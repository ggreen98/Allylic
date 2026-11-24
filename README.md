# Allylic

An interactive chemistry learning site with 3D molecule and orbital visualizations, built for the web and designed to become a mobile app.

**Live site:** [allylic.org](https://allylic.org)

## What's live

- **Chemistry 1 course:** 12 lessons from atomic structure through electron configuration, periodic trends, and ionic, covalent, and metallic bonding, with unit quizzes
- **Interactive visualizations:** 3D bonding models, electrostatic potential maps, an orbital shape viewer, and electron configuration explorers
- **Reference tools:** an interactive periodic table, a chemistry dictionary, and an SI units guide
- **Practice:** mini-games, Lewis dot practice, and achievements

## Roadmap

- More courses and lessons (reactions and beyond)
- User accounts with saved progress
- Mobile app (Expo + React Native)

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| 3D Molecules | React Three Fiber + Drei |
| Auth + Database | Supabase |
| ORM | Prisma |
| Error Logging | Sentry |
| Analytics | Vercel Analytics |
| Package Manager | Bun |
| Deployment | Vercel |
| Mobile (future) | Expo + React Native |

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) installed
- A [Supabase](https://supabase.com) project created
- A [Sentry](https://sentry.io) project created

### Setup

```bash
# Clone the repo
git clone https://github.com/ggreen98/Allylic.git
cd allylic

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
# Fill in your Supabase and Sentry keys in .env.local

# Run database migrations
bun prisma migrate dev

# Start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

See `.env.example` for all required variables.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SENTRY_DSN=
```

## Project Structure

```
app/               # Next.js App Router pages and layouts
components/
  ui/              # shadcn/ui primitives
  molecules/       # 3D molecule viewer components
  chemistry/       # Chemistry-specific UI
lib/               # Utilities, Supabase client, Prisma client
hooks/             # Custom React hooks
types/             # Shared TypeScript types
prisma/            # Prisma schema and migrations
public/            # Static assets
```

## License

MIT
