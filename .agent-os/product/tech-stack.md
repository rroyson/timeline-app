# Technical Stack

> Last Updated: 2025-11-06
> Version: 1.0.0

## Application Framework

- **Framework:** Next.js
- **Version:** Latest stable (15.x)
- **Language:** TypeScript
- **Runtime:** Node.js 22 LTS

## Database

- **Primary:** PostgreSQL
- **Version:** 17+
- **Client:** Supabase JS Client (@supabase/supabase-js)
- **Hosting:** Supabase (Managed PostgreSQL with real-time subscriptions)
- **Migrations:** Managed via Supabase CLI

## Frontend Stack

### JavaScript Framework

- **Framework:** Next.js
- **Version:** Latest stable
- **Build Tool:** Next.js built-in (Turbopack)
- **Package Manager:** npm

### Import Strategy

- **Strategy:** Node.js modules (ESM)
- **Package Manager:** npm
- **Node Version:** 22 LTS

### Authentication

- **Provider:** Supabase Auth
- **Package:** @supabase/supabase-js (includes auth)
- **Features:** Social login, magic links, email/password, role-based access control, team management, row-level security integration

### Real-Time Communication

- **Library:** Socket.io
- **Version:** Latest stable (4.x)
- **Protocol:** WebSockets with fallback to long-polling
- **Purpose:** Real-time timeline updates and push notifications

### CSS Framework

- **Framework:** TailwindCSS
- **Version:** 4.0+
- **PostCSS:** Yes
- **Configuration:** Tailwind config with custom timeline theme

### UI Components

- **Library:** DaisyUI
- **Version:** Latest stable
- **Customization:** Custom timeline components built on DaisyUI base

## Assets & Media

### Fonts

- **Provider:** Google Fonts
- **Loading Strategy:** Self-hosted via next/font for performance
- **Primary Font:** Inter (clean, professional, highly readable)

### Icons

- **Library:** Lucide React
- **Implementation:** React components
- **Usage:** Timeline indicators, navigation, status icons

## Infrastructure

### Application Hosting

- **Platform:** Vercel
- **Service:** Serverless deployment with edge functions
- **Region:** Auto (global CDN distribution)
- **Features:** Automatic HTTPS, preview deployments, analytics

### Database Hosting

- **Provider:** Supabase
- **Service:** Managed PostgreSQL with real-time subscriptions
- **Backups:** Daily automated backups with point-in-time recovery
- **Region:** Primary region based on user base (US East initially)
- **Features:** Row-level security (RLS), built-in authentication, real-time subscriptions, storage, edge functions

### Asset Storage

- **Provider:** Amazon S3
- **CDN:** CloudFront
- **Access:** Private with signed URLs for user uploads
- **Purpose:** Event documents, team logos, attachments

### Push Notifications

- **Service:** Web Push API
- **Fallback:** In-app notifications via Socket.io
- **Permissions:** User-granted browser notifications

## Deployment

### CI/CD Pipeline

- **Platform:** GitHub Actions + Vercel
- **Trigger:** Push to main/staging branches
- **Tests:** Run before deployment (unit, integration, E2E)
- **Preview:** Automatic preview deployments for all PRs

### Environments

- **Production:** main branch → Vercel production + Supabase production database
- **Staging:** staging branch → Vercel preview + Supabase staging/preview database
- **Development:** Local development connecting to Supabase development project
- **Review Apps:** Automatic PR-based preview deployments

## Development Tools

### Code Quality

- **Linter:** ESLint (Next.js config + custom rules)
- **Formatter:** Prettier
- **Type Checking:** TypeScript strict mode
- **Pre-commit:** Husky + lint-staged

### Testing

- **Unit Tests:** Jest + React Testing Library
- **Integration Tests:** Jest + MSW (Mock Service Worker)
- **E2E Tests:** Playwright
- **Coverage Target:** 80%+ for critical paths

### Monitoring

- **Application:** Vercel Analytics + Web Vitals
- **Errors:** Sentry (error tracking and performance monitoring)
- **Database:** Supabase dashboard (query performance, logs, metrics)
- **Real-time:** Custom Socket.io connection monitoring dashboard

### AI Development Tools

- **Supabase MCP Server:** Used by Claude for database schema management, migrations, SQL execution, and development tasks
- **Note:** The Supabase MCP server is for AI-assisted development only and is not part of the application runtime. The application uses the Supabase JS client library directly.

## Code Repository

- **Platform:** GitHub
- **Repository URL:** (to be configured)
- **Branch Protection:** Required PR reviews, passing tests for main branch
- **Workflow:** Feature branches → PR → Review → Merge to main
