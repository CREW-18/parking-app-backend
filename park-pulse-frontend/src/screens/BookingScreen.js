import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from './services/api';

const BookingScreen = ({ route }) => {
  const initialSlotId = route?.params?.slotId || '';

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [slotId, setSlotId] = useState(initialSlotId);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  const handleConfirmParking = async () => {
    if (!vehicleNumber || !slotId) {
      Alert.alert('Missing Data', 'Please enter both the vehicle number and slot ID.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/parking', {
        vehicleNumber,
        slotId,
      });

      setTicket(response.data.parking);
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert(
        'Parking Failed',
        error.response?.data?.message || 'Could not connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (ticket) {
    return (
      <View style={styles.container}>
        <Text style={styles.brandText}>PARK PULSE</Text>
        <View style={styles.ticketCard}>
          <Text style={styles.ticketTitle}>Parking ticket</Text>
          <Text style={styles.ticketText}>Ticket no.: {ticket._id?.substring(0, 8).toUpperCase()}</Text>
          <Text style={styles.ticketText}>Vehicle: {ticket.vehicleNumber}</Text>
          <Text style={styles.ticketText}>Slot: {ticket.slotId?.slotNumber || slotId}</Text>
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrText}>QR CODE PLACEHOLDER</Text>
          </View>
          <Text style={styles.feeText}>Total Amount: Rs 30.00</Text>
        </View>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            setTicket(null);
            setVehicleNumber('');
            setSlotId('');
          }}
        >
          <Text style={styles.doneButtonText}>DONE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>New Parking</Text>
      <Text style={styles.subtitle}>Enter details to assign a slot</Text>

      <Text style={styles.label}>VEHICLE PLATE NUMBER</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. MH 12 AB 1234"
        placeholderTextColor="#555"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>TARGET SLOT ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Paste slot _id from the slots list"
        placeholderTextColor="#555"
        value={slotId}
        onChangeText={setSlotId}
      />

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmParking}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.confirmButtonText}>CONFIRM PARKING</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', padding: 20, paddingTop: 60 },
  headerTitle: { color: '#00FF66', fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { color: '#888', fontSize: 16, marginBottom: 40 },
  label: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#1A1A1A', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 20 },
  confirmButton: { backgroundColor: '#00FF66', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  confirmButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  brandText: { color: '#00FF66', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  ticketCard: { backgroundColor: '#111', borderRadius: 20, padding: 25, borderWidth: 1, borderColor: '#333' },
  ticketTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  ticketText: { color: '#AAA', fontSize: 16, marginBottom: 10, width: '100%' },
  qrPlaceholder: { width: 200, height: 200, backgroundColor: '#E0FFEB', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginVertical: 20, borderRadius: 10 },
  qrText: { color: '#000', fontWeight: 'bold', textAlign: 'center' },
  feeText: { color: '#00FF66', fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  doneButton: { backgroundColor: '#333', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  doneButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});

export default BookingScreen;
