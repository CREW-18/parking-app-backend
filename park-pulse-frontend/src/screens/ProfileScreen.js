import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // UPDATED TO YOUR REAL IP
    fetch('http://10.78.169.136:5000/api/bookings/my-bookings')
      .then((res) => res.json())
      .then((data) => { setBookings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.mall}>{item.mallName}</Text>
      <Text style={styles.sub}>Slot: {item.slot} • {item.hours} hours</Text>
      <Text style={styles.price}>₹{item.totalPrice}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#0F172A', '#020617', '#000000']} style={styles.container}>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <Text style={styles.header}>My Bookings</Text>
        {loading ? <ActivityIndicator color="#00E676" /> : (
          <FlatList data={bookings} renderItem={renderItem} keyExtractor={(item) => item._id} />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 15, marginBottom: 15 },
  mall: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  sub: { color: '#94A3B8', marginTop: 5 },
  price: { color: '#00E676', fontSize: 18, fontWeight: 'bold', marginTop: 10 }
});