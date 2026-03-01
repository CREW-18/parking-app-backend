import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ navigation }) {
  // The Hardware-Accelerated Fade Engine
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Fade the UI in smoothly over 1 second
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true, // Uses device hardware for 60FPS
    }).start();

    // 2. Hold the screen for 3 seconds, then move to Login
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    // Cleanup timer if the component unmounts
    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <LinearGradient colors={['#0F172A', '#020617', '#000000']} style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        
        {/* A sleek, CSS-only pulsing icon replacement */}
        <View style={styles.iconPlaceholder}>
          <Text style={styles.iconText}>🅿️</Text>
        </View>

        <Text style={styles.logoText}>PARK PULSE</Text>
        <Text style={styles.branding}>ENGINEERED BY JASHAN PRATUL</Text>
        
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconPlaceholder: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: 'rgba(0, 230, 118, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20, 
    borderWidth: 2, 
    borderColor: '#00E676' 
  },
  iconText: { fontSize: 40 },
  logoText: { color: '#00E676', fontSize: 36, fontWeight: '900', letterSpacing: 5 },
  branding: { color: '#64748B', fontSize: 10, letterSpacing: 2, textAlign: 'center', marginTop: 10 }
});