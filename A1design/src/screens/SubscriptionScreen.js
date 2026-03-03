import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    FlatList,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SubscriptionScreen = ({ navigation }) => {
    const plans = [
        {
            id: '1',
            name: 'FREE',
            price: '₹0',
            duration: '/mo',
            features: ['5 project saves', 'Basic A1 tools', 'Standard export'],
            color: '#757575'
        },
        {
            id: '2',
            name: 'SILVER',
            price: '₹299',
            duration: '/mo',
            features: ['Unlimited saves', 'No watermark', 'All basic assets'],
            color: '#9E9E9E'
        },
        {
            id: '3',
            name: 'GOLDEN',
            price: '₹699',
            duration: '/mo',
            features: ['Priority support', 'HD export', 'Advanced templates'],
            color: '#D4AF37',
            recommended: true
        },
        {
            id: '4',
            name: 'PLATINUM',
            price: '₹1499',
            duration: '/mo',
            features: ['Commercial license', '3D preview', 'Dedicated assistance'],
            color: '#1A1A1A'
        }
    ];

    const renderPlan = ({ item }) => (
        <View
            style={[
                styles.planCard,
                item.recommended && { borderColor: '#D4AF37', borderWidth: 2 }
            ]}
        >
            {item.recommended && (
                <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>RECOMMENDED</Text>
                </View>
            )}
            <Text style={[styles.planName, { color: item.color }]}>{item.name}</Text>
            <View style={styles.priceRow}>
                <Text style={styles.planPrice}>{item.price}</Text>
                <Text style={styles.planDuration}>{item.duration}</Text>
            </View>
            <View style={styles.featuresList}>
                {item.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity
                style={[styles.selectBtn, { backgroundColor: item.recommended ? '#D4AF37' : '#333' }]}
                onPress={() => navigation.navigate('CheckoutScreen', { plan: item })}
            >
                <Text style={styles.selectBtnText}>GET STARTED</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Subscription Plan</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={plans}
                renderItem={renderPlan}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <View style={styles.intro}>
                        <Text style={styles.introTitle}>Choose Your Plan</Text>
                        <Text style={styles.introSub}>Unlock premium features for your A1 designs</Text>
                    </View>
                )}
            />
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
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#333',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    intro: {
        marginBottom: 30,
        alignItems: 'center',
    },
    introTitle: {
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        color: '#333',
        marginBottom: 8,
    },
    introSub: {
        fontSize: 14,
        textAlign: 'center',
        color: '#777',
        paddingHorizontal: 30,
    },
    planCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 25,
        marginBottom: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        position: 'relative',
    },
    recommendedBadge: {
        position: 'absolute',
        top: -12,
        alignSelf: 'center',
        backgroundColor: '#D4AF37',
        paddingHorizontal: 15,
        paddingVertical: 4,
        borderRadius: 12,
    },
    recommendedText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    },
    planName: {
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 10,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 20,
    },
    planPrice: {
        fontSize: 40,
        fontWeight: '900',
        color: '#333',
    },
    planDuration: {
        fontSize: 16,
        color: '#777',
        marginLeft: 4,
    },
    featuresList: {
        marginBottom: 25,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureText: {
        fontSize: 14,
        marginLeft: 10,
        fontWeight: '500',
        color: '#555',
    },
    selectBtn: {
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    selectBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
});

export default SubscriptionScreen;
