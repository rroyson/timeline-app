# Timeline

Timeline is a real-time event coordination platform that helps event coordinators, musicians, vendors, and caterers stay synchronized during live events.

## Prerequisites

- Node.js 22 LTS or higher
- npm or yarn
- A Supabase account and project ([Create one here](https://supabase.com))

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd timeline-poc
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project in [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **Settings > API** in your Supabase project
3. Copy the **Project URL** and **anon/public key**

### 4. Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
timeline-poc/
├── app/                   # Next.js App Router pages and layouts
│   ├── globals.css       # Global styles and DaisyUI theme
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── ui/               # Reusable UI components (DaisyUI-based)
├── lib/
│   ├── supabase/         # Supabase client configurations
│   │   ├── client.ts     # Browser client
│   │   └── server.ts     # Server client
│   └── utils.ts          # Utility functions (cn, etc.)
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── .env.local.example    # Environment variables template
```

## Development

### Code Formatting

This project uses Prettier for code formatting. Code is automatically formatted on commit via Husky pre-commit hooks.

To manually format all files:

```bash
npm run format
```

### Linting

ESLint is configured with Next.js recommended rules:

```bash
npm run lint
```

### TypeScript

The project uses TypeScript strict mode for enhanced type safety. Path aliases are configured with `@/` prefix:

```typescript
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
```

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL via Supabase
- **Authentication:** Supabase Auth
- **Real-Time:** Supabase Realtime + Socket.io (planned)
- **Styling:** Tailwind CSS v4 + DaisyUI
- **Icons:** Lucide React
- **Code Quality:** Prettier, ESLint, Husky, lint-staged

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## DaisyUI Theme

This project uses a custom DaisyUI theme called "timeline" with the following color scheme:

- **Primary (Blue):** Timeline/coordination feel
- **Secondary (Purple):** Creativity/collaboration
- **Accent (Green):** Success/on-time indicators
- **Neutral (Gray):** Backgrounds and subtle elements

DaisyUI components are available throughout the application. [View components](https://daisyui.com/components/)

## Supabase Setup

### Client-Side Usage

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';

export default function MyComponent() {
  const supabase = createClient();
  // Use supabase client
}
```

### Server-Side Usage

```typescript
import { createClient } from '@/lib/supabase/server';

export default async function ServerComponent() {
  const supabase = await createClient();
  // Use supabase client
}
```

## Contributing

1. Follow the existing code style (enforced by Prettier and ESLint)
2. Use TypeScript for all new code
3. Write descriptive commit messages
4. Pre-commit hooks will automatically format and lint your code

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

[License details to be added]
