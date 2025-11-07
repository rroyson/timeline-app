# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-11-06-authentication-setup/spec.md

> Created: 2025-11-06
> Version: 1.0.0

## Technical Requirements

### Supabase Auth Integration

- Use Supabase Auth's email/password authentication
- Leverage existing Supabase client setup (browser and server)
- Use auth.signUp() for registration with email confirmation disabled initially
- Use auth.signInWithPassword() for login
- Use auth.signOut() for logout
- Use auth.getSession() for session retrieval
- Use auth.onAuthStateChange() for real-time auth state updates

### Session Management

- Store sessions in HTTP-only cookies via Supabase SSR
- Sessions automatically refresh via Next.js middleware
- Session duration: 7 days (Supabase default)
- Refresh token rotation enabled by default
- Session state accessible via React Context

### Route Protection

- Create Next.js middleware to check auth status on protected routes
- Redirect unauthenticated users to /login
- Redirect authenticated users away from /login and /signup to /dashboard
- Use Supabase server client in middleware for session checks

### Error Handling

- Display user-friendly error messages for auth failures
- Handle common errors: invalid credentials, email already exists, network errors
- Show loading states during auth operations
- Clear error messages on form field changes

## Approach Options

**Option A: Client-Side Only Auth**

- Pros: Simpler implementation, fewer files, faster initial development
- Cons: No server-side session validation, less secure, page flicker on protected routes

**Option B: Full SSR Auth with Middleware**

- Pros: Server-side session validation, no page flicker, more secure, better UX
- Cons: More complex setup, requires middleware configuration, more files

**Selected Approach: Option B (Full SSR Auth with Middleware)**

**Rationale:** Timeline is a professional tool handling sensitive event data. Server-side session validation ensures security and provides a better user experience with no authentication flicker. The Supabase SSR package makes this straightforward, and the complexity is worth the security and UX benefits. This aligns with our tech stack decision to use @supabase/ssr.

## Implementation Details

### File Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── signup/
│   │   └── page.tsx          # Signup page
│   └── layout.tsx            # Auth pages layout
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx          # Protected dashboard
│   └── layout.tsx            # Dashboard layout with nav
├── middleware.ts             # Auth middleware
└── providers/
    └── auth-provider.tsx     # Auth context provider

components/
└── auth/
    ├── login-form.tsx        # Login form component
    ├── signup-form.tsx       # Signup form component
    └── logout-button.tsx     # Logout button component
```

### Auth Context

```typescript
interface AuthContext {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

### Middleware Implementation

- Check session on all routes except public assets and auth pages
- Refresh sessions automatically using Supabase SSR helpers
- Redirect logic:
  - `/login`, `/signup` when authenticated → `/dashboard`
  - `/dashboard/*` when not authenticated → `/login`
  - Public routes (`/`) → accessible to all

### Form Validation

- Email: Valid email format
- Password: Minimum 8 characters
- Full name: Required, minimum 2 characters
- Client-side validation before submission
- Server-side validation via Supabase Auth

## External Dependencies

No new dependencies required! All authentication functionality is provided by:

- `@supabase/supabase-js` (already installed)
- `@supabase/ssr` (already installed)
- Next.js App Router (already configured)
- DaisyUI (already installed for forms)

## Success Criteria

- Users can register with email/password
- Users can login with credentials
- Sessions persist across page refreshes
- Protected routes redirect to login when not authenticated
- Authenticated users redirected away from auth pages
- Logout clears session and redirects to login
- No authentication flicker on protected pages
- Profile automatically created on signup (via existing database trigger)
- All forms use DaisyUI styling for consistency
