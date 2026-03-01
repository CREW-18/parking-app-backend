import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function TicketScreen({ route, navigation }) {
  const { mall, slot, hours, totalPrice } = route.params;
  const bookingId = Math.floor(100000 + Math.random() * 900000);

  // --- THE PRO ANIMATION ENGINE (Built-In & Web Safe!) ---
  const scaleAnim = useRef(new Animated.Value(0)).current; // For the checkmark popping in
  const slideAnim = useRef(new Animated.Value(50)).current; // For the ticket sliding up
  const fadeAnim = useRef(new Animated.Value(0)).current; // For the ticket fading in

  useEffect(() => {
    // We run a cinematic sequence the moment the screen loads
    Animated.sequence([
      // 1. Pop the green checkmark in like a bubble
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      // 2. Then, slide and fade the ticket in together smoothly
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0F172A', '#020617', '#000000']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Animated Success Header */}
          <View style={styles.successHeader}>
            <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
              <Ionicons name="checkmark" size={40} color="#121212" />
            </Animated.View>
            <Text style={styles.successText}>Payment Successful!</Text>
            <Text style={styles.subText}>Your spot is secured.</Text>
          </View>

          {/* Animated Digital Boarding Pass */}
          <Animated.View style={[styles.ticketContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Top Cutouts for realism */}
            <View style={[styles.cutout, styles.cutoutLeft]} />
            <View style={[styles.cutout, styles.cutoutRight]} />

            <View style={styles.qrSection}>
              <Ionicons name="qr-code" size={150} color="white" />
              <Text style={styles.scanText}>Scan at Entry Gate</Text>
              <Text style={styles.bookingId}>ID: #{bookingId}</Text>
            </View>

            <View style={styles.dashedLine} />

            <View style={styles.ticketDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{mall.name}</Text>
              </View>

              <View style={styles.detailRow}>
                <View>
                  <Text style={styles.detailLabel}>Slot</Text>
                  <Text style={styles.highlightValue}>{slot}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{hours} Hour(s)</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount Paid</Text>
                <Text style={styles.priceValue}>₹{totalPrice}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Return Home Button */}
          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>Back to Map</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  
  successHeader: { alignItems: 'center', marginBottom: 30 },
  checkCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00E676', justifyContent: 'center', alignItems: 'center', marginBottom: 15, shadowColor: '#00E676', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 15, elevation: 8 },
  successText: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subText: { color: '#94A3B8', fontSize: 16 },

  ticketContainer: { width: '100%', backgroundColor: '#1E293B', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  
  cutout: { position: 'absolute', top: 220, width: 40, height: 40, borderRadius: 20, backgroundColor: '#020617', zIndex: 10 },
  cutoutLeft: { left: -20 },
  cutoutRight: { right: -20 },

  qrSection: { alignItems: 'center', padding: 30, backgroundColor: 'rgba(255,255,255,0.03)' },
  scanText: { color: '#00E676', fontSize: 16, fontWeight: 'bold', marginTop: 15, textTransform: 'uppercase', letterSpacing: 1 },
  bookingId: { color: '#94A3B8', fontSize: 14, marginTop: 5 },

  dashedLine: { height: 1, width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed' },

  ticketDetails: { padding: 30 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  detailLabel: { color: '#94A3B8', fontSize: 14, marginBottom: 5 },
  detailValue: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  highlightValue: { color: '#121212', backgroundColor: '#00E676', paddingHorizontal: 15, paddingVertical: 4, borderRadius: 8, fontSize: 18, fontWeight: '900', overflow: 'hidden' },
  priceValue: { color: '#00E676', fontSize: 22, fontWeight: '900' },

  homeButton: { width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  homeButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});