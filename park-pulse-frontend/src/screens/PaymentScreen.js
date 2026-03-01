import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen({ route, navigation }) {
  const { mall, slot, hours, totalPrice } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // UPDATED TO YOUR REAL IP
      const response = await fetch('http://10.22.9.136:5000/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mallName: mall.name, slot, hours, totalPrice })
      });
      setIsProcessing(false);
      navigation.navigate('Ticket', { mall, slot, hours, totalPrice });
    } catch (error) {
      console.error("Payment failed", error);
      setIsProcessing(false);
      alert("Database error! Please check your IP connection.");
    }
  };

  return (
    <LinearGradient colors={['#0F172A', '#020617', '#000000']} style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Ionicons name="shield-checkmark" size={80} color="#00E676" style={{ alignSelf: 'center' }} />
        <Text style={styles.title}>Secure Payment</Text>
        <View style={styles.receipt}>
          <Text style={styles.text}>Mall: {mall.name}</Text>
          <Text style={styles.text}>Slot: {slot}</Text>
          <Text style={styles.total}>Total: ₹{totalPrice}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={handlePayment} disabled={isProcessing}>
          {isProcessing ? <ActivityIndicator color="#121212" /> : <Text style={styles.btnText}>Pay Now</Text>}
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  receipt: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 20, marginBottom: 40 },
  text: { color: '#94A3B8', fontSize: 18, marginBottom: 10 },
  total: { color: '#00E676', fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  btn: { backgroundColor: '#00E676', padding: 20, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#121212', fontSize: 20, fontWeight: 'bold' }
});