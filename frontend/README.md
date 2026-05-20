# Slotify Web Frontend

Vite + React single page app for the Slotify parking UI.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run lint
npm run build
npm run preview
```

## Vercel Deployment

Recommended Vercel settings:

- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Environment variables:

```text
VITE_API_BASE_URL=https://parking-app-backend-u019.onrender.com
VITE_ALLOW_DEMO_LOGIN=true
```

The included `vercel.json` adds SPA rewrites so direct refreshes on routes like `/dashboard`, `/booking`, `/ticket`, and `/profile` return `index.html` instead of a 404.

If you import the whole repository without setting `frontend` as the root directory, the repo-level `vercel.json` builds `frontend` and serves `frontend/dist`.
