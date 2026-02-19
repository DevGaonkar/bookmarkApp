# Smart Bookmark Manager

A private, real-time bookmark manager built with **Next.js 14 (App Router)**, **Supabase** (Auth + PostgreSQL + Realtime), and **Tailwind CSS**. Deployed on Vercel.

## Features

- 🔐 Google OAuth (no email/password)
- 🔒 Private bookmarks per user (Row Level Security)
- ⚡ Real-time updates across tabs (Supabase Realtime)
- 🗑️ Add & delete bookmarks

## Local Development

```bash
npm install
# Add .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Supabase Setup

1. Create a Supabase project and enable Google OAuth under Authentication → Providers
2. Run the SQL in `supabase/schema.sql` in the SQL Editor
3. Enable Realtime on the `bookmarks` table under Database → Replication

## Deployment (Vercel)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`
4. After deploy, add the Vercel URL to Supabase → Authentication → URL Configuration → Redirect URLs