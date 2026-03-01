import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  TextInput, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { loginUser } from './services/authService'; // Ensure this path matches your folder structure

const LoginScreen = ({ navigation }) => {
  // 1. Setup State to hold your email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. The function that talks to the Backend
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting to login with:", email);
      const response = await loginUser(email, password);
      
      console.log("Login Success!", response);
      // If success, navigate to the City selection screen
      navigation.navigate('City'); 
    } catch (error) {
      console.log("Login Failed:", error.message);
      Alert.alert("Login Failed", error.message || "Network Error: Check if Backend is running");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Brand Section */}
      <View style={styles.brandSection}>
        <Text style={styles.logoText}>P</Text>
        <Text style={styles.appName}>PARK PULSE</Text>
        <Text style={styles.tagline}>PARK WITH PRECISION</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.infoTitle}>Welcome Back</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail} // Updates the 'email' state
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword} // Updates the 'password' state
          secureTextEntry // Hides the characters
        />
      </View>

      {/* Buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.mainLoginButton} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.mainLoginButtonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleText}>G  Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>

        <View style={styles.row}>
           <TouchableOpacity 
             onPress={() => navigation.navigate('City')} 
             style={[styles.smallButton, {backgroundColor: '#222'}]}
           >
              <Text style={styles.btnText}>Skip to App</Text>
           </TouchableOpacity>
           <View style={{width: 20}}/>
           <TouchableOpacity 
             onPress={() => navigation.navigate('SignUp')} 
             style={styles.smallButton}
           >
              <Text style={styles.btnText}>Sign Up</Text>
           </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'space-between', paddingVertical: 40 },
  brandSection: { alignItems: 'center', marginTop: 30 },
  logoText: { color: '#00ff88', fontSize: 70, fontWeight: 'bold', fontStyle: 'italic' },
  appName: { color: '#fff', fontSize: 24, letterSpacing: 3, fontWeight: 'bold', marginTop: 10 },
  tagline: { color: '#888', fontSize: 12, letterSpacing: 2, marginTop: 5 },
  
  inputSection: { paddingHorizontal: 30, marginTop: 20 },
  infoTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333'
  },

  bottomSection: { paddingHorizontal: 20 },
  mainLoginButton: { backgroundColor: '#00ff88', padding: 18, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
  mainLoginButtonText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  googleButton: { backgroundColor: '#fff', padding: 15, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
  googleText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  orText: { color: '#666', textAlign: 'center', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'center' },
  smallButton: { flex: 1, backgroundColor: '#00ff88', padding: 15, borderRadius: 30, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

export default LoginScreen;