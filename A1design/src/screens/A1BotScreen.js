import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ImageBackground,
    Dimensions,
    StatusBar,
    Animated,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const A1BotScreen = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const suggestions = [
        "Generate a Shiva temple layout in Nagara style",
        "Modern Vedantic meditation hall design",
        "Temple entrance with carved gold pillars",
        "12th century Chola architecture floor plan"
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ImageBackground
                source={require('../../assets/marble_bg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.95)']}
                    style={StyleSheet.absoluteFill}
                />

                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={28} color="#1a1a1a" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>AI Temple Generator</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <View style={styles.chatContainer}>
                            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                                <Animated.View style={[styles.welcomeSection, { opacity: fadeAnim }]}>
                                    <View style={styles.aiIconWrapper}>
                                        <LinearGradient colors={['#D4AF37', '#F3E5AB']} style={styles.aiIconGradient}>
                                            <Ionicons name="sparkles" size={40} color="#FFF" />
                                        </LinearGradient>
                                    </View>
                                    <Text style={styles.welcomeTitle}>I am your AI Architect</Text>
                                    <Text style={styles.welcomeSubtitle}>Describe your vision, and I will generate a sacred layout for you.</Text>
                                </Animated.View>

                                <View style={styles.suggestionsSection}>
                                    <Text style={styles.sectionHeading}>Recent Suggestions</Text>
                                    {suggestions.map((item, index) => (
                                        <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => setQuery(item)}>
                                            <Ionicons name="chatbox-ellipses-outline" size={18} color="#D4AF37" />
                                            <Text style={styles.suggestionText} numberOfLines={1}>{item}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            <View style={styles.inputArea}>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Describe your temple layout..."
                                        placeholderTextColor="#999"
                                        value={query}
                                        onChangeText={setQuery}
                                        multiline
                                    />
                                    <TouchableOpacity style={styles.sendBtn}>
                                        <LinearGradient colors={['#C42D2D', '#8B1E1E']} style={styles.sendGradient}>
                                            <Ionicons name="arrow-up" size={24} color="#FFF" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F5F0' },
    backgroundImage: { flex: 1 },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '600', color: '#1a1a1a' },
    chatContainer: { flex: 1 },
    scrollContent: { padding: 24, paddingBottom: 100 },
    welcomeSection: { alignItems: 'center', marginTop: 40, marginBottom: 50 },
    aiIconWrapper: { width: 100, height: 100, borderRadius: 35, overflow: 'hidden', marginBottom: 24, elevation: 10, shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
    aiIconGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    welcomeTitle: { fontSize: 24, fontWeight: '900', color: '#1a1a1a', marginBottom: 12 },
    welcomeSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
    suggestionsSection: { marginTop: 20 },
    sectionHeading: { fontSize: 14, fontWeight: '800', color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    suggestionText: { flex: 1, marginLeft: 12, fontSize: 14, color: '#333', fontWeight: '600' },
    inputArea: { padding: 20, position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'transparent' },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#F1F1F1',
        borderRadius: 27,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 10,
    },
    input: { flex: 1, minHeight: 40, maxHeight: 120, fontSize: 16, color: '#1a1a1a', paddingTop: 10 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', marginLeft: 10, marginBottom: 2 },
    sendGradient: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C62828' },
});

export default A1BotScreen;
