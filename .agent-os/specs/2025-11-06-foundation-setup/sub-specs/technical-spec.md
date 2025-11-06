# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-11-06-foundation-setup/spec.md

> Created: 2025-11-06
> Version: 1.0.0

## Technical Requirements

### Supabase Configuration

- Create Supabase client singleton with TypeScript support
- Support both client-side and server-side usage patterns (Next.js App Router)
- Configure environment variables for Supabase URL and anon key
- Implement proper error handling for missing environment variables
- Use createClient from @supabase/supabase-js with appropriate configuration

### DaisyUI Integration

- Install DaisyUI as Tailwind CSS plugin
- Configure custom Timeline theme with brand colors
- Ensure compatibility with Tailwind CSS v4
- Set up theme customization for primary, secondary, accent colors
- Document available DaisyUI components for team reference

### Project Folder Structure

- Create `app/` structure following Next.js 15 App Router conventions
- Create `components/` folder with `ui/` subfolder for reusable components
- Create `lib/` folder for utilities, clients, and helpers
- Create `types/` folder for TypeScript type definitions
- Create `hooks/` folder for custom React hooks
- Follow path aliasing convention with `@/` prefix for imports

### Environment Configuration

- Create `.env.local.example` template with all required variables
- Document each environment variable with comments
- Add `.env.local` to .gitignore (verify not committed)
- Configure Next.js to properly load environment variables
- Separate public (NEXT*PUBLIC*\*) from server-only variables

### Code Quality Tools

- Configure Prettier with 2-space indentation, single quotes, and multi-line formatting rules
- Extend ESLint with recommended Next.js rules plus custom Timeline rules
- Install and configure Husky for git hooks
- Set up lint-staged to run Prettier and ESLint on staged files
- Configure TypeScript strict mode in tsconfig.json

## Approach Options

**Option A: Manual Supabase Setup**

- Pros: Full control over configuration, easier to debug, no magic abstractions
- Cons: More initial setup work, need to document client/server patterns

**Option B: Use Supabase SSR Package (@supabase/ssr)**

- Pros: Optimized for Next.js App Router, handles cookies automatically, better server-side support
- Cons: Additional dependency, more complex initially, team needs to learn SSR patterns

**Selected Approach: Option B (Supabase SSR Package)**

**Rationale:** The @supabase/ssr package is specifically designed for Next.js App Router and handles the complexity of server-side authentication, cookie management, and client creation patterns. Since Timeline will use Supabase Auth extensively, using the official SSR package will save significant time and prevent common authentication bugs. The additional complexity is worth it for the improved developer experience and reliability.

## External Dependencies

### Production Dependencies

- **@supabase/supabase-js** (^2.x) - Core Supabase client library
  - **Justification:** Required for all Supabase interactions (database, auth, real-time, storage)

- **@supabase/ssr** (^0.x) - Supabase SSR helpers for Next.js
  - **Justification:** Provides optimized client creation for Next.js App Router with proper cookie handling and server-side support

- **daisyui** (^4.x) - UI component library built on Tailwind CSS
  - **Justification:** Accelerates UI development with pre-built accessible components, specified in tech stack

- **lucide-react** (^0.x) - Icon library with React components
  - **Justification:** Clean, modern icons as specified in tech stack, tree-shakeable

### Development Dependencies

- **prettier** (^3.x) - Code formatter
  - **Justification:** Enforces consistent code style automatically across team

- **prettier-plugin-tailwindcss** (^0.x) - Prettier plugin for Tailwind class sorting
  - **Justification:** Automatically sorts Tailwind classes in consistent order

- **husky** (^9.x) - Git hooks manager
  - **Justification:** Enables pre-commit hooks for code quality enforcement

- **lint-staged** (^15.x) - Run linters on staged files
  - **Justification:** Improves pre-commit hook performance by only checking staged files

## Implementation Details

### Supabase Client Pattern

Create two client utilities:

1. `lib/supabase/client.ts` - Browser client using createBrowserClient
2. `lib/supabase/server.ts` - Server client using createServerClient with cookies

This pattern follows Supabase SSR best practices for Next.js App Router.

### DaisyUI Theme Configuration

Configure theme in `tailwind.config.ts`:

- Primary color: Blue (timeline/coordination feel)
- Secondary color: Purple (creativity/collaboration)
- Accent color: Green (success/on-time)
- Neutral: Gray tones for backgrounds
- Base: White/dark backgrounds for themes

### Folder Structure

```
timeline-poc/
├── app/
│   ├── (auth)/           # Auth-related routes
│   ├── (dashboard)/      # Dashboard routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # Utility functions
├── types/
│   └── database.ts       # Database types (generated)
└── hooks/                # Custom React hooks
```

### Environment Variables

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-only, for admin operations)

### Code Quality Configuration

Prettier config (`.prettierrc`):

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

ESLint extends:

- `next/core-web-vitals`
- `next/typescript`

## Success Criteria

- All dependencies install without errors
- `npm run dev` starts successfully
- Supabase client can be imported and instantiated
- DaisyUI components render correctly
- Prettier formats code on save (with IDE configuration)
- Pre-commit hook runs and enforces code quality
- No TypeScript errors in strict mode
