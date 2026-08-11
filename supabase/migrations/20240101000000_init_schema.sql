-- CryoBytePrime CBT & Attendance System
-- Phase C2: Core Schema & RLS Policies
-- Migration: 20240101000000_init_schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. ENUMS
-- ============================================================================

create type user_role as enum ('admin', 'teacher', 'student');
create type exam_status as enum ('draft', 'published', 'archived');
create type question_type as enum ('multiple_choice', 'true_false', 'short_answer', 'essay');
create type attendance_status as enum ('present', 'absent', 'late', 'excused');

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- Profiles (extends auth.users)
create table public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    email text not null,
    full_name text,
    role user_role default 'student' not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Classes/Groups
create table public.classes (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    academic_year text not null,
    teacher_id uuid references public.profiles(id),
    created_at timestamptz default now()
);

-- Class Enrollments
create table public.class_enrollments (
    id uuid default uuid_generate_v4() primary key,
    class_id uuid references public.classes(id) on delete cascade,
    student_id uuid references public.profiles(id) on delete cascade,
    enrolled_at timestamptz default now(),
    unique(class_id, student_id)
);

-- Exams
create table public.exams (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    subject text,
    status exam_status default 'draft' not null,
    duration_minutes int default 60,
    total_marks int default 100,
    pass_marks int default 40,
    created_by uuid references public.profiles(id),
    created_at timestamptz default now(),
    published_at timestamptz
);

-- Questions
create table public.questions (
    id uuid default uuid_generate_v4() primary key,
    exam_id uuid references public.exams(id) on delete cascade,
    question_text text not null,
    question_type question_type default 'multiple_choice' not null,
    marks int default 1,
    options jsonb, -- Stores options for MCQs: [{"text": "A", "is_correct": false}, ...]
    correct_answer text, -- Stores correct answer key
    created_at timestamptz default now()
);

-- Exam Attempts (Student taking an exam)
create table public.exam_attempts (
    id uuid default uuid_generate_v4() primary key,
    exam_id uuid references public.exams(id) on delete cascade,
    student_id uuid references public.profiles(id) on delete cascade,
    started_at timestamptz default now(),
    submitted_at timestamptz,
    status text default 'in_progress', -- in_progress, submitted, graded
    total_score int default 0,
    unique(exam_id, student_id)
);

-- Answers (Student responses)
create table public.answers (
    id uuid default uuid_generate_v4() primary key,
    attempt_id uuid references public.exam_attempts(id) on delete cascade,
    question_id uuid references public.questions(id) on delete cascade,
    selected_answer text,
    is_correct boolean default false,
    marks_awarded int default 0,
    created_at timestamptz default now()
);

-- Attendance Records
create table public.attendance (
    id uuid default uuid_generate_v4() primary key,
    class_id uuid references public.classes(id) on delete cascade,
    student_id uuid references public.profiles(id) on delete cascade,
    date date not null,
    status attendance_status default 'absent' not null,
    remarks text,
    recorded_by uuid references public.profiles(id),
    created_at timestamptz default now(),
    unique(class_id, student_id, date)
);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_enrollments enable row level security;
alter table public.exams enable row level security;
alter table public.questions enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.answers enable row level security;
alter table public.attendance enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone"
    on public.profiles for select
    using ( true );

create policy "Users can update own profile"
    on public.profiles for update
    using ( auth.uid() = id );

-- Classes Policies (Teachers can create/edit, Students view own)
create policy "Teachers can manage classes"
    on public.classes for all
    using ( 
        exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher') 
        or 
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

create policy "Students can view enrolled classes"
    on public.classes for select
    using (
        exists (
            select 1 from public.class_enrollments ce
            join public.profiles p on p.id = auth.uid()
            where ce.class_id = classes.id and ce.student_id = p.id
        )
        or
        exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher')
    );

-- Exams Policies
create policy "Teachers can manage exams"
    on public.exams for all
    using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
    );

create policy "Students can view published exams"
    on public.exams for select
    using (
        status = 'published' 
        and exists (select 1 from public.profiles where id = auth.uid() and role = 'student')
    );

-- Questions Policies
create policy "Teachers can manage questions"
    on public.questions for all
    using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
    );

-- Exam Attempts Policies
create policy "Students can create/view own attempts"
    on public.exam_attempts for all
    using ( auth.uid() = student_id );

create policy "Teachers can view all attempts"
    on public.exam_attempts for select
    using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
    );

-- Answers Policies
create policy "Students can create/view own answers"
    on public.answers for all
    using (
        exists (
            select 1 from public.exam_attempts ea
            where ea.id = answers.attempt_id and ea.student_id = auth.uid()
        )
    );

create policy "Teachers can view all answers"
    on public.answers for select
    using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
    );

-- Attendance Policies
create policy "Teachers can record attendance"
    on public.attendance for all
    using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
    );

create policy "Students can view own attendance"
    on public.attendance for select
    using ( auth.uid() = student_id );

-- ============================================================================
-- 4. TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'role')::user_role
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update timestamp trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure update_updated_at_column();
