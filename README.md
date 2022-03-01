# Thai Board Game Database

A nodejs database front-end made with Svelte and Svelte Kit. Data and auth supplied by Supabase.

# How to install

      git clone 
      cd thaibg
      npm install

Create an env file at the root folder manually, or run the following code

      sudo .env.local

Then, add the following environments for dev

      VITE_SUPABASE_URL= YOUR-SUPABASE-URL
      VITE_SUPABASE_ANON_KEY= YOUR-SECRET-ANON-KEY
      VITE_SITE_URL = YOUR-DEPLOYMENT-WEBSITE

`ANON-KEY` can be accessed at 
`https://app.supabase.io/project/YOUR-PROJECT-SLUG/settings/api`, or found on website at Settings > API.

Now, you are ready to test via

      npm run dev

and monitor at `localhost:3000`

# Directory

There are several folders here.

## Board Game

## Category

## Content

## Event

## Honor

## Manufacturer

## Mechanics

## Person

## Place

Might be removed later

## Publisher

## Retailer

## Sponsor

# Relation

In addition, there are several relational tables

## Designer_Relation
## Graphicdesigner_Relation
## Artist_Relation
## Creator_Relation
## Publisher_Relation
## Sponsor_Relation

Linked with board games via `TBG_ID`

## Category_Relation
## Mechanics_Relation
## Type_Relation

Linked with board games via `TBG_ID`

## Person

Contains `Designer_ID`, `Graphicdesigner_ID`, `Artist_ID` and `Creator_ID` of the same person

## Honor_Relation

Linked with board games via `TBG_ID`. Also contains specific information of each honor, such as honor type (e.g. award, contest), position (e.g. winnter, runner-up)

## Content_Relation

Linked with content creators via `Creator_ID`

# API

To be implemented

# Resources

* [Svelte-start-kit](https://github.com/one-aalam/svelte-starter-kit) for head start
* Tailwind, daisyUI
* Typescript
* [Supabase](https://supabase.io/) 
* Svelte Kit with adapter-node for deployment on heroku