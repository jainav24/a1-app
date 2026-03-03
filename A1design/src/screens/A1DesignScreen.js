import React, { useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Animated,
    StatusBar,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CategoryCard = ({ title, imageUrl }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.card}
            >
                <Image
                    source={{ uri: imageUrl || 'https://via.placeholder.com/400x300?text=A1+Design' }}
                    style={styles.image}
                />
                <View style={styles.info}>
                    <Text style={styles.title}>{title || 'Design'}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const A1DesignScreen = ({ navigation }) => {
    const categories = [
        { id: '1', title: 'Modern Designs', image: 'https://picsum.photos/400/300?random=301' },
        { id: '2', title: 'Traditional Art', image: 'https://picsum.photos/400/300?random=302' },
        { id: '3', title: 'Creative Assets', image: 'https://picsum.photos/400/300?random=303' },
        { id: '4', title: 'Premium Layouts', image: 'https://picsum.photos/400/300?random=304' },
        { id: '5', title: 'Custom Elements', image: 'https://picsum.photos/400/300?random=305' },
        { id: '6', title: 'Studio Special', image: 'https://picsum.photos/400/300?random=306' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Image
                        source={require('../../assets/a1logo.png')}
                        style={styles.headerLogo}
                        resizeMode="contain"
                        onError={() => console.log('Logo error')}
                    />
                    <Text style={styles.headerTitle}>A1 Designs</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {categories.map((item) => (
                        <CategoryCard key={item.id} title={item.title} imageUrl={item.image} />
                    ))}
                </View>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    backButton: {
        padding: 5,
        marginRight: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1A1A1A',
    },
    scrollContent: {
        padding: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardContainer: {
        width: (width - 45) / 2,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    image: {
        width: '100%',
        height: 140,
        backgroundColor: '#EEE',
    },
    info: {
        padding: 12,
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
});

export default A1DesignScreen;
