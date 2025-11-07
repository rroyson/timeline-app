# Spec Tasks

These are the tasks to be completed for the spec detailed in @.agent-os/specs/2025-11-06-authentication-setup/spec.md

> Created: 2025-11-06
> Status: Ready for Implementation

## Tasks

- [ ] 1. Set up Auth Context and Provider
  - [ ] 1.1 Create AuthContext with user state, loading state, and auth methods
  - [ ] 1.2 Implement AuthProvider component with Supabase auth state listener
  - [ ] 1.3 Add AuthProvider to root layout
  - [ ] 1.4 Create useAuth hook for consuming auth context

- [ ] 2. Implement Authentication UI Components
  - [ ] 2.1 Create LoginForm component with email/password fields and validation
  - [ ] 2.2 Create SignupForm component with full name, email, password, and confirm password fields
  - [ ] 2.3 Create LogoutButton component with loading state
  - [ ] 2.4 Implement form validation and error display for all auth forms

- [ ] 3. Create Authentication Pages and Layouts
  - [ ] 3.1 Create auth layout with centered card design in app/(auth)/layout.tsx
  - [ ] 3.2 Create login page at app/(auth)/login/page.tsx
  - [ ] 3.3 Create signup page at app/(auth)/signup/page.tsx
  - [ ] 3.4 Add Timeline branding and responsive styling to auth pages

- [ ] 4. Implement Protected Routes and Middleware
  - [ ] 4.1 Create Next.js middleware to check auth status on all routes
  - [ ] 4.2 Implement session refresh logic using Supabase SSR helpers
  - [ ] 4.3 Add redirect logic: authenticated users away from /login and /signup to /dashboard
  - [ ] 4.4 Add redirect logic: unauthenticated users from /dashboard to /login
  - [ ] 4.5 Test middleware with various authentication states

- [ ] 5. Create Dashboard Layout and Protected Pages
  - [ ] 5.1 Create dashboard layout with navigation bar in app/(dashboard)/layout.tsx
  - [ ] 5.2 Add user profile display and logout button to dashboard nav
  - [ ] 5.3 Create basic dashboard page at app/(dashboard)/dashboard/page.tsx
  - [ ] 5.4 Verify profile auto-creation on signup via database trigger

- [ ] 6. Verify Authentication Flow End-to-End
  - [ ] 6.1 Test new user registration flow (signup → profile creation → dashboard redirect)
  - [ ] 6.2 Test existing user login flow (login → dashboard redirect)
  - [ ] 6.3 Test session persistence across page refreshes and browser tabs
  - [ ] 6.4 Test logout flow (logout → session cleared → redirect to login)
  - [ ] 6.5 Test protected route access without authentication (redirect to login)
  - [ ] 6.6 Test authenticated user accessing auth pages (redirect to dashboard)
