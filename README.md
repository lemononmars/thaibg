# Thai Board Game Database

A nodejs database front-end made with Svelte and Svelte Kit. Data and auth supplied by Supabase.

# How to install

      git clone
      cd thaibg
      npm install

Create an env file at the root folder manually, or run the following code

      touch .env.local

Then, add the following environment variables to `.env.local` for development

      VITE_SUPABASE_URL= YOUR-SUPABASE-URL
      VITE_SUPABASE_ANON_KEY= YOUR-SECRET-ANON-KEY
      VITE_SITE_URL = YOUR-DEPLOYMENT-WEBSITE

For deployment, use platform specific configuration. For example, if you deploy to [heroku](https://devcenter.heroku.com/articles/config-vars), you will need to use the command

      heroku config:set VITE_SUPABASE_URL=YOUR-SUPABASE-URL  VITE_SUPABASE_ANON_KEY=YOUR-SECRET-ANON-KEY

`ANON-KEY` can be accessed at
`https://app.supabase.io/project/YOUR-PROJECT-SLUG/settings/api`, or found on website at Settings > API.

Now, you are ready to test via

      npm run dev

and monitor at `localhost:3000`

# API

To be added

# How to use database

See this project's [wiki](https://github.com/lemononmars/thaibg/wiki).

# Resources

- [Svelte-start-kit](https://github.com/one-aalam/svelte-starter-kit) for head start
- Tailwind, daisyUI
- Typescript
- [Supabase](https://supabase.io/)
- Svelte Kit with adapter-node for deployment on heroku
