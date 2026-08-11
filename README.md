# CryoBytePrime CBT & Attendance — Final Development Prompt

You are GitHub Copilot, Cursor, Coder, or another AI development agent working in this repository.

You must act as:

1. A senior full-stack engineer.
2. A senior frontend engineer.
3. A senior UI/UX product designer.
4. A security-conscious Supabase/PostgreSQL engineer.
5. A careful implementation agent that does not guess, does not expose secrets, and does not take unauthorized deployment or database actions.

This repository is the source of truth for the CryoBytePrime CBT and academic attendance web application for a Nigerian educational institution.

Read this entire file before creating, editing, running, recommending, or deploying anything.

Build incrementally. Apply strong UI/UX expertise at every stage. Do not invent academic rules. Do not use fake data. Do not hardcode institution policy. If a requirement is missing, ambiguous, or requires credentials or approval, stop and ask.

---

## 1. Product goal

Build one role-based web application containing:

1. Student experience.
2. Tutor/invigilator experience.
3. Administration experience.
4. Author experience.
5. Auditor experience.

The application manages:

- Authentication and role-based access.
- Academic classes and joint classes.
- Student memberships and tutor assignments.
- Daily class attendance.
- Exam check-in.
- Test check-in.
- Assessment eligibility.
- Question bank and import/export.
- CBT attempts, saving, heartbeat, monitoring, and submission.
- Grading and result release.
- Attendance reporting and CSV export.
- Audit logging.
- Superadmin dashboard.

The product must feel polished, calm, trustworthy, simple, and role-appropriate.

A student should feel the application was built specifically for students. Staff, admin, author, and auditor experiences must exist, but they must not be advertised on the public login screen.

Do not create separate frontend applications for each role. Use one Vite React app with role-based portals and role-specific navigation after login.

---

## 2. Confirmed architecture

### Frontend

- React.
- Vite.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.
- React Router.
- TanStack Query.
- React Hook Form.
- Zod.
- Supabase JS v2.

### Backend

- Hosted Supabase staging project.
- Supabase PostgreSQL.
- Supabase Auth.
- Row Level Security.
- Secure database functions/RPCs.
- Supabase Storage only when explicitly approved later.
- Supabase Realtime only where explicitly approved.

### Deployment

- Vercel for the Vite frontend.
- Separate Development, Preview, and Production environment variables.
- Preview uses staging values only.
- Production values only after separate production approval.

### Prohibited during development

- Docker.
- Local PostgreSQL.
- Django.
- Production Supabase.
- Any non-Supabase authentication authority.
- Any separate frontend app per role.
- Any browser-side secret.
- Any hardcoded academic value.
- Any fallback literal such as `|| 50`, `|| 12`, fake IDs, fake pass marks, fake durations, or fake identifiers.
- Public signup unless explicitly approved.
- Public portal selection unless explicitly approved.

---

## 3. Credentials and environments

The owner creates separate Supabase staging and production projects. Start with staging only.

Obtain values from the Supabase Dashboard:

- `VITE_SUPABASE_URL`: Connect → Project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Settings → API Keys → Publishable key.
- `SUPABASE_URL`: same Project URL, server-side only.
- `SUPABASE_SECRET_KEY`: Settings → API Keys → Secret key, server-side only.
- `SUPABASE_DB_URL`: Connect → Database connection string, migration/server use only.

The local Vite app may use only:

    VITE_SUPABASE_URL=https://your-staging-project.supabase.co
    VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

Create `.env.example` with placeholders only:

    VITE_SUPABASE_URL=
    VITE_SUPABASE_PUBLISHABLE_KEY=

Real local values may exist only in `.env.local`, which must be ignored by Git.

Rules:

- Never put a database password, secret key, service-role key, or database URL in browser code, Git, documentation, chat, logs, or any `VITE_*` variable.
- Never request credentials in chat.
- Use protected environment variables or local machine configuration.
- Test RLS before trusting the publishable key.
- Vercel must have separate Development, Preview, and Production variables.
- Preview uses staging values.
- Production values are configured only after separate production approval.
- Database production migration and Vercel production deployment require separate approvals.
- If environment variables are missing, the app must show a safe configuration error, not a blank screen.

---

## 4. Copilot control protocol

The agent is an implementer, not the project owner.

### Level 0 — Plan

Inspect and propose only.

No:

- Edits.
- Credentials.
- Supabase connection.
- SQL execution.
- Migration application.
- Deployment.

### Level 1 — Draft

Create scoped:

- Code.
- Migrations.
- Tests.
- Documentation.
- UX documentation.
- Configuration.

No:

- Hosted Supabase connection.
- Migration application.
- Deployment.
- Secret access.

### Level 2 — Staging

Apply only the exact approved migration to the named staging project.

### Level 3 — Vercel Preview

Deploy only the approved commit with staging variables.

### Level 4 — Production

Separate approval required for:

- Production database migration.
- Vercel Production deployment.
- Production environment variables.

Unless explicitly approved by the owner, the maximum autonomous level is Level 1.

### Mandatory stop points

Stop before:

- Connecting to Supabase.
- Applying migrations.
- Changing RLS.
- Changing roles, grants, or permissions.
- Changing `SECURITY DEFINER` functions.
- Changing triggers.
- Changing authentication, grading, timing, retention, or access control.
- Deleting or exporting data.
- Editing out-of-scope files.
- Deploying anywhere.
- Using any secret.
- Creating production configuration.

### Before each task, return

    TASK CONTROL CHECK
    Task:
    Permission level:
    Files expected to change:
    Database objects expected to change:
    External systems expected to access:
    Assumptions:
    Questions:

### Before any staging, production, or Vercel action, return

    CHANGE REQUEST
    Target: staging / Vercel Preview / production / Vercel Production
    Project or deployment reference:
    Migration or deployment commit/hash:
    Files and objects changed:
    Exact command with secrets redacted:
    Data impact:
    RLS/security impact:
    Rollback plan:
    Tests completed and actual results:
    Risks:

Stop and wait for explicit approval naming the target and commit/hash.

Approval applies only to the exact reviewed SQL, files, command, target, and commit. Any change requires fresh approval.

---

## 5. Security and migration rules

1. Never modify an applied migration; create a new one.
2. Never use destructive `DROP`, `TRUNCATE`, or `DELETE` migrations for the initial build.
3. Show complete SQL before execution.
4. Enable and test RLS on every application table.
5. Use explicit role/action policies; role ranking alone never grants access.
6. Pin `search_path` and perform authorization checks in every `SECURITY DEFINER` function.
7. Derive audit actors from authenticated context; never trust caller-supplied actor IDs.
8. Use server time for deadlines and submission.
9. Use idempotency keys for issuance, answer writes, and submission.
10. Never expose correct answers before explicit release.
11. Never use hardcoded academic values or fallbacks such as `|| 50`, `|| 12`, or fake IDs.
12. Policy defaults are stored in the settings registry and confirmed by the institution before seeding.
13. Completed exams/tests use an immutable `policy_snapshot`.
14. All stored timestamps are `timestamptz`.
15. Hidden menus are not security. Enforce authorization through Supabase Auth, RLS, and server/database authorization.
16. Browser monitoring signals are evidence only. The server enforces consequences according to policy.
17. If a secret is exposed, stop work, report it, and require immediate rotation.

---

## 6. Public entry, login, and role-based routing

The application must have one public entry point only.

### Public login experience

- The homepage/login page must not display portal navigation.
- Do not show links or buttons for Student, Tutor, Admin, Author, or Auditor portals before authentication.
- Do not show a role selector before login.
- Do not provide public signup unless explicitly approved.
- Do not reveal that separate staff portals exist.
- Use neutral wording.
- Use one email/password login form.
- Include a subtle “Forgot password?” link if password reset is enabled.
- Do not show different login forms for different roles.

### Route behavior

Preferred public routes:

    /
    /login
    /dashboard
    /reset-password
    /not-available

Routing rules:

- `/` redirects unauthenticated users to `/login`.
- `/` redirects authenticated users to `/dashboard`.
- `/login` shows only the login form.
- If an authenticated user visits `/login`, redirect them to `/dashboard`.
- After successful login, the app must fetch the user profile and active roles from the database.
- The user must then be routed to the appropriate role dashboard.
- The preferred post-login route is `/dashboard`, with role-specific content rendered inside it.
- Do not advertise `/student`, `/tutor`, `/admin`, `/author`, or `/auditor` publicly.
- If separate internal role routes are used later, they must remain hidden from the public login experience and must be protected by server-side authorization.

### Role resolution after login

After login:

1. Load the authenticated Supabase user.
2. Load the user profile from the database.
3. Load active roles from the database.
4. Determine the user’s primary dashboard.
5. Redirect to `/dashboard`.
6. Render the appropriate role-specific dashboard and navigation.

Multiple-role rules:

- If the user has only one active role, use that role.
- If the user has multiple roles, use the configured primary role.
- If no primary role is configured, use the approved role priority.
- The default role priority is:

      superadmin
      admin
      auditor
      author
      tutor
      student

- This priority is an application routing rule, not an academic policy.
- Do not show a public role switcher unless explicitly approved.
- If a user has no active role, show a generic account-pending page.
- If the profile is incomplete, show a profile-completion state.
- If the user is archived or inactive, show a generic inactive-account message.

### Login UX requirements

- Use a clean centered card layout.
- Show institution/product logo or name.
- Use clear labels: Email address and Password.
- Use accessible form fields.
- Show password visibility toggle.
- Disable the submit button while loading.
- Show a loading state such as “Signing in…”.
- Use generic error messages only.
- Do not reveal whether an email exists.
- Do not reveal role information in errors.
- Use errors such as:

      Invalid login details or account not active.

- If password reset is used, show a generic message such as:

      If that account exists, password reset instructions have been sent.

### Unauthorized access UX

If a user tries to access a route they do not have permission for:

- Do not expose the name of the hidden portal.
- Do not show “Admin Portal Access Denied”.
- Show a generic page such as:

      This page is not available.

- Redirect to `/dashboard` where appropriate.
- Log authorization failures only where approved and safe.

---

## 7. UI/UX expertise requirement

You must apply senior UI/UX expertise throughout planning, architecture, component design, visual design, content design, accessibility, and quality assurance.

The UI must not feel like a raw developer admin panel. It must feel like a polished, institution-grade product.

### 7.1 UX principles

Apply these principles on every screen:

1. Clarity before decoration.
2. One primary action per screen where possible.
3. Low cognitive load.
4. Progressive disclosure.
5. Obvious system state.
6. Safe handling of high-risk actions.
7. Consistent spacing, typography, and components.
8. Mobile-responsive behavior.
9. Accessibility by default.
10. Trustworthy language.
11. No fake data.
12. No dead ends.
13. No unexplained errors.
14. No unimplemented features presented as working.
15. No public exposure of staff/admin portals.

### 7.2 Product feel

The product should feel:

- Calm.
- Professional.
- Simple.
- Fast.
- Trustworthy.
- Academic.
- Clean.
- Mobile-friendly.
- Suitable for low-bandwidth environments.
- Suitable for users with varying digital literacy.

Avoid:

- Overly bright or decorative designs.
- Cluttered dashboards.
- Too many colors.
- Technical jargon.
- Alarmist error messages.
- Confusing navigation.
- Dense tables without filters or pagination.
- Heavy animations.
- Unnecessary third-party scripts.

### 7.3 Design system

Use Tailwind CSS and shadcn/ui to create a consistent design system.

Define reusable design tokens for:

- Primary color.
- Neutral colors.
- Success color.
- Warning color.
- Danger color.
- Info color.
- Border radius.
- Spacing scale.
- Font sizes.
- Shadows.
- Focus rings.
- Input heights.
- Card padding.
- Table density.
- Button variants.
- Badge variants.

Rules:

- Use shadcn/ui components where possible.
- Do not create multiple conflicting button styles.
- Do not use raw HTML buttons where a design-system component should exist.
- Use consistent card, form, table, badge, dialog, toast, dropdown, and navigation patterns.
- Use icons only with accessible labels or tooltips where needed.
- Use status badges with both color and text.
- Do not rely on color alone to communicate state.

### 7.4 Required UX states

Every meaningful screen and component must handle:

1. Initial loading.
2. Background refreshing.
3. Empty state.
4. Error state.
5. Permission denied state.
6. Missing configuration state.
7. Unimplemented feature state.
8. Success state.
9. Saving state.
10. Unsaved changes state.
11. Locked state.
12. Finalized state.
13. Archived state.
14. Offline or network-loss state where relevant.
15. Long-content overflow state.

Rules:

- Use skeleton loaders for large content areas.
- Use spinners for small actions such as buttons.
- Use empty states with helpful guidance and, where permitted, a call to action.
- Use error states with retry actions where safe.
- Use “Not yet available” for unimplemented controls.
- Use locked banners for finalized registers, submitted attempts, released results, or locked check-ins.
- Use confirmation dialogs before high-risk actions.
- Use toasts for non-blocking success or error feedback.
- Use dialogs for blocking decisions and confirmations.
- Use inline validation for forms.
- Use no fake data in empty states.

### 7.5 Forms

All forms must follow good UX:

- Visible labels.
- Helpful placeholder text only where it does not replace labels.
- Inline validation after blur, not aggressively while typing.
- Error messages attached to fields.
- Error summary for long forms.
- Clear required/optional indicators.
- Disabled submit button while submitting.
- Prevention of accidental double submission.
- Clear success message.
- Unsaved-change warning where appropriate.
- Logical keyboard tab order.
- Accessible field descriptions.
- Date pickers and time pickers where appropriate.
- Server-authoritative values for anything academic or security-related.

High-risk actions requiring confirmation and reason where appropriate:

- Finalizing attendance.
- Reopening attendance.
- Force submitting an attempt.
- Granting an extension.
- Overriding check-in.
- Changing roles.
- Archiving classes.
- Archiving users.
- Releasing results.
- Releasing answer keys.
- Changing identifier formats.
- Changing critical settings.
- Exporting sensitive data.
- Adjusting grades.

### 7.6 Tables and reports

Tables must be usable on desktop and mobile.

Requirements:

- Clear header labels.
- Sticky header where useful.
- Horizontal scroll on small screens.
- Sticky first column where useful.
- Pagination or controlled loading for large data sets.
- Filters above the table.
- Search with debounce.
- Clear no-results state.
- Sort indicators where sorting is supported.
- Row hover state.
- Readable truncation with tooltip or detail view.
- CSV export button near the report it exports.
- Export must preserve the on-screen approved order and values.
- Long reports should show loading and export progress.

### 7.7 Navigation and app shell

The authenticated app shell must be role-aware.

Requirements:

- Show only navigation items permitted for the user’s active role.
- Use a consistent sidebar on desktop.
- Use a collapsible menu or bottom navigation on mobile where appropriate.
- Show user name and active role context subtly.
- Show sign-out action.
- Show session-expiry handling.
- Do not show hidden portals.
- Do not show admin, author, auditor, or tutor links to students.
- Do not show student-only labels to staff where irrelevant.
- Use page titles that match the current section.
- Use breadcrumbs where deep navigation is needed.
- Use active route highlighting.

Recommended student navigation labels:

- Dashboard
- My Assessments
- My Results
- Profile

Recommended tutor navigation labels:

- Dashboard
- Attendance
- Check-in
- Invigilation
- Classes

Recommended admin navigation labels:

- Dashboard
- Classes
- Users
- Assessments
- Questions
- Settings
- Reports
- Audit

Recommended author navigation labels:

- Dashboard
- Questions
- Import/Export
- Review

Recommended auditor navigation labels:

- Dashboard
- Audit
- Attempts
- Results
- Exports

Navigation labels may be simplified, but they must not expose unauthorized portals.

### 7.8 Student UX requirements

The student experience must feel simple, focused, and reassuring.

Student dashboard should show:

- Welcome message.
- Next assessment or eligibility status.
- Readiness checklist.
- Recent results if released.
- Profile identifiers where approved.
- Support or help area where approved.

Student assessment experience must include:

- Clear assessment title.
- Time remaining.
- Server-synced countdown.
- Question number and progress.
- Clear answer input controls.
- Previous and next navigation.
- Question palette or list if approved.
- Autosave indicator.
- Network status indicator.
- Warning messages.
- Submit confirmation.
- Submission receipt.
- No correct answers unless explicitly released.
- No admin or staff language.
- No unnecessary clutter.

Student-facing language examples:

- “My Assessments”
- “My Results”
- “Continue assessment”
- “Submit assessment”
- “Your work is saved”
- “Connection issue. Your answers will retry when connection returns.”

Avoid student-facing language such as:

- “Admin settings”
- “Invigilation board”
- “Author review”
- “Audit log”
- “Release controls”

### 7.9 Tutor/invigilator UX requirements

Tutor and invigilator screens must support fast, accurate field use.

Attendance register UX:

- Roster list with clear student identity.
- Status controls that are easy to tap.
- Mark all present action.
- Search by name or Student Number.
- Clear status colors and labels.
- Save indicator.
- Finalize confirmation.
- Locked finalized state.
- Controlled reopen with reason.
- Notes/reasons where required.
- Roster snapshot clarity.
- Joint-class single-count clarity.

Check-in UX:

- Search by Student Number, Class S/N, name, or Exam Number.
- Clear eligibility status.
- Clear check-in status.
- Clear denied state with reason where safe.
- Access-code issuance action where approved.
- Audit-aware override flow.
- Locked state after attempt starts.

Invigilation board UX:

- Candidate list or cards.
- Status badges.
- Time remaining.
- Answered count.
- Heartbeat age.
- Connection state.
- Violation count.
- Warning state.
- Force submit action.
- Extension action.
- Search and filters.
- Auto-refresh or approved realtime updates.
- No correct answers.

### 7.10 Administration UX requirements

Admin screens must be powerful but organized.

Requirements:

- Clear section grouping.
- Searchable data tables.
- Detail drawers or pages.
- Audit history where relevant.
- Status badges.
- Confirmation dialogs.
- Reason capture for overrides.
- Settings generated from definitions.
- Disabled controls for unimplemented settings.
- Clear validation errors.
- History views for settings and identifiers.
- Export actions with audit logging.
- Role-aware scoping.
- No destructive actions presented casually.

Admin settings UX:

- Group by category.
- Search settings.
- Show label, help text, current value, default value, validation, implementation status, history, actor, and timestamp.
- Show “Not yet available” where `is_implemented = false`.
- Show role restrictions where `min_role` applies.
- Show confirmation before changing critical settings.

### 7.11 Author UX requirements

Author screens must make question creation efficient.

Requirements:

- Clear question type selector.
- MCQ option editor.
- True/false editor.
- Fill-in-the-blank editor.
- Accepted answers editor where applicable.
- Marks editor.
- Subject and topic fields.
- Difficulty field.
- Tags.
- Review status.
- Validation messages.
- Import preview.
- Duplicate warnings.
- Version history.
- Protected answer key handling.
- No results access.
- No answer-key export unless authorized.

### 7.12 Auditor UX requirements

Auditor screens must be read-only and highly legible.

Requirements:

- Clear filters.
- Timestamps.
- Actor information.
- Action labels.
- Entity references.
- Metadata viewer.
- Export history.
- Attempt and result read-only views.
- No mutation actions.
- Clear visual indication that data is read-only.

### 7.13 Accessibility requirements

Target WCAG 2.1 AA where practical.

Requirements:

- Semantic HTML.
- Proper heading order.
- Labels for all form controls.
- Keyboard access for all interactive elements.
- Visible focus states.
- Focus trapping in dialogs.
- Focus restoration after dialogs close.
- Accessible error messages.
- `aria-live` for important status changes such as autosave or alerts.
- Sufficient color contrast.
- Text can be resized without breaking layout.
- No reliance on color alone.
- Touch targets should be comfortably sized.
- Tables remain usable with horizontal scroll on small screens.
- Skip-to-content link where appropriate.
- Reduced motion respected where animations exist.
- No flashing or distracting movement.
- Readable font sizes.
- Clear link and button labels.

### 7.14 Responsive design

The app must work on:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Priority responsive behaviors:

- Login page centered and readable on mobile.
- Dashboard cards stack cleanly.
- Navigation collapses on small screens.
- Tables scroll horizontally where needed.
- Attendance status controls remain easy to tap.
- Exam runner remains usable on small screens.
- Dialogs are usable on mobile.
- Filters collapse into a mobile-friendly pattern.
- Long names, emails, and question text wrap or truncate gracefully.

### 7.15 Content design

Use plain, clear English.

Rules:

- Do not expose internal role names unnecessarily.
- Do not reveal hidden portals.
- Do not blame the user.
- Do not expose technical errors directly.
- Do not show SQL errors.
- Do not show stack traces.
- Do not show secrets or environment details.
- Use short sentences.
- Use helpful empty states.
- Use consistent action labels such as Save, Continue, Submit, Finalize, Confirm, Export.
- Use consistent status labels.
- Use dates clearly.
- Use server timezone settings for display where applicable.

### 7.16 Performance UX

Requirements:

- Lazy-load routes where appropriate.
- Code-split large features.
- Avoid loading all rows at once.
- Use pagination or server-side filtering.
- Use skeletons for initial loads.
- Use debounce for search.
- Avoid blocking the UI while background saving.
- Keep animations subtle.
- Avoid heavy third-party libraries unless approved.
- Optimize for low-bandwidth conditions.
- Do not show false success states during network failure.

### 7.17 UX documentation

Create and maintain:

- `docs/UX_FLOWS.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/ACCESSIBILITY_CHECKLIST.md`

`docs/UX_FLOWS.md` must describe the main user journeys:

1. Student login and dashboard.
2. Student assessment attempt.
3. Student result viewing.
4. Tutor daily attendance.
5. Tutor exam check-in.
6. Tutor invigilation.
7. Admin class management.
8. Admin settings management.
9. Author question import.
10. Auditor read-only review.

`docs/DESIGN_SYSTEM.md` must describe:

- Color usage.
- Typography.
- Spacing.
- Buttons.
- Forms.
- Tables.
- Cards.
- Badges.
- Dialogs.
- Empty states.
- Error states.
- Loading states.

`docs/ACCESSIBILITY_CHECKLIST.md` must be used before C8 completion.

---

## 8. Frontend repository structure

Create or verify the following structure:

    .env.example
    .gitignore
    .nvmrc
    index.html
    package.json
    package-lock.json
    tsconfig.json
    vite.config.ts
    tailwind.config.ts
    postcss.config.js
    vercel.json
    README.md
    STATUS.md
    docs/
      ARCHITECTURE.md
      DATA_MODEL.md
      SETTINGS_CATALOG.md
      RLS_TEST_PLAN.md
      REPORT_SPEC.md
      DEPLOYMENT.md
      OPEN_QUESTIONS.md
      EXECUTION_LOG.md
      UX_FLOWS.md
      DESIGN_SYSTEM.md
      ACCESSIBILITY_CHECKLIST.md
    src/
      main.tsx
      App.tsx
      vite-env.d.ts
      lib/
        env.ts
        supabase.ts
        queryClient.ts
        utils.ts
        datetime.ts
        csv.ts
        idempotency.ts
        permissions.ts
      types/
        database.ts
        domain.ts
      hooks/
      components/
        ui/
        layout/
        data-table/
        forms/
        feedback/
      features/
        auth/
        student/
        tutor/
        admin/
        author/
        auditor/
        settings/
        attendance/
        assessment/
        question-bank/
        dashboard/
        reports/
      routes/
    supabase/
      migrations/
      tests/
        rls/
        functions/
    tests/
      unit/
      integration/
    .github/
      workflows/
        ci.yml
      PULL_REQUEST_TEMPLATE.md

Required documentation files:

- `STATUS.md`: current build phase, completed work, blocked work, next action.
- `docs/ARCHITECTURE.md`: architecture summary.
- `docs/DATA_MODEL.md`: table and function catalog.
- `docs/SETTINGS_CATALOG.md`: all settings definitions and implementation status.
- `docs/RLS_TEST_PLAN.md`: role-by-role RLS tests.
- `docs/REPORT_SPEC.md`: attendance report and CSV specification.
- `docs/DEPLOYMENT.md`: Vercel and Supabase deployment rules.
- `docs/OPEN_QUESTIONS.md`: unanswered institution decisions.
- `docs/EXECUTION_LOG.md`: chronological agent execution log.
- `docs/UX_FLOWS.md`: user journeys.
- `docs/DESIGN_SYSTEM.md`: UI design system.
- `docs/ACCESSIBILITY_CHECKLIST.md`: accessibility verification checklist.

---

## 9. Frontend engineering rules

Use:

- Node LTS. Specify Node 20 or later in `.nvmrc`.
- npm only unless another package manager is explicitly approved.
- TypeScript strict mode.
- Absolute imports using `@/`.
- ESLint and Prettier.
- React Router for routing.
- TanStack Query for server state.
- React Hook Form plus Zod for forms and validation.
- shadcn/ui components.
- Tailwind design tokens.
- Lucide icons where needed.

Requirements:

- No `any` unless explicitly justified.
- No secrets in frontend code.
- No direct SQL from frontend.
- No business logic in components where it should be server-side.
- Client validation is optional UX only. Database validation is authoritative.
- All official calculations must come from database functions or views.
- All protected data must be fetched only through authorized Supabase queries or RPCs.
- All date/time displays must respect the institution timezone setting.
- All countdown timers are advisory. Server time is authoritative.
- All route guards are UX only. Supabase RLS and database functions are the security boundary.
- No console errors in production build.
- No dead links.
- No unimplemented features shown as working.
- No fake data.
- No lorem ipsum in final UI.
- No external analytics or tracking without approval.

---

## 10. Role-based portals in one app

### 10.1 Student portal

Features:

- Authentication.
- Identifiers.
- Eligibility.
- Access code.
- Readiness.
- Assessment taking.
- Saving.
- Submission receipt.
- Released results.

UX requirements:

- Simple navigation.
- Student-only language.
- No staff/admin features visible.
- Clear exam states.
- Clear receipt after submission.
- Clear released results only.

### 10.2 Tutor/invigilator portal

Features:

- Assigned classes.
- Daily attendance.
- Exam/test check-in.
- Invigilation.
- Violations.
- Heartbeat status.
- Force submit.
- Time extension.

UX requirements:

- Fast workflows.
- Large tap targets.
- Clear statuses.
- Search.
- Confirmation for overrides.
- Clear locked states.

### 10.3 Administration portal

Features:

- Users.
- Roles.
- Classes.
- Joint classes.
- Memberships.
- Tutor assignments.
- Assessments.
- Questions.
- Settings.
- Results.
- Release controls.
- Reports.
- Audit.
- Exports.
- Dashboard.

UX requirements:

- Organized sections.
- Powerful tables.
- Audit visibility.
- Confirmation dialogs.
- Settings clarity.
- Role scoping.

### 10.4 Author portal

Features:

- Question creation/editing.
- Marks.
- Accepted answers.
- Topics.
- Review status.
- Import/export validation.

Rules:

- No results.
- No answer-key exports unless authorized.
- Frozen question sets for activated assessments.

### 10.5 Auditor portal

Features:

- Read-only audit.
- Read-only assessment.
- Read-only attempt.
- Read-only result.
- Read-only moderation.
- Export history.

UX requirements:

- Clear read-only state.
- Clear filters.
- Clear metadata display.

Use route guards for navigation, but enforce authorization through Supabase Auth, RLS, and server/database authorization. Hidden menus are not security.

---

## 11. Classes, joint classes, and memberships

The institution may create any number and type of classes. Never hardcode Class A, Class B, or a fixed category.

Create:

- `classes` for ordinary academic/teaching groups.
- `class_memberships` for student membership history.
- `joint_classes` for named groups combining existing classes.
- `joint_class_members` linking joint classes to component classes.
- `tutor_class_assignments` limiting tutor scope.

Rules:

- Superadmin alone creates, edits, archives, and structures classes/joint classes unless explicitly delegated.
- Superadmin manages memberships and assigns tutors.
- Tutors use only assigned classes.
- Prevent duplicate components.
- Prevent circular joint classes.
- Preserve historical membership.
- A transfer does not rewrite past attendance.
- A joint-class session counts once and must not double-count a student.

UX:

- Class management screens must clearly show active vs archived items.
- Membership history must be viewable.
- Joint class components must be clearly listed.
- Duplicate component warnings must appear before save.
- Archive actions require confirmation and reason where appropriate.

---

## 12. Daily attendance, exam check-in, and test check-in

These are separate workflows.

### 12.1 Daily class register

A tutor creates a `class_register` session for an assigned class or joint class, with date/time, topic, notes, and status.

Store a roster snapshot.

Mark each student:

    present
    late
    absent
    excused
    left_early
    pending

Support:

- Mark-all-present.
- Individual changes.
- Search by name/Student Number.
- Notes/reasons.
- Progressive save.
- Controlled reopening.
- Finalization.

Rules:

- Only finalized registers count.
- A missing status becomes absent only when the roster session is finalized.
- A routine class register must never grant or revoke exam/test eligibility.

UX:

- Clear save state.
- Clear finalization confirmation.
- Clear locked state.
- Clear reopen flow with reason.
- Easy status switching.
- Good mobile behavior.

### 12.2 Exam check-in

An `exam_check_in` references exactly one exam and one class/joint class.

Before check-in verify:

- Assessment eligibility.
- Student Number.
- Class S/N.
- Identity where required.
- Check-in window.
- Prior check-in.
- Attempt limit.

The invigilator may search by:

- Student Number.
- Class S/N.
- Name.
- Exam Number.

Statuses:

    present
    late
    absent
    denied
    withdrawn

Rules:

- A properly checked-in student may receive the exam access code and attempt.
- An eligible but unchecked-in/absent student is denied.

UX:

- Search-first workflow.
- Clear status badges.
- Clear denial reasons where safe.
- Clear access-code issuance action.
- Clear locked state after attempt starts.

### 12.3 Test check-in

A `test_check_in` references exactly one test and class/joint class.

It may use different configured rules, including:

- Automatic class eligibility.
- Online attendance.
- No physical identity check.
- No access code.
- No Exam Number.

These rules come from settings/policy, not hardcoded conditionals.

### 12.4 Audit rules

Every creation, status change, identity verification, late override, finalization, access-code issuance, manual edit, and correction is audit-logged.

Check-in is unique per assessment/student and becomes locked after an attempt starts except for authorized Superadmin override with reason.

---

## 13. Assessments and eligibility gate

Use an `assessments` model with:

- `assessment_type = exam | test`
- Title.
- Description.
- Class/joint-class scope.
- Status.
- Opening/closing times.
- Duration.
- Policy snapshot.
- Key release.
- Result release.
- Creator.
- Timestamps.

Use `assessment_eligibility` with:

- assessment_id.
- student_id.
- status:
  - `eligible`
  - `pending`
  - `blocked`
  - `withdrawn`
  - `completed`
- reason.
- approval.
- check-in status.
- exam_number where applicable.
- timestamps.

A student can be eligible for one assessment and ineligible for another.

The attempt-issue server function must permit access only when:

    eligible for this assessment
    + checked in for this assessment
    + present, or late where policy permits
    + valid assessment window
    + valid access code where required
    + attempt limit available
    = attempt may be issued

Daily attendance never grants assessment access. The browser never decides access.

UX:

- Student sees only their own eligibility and assessment state.
- Admin sees eligibility management with clear statuses and reasons.
- Tutor/invigilator sees check-in and attempt state for assigned scope.
- Do not expose correct answers or unreleased results.

---

## 14. Identifiers

Support three distinct identifiers:

1. Class S/N: serial number assigned to a class or joint class.
2. Student Number: permanent unique student identifier.
3. Exam Number: identifier assigned to a student for a particular exam sitting; it does not replace Student Number.

If the institution defines Class S/N differently, stop and ask before implementing.

Rules:

- Generate identifiers server-side or through secure transactional database functions.
- Enforce uniqueness.
- Never silently regenerate existing identifiers.
- Format changes affect only new identifiers.

Superadmin controls `identifier_formats` from the Administration portal:

- Type.
- Prefix.
- Pattern.
- Padding.
- Starting number.
- Reset period.
- Uniqueness scope.
- Checksum option.
- Generation point.
- Active status.

Include:

- Live preview.
- Validation.
- Confirmation.
- History.
- Audit logging.

UX:

- Identifier format editor must be clear and preview-driven.
- Warn before changes that affect future identifiers.
- Show history and actor.
- Do not allow accidental regeneration.

---

## 15. Settings registry and admin settings portal

Create:

- `setting_definitions`
- `settings`
- `settings_history`

Resolve:

    exam override → class override → global value → definition default

The Superadmin/Admin settings portal is generated from definitions, grouped by category, rendered by data type, and protected by `min_role` in UI and database.

Show:

- Label.
- Help.
- Current/default value.
- Validation.
- Implementation status.
- History.
- Actor.
- Timestamp.

Settings marked `is_implemented = false` show disabled “Not yet available”.

Missing settings error; never substitute literals.

Settings include, where institution-approved:

- Timezone.
- Pass mark.
- Grade bands.
- Duration.
- Heartbeat.
- Stale threshold.
- Autosave.
- Retry count.
- Violation limit/action/penalty.
- Extra time.
- Access/check-in rules.
- Key/result release.
- Attendance statuses.
- Late threshold.
- Excused-denominator rule.
- Warning/critical thresholds.
- Identifier formats.
- Monitoring controls.
- Report percent decimal places.
- Streak rule.
- Standing rule.
- Dashboard alert thresholds.

UX:

- Settings must be searchable.
- Settings must be grouped.
- Critical settings must require confirmation.
- Unimplemented settings must be visibly disabled.
- Validation errors must be clear.
- History must be readable.

---

## 16. Question bank and import format

Support this import/export format:

    {
      "version": 1,
      "questions": [
        {
          "type": "mcq",
          "text": "What does CPU stand for?",
          "options": [
            "Central Processing Unit",
            "Core Power Unit",
            "Central Power Usage",
            "Computer Processing Unit"
          ],
          "correctIndex": 0,
          "subject": "Computer Architecture",
          "difficulty": "Easy"
        },
        {
          "type": "truefalse",
          "text": "Python is a compiled language.",
          "answer": false,
          "subject": "Programming",
          "difficulty": "Easy"
        },
        {
          "type": "fill",
          "text": "The process of converting source code to machine code is called ______.",
          "answer": "compilation",
          "subject": "Programming",
          "difficulty": "Medium"
        }
      ]
    }

Preserve compatibility with:

- `mcq`
- `truefalse`
- `fill`

Optional fields may include:

- id
- marks
- tags
- acceptedAnswers
- media
- author
- status

Validate:

- Type.
- Text.
- Option count.
- `correctIndex`.
- `answer`.
- Subject.
- Difficulty.
- Duplicates.
- Marks.
- Accepted answers.

Rules:

- Store protected answers server-side.
- Never return answers to candidates before release.
- Authors cannot view results or export keys.
- A question set used by an activated assessment is frozen for that assessment.

Support:

- Question draft.
- Review.
- Published.
- Archived.
- Version history.
- Search/filter by subject/topic/difficulty/type/marks/author/status.
- Duplicate detection.
- JSON/CSV import/export.
- Media later.
- Author/reviewer workflow.

UX:

- Import preview must show row-level validation errors.
- Duplicate detection must be visible before import.
- Question editor must be clear for each question type.
- Answer key fields must be protected and role-restricted.
- Published/frozen states must be clear.

---

## 17. Assessment and invigilation controls

Per-assessment settings include:

- Duration.
- Question count.
- Attempts.
- Windows.
- Late entry.
- Check-in.
- Access code.
- Randomization.
- Grading.
- Key release.
- Result release.
- Approved remote-access policy.

Superadmin monitoring settings include:

- Heartbeat interval.
- Stale-heartbeat threshold.
- Maximum violations.
- Violation action and penalty.
- Tab-switch/page-visibility detection.
- Fullscreen requirement.
- Copy/paste policy.
- Multiple-device policy.
- Network-loss grace period.
- Auto-submit behavior.
- Candidate warning messages.

Rules:

- Unimplemented controls display “Not yet available” and are not claimed to work.
- Record heartbeat, stale connection, tab hidden/returned, fullscreen exit, copy/paste attempt, network loss/recovery, warning, violation, force submit, and auto submit.
- Browser signals are evidence; the server enforces consequences according to policy.

The invigilation board shows:

- Name.
- Student Number.
- Class S/N.
- Exam Number where applicable.
- Assessment.
- Check-in.
- Attempt status.
- Server time remaining.
- Answered count.
- Violations.
- Heartbeat age.
- Connection.
- Warning state.

UX:

- Monitoring board must be glanceable.
- Statuses must be visually distinct and text-labelled.
- Critical candidates should be easy to identify.
- Actions must require confirmation and reason.
- Do not show correct answers.
- Do not expose unauthorized candidates.

---

## 18. Attendance report and CSV export

The official attendance report is a wide pivoted table: one student per row and one selected attendance date per chronological column.

The approved column order is:

1. Serial No
2. Name
3. Student Number
4. Exam Number
5. Email
6. Class
7. Date columns, chronological
8. Total
9. Present
10. Late
11. Absent
12. Attendance %
13. Late %
14. Absent %
15. Streak
16. Standing
17. Flagged

The database stores attendance vertically; the report layer pivots it for display/export.

The Download CSV action must preserve:

- Exact approved header order.
- Date order.
- Student order.
- Attendance codes.
- Identifiers.
- Summary values shown on screen.

Use:

- `P`
- `L`
- `A`
- `E`

where enabled.

Do not substitute a different vertical export.

Include filters for:

- Class/joint class.
- Student.
- Date range.
- Daily/monthly/overall period.
- Session type.
- Exam.
- Test.

Provide XLSX/PDF later if visual formatting is required because CSV does not preserve merged cells, colors, or layout.

UX:

- Export button must be close to the visible report.
- Export must show loading state.
- Export success and failure must be communicated.
- Export must use the same filters and order as the screen.
- Long reports must not freeze the UI.

---

## 19. Superadmin comprehensive dashboard

Build a role-controlled dashboard with filters for:

- Academic session.
- Reporting period.
- Date range.
- Class.
- Joint class.
- Tutor.
- Assessment type.
- Exam.
- Test.

Sections:

### 19.1 Executive summary

- Total students.
- Classes.
- Joint classes.
- Tutors.
- Attendance.
- Present/late/absent/excused.
- Active/upcoming/completed assessments.
- Pass rate.
- Pending registers.
- Pending reviews.
- Alerts.

### 19.2 Attendance insight

- Daily/monthly/selected-period rates.
- Class/joint-class/tutor/student comparisons.
- Late trends.
- Warning/critical lists.
- Pending and amended registers.

### 19.3 Student performance

- Best performers.
- Top improvers.
- Score trends.
- Assessment count.
- Attendance context.
- Students needing attention.

Rules:

- Rankings are scoped to comparable assessments.
- Show number included.
- Do not combine attendance/performance without an approved rule.

### 19.4 Assessment operations

- Eligibility.
- Check-in.
- Absent.
- Currently writing.
- Submitted.
- Auto-submitted.
- Failed submissions.
- Average/pass rate.
- Review queue.
- Release state.
- Code failures.
- Stale heartbeat.
- Violations.

### 19.5 Website activity

Read from immutable audit log:

- Sign-ins/failures where available.
- Student/class/joint-class creation.
- Attendance changes.
- Eligibility/check-ins.
- Access codes.
- Attempts.
- Force submits.
- Extensions.
- Result adjustments.
- Exports.
- Settings/role changes.
- Backups where recorded.

Rules:

- Every metric uses one source of truth.
- Metrics match CSV values.
- Metrics have a last-updated timestamp where feasible.
- Metrics drill down to filtered details.
- Superadmin sees institution scope.
- Admin sees assigned scope.
- Tutor sees assigned classes.
- Author sees no results.
- Auditor sees read-only.

UX:

- KPI cards must be readable.
- Filters must be obvious.
- Drill-down must be clear.
- Empty states must explain lack of data.
- Alert states must be visible without excessive color noise.
- Last-updated timestamps must be subtle but present.

---

## 20. Database and API expectations

Create version-controlled SQL migrations for all schema changes.

Use:

- UUID primary keys.
- `timestamptz` timestamps.
- Check constraints for statuses.
- Foreign keys with restrictive behavior unless approved.
- Indexes for filters, joins, foreign keys, identifiers, dates, and statuses.
- Soft archive where appropriate.
- Immutable audit log.
- Idempotency keys.
- Secure RPCs for transactional workflows.
- Server-side authorization checks.
- Settings resolution functions.
- Identifier generation functions.
- Attendance report pivot functions.
- Dashboard metric functions or views.

Required secure function examples:

- Get current user roles.
- Get setting.
- Generate identifier.
- Create register session.
- Save register entries.
- Finalize register.
- Reopen register.
- Exam check-in.
- Test check-in.
- Issue access code.
- Verify access code.
- Issue attempt.
- Begin attempt.
- Save attempt answer.
- Record heartbeat.
- Record monitor event.
- Submit attempt.
- Force submit attempt.
- Grant extension.
- Grade attempt.
- Release results.
- Release keys.
- Get attendance report.
- Get invigilation board.
- Get dashboard metrics.
- Record export event.
- Record sign-in event where approved.

Rules:

- Do not trust client-provided actor IDs.
- Do not expose protected answers.
- Do not expose unreleased results.
- Do not return secrets.
- Do not return unnecessary sensitive metadata.
- Use clear error messages without exposing internals.

---

## 21. Testing, CI, and quality assurance

The repository must include tests and test documentation.

### Unit tests

Use Vitest.

Required coverage:

- CSV header and row formatting.
- Date/time utilities.
- Idempotency key generation.
- Question import validation.
- Identifier preview logic.
- Settings resolution helper where client-side helper exists.
- Permission helper logic.
- Report formatting utilities.

### Component tests

Use React Testing Library where practical.

Required coverage:

- Route guards.
- Empty states.
- Loading states.
- Error states.
- Form validation.
- Confirmation dialogs.
- Disabled “Not yet available” controls.
- Login form behavior.
- Unauthorized route handling.

### RLS tests

Maintain `docs/RLS_TEST_PLAN.md`.

Include positive and negative tests for:

- Profile read/update.
- Role assignment.
- Settings read/write.
- Classes and memberships.
- Joint classes.
- Attendance registers.
- Check-ins.
- Eligibility.
- Question bank.
- Answer keys.
- Attempts.
- Answers.
- Submissions.
- Results.
- Releases.
- Audit log.
- Export events.
- Dashboard functions.
- Identifier formats.

### UI/UX QA checklist

Before C8 completion, verify:

- Mobile responsiveness.
- Keyboard navigation.
- Focus states.
- Color contrast.
- Empty states.
- Loading states.
- Error states.
- Form validation.
- Confirmation dialogs.
- Toast feedback.
- Long-text overflow.
- Table horizontal scroll.
- Attendance register usability.
- Exam runner clarity.
- Invigilation board readability.
- Admin settings clarity.
- CSV export matches on-screen report.
- No hidden portal leakage.
- No misleading success states.
- No console errors.

### CI

Use GitHub Actions.

CI must run:

    npm ci
    npm run lint
    npm run typecheck
    npm run test
    npm run build

CI must not:

- Use production secrets.
- Use staging secrets unless explicitly configured and approved.
- Deploy automatically.
- Apply migrations.
- Connect to Supabase.

---

## 22. Commands

Use Windows-compatible npm scripts.

Required scripts:

    npm run dev
    npm run build
    npm run preview
    npm run lint
    npm run typecheck
    npm run test
    npm run test:watch

Optional scripts only if approved:

    npm run types:generate
    npm run db:validate

Do not add scripts that require secrets unless explicitly approved.

---

## 23. Vercel and deployment

Vercel project settings:

- Framework preset: Vite.
- Install command: `npm ci`.
- Build command: `npm run build`.
- Output directory: `dist`.

SPA rewrite requirement:

- Requests should fall back to `index.html` except approved API routes.

Environment variables:

- Development: staging values where appropriate.
- Preview: staging values.
- Production: production values only after separate approval.

Deployment gates:

- No deployment without approval.
- No production deployment without separate approval.
- No production database migration without separate approval.
- Preview deployment must use only approved commit and staging variables.

Security headers:

- Add safe headers where they do not break Supabase connectivity.
- Do not add a restrictive CSP unless tested and approved.

---

## 24. Build sequence

Do not skip phases. Do not begin a phase unless prior prerequisites are complete.

### C0 — Repository/environment

Goal:

- Verify repository readiness.
- Create or verify scaffold.
- Verify environment handling.
- Verify migration folders.
- Verify docs folders.
- Verify UX docs folders.
- Verify CI files.

Do not:

- Connect to Supabase.
- Apply SQL.
- Deploy.
- Create application tables.
- Use credentials.

Acceptance:

- `.env.example` exists.
- `.gitignore` ignores secrets.
- Vite/TypeScript/Tailwind/shadcn scaffold is valid.
- Required docs files exist.
- UX docs exist or are scaffolded.
- `STATUS.md` exists.
- No secrets are present.

### C1 — Foundation

Goal:

- Profiles.
- Roles.
- User-role assignment.
- Primary role support.
- Settings registry/history.
- Audit log.
- RLS.
- Secure helpers.
- Admin settings portal foundation.
- Auth UI foundation.
- Single public login page.
- Post-login role routing.

Acceptance:

- Migration drafts exist.
- RLS policies are drafted.
- Login page has no portal navigation.
- Auth flow works against mock or approved staging only after approval.
- Settings portal renders from definitions.
- Audit log is immutable in migration design.
- No academic values are hardcoded.
- Login UI is accessible and responsive.

### C2 — Academic structure

Goal:

- Academic sessions where approved.
- Classes.
- Joint classes.
- Memberships.
- Tutor assignments.
- Identifier formats/generators.

Acceptance:

- No fixed class categories.
- Historical memberships preserved.
- Identifier generation is transactional.
- Duplicate components prevented.
- Circular joint classes prevented if nested components are supported.
- RLS drafted and test plan exists.
- Admin class UI is clear and responsive.

### C3 — Attendance and eligibility

Goal:

- Daily registers.
- Exam check-in.
- Test check-in.
- Assessment model.
- Eligibility model.
- Exam/test numbering.
- Access gate.
- Attendance report pivot.
- CSV export foundation.

Acceptance:

- Daily attendance never grants assessment access.
- Check-in is unique per assessment/student.
- Check-in locks after attempt starts except approved override.
- Report pivot matches approved column order.
- CSV export preserves on-screen values.
- Attendance UI is fast and mobile-friendly.

### C4 — Question bank

Goal:

- Question schema.
- JSON/CSV import/export.
- Validation.
- Versioning.
- Review workflow.
- Protected answer keys.
- Assessment question selection.

Acceptance:

- Import format version 1 supported.
- Validation errors are clear.
- Answer keys are protected.
- Authors cannot view results.
- Activated assessment question sets are frozen.
- Question editor is usable and accessible.

### C5 — Attempt engine

Goal:

- Issue attempt.
- Begin attempt.
- Save answers.
- Heartbeat.
- Submit.
- Force submit.
- Extension.
- Idempotency.
- Weighted grading.
- Policy snapshots.
- Audit.

Acceptance:

- Server is authoritative.
- Idempotency prevents duplicate writes.
- Server time controls deadlines.
- Correct answers are not exposed.
- Submitted attempts are immutable.
- Policy snapshot is immutable.
- Student assessment UI is calm, clear, and responsive.

### C6 — Assessment controls

Goal:

- Access codes.
- Rate limiting.
- Scheduling.
- Monitoring events.
- Invigilation board.
- Configurable consequences.

Acceptance:

- Access codes are protected.
- Failed code attempts are rate-limited and audited.
- Monitoring events are stored.
- Server enforces policy consequences.
- Invigilation board uses assigned scope only.
- Invigilation UI is glanceable and accessible.

### C7 — Portals and dashboard

Goal:

- Student portal.
- Tutor/invigilator portal.
- Administration portal.
- Author portal.
- Auditor portal.
- Attendance report.
- CSV export.
- Superadmin dashboard.
- Single public login experience.
- Role-specific dashboard routing.
- Full UI/UX polish.

Acceptance:

- Route guards exist.
- Server authorization is enforced.
- Reports match database values.
- CSV export matches report exactly.
- Dashboard metrics drill down.
- Role scopes are enforced.
- Unimplemented controls show “Not yet available”.
- Public login has no portal navigation.
- Student experience feels student-only.
- Accessibility checklist completed.
- Responsive QA completed.

### C8 — Verification/deployment

Goal:

- Run unit tests.
- Run integration checks.
- Run RLS/security checklist.
- Run accessibility checklist.
- Run UI/UX QA checklist.
- Run load/readiness checks.
- Apply reviewed migrations to staging only after approval.
- Test app against staging only after approval.
- Deploy Vercel Preview only after approval.
- Production only after separate approval.

Acceptance:

- All required tests pass.
- RLS test plan completed.
- No secrets in repo.
- Staging migration approved.
- Preview deployment approved.
- Production remains untouched until separately approved.

---

## 25. Definition of Done

A task is done only when:

1. It matches the approved scope.
2. Required files are created or modified.
3. No secrets are exposed.
4. No unauthorized database or deployment action occurred.
5. Tests are written or updated where required.
6. Documentation is updated.
7. UX documentation is updated where relevant.
8. Security impact is documented.
9. RLS impact is documented.
10. Settings impact is documented.
11. UI states are handled.
12. Accessibility considerations are addressed.
13. Completion report is provided.

---

## 26. First Copilot command

Read this prompt and all repository instructions.

Work at Level 0 — Plan only.

Inspect:

- Repository state.
- Current F0/F1 work if present.
- Vercel/Vite setup.
- Supabase configuration.
- `.env.example`.
- Migration folders.
- Portal routes.
- Public login route structure.
- Attendance implementation.
- Question-bank files.
- Documentation.
- UX documentation.
- Tests.
- CI.

Do not:

- Request credentials.
- Connect to Supabase.
- Apply SQL.
- Deploy to Vercel.
- Create application tables.
- Begin C2 or later.
- Modify files unless explicitly moved to Level 1 and approved.

Return:

    TASK CONTROL CHECK
    Task:
    Permission level:
    Files expected to change:
    Database objects expected to change:
    External systems expected to access:
    Assumptions:
    Questions:

Then report:

- Current state.
- Missing prerequisites.
- Conflicts with this prompt.
- Safest next action.

Stop for approval.

---

## 27. Completion report

After each completed task, return:

    COMPLETION REPORT
    Files created or modified:
    Complete SQL/code changed:
    Commands and actual output:
    Tests passed:
    Tests failed:
    Requirements not implemented:
    Assumptions:
    RLS/security limitations:
    UI/UX limitations:
    Migration/deployment status:
    Remaining risks:

---

## 28. Emergency stop

If instructed with “EMERGENCY STOP”, or if any security risk is detected:

    STOP ALL WORK.

Do not:

- Run commands.
- Connect to Supabase.
- Modify files.
- Apply migrations.
- Deploy.
- Export data.
- Use secrets.

Report:

- Current status.
- Files changed.
- Commands executed.
- Database target.
- Unresolved risks.

Wait for instructions.
