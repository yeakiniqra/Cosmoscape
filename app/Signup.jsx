import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform,
  ToastAndroid,
  ImageBackground
} from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authContext';

const { width, height } = Dimensions.get('window');

export default function CosmicSignup() {
  const usernameRef = useRef("");
  const emailRef = useRef("");
  const phoneRef = useRef("");
  const passwordRef = useRef("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!usernameRef.current || !emailRef.current || !phoneRef.current || !passwordRef.current) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);

    try {
      let response = await register(
        emailRef.current, 
        passwordRef.current, 
        usernameRef.current, 
        phoneRef.current
      );
      
      if (!response.success) {
        ToastAndroid.show("Registration failed", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Welcome aboard!", ToastAndroid.SHORT);
        // Navigate to next screen
      }
    } catch (error) {
      console.error('Registration Error: ', error);
      ToastAndroid.show("Cosmic connection error", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const InputWithIcon = ({ 
    icon, 
    placeholder, 
    onChangeText, 
    secureTextEntry = false,
    keyboardType = 'default',
    showPasswordToggle = false
  }) => (
    <View style={styles.inputContainer}>
      <Ionicons 
        name={icon} 
        size={20} 
        color="rgba(255,255,255,0.7)" 
        style={styles.inputIcon} 
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.5)"
        style={styles.input}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      {showPasswordToggle && (
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.passwordToggle}
        >
          <Ionicons 
            name={showPassword ? "eye-off" : "eye"} 
            size={20} 
            color="rgba(255,255,255,0.7)" 
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/images/cosmic-background.jpg')} // Ensure you have a cosmic background image
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <BlurView intensity={40} style={styles.blurContainer}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>
                Sign up for a Cosmic Journey
            </Text>
            
            <InputWithIcon 
              icon="person-outline" 
              placeholder="Username" 
              onChangeText={(text) => usernameRef.current = text}
            />
            
            <InputWithIcon 
              icon="mail-outline" 
              placeholder="Email" 
              onChangeText={(text) => emailRef.current = text}
              keyboardType="email-address"
            />
            
            <InputWithIcon 
              icon="phone-portrait-outline" 
              placeholder="Phone Number" 
              onChangeText={(text) => phoneRef.current = text}
              keyboardType="phone-pad"
            />
            
            <InputWithIcon 
              icon="lock-closed-outline" 
              placeholder="Password" 
              onChangeText={(text) => passwordRef.current = text}
              secureTextEntry={!showPassword}
              showPasswordToggle={true}
            />
            
            <TouchableOpacity 
              style={styles.signupButton}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.buttonText}>Launching...</Text>
              ) : (
                <Text style={styles.buttonText}>Launch Mission</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>Already have a spacecraft? </Text>
              <TouchableOpacity onPress={() => router.push('/Signin')}>
                <Text style={styles.signinLink}>Dock In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
      <StatusBar style="dark" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    opacity: 0.7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 12, 44, 0.8)', // Deep space-like overlay
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    width: width * 0.9,
    borderRadius: 20,
    overflow: 'hidden',
  },
  innerContainer: {
    padding: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 30,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: 'white',
  },
  passwordToggle: {
    padding: 10,
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#6A046F',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signinContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signinText: {
    color: 'rgba(255,255,255,0.7)',
  },
  signinLink: {
    color: '#8b49f5',
    fontWeight: 'bold',
  },
});