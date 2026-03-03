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

const TemplateCard = ({ name, imageUrl }) => {
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
                    source={{ uri: imageUrl || 'https://via.placeholder.com/400x300?text=Temple+Design' }}
                    style={styles.image}
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name || 'Temple Template'}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const TemplatesScreen = ({ navigation }) => {
    const templates = [
        { id: '1', name: 'Grand Mandir', image: 'https://picsum.photos/400/300?random=101' },
        { id: '2', name: 'Marble Shrine', image: 'https://picsum.photos/400/300?random=102' },
        { id: '3', name: 'Vedic Dome', image: 'https://picsum.photos/400/300?random=103' },
        { id: '4', name: 'Ornate Pillar', image: 'https://picsum.photos/400/300?random=104' },
        { id: '5', name: 'Modern Temple', image: 'https://picsum.photos/400/300?random=105' },
        { id: '6', name: 'Stone Carving', image: 'https://picsum.photos/400/300?random=106' },
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
                    />
                    <Text style={styles.headerTitle}>Temple Templates</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {templates.map((item) => (
                        <TemplateCard key={item.id} name={item.name} imageUrl={item.image} />
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
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
});

export default TemplatesScreen;
