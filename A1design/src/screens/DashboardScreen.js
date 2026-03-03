import React, { useState, useEffect, useRef } from 'react';
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
    FlatList,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
    const [recentProjects, setRecentProjects] = useState([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadProjects();
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        });
        return unsubscribe;
    }, [navigation]);

    const loadProjects = async () => {
        try {
            const stored = await AsyncStorage.getItem('A1_PROJECTS');
            const parsed = stored ? JSON.parse(stored) : [];
            setRecentProjects(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
            console.error("Load projects error:", error);
            setRecentProjects([]);
        }
    };

    const sections = [
        { id: '1', title: 'New Project', icon: 'add-circle-outline', route: 'DesignCanvasScreen', color: '#D4AF37' },
        { id: '2', title: 'Templates', icon: 'library-outline', route: 'TemplatesScreen', color: '#4CAF50' },
        { id: '3', title: 'A1 Design', icon: 'color-palette-outline', route: 'A1DesignScreen', color: '#FF9800' },
        { id: '4', title: 'A1 Bot', icon: 'sparkles-outline', route: 'A1BotScreen', color: '#9C27B0' },
        { id: '5', title: 'Subscription', icon: 'card-outline', route: 'SubscriptionScreen', color: '#2196F3' },
    ];

    const renderProjectCard = ({ item }) => (
        <TouchableOpacity
            style={styles.projectCard}
            onPress={() => navigation.navigate('DesignCanvasScreen', { project: item })}
        >
            <View style={styles.projectIcon}>
                <Ionicons name="document-text-outline" size={30} color="#D4AF37" />
            </View>
            <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{item?.name || 'Untitled Project'}</Text>
                <Text style={styles.projectDate}>{item?.date || 'Unknown Date'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#DDD" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image
                        source={require('../../assets/a1logo.png')}
                        style={styles.headerLogo}
                        resizeMode="contain"
                        onError={() => console.log('Logo load error')}
                    />
                    <Text style={styles.headerTitle}>A1 Studio</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                    <Ionicons name="person-circle-outline" size={35} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={styles.sectionTitle}>Main Menu</Text>
                    <View style={styles.grid}>
                        {sections.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.gridItem}
                                onPress={() => navigation.navigate(item.route)}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                                    <Ionicons name={item.icon} size={28} color={item.color} />
                                </View>
                                <Text style={styles.gridLabel}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.projectsHeader}>
                        <Text style={styles.sectionTitle}>Recent Projects</Text>
                        <TouchableOpacity onPress={loadProjects}>
                            <Ionicons name="refresh-outline" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {recentProjects.length > 0 ? (
                        <FlatList
                            data={recentProjects}
                            renderItem={renderProjectCard}
                            keyExtractor={item => item?.id?.toString() || Math.random().toString()}
                            scrollEnabled={false}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="brush-outline" size={50} color="#EEE" />
                            <Text style={styles.emptyText}>Start your first design project!</Text>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('DesignCanvasScreen')}
            >
                <Ionicons name="add" size={30} color="#FFF" />
            </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 25,
        backgroundColor: '#FFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: {
        width: 35,
        height: 35,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#333',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 15,
        marginTop: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    gridItem: {
        width: (width - 60) / 2,
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
        alignItems: 'center',
        backgroundColor: '#FFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    gridLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
    },
    projectsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    projectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 18,
        marginBottom: 12,
        backgroundColor: '#FFF',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    projectIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F5F5F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    projectInfo: {
        flex: 1,
    },
    projectName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    projectDate: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    emptyState: {
        padding: 40,
        borderRadius: 25,
        backgroundColor: '#FFF',
        alignItems: 'center',
        marginTop: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 15,
        color: '#999',
        lineHeight: 20,
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        right: 25,
        bottom: 25,
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
});

export default DashboardScreen;
