import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Dimensions,
    StatusBar,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const A1DesignScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Pillars');

    const categories = ['Pillars', 'Domes', 'Entrances', 'Carvings'];

    const assets = [
        { id: '1', name: 'Corinthian Pillar', type: 'Pillars' },
        { id: '2', name: 'Vedic Dome', type: 'Domes' },
        { id: '3', name: 'Golden Archway', type: 'Entrances' },
        { id: '4', name: 'Floral Entablature', type: 'Carvings' },
        { id: '5', name: 'Doric Foundation', type: 'Pillars' },
        { id: '6', name: 'Lotus Tip Dome', type: 'Domes' },
    ];

    const filteredAssets = assets.filter(asset => asset.type === activeTab || activeTab === 'Pillars');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ImageBackground
                source={require('../../assets/marble_bg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.9)']}
                    style={StyleSheet.absoluteFill}
                />

                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={28} color="#1a1a1a" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Architectural Assets</Text>
                        <TouchableOpacity style={styles.headerAction}>
                            <Ionicons name="filter-outline" size={24} color="#1a1a1a" />
                        </TouchableOpacity>
                    </View>

                    {/* CATEGORY TABS */}
                    <View style={styles.tabsContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                            {categories.map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                                    onPress={() => setActiveTab(tab)}
                                >
                                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <FlatList
                        data={filteredAssets}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        contentContainerStyle={styles.gridContainer}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.assetCard}>
                                <View style={styles.assetPreview}>
                                    <View style={styles.blueprintGrid} />
                                    <Ionicons name="cube-outline" size={40} color="#D4AF37" />
                                </View>
                                <View style={styles.assetInfo}>
                                    <Text style={styles.assetName}>{item.name}</Text>
                                    <Text style={styles.assetType}>{item.type}</Text>
                                </View>
                                <TouchableOpacity style={styles.addBtn}>
                                    <Ionicons name="add" size={18} color="#FFF" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}
                    />
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
    headerAction: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
    tabsContainer: { paddingVertical: 10 },
    tabsScroll: { paddingHorizontal: 20, gap: 12 },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    activeTab: { backgroundColor: '#C42D2D', borderColor: '#C42D2D' },
    tabText: { fontSize: 14, fontWeight: '700', color: '#666' },
    activeTabText: { color: '#FFF' },
    gridContainer: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 8 },
    assetCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    assetPreview: {
        height: 110,
        borderRadius: 14,
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        overflow: 'hidden',
    },
    blueprintGrid: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        borderWidth: 1,
        borderColor: '#D4AF37',
        borderStyle: 'dashed',
    },
    assetInfo: { paddingHorizontal: 4 },
    assetName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
    assetType: { fontSize: 12, color: '#777', fontWeight: '500' },
    addBtn: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default A1DesignScreen;
