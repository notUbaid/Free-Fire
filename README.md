# CSGC x IAR Free Fire MAX Tournament

A responsive Next.js website for the Computer Science & Gaming Club (CSGC) Free Fire MAX tournament at Institute of Advanced Research (IAR).

## Features

- 📱 **Mobile-optimized** - PWA support, disable zoom for app-like experience
- 🎮 **Team Registration** - Full team (4 players) registration with validation
- 📊 **Admin Panel** (`/admin`) - View, approve, edit, delete registrations
- ⭐ **Score Manager** (`/scoremanager`) - Manage scores, kills, placements
- 🏆 **Live Scoreboard** (`/score`) - Public scoreboard for spectators
- 🔒 **Password Protected** - All admin routes secured

## Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Email**: Brevo SMTP (for confirmations)
- **Deploy**: Vercel

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/notUbaid/Free-Fire.git
cd ff-tournament
npm install
```

### 2. Setup Environment
Copy `.env.local.example` to `.env.local` and fill in:

```env
# Supabase (Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Brevo SMTP (Settings → SMTP & Sender)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-smtp-password
```

### 3. Setup Database
Run in Supabase SQL Editor:
```sql
-- See supabase/schema.sql for full schema
```

### 4. Run Locally
```bash
npm run dev
```

Open http://localhost:3000

## Admin Credentials

Password: `Admin@CSGC#`

| Route | Purpose |
|-------|---------|
| `/admin` | Manage registrations |
| `/scoremanager` | Manage scores |
| `/score` | Public leaderboard |

## Project Structure

```
ff-tournament/
├── src/
│   ├── app/              # Next.js pages
│   │   ├── admin/        # Admin panel
│   │   ├── scoremanager # Score manager
│   │   ├── score/       # Public scoreboard
│   │   └── api/         # API routes
│   └── components/       # React components
├── public/images/        # Assets
└── supabase/           # DB schema
```

## Deployment

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

## License

Made with 🔥 by CSGC