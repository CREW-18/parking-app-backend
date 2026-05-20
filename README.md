# Park Pulse

Smart parking software workspace for the Park Pulse / Slotify app.

The current primary app is:

- Backend API: Node.js, Express, MongoDB, Mongoose
- Web frontend: Vite, React, Tailwind, Framer Motion
- Legacy mobile app: the older Expo app is still preserved in `park-pulse-frontend/`

ESP32/NodeMCU hardware integration comes after the software flow is stable.

## Folder Structure

```text
parking-app-backend/
  src/                    Backend API source
  scripts/                Database seed scripts
  frontend/               Primary React web frontend
  hardware/               ESP32/NodeMCU sketch and setup guide for KCT slot hardware
  park-pulse-frontend/    Legacy Expo mobile app, preserved for reference
  ai_service.py           Optional Python heatmap service
  .env.example            Backend env example
  frontend/.env.example   Web frontend env example
```

## What Is Working

- MongoDB Atlas connection
- Render-hosted backend
- Auth API: register/login
- Parking slot API for ESP32-style availability updates
- Location/mall card API for the new web frontend
- Booking creation and booking list
- Vite frontend build and lint

## Backend Setup

Install dependencies from the project root:

```bash
npm.cmd install
```

Create `.env` from the example:

```bash
copy .env.example .env
```

Example backend `.env` shape:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@parking.fa0b5qn.mongodb.net/parkpulse?retryWrites=true&w=majority&appName=Parking
MONGO_DB=parkpulse
JWT_SECRET=replace-with-a-long-random-secret
DNS_SERVERS=8.8.8.8,1.1.1.1
```

Do not commit `.env`.

Seed starter data:

```bash
npm.cmd run seed:all
```

Or seed separately:

```bash
npm.cmd run seed:slots
npm.cmd run seed:locations
```

Start backend locally:

```bash
npm.cmd run dev
```

Test:

```text
http://localhost:5000/health
http://localhost:5000/api/slots
http://localhost:5000/api/locations
```

## Render Backend

Current hosted backend:

```text
https://parking-app-backend-u019.onrender.com
```

Useful test URLs:

```text
https://parking-app-backend-u019.onrender.com/health
https://parking-app-backend-u019.onrender.com/api/slots
https://parking-app-backend-u019.onrender.com/api/locations
```

Render settings:

```text
Language: Node
Root Directory: leave empty
Build Command: npm install
Start Command: npm start
```

Render environment variables:

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@parking.fa0b5qn.mongodb.net/parkpulse?retryWrites=true&w=majority&appName=Parking
MONGO_DB=parkpulse
JWT_SECRET=replace-with-a-long-random-secret
DNS_SERVERS=8.8.8.8,1.1.1.1
NODE_VERSION=20
```

MongoDB Atlas Network Access must allow Render. For a demo setup:

```text
0.0.0.0/0
```

## Web Frontend Setup

The primary frontend is now:

```text
frontend/
```

Install dependencies:

```bash
cd frontend
npm.cmd install
```

Create frontend env:

```bash
copy .env.example .env
```

For hosted Render backend:

```env
VITE_API_BASE_URL=https://parking-app-backend-u019.onrender.com
```

For local backend:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start frontend locally:

```bash
npm.cmd run dev
```

Build frontend:

```bash
npm.cmd run build
```

Lint frontend:

```bash
npm.cmd run lint
```

## Frontend Deployment

The `frontend/` app is a Vite app and can be deployed on Vercel, Netlify, or Render Static Site.

Recommended Vercel settings:

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Frontend environment variable:

```env
VITE_API_BASE_URL=https://parking-app-backend-u019.onrender.com
```

## API Endpoints

Health:

```text
GET /health
```

Auth:

```text
POST /api/auth/register
POST /api/auth/login
```

Important: login/register are `POST` endpoints. Opening them directly in a browser sends `GET`, so it will not work.

Location cards for the new web UI:

```text
GET  /api/locations
POST /api/locations
```

Parking slots for actual slot availability and ESP32:

```text
GET   /api/slots
GET   /api/slots?locationName=KCT&hardwareLinked=true
POST  /api/slots
PATCH /api/slots/:slotId/availability
POST  /api/slots/hardware/:hardwareId/availability
PATCH /api/slots/hardware/:hardwareId/availability
```

Bookings:

```text
GET  /api/bookings
POST /api/bookings
```

Parking sessions:

```text
GET  /api/parking
POST /api/parking
PUT  /api/parking/exit/:parkingId
```

## ESP32 Later

The planned ESP32 integration should call:

```http
PATCH https://parking-app-backend-u019.onrender.com/api/slots/<slotId>/availability
Content-Type: application/json
```

Occupied:

```json
{
  "isAvailable": false
}
```

Empty:

```json
{
  "isAvailable": true
}
```

Keep hardware mapping simple at first: one sensor maps to one MongoDB slot `_id`.

For the seeded KCT hardware slot, the hardware-friendly endpoint is:

```http
POST https://parking-app-backend-u019.onrender.com/api/slots/hardware/KCT-SENSOR-01/availability
Content-Type: application/json
```

Occupied:

```json
{
  "sensorBlocked": true
}
```

Empty:

```json
{
  "sensorBlocked": false
}
```

The same endpoint also accepts `PATCH` with `isAvailable`.

The seed scripts create venue `KCT` and hardware slot `KCT-A1` with hardware id `KCT-SENSOR-01`.

ESP32/NodeMCU code and wiring/setup instructions are in `hardware/README.md`.

## Fresh Setup Checklist

1. Install backend dependencies: `npm.cmd install`
2. Configure backend `.env`
3. Run `npm.cmd run seed:all`
4. Run `npm.cmd run dev`
5. Test `/health`, `/api/slots`, `/api/locations`
6. Install frontend dependencies: `cd frontend && npm.cmd install`
7. Configure `frontend/.env`
8. Run `npm.cmd run dev` inside `frontend/`
9. Test register, login, dashboard, booking, payment, and my bookings
10. Deploy backend on Render
11. Deploy frontend separately as a Vite app

## Notes

- The old Expo project is kept in `park-pulse-frontend/` for reference.
- The new primary UI is `frontend/`.
- Do not commit `.env` files.
- ZIP files and generated folders are ignored.
