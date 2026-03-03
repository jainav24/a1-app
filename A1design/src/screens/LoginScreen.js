import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Selection Error', 'Please fill all fields');
      return;
    }

    if (email === 'jainavtech24@gmail.com' && password === 'jainav2412') {
      navigation.replace('DashboardScreen');
    } else {
      Alert.alert('Login Failed', 'Invalid Email or Password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <View style={styles.brandContainer}>
          <Image
            source={require('../../assets/a1logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
            onError={() => console.log('Login logo error')}
          />
          <Text style={styles.brandText}>A1 Temple Design</Text>
          <View style={styles.brandUnderline} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Divine Login</Text>
          <Text style={styles.subtitle}>Sign in to your premium master account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate('SignupScreen')}
          >
            <Text style={styles.signupText}>
              New to A1 Temple? <Text style={styles.signupHighlight}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 35,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandLogo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  brandText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#C62828',
    letterSpacing: 1,
  },
  brandUnderline: {
    width: 40,
    height: 4,
    backgroundColor: '#C62828',
    marginTop: 5,
    borderRadius: 2,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  button: {
    height: 60,
    backgroundColor: '#C62828',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  signupLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 15,
    color: '#666',
  },
  signupHighlight: {
    color: '#C62828',
    fontWeight: '700',
  },
});

export default LoginScreen;
