# Park Pulse Smart Parking System

Beginner-friendly setup guide for the Park Pulse smart parking project.

This project has two main software parts:

1. Backend API: Node.js, Express, MongoDB, Mongoose
2. Mobile app: Expo React Native

Hardware/ESP32 integration comes later. First, get MongoDB, the backend, and the mobile app working.

## Current Project Status

- Backend source code is inside `src/`.
- Mobile app source code is inside `park-pulse-frontend/`.
- Backend can run locally with `npm run dev`.
- Backend can also run on Render.
- Database should be MongoDB Atlas for hosted/deployed use.
- ESP32 integration is planned around slot availability updates.

## Folder Structure

```text
parking-app-backend/
  src/
    app.js                 Express app and route setup
    server.js              Starts the backend server
    config/db.js           MongoDB connection
    controllers/           Backend logic
    models/                MongoDB schemas
    routes/                API endpoints
    middlewares/           Auth and error handlers
  scripts/
    seedSlots.js           Adds sample parking slots
  park-pulse-frontend/     Expo React Native app
  ai_service.py            Optional Python heatmap service
  .env.example             Backend env example
  README.md                This guide
```

## Part 1: Install Required Software

Install these first:

1. Node.js LTS
   - Download from https://nodejs.org/
   - After installing, check:

```bash
node -v
npm -v
```

2. Git
   - Download from https://git-scm.com/

3. MongoDB Atlas account
   - Go to https://www.mongodb.com/products/platform/atlas-database
   - This is where your cloud database will live.

4. Expo Go app on your phone
   - Install Expo Go from Play Store or App Store.

5. Python is optional
   - Only needed later for `ai_service.py`.
   - Skip it for now if you only want backend + mobile app.

## Part 2: Create MongoDB Atlas Database

Do this before running the backend.

1. Open MongoDB Atlas.
2. Create a new project, for example:

```text
Park Pulse
```

3. Create a new cluster.
   - Choose the free/shared option if available.
   - Pick a nearby region.
   - Wait for the cluster to finish creating.

4. Create a database user.
   - Go to Database Access.
   - Add a new user.
   - Example:

```text
Username: parkpulse_user
Password: make-a-strong-password
```

Save this password somewhere safe. You will need it for `MONGO_URI`.

5. Allow network access.
   - Go to Network Access.
   - Add your current IP address for local development.
   - For Render hosting, you may need to allow access from anywhere:

```text
0.0.0.0/0
```

This is convenient for student/demo projects, but for production you should restrict access more carefully.

6. Get your connection string.
   - Go to your cluster.
   - Click Connect.
   - Choose Drivers / Connect your application.
   - Copy the connection string.

It will look similar to this:

```text
mongodb+srv://parkpulse_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Change it to include your database name, `parkpulse`:

```text
mongodb+srv://parkpulse_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/parkpulse?retryWrites=true&w=majority
```

Important:

- Replace `YOUR_PASSWORD` with your real database password.
- If your password has special characters like `@`, `#`, `/`, or `?`, encode them or create a simpler password for development.
- Keep this URI private. Do not commit it to GitHub.

Official docs:

- MongoDB Atlas connection guide: https://www.mongodb.com/docs/atlas/connect-to-cluster/
- MongoDB connection string format: https://www.mongodb.com/docs/manual/reference/connection-string/

## Part 3: Setup Backend Locally

Open terminal in the project root:

```bash
cd D:\Projects\parking-app-backend
```

Install backend dependencies:

```bash
npm install
```

Create your real backend `.env` file:

```bash
copy .env.example .env
```

Open `.env` and update it:

```env
PORT=5000
MONGO_URI=mongodb+srv://parkpulse_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/parkpulse?retryWrites=true&w=majority
JWT_SECRET=make-a-long-random-secret
```

Now add sample parking slots:

```bash
npm run seed:slots
```

Start the backend:

```bash
npm run dev
```

If it works, you should see something like:

```text
MongoDB connected: ...
Park Pulse API listening on port 5000
```

Open this in your browser:

```text
http://localhost:5000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Part 4: Test Backend API Quickly

You can test using Postman, Thunder Client, or curl.

Important: auth endpoints are `POST` endpoints. If you paste `http://localhost:5000/api/auth/login` into a browser, the browser sends a `GET` request and you will see `Not found`. That is normal. Use Postman, Thunder Client, or the mobile app so you can send JSON in the request body.

Get all slots:

```http
GET http://localhost:5000/api/slots
```

Register user:

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

Login:

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json
```

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Create a slot manually:

```http
POST http://localhost:5000/api/slots
Content-Type: application/json
```

```json
{
  "slotNumber": "A10",
  "vehicleType": "Car"
}
```

## Part 5: Deploy Backend To Render From Scratch

This deploys only the backend API. The Expo mobile app stays separate and will call the Render backend URL.

### Step 1: Make Sure The Backend Works Locally

Before Render, confirm local backend + Atlas are working:

```bash
npm.cmd install
npm.cmd run seed:slots
npm.cmd run dev
```

Open:

```text
http://localhost:5000/health
```

If you see this, continue:

```json
{
  "status": "ok"
}
```

### Step 2: Push Code To GitHub

Render deploys from GitHub/GitLab/Bitbucket.

Make sure these files are committed:

```text
package.json
package-lock.json
src/
scripts/
.node-version
```

Do not commit `.env`.

If this is a fresh GitHub repo:

```bash
git add .
git commit -m "Prepare backend for Render deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

If the remote already exists:

```bash
git add .
git commit -m "Prepare backend for Render deploy"
git push
```

### Step 3: Create A Render Web Service

1. Go to https://render.com/
2. Sign in.
3. Click **New**.
4. Choose **Web Service**.
5. Connect your GitHub account.
6. Select this repository.

Use these settings:

```text
Name: park-pulse-backend
Language/Runtime: Node
Branch: main
Root Directory: leave empty
Build Command: npm install
Start Command: npm start
Instance Type: Free is fine for testing
```

Why root directory is empty: the backend `package.json` is already in the project root.

### Step 4: Add Environment Variables In Render

In the Render service setup, add these environment variables:

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@parking.fa0b5qn.mongodb.net/parkpulse?retryWrites=true&w=majority&appName=Parking
MONGO_DB=parkpulse
JWT_SECRET=make-a-long-random-secret
DNS_SERVERS=8.8.8.8,1.1.1.1
NODE_VERSION=20
```

Important:

- Do not add quotes around values.
- Do not use `<password>`.
- Do not commit these values into GitHub.
- Use the MongoDB Atlas **Database Access** username and password.
- `PORT` is not required on Render because Render provides it automatically.

### Step 5: Allow Render To Access MongoDB Atlas

Go to MongoDB Atlas:

1. Open your project.
2. Go to **Network Access**.
3. Click **Add IP Address**.
4. For a simple student/demo setup, add:

```text
0.0.0.0/0
```

This allows Render to connect to Atlas.

Note: this is easy for demos, but not ideal for production. For production, restrict database access more carefully.

### Step 6: Deploy

Click **Create Web Service**.

Render will:

1. Pull your GitHub repo.
2. Run `npm install`.
3. Run `npm start`.
4. Give you a public URL.

Your URL will look like:

```text
https://park-pulse-backend.onrender.com
```

### Step 7: Test The Render Backend

Open:

```text
https://YOUR_RENDER_SERVICE.onrender.com/health
```

Expected:

```json
{
  "status": "ok"
}
```

Then test slots:

```text
https://YOUR_RENDER_SERVICE.onrender.com/api/slots
```

Remember: login/register are `POST` endpoints. They will not work by simply opening them in a browser.

### Step 8: Point The Mobile App To Render

Open:

```text
park-pulse-frontend/.env
```

Set:

```env
EXPO_PUBLIC_API_URL=https://YOUR_RENDER_SERVICE.onrender.com/api
```

Then restart Expo:

```bash
cd park-pulse-frontend
npm.cmd start
```

### Render Troubleshooting

If Render deploy fails, check **Logs** inside your Render service.

Common problems:

- `Cannot find module`: Render did not install dependencies. Check Build Command is `npm install`.
- `MongoDB connection failed`: check `MONGO_URI`, Atlas Network Access, and Database Access.
- `bad auth`: MongoDB username/password is wrong or still has `<password>`.
- App starts locally but not on Render: make sure Start Command is `npm start`.
- First request is slow: free Render services can sleep when inactive.

Official Render docs:

- First deploy: https://render.com/docs/your-first-deploy
- Node Express deploy: https://render.com/docs/deploy-node-express-app
- Environment variables: https://render.com/docs/environment-variables
- Node version: https://render.com/docs/node-version

## Part 6: Setup Mobile App

Open a second terminal:

```bash
cd D:\Projects\parking-app-backend\park-pulse-frontend
```

Install frontend dependencies:

```bash
npm install
```

Create frontend `.env`:

```bash
copy .env.example .env
```

Now choose which backend the mobile app should use.

### Option A: Use Local Backend

If backend is running locally and you test Expo in a browser/emulator:

```env
EXPO_PUBLIC_API_URL=http://127.0.0.1:5000/api
```

If testing Expo Go on your phone, use your laptop's Wi-Fi IP address:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.25:5000/api
```

To find your IP on Windows:

```bash
ipconfig
```

Look for `IPv4 Address`.

Do not use `localhost` on a physical phone. On a phone, `localhost` means the phone itself.

### Option B: Use Render Backend

If you want the app to use your hosted backend:

```env
EXPO_PUBLIC_API_URL=https://your-service-name.onrender.com/api
```

Start the mobile app:

```bash
npm start
```

Then scan the QR code with Expo Go.

## Part 7: Normal Development Flow

Use two terminals.

Terminal 1: backend

```bash
cd D:\Projects\parking-app-backend
npm run dev
```

Terminal 2: mobile app

```bash
cd D:\Projects\parking-app-backend\park-pulse-frontend
npm start
```

If using Render backend, you only need Terminal 2 for the mobile app.

## Part 8: Important API Endpoints

Health:

```text
GET /health
```

Auth:

```text
POST /api/auth/register
POST /api/auth/login
```

Slots:

```text
GET   /api/slots
POST  /api/slots
PATCH /api/slots/:slotId/availability
```

Parking:

```text
GET  /api/parking
POST /api/parking
PUT  /api/parking/exit/:parkingId
```

Bookings:

```text
GET  /api/bookings
POST /api/bookings
```

## Part 9: ESP32 Integration Later

Do not start with hardware yet. First make sure:

1. MongoDB Atlas is connected.
2. Backend works locally or on Render.
3. Mobile app can fetch slots.
4. Mobile app can create parking records.

Later, ESP32 can update slot availability using:

```http
PATCH /api/slots/<slotId>/availability
Content-Type: application/json
```

Body when slot is occupied:

```json
{
  "isAvailable": false
}
```

Body when slot is empty:

```json
{
  "isAvailable": true
}
```

For the first hardware version, each ESP32 sensor can be mapped to a MongoDB slot `_id`.

## Common Problems

### Backend says MongoDB connection failed

Check:

- Is `MONGO_URI` correct?
- Did you replace `YOUR_PASSWORD`?
- Did you add your IP in MongoDB Atlas Network Access?
- If using Render, did you allow `0.0.0.0/0` or another valid network rule?

### Mobile app cannot reach backend

Check:

- Is backend running?
- Is `EXPO_PUBLIC_API_URL` correct?
- If using a phone, did you use laptop Wi-Fi IP instead of `localhost`?
- Are phone and laptop on the same Wi-Fi?

### Render works sometimes slowly

Free Render services can sleep when inactive. The first request after sleep can take time.

### PowerShell blocks npm

Use:

```bash
npm.cmd install
npm.cmd run dev
```

## Quick Fresh Setup Checklist

1. Create MongoDB Atlas cluster.
2. Create MongoDB user.
3. Allow network access.
4. Copy Atlas connection string.
5. Put connection string in backend `.env`.
6. Run `npm install`.
7. Run `npm run seed:slots`.
8. Run `npm run dev`.
9. Test `http://localhost:5000/health`.
10. Add same `MONGO_URI` to Render environment variables.
11. Redeploy Render.
12. Test `https://your-service-name.onrender.com/health`.
13. Setup frontend `.env`.
14. Run mobile app with `npm start`.
