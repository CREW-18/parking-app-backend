import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SlotScreen from '../screens/SlotScreen';
import BookingScreen from '../screens/BookingScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#1A1A1A', 
          borderTopWidth: 0, 
          height: 70,
          paddingBottom: 10
        },
        tabBarActiveTintColor: '#00FF66',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Map" component={SlotScreen} />
      <Tab.Screen name="Book" component={BookingScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
