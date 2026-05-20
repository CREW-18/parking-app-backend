# Backend API Documentation

The Park Pulse backend is a RESTful API built using Node.js, Express, and MongoDB (via Mongoose). It serves as the central hub connecting the web frontend, mobile app, and hardware sensors.

## Core Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODMs)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs for password hashing

## Directory Structure

```text
src/
 ├── app.js                 # Express app setup and middleware configuration
 ├── server.js              # Entry point: Server initialization and DB connection
 ├── config/
 │    └── db.js             # Mongoose connection logic
 ├── controllers/           # Business logic for all routes
 ├── middlewares/           # Custom middlewares (auth, error handling)
 ├── models/                # Mongoose Database schemas
 ├── realtime/              # (Reserved for WebSockets/Events)
 └── routes/                # Express route definitions
```

## Database Models

The MongoDB database is structured around five primary models:

1. **User (`models/User.js`)**
   - Manages user accounts (name, email, hashed password).
   - Includes methods for hashing passwords and comparing login credentials.

2. **Location (`models/Location.js`)**
   - Represents a physical parking venue (e.g., a mall or complex).
   - Tracks location name, distance, rating, congestion status, and image URL.

3. **Slot (`models/Slot.js`)**
   - Represents an individual parking space within a Location.
   - Includes the `slotNumber`, `vehicleType` (Car/Bike), and availability status (`isAvailable`).
   - Handles IoT integration through `hardwareId` and `isHardwareLinked` flags.

4. **Booking (`models/Booking.js`)**
   - Represents an advance reservation made by a user.
   - Stores the mall name, specific slot, duration (hours), total price, and booking date.

5. **Parking (`models/Parking.js`)**
   - Tracks a real-time parking session.
   - Links a vehicle number to a specific `Slot` ObjectId.
   - Records `entryTime`, `exitTime`, and session `status` ('Active' or 'Completed').

## Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Authenticate a user and receive a JWT.

### Locations
- `GET /api/locations` - Fetch all parking venues.
- `POST /api/locations` - Add a new venue.

### Slots (Availability & Hardware)
- `GET /api/slots` - Retrieve all slots (supports filtering).
- `POST /api/slots` - Create a new slot.
- `PATCH /api/slots/:slotId/availability` - Manually update slot availability.
- `POST /PATCH /api/slots/hardware/:hardwareId/availability` - Dedicated endpoint for ESP32 sensors to report occupancy (`sensorBlocked`).

### Bookings & Parking
- `GET /POST /api/bookings` - Manage user advance reservations.
- `GET /POST /api/parking` - Start and retrieve live parking sessions.
- `PUT /api/parking/exit/:parkingId` - End a parking session (records exit time).

## Environment Setup
Requires a `.env` file with `PORT`, `MONGO_URI`, `MONGO_DB`, and `JWT_SECRET`.
Database seeding can be performed via `npm run seed:all` to populate initial locations and hardware slots.