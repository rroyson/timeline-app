# UI Components Specification

This is the UI components specification for the spec detailed in @.agent-os/specs/2025-11-06-authentication-setup/spec.md

> Created: 2025-11-06
> Version: 1.0.0

## Component Structure

### LoginForm Component

**Purpose:** Allow existing users to authenticate with email/password

**Props:**

```typescript
interface LoginFormProps {
  onSuccess?: () => void;
}
```

**UI Elements:**

- Email input field (type="email", required)
- Password input field (type="password", required)
- Submit button with loading state
- Link to signup page
- Error message display area

**DaisyUI Components Used:**

- `input` with `input-bordered` classes
- `btn` with `btn-primary` for submit
- `alert` with `alert-error` for errors
- `form-control` and `label` for form structure

**Validation:**

- Email must be valid format
- Password must not be empty
- Show validation errors inline

### SignupForm Component

**Purpose:** Allow new users to create an account

**Props:**

```typescript
interface SignupFormProps {
  onSuccess?: () => void;
}
```

**UI Elements:**

- Full name input field (required)
- Email input field (type="email", required)
- Password input field (type="password", required, min 8 chars)
- Confirm password field (must match password)
- Submit button with loading state
- Link to login page
- Error message display area

**DaisyUI Components Used:**

- `input` with `input-bordered` classes
- `btn` with `btn-primary` for submit
- `alert` with `alert-error` for errors
- `form-control` and `label` for form structure

**Validation:**

- Full name minimum 2 characters
- Email must be valid format
- Password minimum 8 characters
- Confirm password must match
- Show validation errors inline

### LogoutButton Component

**Purpose:** Allow users to sign out securely

**Props:**

```typescript
interface LogoutButtonProps {
  className?: string;
  onSuccess?: () => void;
}
```

**UI Elements:**

- Button with loading state
- Optional icon (logout icon from Lucide React)

**DaisyUI Components Used:**

- `btn` with `btn-ghost` or `btn-outline`
- `loading` class for loading spinner

## Layout Components

### Auth Layout

**Purpose:** Provide consistent layout for login/signup pages

**Features:**

- Centered card on page
- Timeline branding/logo
- Responsive design (mobile-friendly)
- Clean, professional appearance
- Light background with subtle gradient

**Structure:**

```tsx
<main className="bg-base-200 flex min-h-screen items-center justify-center">
  <div className="card bg-base-100 w-full max-w-md shadow-xl">
    <div className="card-body">
      {/* Timeline logo */}
      {/* Page content */}
    </div>
  </div>
</main>
```

### Dashboard Layout

**Purpose:** Provide layout for authenticated pages

**Features:**

- Navigation bar with Timeline branding
- User profile dropdown
- Logout button
- Responsive sidebar (future feature)

**Structure:**

```tsx
<div className="bg-base-200 min-h-screen">
  <nav className="navbar bg-base-100 shadow-lg">
    {/* Logo */}
    {/* User menu with logout */}
  </nav>
  <main className="container mx-auto p-4">{children}</main>
</div>
```

## Styling Guidelines

### Form Styling

All forms should follow consistent DaisyUI patterns:

```tsx
<div className="form-control">
  <label className="label">
    <span className="label-text">Email</span>
  </label>
  <input
    type="email"
    className="input input-bordered"
    placeholder="you@example.com"
  />
  {error && (
    <label className="label">
      <span className="label-text-alt text-error">{error}</span>
    </label>
  )}
</div>
```

### Button States

- Default: `btn btn-primary`
- Loading: Add `loading` class
- Disabled: Add `disabled` attribute
- Full width on mobile: `btn-block sm:btn-wide`

### Error Display

- Use DaisyUI `alert alert-error` for general errors
- Use label-text-alt with `text-error` for field-specific errors
- Clear errors on input change for better UX

### Loading States

- Show loading spinner on buttons during auth operations
- Disable form inputs while loading
- Use DaisyUI `loading loading-spinner` classes

## Responsive Design

### Mobile (< 640px)

- Single column layout
- Full-width buttons
- Adequate touch targets (min 44px)
- Simplified navigation

### Tablet (640px - 1024px)

- Same as mobile, but with more padding
- Optional sidebar collapsed by default

### Desktop (> 1024px)

- Maximum width container
- Side-by-side layouts where appropriate
- Full navigation visible

## Accessibility

- All form inputs have associated labels
- Error messages announced to screen readers
- Keyboard navigation supported
- Focus states visible
- Sufficient color contrast (handled by DaisyUI)
- ARIA labels where appropriate

## Color Usage

Using custom Timeline theme from globals.css:

- **Primary (Blue):** Main CTAs, submit buttons
- **Secondary (Purple):** Secondary actions, links
- **Accent (Green):** Success states
- **Error (Red):** Error messages, validation failures
- **Base:** Backgrounds and text (from DaisyUI theme)
