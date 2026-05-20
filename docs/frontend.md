# Web Frontend Documentation

The Park Pulse primary web frontend is a modern, responsive Single Page Application (SPA) providing users with a fast and intuitive interface for booking and managing parking slots.

## Core Technologies

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & PostCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios

## Folder Structure

```text
frontend/
 ├── index.html             # Vite HTML entry point
 ├── vite.config.js         # Vite configuration (plugins, dev server)
 ├── tailwind.config.js     # Tailwind design system configuration
 ├── src/
 │    ├── main.jsx          # React DOM mounting
 │    ├── App.jsx           # Root component and Router configuration
 │    ├── api/              # Axios instances and API wrapper functions
 │    ├── components/       # Reusable UI components (e.g., BottomNavigation)
 │    ├── context/          # React Context providers (e.g., UserContext)
 │    ├── layouts/          # Page layouts (e.g., MainLayout)
 │    └── pages/            # Application views/screens
```

## Key Architectural Concepts

### 1. State Management & Context
Global user state (authentication status, user details) is managed using React Context API (`UserContext.jsx`). This avoids prop-drilling and allows any component to access the current logged-in user and their JWT token.

### 2. API Integration
The `src/api` folder encapsulates all backend communication using `axios`.
- Base URL is configured via environment variables (`VITE_API_BASE_URL`).
- Axios interceptors can be utilized here to automatically inject the JWT token into request headers for protected routes.

### 3. Component Hierarchy & Routing
React Router is used to handle client-side routing.
The `MainLayout` component serves as a wrapper for most pages, ensuring consistent UI elements like the top navigation bar and the `BottomNavigation` (mobile-like tab bar) are present across the app.

### Main Pages
- **Splash / Login / Register**: Onboarding and authentication flows.
- **Dashboard**: The main hub displaying nearby locations, search features, and quick actions.
- **Booking**: UI for selecting a time, duration, and specific slot at a venue.
- **Payment**: Checkout screen finalizing the booking.
- **TicketQR**: Generates a scannable QR code (using `qrcode.react`) for entry at the parking location. Includes PDF download functionality.
- **MyBookings**: History of active and past reservations.
- **Navigate**: Integrated map or directions view.

## Scripts
- `npm run dev` - Starts the Vite development server.
- `npm run build` - Compiles the app for production (outputs to `/dist`).
- `npm run lint` - Runs ESLint to ensure code quality.