import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';

const HomeScreen = () => {
  const [parkingRecords, setParkingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // REPLACE THIS WITH YOUR ACTUAL IP ADDRESS
  const API_BASE_URL = 'http://10.78.169.136:5000/api/parking';

  const fetchParkingData = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setParkingRecords(data);
      setLoading(false);
    } catch (error) {
      console.error("AI Fetch Error:", error);
      setLoading(false);
    }
  };

  const handleExit = async (parkingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/exit/${parkingId}`, {
        method: 'PUT',
      });
      
      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success 🏁", "Vehicle has exited. Slot is now available.");
        fetchParkingData(); // Refresh the list automatically
      } else {
        Alert.alert("Error", result.message || "Failed to process exit.");
      }
    } catch (error) {
      console.error("Exit Error:", error);
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  useEffect(() => {
    fetchParkingData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00FF66" />
        <Text style={styles.loadingText}>Fetching Matrix Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome, Driver!</Text>
      
      <View style={styles.radarCard}>
        <Text style={styles.radarTitle}>📍 Live Parking Radar Active</Text>
        
        <View style={styles.analysisBox}>
          <Text style={styles.analysisTitle}>⚡ Active Parkings</Text>
          
          {parkingRecords.length > 0 ? (
            parkingRecords.map((record) => (
              <View key={record._id} style={styles.statusCard}>
                <View style={styles.infoColumn}>
                  <Text style={styles.labelText}>VEHICLE NUMBER</Text>
                  <Text style={styles.vehicleText}>{record.vehicleNumber}</Text>
                </View>

                <View style={styles.slotBadge}>
                  <Text style={styles.slotLabel}>SLOT</Text>
                  <Text style={styles.slotNumber}>{record.slotId?.slotNumber || '??'}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.exitButton} 
                  onPress={() => handleExit(record._id)}
                >
                  <Text style={styles.exitButtonText}>EXIT</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No active vehicles detected in range.</Text>
          )}
        </View>

        <TouchableOpacity style={styles.rescanButton} onPress={fetchParkingData}>
          <Text style={styles.rescanText}>RESCAN AREA</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  header: { color: '#00FF66', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginTop: 40, marginBottom: 20 },
  radarCard: { borderWidth: 1, borderColor: '#00FF66', borderRadius: 20, padding: 20, backgroundColor: '#111' },
  radarTitle: { color: '#888', textAlign: 'center', marginBottom: 20, fontSize: 12, letterSpacing: 1 },
  analysisBox: { backgroundColor: '#1A1A1A', borderRadius: 15, padding: 15 },
  analysisTitle: { color: '#FFF', fontWeight: 'bold', marginBottom: 15, fontSize: 18 },
  statusCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#222', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00FF66'
  },
  infoColumn: { flex: 1 },
  labelText: { color: '#555', fontSize: 10, fontWeight: 'bold' },
  vehicleText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  slotBadge: { backgroundColor: '#00FF66', padding: 8, borderRadius: 10, alignItems: 'center', minWidth: 50, marginRight: 10 },
  slotLabel: { color: '#000', fontSize: 8, fontWeight: 'bold' },
  slotNumber: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  exitButton: { backgroundColor: '#FF3B30', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  exitButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  rescanButton: { marginTop: 20, backgroundColor: '#00FF66', padding: 15, borderRadius: 12, alignItems: 'center' },
  rescanText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  loadingText: { color: '#00FF66', marginTop: 10 },
  noDataText: { color: '#555', textAlign: 'center', marginTop: 10, fontStyle: 'italic' }
});

export default HomeScreen;