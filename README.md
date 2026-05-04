# 🧭 TripMate — Your Travel Companion

A mobile-first PWA travel companion built with React + Vite + TailwindCSS + Supabase.

## Features

- 🏠 **Home** — Search destinations, browse by category, see nearby places
- ❤️ **Favourites** — Save and manage favourite destinations
- 🧭 **Explorer** — Feature hub for trips, groups, and expenses
- 👥 **Groups** — Create trip groups, add members, plan together
- 💰 **Expense Calculator** — Track and split trip expenses with pie charts
- 📋 **Trip Planner** — Plan trips from templates or custom
- 👤 **Profile** — View stats, settings, manage account

## Tech Stack

- **Frontend:** React 18 + Vite 6
- **Styling:** TailwindCSS 3.4
- **Backend:** Supabase (Auth + Database)
- **APIs:** Nominatim (location search), Unsplash (images), Browser Geolocation
- **Charts:** Recharts
- **Icons:** Lucide React
- **PWA:** vite-plugin-pwa

## Setup

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run Supabase migration
# Copy supabase/migrations/001_initial_schema.sql to your Supabase SQL Editor

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Demo Mode

If Supabase is not configured, the app runs in **Guest Mode** with localStorage for data persistence. All features work without a backend.

## Deployment

Deploy to Vercel:
```bash
npm run build
# Upload dist/ or connect repo to Vercel
```

`vercel.json` is included for SPA routing.
