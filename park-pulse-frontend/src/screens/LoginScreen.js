import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Connect to the Global Brain (AuthContext)
  const authContext = useContext(AuthContext);
  const login = authContext ? authContext.login : null;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      // 2. Using your exact computer IP address to bridge the Wi-Fi gap
      const response = await fetch("http://10.78.169.136:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // 3. SUCCESS: Save the user profile to memory BEFORE navigating
        if (login) {
          login(data, data.token); 
        }
        
        // 4. Navigate safely to the City view!
        navigation.navigate("City");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Brand Header */}
      <Text style={styles.logoText}>P</Text>
      <Text style={styles.brandName}>PARK PULSE</Text>
      <Text style={styles.tagline}>PARK WITH PRECISION</Text>

      <Text style={styles.welcomeText}>Welcome Back</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      {/* Google Placeholder */}
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={() => Alert.alert("Coming Soon", "Google Login integration pending.")}
      >
        <Text style={styles.googleButtonText}>G Continue with Google</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      {/* Bottom Navigation Row */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate("City")}>
          <Text style={styles.skipButtonText}>Skip to App</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles to match your dark theme UI
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, justifyContent: 'center' },
  logoText: { color: '#00FF66', fontSize: 60, fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' },
  brandName: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 10, letterSpacing: 2 },
  tagline: { color: '#888', fontSize: 12, textAlign: 'center', marginBottom: 40, letterSpacing: 1 },
  welcomeText: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#1E1E1E', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  loginButton: { backgroundColor: '#00FF66', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  loginButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  googleButton: { backgroundColor: '#333', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  googleButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  orText: { color: '#888', textAlign: 'center', marginBottom: 20, fontSize: 14 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  skipButton: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10, flex: 0.48, alignItems: 'center' },
  skipButtonText: { color: '#888', fontSize: 16, fontWeight: 'bold' },
  signupButton: { backgroundColor: '#00FF66', padding: 15, borderRadius: 10, flex: 0.48, alignItems: 'center' },
  signupButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});

export default LoginScreen;