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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authContext';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function CosmicSignin() {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
      return;
    }
    
    setLoading(true);
    try {
      let response = await login(emailRef.current, passwordRef.current);
      
      if (!response.success) {
        ToastAndroid.show("Mission Aborted: Login Failed", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Navigating to Mission Control", ToastAndroid.SHORT);
        router.push('/Home');
      }
    } catch (error) {
      console.error('Login Error: ', error);
      ToastAndroid.show("Cosmic Interference Detected", ToastAndroid.SHORT);
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
      source={require('../assets/images/space-bg.jpg')}
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
            <Text style={styles.title}>Welcome Back,Explorer</Text>
            
            <InputWithIcon 
              icon="mail-outline" 
              placeholder="Email" 
              onChangeText={(text) => emailRef.current = text}
              keyboardType="email-address"
            />
            
            <InputWithIcon 
              icon="lock-closed-outline" 
              placeholder="Password" 
              onChangeText={(text) => passwordRef.current = text}
              secureTextEntry={!showPassword}
              showPasswordToggle={true}
            />
            
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={() => router.push('/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Authenticating..." : "Start Mission"}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>New to the Mission? </Text>
              <TouchableOpacity onPress={() => router.push('/Signup')}>
                <Text style={styles.signupLink}>Recruit Here</Text>
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
    backgroundColor: 'rgba(12, 12, 44, 0.8)', 
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
    fontSize: 28,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#8b49f5',
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#6A046F',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: 'rgba(255,255,255,0.7)',
  },
  signupLink: {
    color: '#8b49f5',
    fontWeight: 'bold',
  },
});