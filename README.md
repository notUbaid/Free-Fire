# CSGC x IAR Free Fire MAX Tournament Website

## Setup

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables** - Copy `.env.local.example` to `.env.local` and fill in:

```env
# Supabase (get from your Supabase project → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Brevo SMTP (for sending confirmation emails)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email
SMTP_PASS=your-smtp-password
```

3. **Setup Supabase Database**
- Go to Supabase SQL Editor and run `supabase/schema.sql`

4. **Run locally**
```bash
npm run dev
```

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy