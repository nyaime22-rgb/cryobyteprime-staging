# UX Guidelines - CryoBytePrime CBT & Attendance

## Design Principles

1. **Clarity**: Every action and piece of information should be immediately understandable
2. **Efficiency**: Minimize clicks and cognitive load for frequent tasks
3. **Consistency**: Use established patterns across all modules
4. **Accessibility**: WCAG 2.1 AA compliance target
5. **Responsiveness**: Mobile-first approach, works on tablets and desktops

## Color System

### Primary Palette
- Primary: Blue (trust, professionalism)
- Secondary: Gray (neutral backgrounds)
- Destructive: Red (errors, deletions)
- Success: Green (confirmations, completed actions)
- Warning: Amber (cautions, pending states)

### Usage Guidelines
- Use primary color for main actions and brand elements
- Reserve destructive color for dangerous actions only
- Ensure sufficient contrast ratios (minimum 4.5:1 for normal text)

## Typography

### Font Stack
- Default: System fonts (San Francisco, Inter, Segoe UI, Roboto)
- Monospace: For code, IDs, and technical data

### Hierarchy
- H1: Page titles (text-3xl font-bold)
- H2: Section headers (text-2xl font-semibold)
- H3: Subsections (text-xl font-medium)
- Body: Regular content (text-sm)
- Small:辅助 text (text-xs text-muted-foreground)

## Component Patterns

### Forms
- Label above input field
- Placeholder shows format example, not label
- Validation errors appear inline below field
- Required fields marked with asterisk
- Submit button at bottom right

### Tables
- Striped rows for readability
- Sticky header for long lists
- Pagination for >10 rows
- Sortable columns where relevant
- Bulk actions toolbar when multi-select enabled

### Cards
- Used for dashboard widgets and summaries
- Consistent padding (p-6)
- Header-title-description-content-footer structure
- Hover effects for interactive cards

### Dialogs/Modals
- Confirm destructive actions
- Use for quick edits without page navigation
- Close on outside click or Escape key
- Focus trap while open

## Navigation

### Top Bar
- Logo and product name on left
- User profile and sign out on right
- Breadcrumbs for deep pages (future)

### Side Navigation (future enhancement)
- Collapsible for more screen space
- Grouped by module (Students, Teachers, Courses, etc.)
- Active state clearly indicated

## States & Feedback

### Loading States
- Skeleton loaders for content areas
- Spinner for actions >500ms
- Disable buttons during submission

### Empty States
- Illustration + message + call-to-action
- Example: "No students enrolled yet" + "Add Student" button

### Error States
- Clear error message explaining what went wrong
- Suggested action to resolve
- Preserve user input where appropriate

### Success Feedback
- Toast notifications for background actions
- Inline confirmation for form submissions
- Auto-dismiss after 5 seconds for non-critical messages

## Responsive Breakpoints

- sm: 640px (mobile landscape)
- md: 768px (tablets)
- lg: 1024px (small laptops)
- xl: 1280px (desktops)
- 2xl: 1536px (large screens)

## Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels for icon-only buttons
- [ ] Form inputs associated with labels
- [ ] Color not used as sole means of conveying information
- [ ] Alt text for meaningful images
- [ ] Skip to main content link (future)

## Dark Mode Support

Dark mode is configured in Tailwind but should be tested thoroughly before enabling. Consider:
- Reduced eye strain for evening use
- Battery savings on OLED displays
- User preference detection via `prefers-color-scheme`
