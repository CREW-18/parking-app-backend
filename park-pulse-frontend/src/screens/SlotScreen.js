import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import api from './services/api';

const SlotScreen = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSlots = async () => {
    try {
      const response = await api.get('/slots');
      setSlots(response.data);
    } catch (error) {
      console.error('Slot fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSlots();
  };

  const renderSlot = ({ item }) => (
    <View style={[
      styles.slotCard,
      item.isAvailable ? styles.availableBorder : styles.occupiedBorder,
    ]}>
      <Text style={styles.slotNumber}>{item.slotNumber}</Text>
      <View style={[styles.indicator, item.isAvailable ? styles.bgGreen : styles.bgRed]} />
      <Text style={styles.statusText}>
        {item.isAvailable ? 'AVAILABLE' : 'OCCUPIED'}
      </Text>
      <Text style={styles.vehicleType}>{item.vehicleType}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00FF66" />
        <Text style={styles.loadingText}>Syncing slots...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Parking Matrix</Text>

      <FlatList
        data={slots}
        keyExtractor={(item) => item._id}
        renderItem={renderSlot}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF66" />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  header: {
    color: '#00FF66',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  listContainer: { paddingBottom: 20 },
  slotCard: {
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#111',
    alignItems: 'center',
    borderWidth: 2,
  },
  availableBorder: { borderColor: '#00FF66' },
  occupiedBorder: { borderColor: '#FF3B30' },
  slotNumber: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  indicator: { width: 10, height: 10, borderRadius: 5, marginVertical: 8 },
  bgGreen: { backgroundColor: '#00FF66' },
  bgRed: { backgroundColor: '#FF3B30' },
  statusText: { color: '#AAA', fontSize: 10, fontWeight: 'bold' },
  vehicleType: { color: '#555', fontSize: 10, marginTop: 2 },
  loadingText: { color: '#00FF66', marginTop: 10 },
});

export default SlotScreen;
