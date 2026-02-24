import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://10.78.169.136:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        Alert.alert("Success", "Account created! Now Log In.");
        navigation.navigate("Login");
      } else {
        const errorData = await response.json();
        Alert.alert("Registration Failed", errorData.message || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Network Error", "Check your Wi-Fi and Backend at 10.78.169.136");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JOIN PARK PULSE</Text>
      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#666" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#666" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#666" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{color: '#00FF7F', textAlign: 'center', marginTop: 15}}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center' },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#111', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#00FF7F', padding: 15, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: 'bold' }
});

export default SignUpScreen;