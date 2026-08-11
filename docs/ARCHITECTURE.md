# CryoBytePrime CBT & Attendance - Architecture

## Overview

This document describes the technical architecture of the CryoBytePrime CBT & Attendance system.

## Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v7
- **State Management**: React Context API
- **Database Client**: Supabase JS SDK

### Backend (Supabase)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for attachments)
- **Real-time**: Supabase Realtime (for live attendance/assessment updates)

## Project Structure

```
/workspace
├── src/
│   ├── components/     # Reusable UI components
│   │   └── ui/        # shadcn/ui base components
│   ├── context/       # React Context providers
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries and configurations
│   ├── pages/         # Page-level components
│   ├── types/         # TypeScript type definitions
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── docs/              # Documentation
├── migrations/        # Database migration files
├── tests/             # Test files
├── .env.example       # Environment variable template
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
└── postcss.config.js  # PostCSS configuration
```

## Authentication Flow

1. User accesses `/login` page
2. Enters email and password
3. Credentials validated against Supabase Auth
4. On success, user profile fetched from `users` table
5. AuthContext stores user session
6. User redirected to `/dashboard`
7. Protected routes check authentication status via AppShell

## Role-Based Access Control

The system supports three roles:
- **Admin**: Full system access, user management, configuration
- **Teacher**: Manage assigned subjects, take attendance, create assessments
- **Student**: View attendance, take assessments, check results

## Database Schema

Core tables (defined in `src/types/database.types.ts`):
- `users` - System users with role assignment
- `students` - Student profiles
- `teachers` - Teacher profiles
- `courses` - Course definitions
- `batches` - Academic batches
- `subjects` - Subject offerings per batch
- `attendance_sessions` - Scheduled attendance sessions
- `attendance_records` - Individual attendance entries
- `assessments` - Test/exam definitions
- `questions` - Question bank
- `student_assessment_responses` - Student test submissions
- `student_answers` - Individual answers

## Security Considerations

- All Supabase queries use Row Level Security (RLS)
- Environment variables never committed to version control
- No hardcoded credentials
- HTTPS enforced in production
- Session management handled by Supabase Auth

## Development Workflow

1. Clone repository
2. Copy `.env.example` to `.env.local`
3. Fill in Supabase credentials
4. Run `npm install`
5. Run `npm run dev` for development server
6. Run `npm run build` for production build

## Future Enhancements

- Real-time attendance marking
- Online assessment engine with timer
- Automated result calculation
- Report generation (PDF/Excel)
- Mobile-responsive improvements
- Offline support for attendance marking
