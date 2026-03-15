import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Dimensions,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SubscriptionScreen = ({ navigation }) => {
    const plans = [
        { id: '1', name: 'Free', price: '₹0', period: '/month', features: ['Core Drawing Tools', '3 Projects', 'Standard Library'], color: '#999' },
        { id: '2', name: 'Silver', price: '₹499', period: '/month', features: ['AI Suggestions', '10 Projects', 'Full Pillar Library'], color: '#757575', popular: false },
        { id: '3', name: 'Golden', price: '₹999', period: '/month', features: ['AI Floor Plans', 'Unlimited Projects', '3D Preview Mode', 'Pro Support'], color: '#D4AF37', popular: true },
        { id: '4', name: 'Platinum', price: '₹1999', period: '/month', features: ['Full AI Automation', 'Team Collaboration', 'VR Architecture Tour', 'VIP Concierge'], color: '#1a1a1a', popular: false },
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
                    colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.95)']}
                    style={StyleSheet.absoluteFill}
                />

                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={28} color="#1a1a1a" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Premium Plans</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.subtitle}>Unlock the full potential of sacred architecture with our premium design suites.</Text>

                        {plans.map((plan) => (
                            <View key={plan.id} style={[styles.planCard, plan.popular && styles.popularCard]}>
                                {plan.popular && (
                                    <View style={styles.popularBadge}>
                                        <Text style={styles.popularText}>MOST POPULAR</Text>
                                    </View>
                                )}
                                <View style={styles.planHeader}>
                                    <View>
                                        <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                                        <View style={styles.priceRow}>
                                            <Text style={styles.priceText}>{plan.price}</Text>
                                            <Text style={styles.periodText}>{plan.period}</Text>
                                        </View>
                                    </View>
                                    <Ionicons name="ribbon-outline" size={32} color={plan.color} />
                                </View>

                                <View style={styles.featuresList}>
                                    {plan.features.map((feature, idx) => (
                                        <View key={idx} style={styles.featureItem}>
                                            <Ionicons name="checkmark-circle" size={18} color={plan.color} />
                                            <Text style={styles.featureText}>{feature}</Text>
                                        </View>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={[styles.selectBtn, { backgroundColor: plan.color }]}
                                    onPress={() => navigation.navigate('CheckoutScreen', { plan })}
                                >
                                    <Text style={styles.selectBtnText}>Upgrade to {plan.name}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
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
    scrollContent: { paddingHorizontal: 20, paddingBottom: 50, paddingTop: 8 },
    subtitle: { fontSize: 15, color: '#777', textAlign: 'center', marginBottom: 30, lineHeight: 22, paddingHorizontal: 10, fontWeight: '500' },
    planCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    popularCard: {
        borderColor: '#D4AF37',
        borderWidth: 2,
        backgroundColor: '#FFF',
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        alignSelf: 'center',
        backgroundColor: '#D4AF37',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 12,
    },
    popularText: { fontSize: 10, fontWeight: '900', color: '#FFF' },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    planName: { fontSize: 18, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline' },
    priceText: { fontSize: 32, fontWeight: '900', color: '#1a1a1a' },
    periodText: { fontSize: 14, color: '#999', fontWeight: '600', marginLeft: 4 },
    featuresList: { marginBottom: 24 },
    featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    featureText: { fontSize: 14, color: '#444', marginLeft: 10, fontWeight: '600' },
    selectBtn: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    selectBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

export default SubscriptionScreen;
