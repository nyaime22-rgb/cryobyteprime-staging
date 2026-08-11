-- CryoBytePrime CBT & Attendance System
-- Core Database Schema with RLS Policies
-- Migration: 20240101000000_init_schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE exam_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    student_id TEXT UNIQUE,
    teacher_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Classes/Groups
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Class Enrollment
CREATE TABLE public.class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- Subjects
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Question Bank
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id),
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
    options JSONB, -- For multiple choice: [{"text": "A", "is_correct": false}]
    correct_answer TEXT,
    marks INTEGER NOT NULL DEFAULT 1,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    tags TEXT[],
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exams
CREATE TABLE public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subject_id UUID NOT NULL REFERENCES public.subjects(id),
    class_id UUID NOT NULL REFERENCES public.classes(id),
    status exam_status NOT NULL DEFAULT 'draft',
    duration_minutes INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    passing_marks INTEGER,
    scheduled_at TIMESTAMPTZ,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exam Questions (linking table)
CREATE TABLE public.exam_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id),
    order_num INTEGER NOT NULL,
    marks_allocated INTEGER NOT NULL,
    UNIQUE(exam_id, question_id)
);

-- Student Attempts
CREATE TABLE public.attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('in_progress', 'submitted', 'graded')),
    score NUMERIC(5,2),
    percentage NUMERIC(5,2),
    UNIQUE(exam_id, student_id)
);

-- Attempt Answers
CREATE TABLE public.attempt_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id),
    student_answer TEXT,
    is_correct BOOLEAN,
    marks_awarded NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Attendance Records
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    notes TEXT,
    recorded_by UUID NOT NULL REFERENCES public.users(id),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(class_id, student_id, date)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Users: Users can see their own data; admins/teachers see all
CREATE POLICY users_select_own ON public.users
    FOR SELECT USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    ));

CREATE POLICY users_update_own ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Classes: Teachers see their classes, students see enrolled classes
CREATE POLICY classes_select ON public.classes
    FOR SELECT USING (
        teacher_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.class_enrollments WHERE class_id = id AND student_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Questions: Teachers can manage, students can only view in exam context
CREATE POLICY questions_select ON public.questions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'teacher')) OR
        created_by = auth.uid()
    );

CREATE POLICY questions_insert ON public.questions
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
    );

CREATE POLICY questions_update ON public.questions
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'teacher')) AND
        created_by = auth.uid()
    );

-- Exams: Similar to questions
CREATE POLICY exams_select ON public.exams
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'teacher')) OR
        EXISTS (
            SELECT 1 FROM public.attempts 
            WHERE exam_id = id AND student_id = auth.uid()
        )
    );

-- Attempts: Students see their own, teachers see all for their classes
CREATE POLICY attempts_select ON public.attempts
    FOR SELECT USING (
        student_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.exams e
            JOIN public.classes c ON e.class_id = c.id
            WHERE e.id = exam_id AND c.teacher_id = auth.uid()
        ) OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Attendance: Teachers record, students view own
CREATE POLICY attendance_select ON public.attendance
    FOR SELECT USING (
        student_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.classes 
            WHERE id = class_id AND teacher_id = auth.uid()
        ) OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY attendance_insert ON public.attendance
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.classes 
            WHERE id = class_id AND teacher_id = auth.uid()
        ) OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================
-- TRIGGERS (Updated At timestamps)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER questions_updated_at
    BEFORE UPDATE ON public.questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER exams_updated_at
    BEFORE UPDATE ON public.exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES (Performance)
-- ============================================

CREATE INDEX idx_class_enrollments_student ON public.class_enrollments(student_id);
CREATE INDEX idx_class_enrollments_class ON public.class_enrollments(class_id);
CREATE INDEX idx_questions_subject ON public.questions(subject_id);
CREATE INDEX idx_questions_created_by ON public.questions(created_by);
CREATE INDEX idx_exams_class ON public.exams(class_id);
CREATE INDEX idx_exams_subject ON public.exams(subject_id);
CREATE INDEX idx_attempts_exam ON public.attempts(exam_id);
CREATE INDEX idx_attempts_student ON public.attempts(student_id);
CREATE INDEX idx_attempt_answers_attempt ON public.attempt_answers(attempt_id);
CREATE INDEX idx_attendance_class_date ON public.attendance(class_id, date);
CREATE INDEX idx_attendance_student ON public.attendance(student_id);