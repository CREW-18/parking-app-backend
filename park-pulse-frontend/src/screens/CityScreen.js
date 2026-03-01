import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';

// Our list of cities
const CITIES = [
  { id: '1', name: 'Bengaluru', state: 'India' },
  { id: '2', name: 'Mumbai', state: 'India' },
  { id: '3', name: 'Chennai', state: 'India' },
  { id: '4', name: 'Hyderabad', state: 'India' },
  { id: '5', name: 'Bhopal', state: 'India' },
];

export default function CityScreen({ navigation }) {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleSelectCity = (city) => {
    setSelectedCity(city.name);
    
    // As soon as a city is clicked, navigate to the Home screen 
    // and pass the chosen city name along with it!
    setTimeout(() => {
      navigation.navigate('Home', { cityName: city.name });
    }, 300); // 300ms delay just so the user can see the green highlight click
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.cityItem,
        selectedCity === item.name && styles.selectedCityItem
      ]}
      onPress={() => handleSelectCity(item)}
    >
      <View style={[styles.checkbox, selectedCity === item.name && styles.checkboxSelected]}>
        {selectedCity === item.name && <View style={styles.checkboxInner} />}
      </View>
      <View>
        <Text style={styles.cityName}>{item.name}</Text>
        <Text style={styles.cityState}>{item.state}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Select Manually</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search your city..."
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.locateButton}>
        <Text style={styles.locateText}>➤ Locate Me</Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Recommended Popular Locations</Text>

      <FlatList
        data={CITIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 60 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  searchInput: { backgroundColor: '#1E1E1E', color: 'white', padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 20 },
  locateButton: { marginBottom: 30 },
  locateText: { color: '#00E676', fontSize: 16, fontWeight: 'bold' },
  subHeader: { color: '#888', fontSize: 14, marginBottom: 15 },
  cityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1E1E1E' },
  selectedCityItem: { backgroundColor: 'rgba(0, 230, 118, 0.1)' },
  checkbox: { height: 20, width: 20, borderRadius: 4, borderWidth: 2, borderColor: '#888', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  checkboxSelected: { borderColor: '#00E676' },
  checkboxInner: { width: 10, height: 10, borderRadius: 2, backgroundColor: '#00E676' },
  cityName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cityState: { color: '#888', fontSize: 12 },
});