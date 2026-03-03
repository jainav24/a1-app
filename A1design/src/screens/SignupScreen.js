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
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Validation Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Validation Error', 'Passwords do not match');
            return;
        }

        Alert.alert('Success', 'Account created successfully!', [
            { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.innerContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.brandContainer}>
                        <Image
                            source={require('../../assets/a1logo.png')}
                            style={styles.brandLogo}
                            resizeMode="contain"
                            onError={() => console.log('Signup logo error')}
                        />
                        <Text style={styles.brandText}>A1 Temple Design</Text>
                        <View style={styles.brandUnderline} />
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.title}>Join the Divine Studio</Text>
                        <Text style={styles.subtitle}>Create your A1 Temple account today</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor="#999"
                            />
                        </View>

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
                                secureTextEntry
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                placeholderTextColor="#999"
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleSignup}>
                            <Text style={styles.buttonText}>SIGN UP</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={() => navigation.navigate('LoginScreen')}
                        >
                            <Text style={styles.loginText}>
                                Already have an account? <Text style={styles.loginHighlight}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 35,
        paddingVertical: 50,
    },
    brandContainer: {
        alignItems: 'center',
        marginBottom: 35,
    },
    brandLogo: {
        width: 70,
        height: 70,
        marginBottom: 10,
    },
    brandText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#C62828',
        letterSpacing: 1,
    },
    brandUnderline: {
        width: 30,
        height: 3,
        backgroundColor: '#C62828',
        marginTop: 4,
        borderRadius: 2,
    },
    header: {
        marginBottom: 35,
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
        marginBottom: 15,
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
    button: {
        height: 60,
        backgroundColor: '#C62828',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
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
    loginLink: {
        marginTop: 30,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 15,
        color: '#666',
    },
    loginHighlight: {
        color: '#C62828',
        fontWeight: '700',
    },
});

export default SignupScreen;
