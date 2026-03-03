import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StatusBar,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CheckoutScreen = ({ navigation, route }) => {
    const { plan } = route?.params || {};

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isApplied, setIsApplied] = useState(false);

    const basePrice = parseInt(plan?.price?.replace('₹', '') || '0');
    const finalPrice = basePrice - (basePrice * discount);

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === 'A1TEMPLE50') {
            setDiscount(0.5);
            setIsApplied(true);
            Alert.alert("Discount Applied", "50% off applied successfully!");
        } else {
            Alert.alert("Invalid Code", "Please enter a valid promo code.");
        }
    };

    const handlePayment = () => {
        if (!name || !email) {
            Alert.alert("Incomplete", "Please fill in all details.");
            return;
        }
        console.log(`Payment processed for ${plan?.name} plan at ₹${finalPrice}`);
        Alert.alert(
            "Payment Successful",
            `Thank you for subscribing to the ${plan?.name} plan!`,
            [{ text: "OK", onPress: () => navigation.navigate('DashboardScreen') }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.planSummary}>
                    <Text style={styles.summaryTitle}>Plan Summary</Text>
                    <View style={styles.planRow}>
                        <Text style={[styles.planName, { color: plan?.color || '#D4AF37' }]}>{plan?.name} Tier</Text>
                        <Text style={styles.planPrice}>{plan?.price}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.promoRow}>
                        <TextInput
                            style={[styles.promoInput, isApplied && { borderColor: '#4CAF50', backgroundColor: '#F1F8E9' }]}
                            placeholder="Promo Code"
                            placeholderTextColor="#999"
                            value={promoCode}
                            onChangeText={setPromoCode}
                            autoCapitalize="characters"
                            editable={!isApplied}
                        />
                        <TouchableOpacity
                            style={[styles.promoBtn, { backgroundColor: isApplied ? '#4CAF50' : '#D4AF37' }]}
                            onPress={handleApplyPromo}
                            disabled={isApplied}
                        >
                            <Text style={styles.promoBtnText}>{isApplied ? 'OK' : 'APPLY'}</Text>
                        </TouchableOpacity>
                    </View>

                    {isApplied && (
                        <View style={styles.discountRow}>
                            <Text style={styles.discountLabel}>Promo Discount (50%)</Text>
                            <Text style={styles.discountAmount}>-₹{basePrice * 0.5}</Text>
                        </View>
                    )}

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Grand Total</Text>
                        <Text style={styles.totalAmount}>₹{finalPrice}</Text>
                    </View>
                </View>

                <Text style={styles.sectionHeading}>Billing Info</Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#999"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    style={styles.payBtn}
                    onPress={handlePayment}
                >
                    <Text style={styles.payBtnText}>PROCEED TO PAY</Text>
                </TouchableOpacity>

                <Text style={styles.secureText}>
                    <Ionicons name="lock-closed" size={12} color="#777" /> Secure 256-bit encrypted payment
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#333',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    planSummary: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    summaryTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    planRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planName: {
        fontSize: 22,
        fontWeight: '900',
    },
    planPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 15,
    },
    promoRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    promoInput: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 15,
        marginRight: 10,
        backgroundColor: '#FAFAFA',
        fontWeight: '600',
    },
    promoBtn: {
        width: 80,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    promoBtnText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 12,
    },
    discountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    discountLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4CAF50',
    },
    discountAmount: {
        fontSize: 14,
        fontWeight: '800',
        color: '#4CAF50',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '900',
        color: '#333',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: '900',
        color: '#D4AF37',
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: '900',
        color: '#333',
        marginBottom: 15,
    },
    form: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    input: {
        height: 55,
        borderRadius: 12,
        backgroundColor: '#F5F5F7',
        paddingHorizontal: 15,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 15,
    },
    payBtn: {
        height: 60,
        borderRadius: 18,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    payBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    secureText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 12,
        color: '#999',
        fontWeight: '600',
    }
});

export default CheckoutScreen;
