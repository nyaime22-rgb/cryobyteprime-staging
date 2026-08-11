export interface User {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'teacher' | 'student'
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id: string
  enrollment_number: string
  full_name: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  contact_number?: string
  guardian_name?: string
  guardian_contact?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  admission_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: string
  user_id: string
  employee_id: string
  full_name: string
  qualification?: string
  specialization?: string
  contact_number?: string
  email: string
  joining_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  code: string
  name: string
  description?: string
  credits: number
  semester: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Batch {
  id: string
  name: string
  academic_year: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  course_id: string
  batch_id: string
  name: string
  code: string
  max_marks: number
  min_passing_marks: number
  theory_marks?: number
  practical_marks?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AttendanceSession {
  id: string
  subject_id: string
  teacher_id: string
  scheduled_date: string
  start_time: string
  end_time: string
  room_number?: string
  attendance_type: 'theory' | 'practical' | 'lab' | 'tutorial'
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  remarks?: string
  created_at: string
  updated_at: string
}

export interface AttendanceRecord {
  id: string
  session_id: string
  student_id: string
  status: 'present' | 'absent' | 'late' | 'excused'
  marked_at: string
  marked_by: string
  remarks?: string
  created_at: string
  updated_at: string
}

export interface Assessment {
  id: string
  subject_id: string
  title: string
  assessment_type: 'quiz' | 'midterm' | 'final' | 'assignment' | 'practical' | 'viva'
  total_marks: number
  passing_marks: number
  duration_minutes?: number
  scheduled_date: string
  start_time?: string
  end_time?: string
  instructions?: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  assessment_id: string
  question_number: number
  question_type: 'mcq_single' | 'mcq_multiple' | 'true_false' | 'short_answer' | 'long_answer' | 'numerical'
  question_text: string
  options?: JsonArray
  correct_answer?: string | string[]
  marks: number
  negative_marks?: number
  explanation?: string
  difficulty_level: 'easy' | 'medium' | 'hard'
  bloom_taxonomy?: string
  created_at: string
  updated_at: string
}

export interface StudentAssessmentResponse {
  id: string
  assessment_id: string
  student_id: string
  started_at: string
  submitted_at?: string
  total_marks_obtained?: number
  percentage?: number
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded'
  created_at: string
  updated_at: string
}

export interface StudentAnswer {
  id: string
  response_id: string
  question_id: string
  selected_answer: string | string[]
  is_correct?: boolean
  marks_obtained?: number
  created_at: string
  updated_at: string
}

export type JsonArray = (string | number | boolean | null | JsonObject)[]

export interface JsonObject {
  [key: string]: string | number | boolean | null | JsonArray | JsonObject
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'created_at' | 'updated_at'>>
      }
      students: {
        Row: Student
        Insert: Omit<Student, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at'>>
      }
      teachers: {
        Row: Teacher
        Insert: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Teacher, 'id' | 'created_at' | 'updated_at'>>
      }
      courses: {
        Row: Course
        Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>
      }
      batches: {
        Row: Batch
        Insert: Omit<Batch, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Batch, 'id' | 'created_at' | 'updated_at'>>
      }
      subjects: {
        Row: Subject
        Insert: Omit<Subject, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Subject, 'id' | 'created_at' | 'updated_at'>>
      }
      attendance_sessions: {
        Row: AttendanceSession
        Insert: Omit<AttendanceSession, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AttendanceSession, 'id' | 'created_at' | 'updated_at'>>
      }
      attendance_records: {
        Row: AttendanceRecord
        Insert: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>>
      }
      assessments: {
        Row: Assessment
        Insert: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Assessment, 'id' | 'created_at' | 'updated_at'>>
      }
      questions: {
        Row: Question
        Insert: Omit<Question, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>
      }
      student_assessment_responses: {
        Row: StudentAssessmentResponse
        Insert: Omit<StudentAssessmentResponse, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StudentAssessmentResponse, 'id' | 'created_at' | 'updated_at'>>
      }
      student_answers: {
        Row: StudentAnswer
        Insert: Omit<StudentAnswer, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StudentAnswer, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
