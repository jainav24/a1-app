import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (email === 'jainavtech24@gmail.com' && password === 'jainav2412') {
        navigation.replace('DashboardScreen');
      } else {
        Alert.alert('Login Failed', 'Invalid Email or Password');
      }
    }, 1500);
  };

  const getInputStyle = (fieldName) => {
    if (errors[fieldName]) return styles.inputWrapperError;
    if (focusedField === fieldName) return styles.inputWrapperFocused;
    return styles.inputWrapper;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={require('../../assets/marble_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(250, 248, 243, 0.85)', 'rgba(250, 248, 243, 0.6)']}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* TOP BRAND SECTION */}
              <Animated.View style={[styles.brandSection, { opacity: fadeAnim }]}>
                <View style={styles.logoWrapper}>
                  <View style={styles.logoContainer}>
                    <Ionicons name="business-outline" size={44} color="#D4AF37" />
                  </View>
                </View>
                <Text style={styles.appName}>A1 Temple Studio</Text>
                <Text style={styles.tagline}>Design sacred spaces with precision</Text>
                <View style={styles.goldDivider} />
              </Animated.View>

              {/* LOGIN CARD */}
              <Animated.View
                style={[
                  styles.glassCard,
                  { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Welcome Back</Text>
                  <Text style={styles.cardSubtitle}>Continue your temple design journey</Text>
                </View>

                <View style={styles.form}>
                  {/* Email Field */}
                  <View style={getInputStyle('email')}>
                    <Ionicons name="mail-outline" size={18} color={errors.email ? '#C42D2D' : (focusedField === 'email' ? '#D4AF37' : '#666')} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      value={email}
                      onChangeText={(val) => { setEmail(val); setErrors({ ...errors, email: null }); }}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#999"
                    />
                  </View>
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                  {/* Password Field */}
                  <View style={getInputStyle('password')}>
                    <Ionicons name="lock-closed-outline" size={18} color={errors.password ? '#C42D2D' : (focusedField === 'password' ? '#D4AF37' : '#666')} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      value={password}
                      onChangeText={(val) => { setPassword(val); setErrors({ ...errors, password: null }); }}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                  <TouchableOpacity style={styles.forgotBtn}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>

                  {/* Primary Button */}
                  <TouchableOpacity
                    style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={isLoading ? ['#999', '#777'] : ['#C42D2D', '#8B1E1E']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientButton}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Text style={styles.buttonText}>Login</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryAction}
                    onPress={() => navigation.navigate('SignupScreen')}
                  >
                    <Text style={styles.secondaryText}>
                      New to A1? <Text style={styles.goldLink}>Create Account</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 10,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 35,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
    marginTop: 4,
  },
  goldDivider: {
    width: 40,
    height: 2,
    backgroundColor: '#D4AF37',
    marginTop: 15,
    borderRadius: 1,
  },
  glassCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 14,
  },
  inputWrapperFocused: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  inputWrapperError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#C62828',
  },
  errorText: {
    color: '#C42D2D',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 54,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
    textAlignVertical: 'center',
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 15,
    paddingVertical: 4,
  },
  forgotText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    marginTop: 18,
    backgroundColor: '#C62828',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryButtonDisabled: {
    shadowOpacity: 0.1,
  },
  gradientButton: {
    flex: 1,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1,
  },
  secondaryAction: {
    marginTop: 16,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },
  goldLink: {
    color: '#D4AF37',
    fontWeight: '800',
  },
});

export default LoginScreen;
