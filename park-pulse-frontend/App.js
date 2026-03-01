import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
<<<<<<< HEAD
import TabNavigator from './src/navigation/TabNavigator'; // Points to the file you already have!

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
=======
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- THE GLOBAL BRAIN ---
import { AuthProvider } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import CityScreen from './src/screens/CityScreen';
import BookingScreen from './src/screens/BookingScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import TicketScreen from './src/screens/TicketScreen';
import TabNavigator from './src/navigation/TabNavigator'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login" 
          screenOptions={{ 
            headerShown: false,
            // --- GLOBAL ANIMATION RULES ---
            animation: 'slide_from_right', // Default: Smooth horizontal slide like iOS
            gestureEnabled: true,          // Allows users to swipe from the left edge to go back!
            gestureDirection: 'horizontal'
          }}
        >
          
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          
          {/* Fades in gently after a successful login */}
          <Stack.Screen 
            name="City" 
            component={CityScreen} 
            options={{ animation: 'fade' }} 
          />
          
          {/* Fades into the main dashboard */}
          <Stack.Screen 
            name="Home" 
            component={TabNavigator} 
            options={{ animation: 'fade' }} 
          />
          
          {/* Booking inherits the global 'slide_from_right' automatically */}
          <Stack.Screen name="Booking" component={BookingScreen} />
          
          {/* Payment slides up from the bottom like a premium native modal */}
          <Stack.Screen 
            name="Payment" 
            component={PaymentScreen} 
            options={{ animation: 'slide_from_bottom' }} 
          />
          
          {/* The final ticket elegantly materializes from the bottom */}
          <Stack.Screen 
            name="Ticket" 
            component={TicketScreen} 
            options={{ animation: 'fade_from_bottom' }} 
          />

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
>>>>>>> 43cc5d9eac87366a63fd3723e8af0f50fe2169fd
  );
}