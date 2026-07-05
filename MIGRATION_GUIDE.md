# Heroku to Vercel Migration Guide

## 1. Env Configuration
Transfer env vars from Heroku to Vercel Project Settings > Environment Variables:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key
- `VITE_SITE_URL`: Set to Vercel deployment URL (e.g., `https://your-app.vercel.app/` or custom domain)
- `VITE_DISCORD_WEBHOOK_ID`: Discord webhook ID
- `VITE_DISCORD_WEBHOOK_TOKEN`: Discord webhook token
- `VITE_GOOGLE_MAP_API_KEY`: Google Maps API key

## 2. Configuration changes
- Package: `@sveltejs/adapter-node` → `@sveltejs/adapter-vercel@1.0.0-next.14`
- Config: `svelte.config.js` adapter switched to `vercel()`
- Build: Vercel automatically detects SvelteKit and builds via `npm run build`

## 3. Database (Supabase)
- Hosting: Supabase remains external. No data migration needed.
- Connections: Managed via client in `src/lib/supabase.ts` reading env vars.
