# Mobile Application Documentation (Legacy)

The `park-pulse-frontend` directory houses the legacy mobile application for Park Pulse. While the web frontend (`/frontend`) is the current primary interface, this mobile app is preserved for reference, native mobile support, and backward compatibility.

## Core Technologies

- **Framework**: React Native
- **Toolkit**: Expo (v54+)
- **Navigation**: React Navigation (Bottom Tabs, Native Stack)
- **HTTP Client**: Axios
- **Maps**: `react-native-maps`
- **Animations**: Reanimated & Lottie

## Directory Structure

```text
park-pulse-frontend/
 ├── App.js                 # App entry point (Expo root)
 ├── app.json               # Expo configuration (icons, splash, permissions)
 ├── assets/                # Images, fonts, and local assets
 ├── components/            # Reusable React Native components (Themed UI)
 ├── constants/             # Styling constants and themes
 ├── hooks/                 # Custom React hooks (Theme/Color Scheme logic)
 ├── src/
 │    ├── context/          # AuthContext for state management
 │    ├── navigation/       # React Navigation setup (TabNavigator)
 │    ├── screens/          # Individual app screens (Home, Login, Booking, etc.)
 │    └── services/         # API wrappers using Axios
```

## Key Architectural Concepts

### 1. Expo Ecosystem
The app leverages the Expo framework, which drastically simplifies React Native development by providing pre-configured modules for routing (Expo Router), Splash screens, Haptics, and system UI components without requiring manual native (iOS/Android) configuration.

### 2. Navigation
Routing is handled by `@react-navigation/native-stack` for standard screen transitions and `@react-navigation/bottom-tabs` for the primary dashboard navigation. The `TabNavigator.js` wires together the main user flows.

### 3. State and Authentication
Similar to the web app, `AuthContext.js` provides a global state wrapper that manages JWT tokens (likely persisted via SecureStore or AsyncStorage) and user profile data, feeding it to the UI components.

### Main Screens
- **SplashScreen / LoginScreen / SignUpScreen**: Onboarding flow.
- **HomeScreen**: Dashboard showing available parking malls.
- **CityScreen / MallsScreen**: Browsing locations.
- **SlotScreen / BookingScreen**: Interactive slot selection and reservation time management.
- **PaymentScreen**: Mock payment gateway.
- **TicketScreen**: Displays a generated QR Code (via `react-native-qrcode-svg`) for physical entry.

## Running the App

The app can be run locally using the Expo CLI:
```bash
# Install dependencies
npm install

# Start the Expo Metro Bundler
npm start
```
From the terminal, you can press `a` to open in an Android Emulator, `i` for an iOS Simulator, or scan the QR code with the Expo Go app on a physical device.