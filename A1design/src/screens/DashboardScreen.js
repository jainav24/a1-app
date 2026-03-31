import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    StatusBar,
    Animated,
    Pressable,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
    const { theme, colors, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const fabScale = useRef(new Animated.Value(1)).current;

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
            Animated.loop(
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                })
            )
        ]).start();
    }, []);

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    const designTools = [
        { id: '1', title: 'A1 Design Engine', icon: 'color-palette', color: '#D4AF37', tint: 'rgba(212, 175, 55, 0.1)', screen: 'DesignCanvasScreen' },
        { id: '2', title: 'My Collection', icon: 'folder-open-outline', color: '#4A90E2', tint: 'rgba(74, 144, 226, 0.1)', screen: 'SavedProjectsScreen' },
        { id: '3', title: '3D Walkthrough', icon: 'cube-outline', color: '#50C878', tint: 'rgba(80, 200, 120, 0.1)', screen: 'WalkthroughScreen' },
        { id: '4', title: 'Temple Assets', icon: 'apps-outline', color: '#E0115F', tint: 'rgba(224, 17, 95, 0.1)', screen: 'A1DesignScreen' },
    ];

    const recentProjects = [
        { id: '1', title: 'Somnath Temple Revamp', time: '2h ago', progress: 0.85, icon: 'business' },
        { id: '2', title: 'Modern Civic Asharam', time: 'Yesterday', progress: 0.45, icon: 'construct' },
        { id: '3', title: 'Stone Carving Detail B', time: '3 days ago', progress: 1.0, icon: 'star' },
    ];

    const ListHeader = () => (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* HERO CREATION CARD */}
            <TouchableOpacity activeOpacity={0.96} style={styles.heroCardContainer}>
                <View style={styles.heroShadowLayer} />
                <ImageBackground
                    source={require('../../assets/temple_hero.png')}
                    style={styles.heroImage}
                    imageStyle={{ borderRadius: 24 }}
                >
                    <View style={styles.heroImageBlur} />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.15)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroOverlay}
                    >
                        <View style={styles.heroContent}>
                            <Text style={styles.heroHeading}>Create Your Next Temple Design</Text>
                            <Text style={styles.heroSubheading}>Design layouts, domes and carvings with precision</Text>

                            <View style={styles.heroButtons}>
                                <TouchableOpacity
                                    style={styles.primaryHeroBtn}
                                    onPress={() => navigation.navigate('DesignCanvasScreen')}
                                >
                                    <View style={[styles.btnGradient, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.primaryHeroBtnText}>New Project</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.secondaryHeroBtn}
                                    onPress={() => navigation.navigate('SavedProjectsScreen')}
                                >
                                    <Text style={styles.secondaryHeroBtnText}>Open Recent</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </TouchableOpacity>

            {/* SMART DESIGN TOOLS */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Smart Design Tools</Text>
            <View style={styles.toolsGrid}>
                {designTools.map((tool) => (
                    <Pressable
                        key={tool.id}
                        style={({ pressed }) => [
                            styles.toolCard,
                            { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
                            pressed && { transform: [{ scale: 0.97 }] }
                        ]}
                        onPress={() => navigation.navigate(tool.screen)}
                    >
                        <View style={[styles.toolIconWrapper, { backgroundColor: tool.tint }]}>
                            <Ionicons name={tool.icon} size={24} color={tool.color} />
                        </View>
                        <Text style={[styles.toolLabel, { color: colors.text }]}>{tool.title}</Text>
                    </Pressable>
                ))}
            </View>

            {/* RECENT DESIGNS HEADER */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Recent Designs</Text>
                <TouchableOpacity 
                    style={styles.viewAllBtn}
                    onPress={() => navigation.navigate('SavedProjectsScreen')}
                >
                    <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );

    const renderRecentItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.fullWidthCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ProjectDetailScreen', { project: item })}
        >
            <View style={[styles.recentIconBox, { backgroundColor: colors.primary + '10' }]}>
                <Ionicons name={item.icon || 'cube-outline'} size={24} color={colors.primary} />
            </View>
            <View style={styles.recentInfo}>
                <View style={styles.recentHeaderRow}>
                    <Text style={[styles.fullProjectTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                    <Text style={[styles.projectTimeText, { color: colors.subText }]}>{item.time}</Text>
                </View>
                <View style={styles.progressBarWrapper}>
                    <View style={[styles.progressBarBgFull, { backgroundColor: colors.border + '30' }]}>
                        <LinearGradient
                            colors={[colors.primary, '#F3E5AB']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: `${item.progress * 100}%` }]}
                        />
                    </View>
                    <Text style={[styles.progressPct, { color: colors.primary }]}>{Math.round(item.progress * 100)}%</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const ListFooter = () => (
        <View style={{ marginTop: 20 }}>
            {/* INSIGHTS BANNER */}
            <LinearGradient
                colors={[colors.primary, isDark ? '#1E1E1E' : '#F3E5AB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.insightsBanner}
            >
                <Animated.View style={[styles.shimmerLine, { transform: [{ translateX: shimmerTranslate }] }]} />
                <View style={styles.insightsIconWrapper}>
                    <Ionicons name="ribbon" size={24} color="#FFF" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.insightsText, { color: isDark ? '#FFF' : colors.text }]}>Upgrade to A1 Pro for 3D Walkthroughs</Text>
                </View>
                <TouchableOpacity
                    style={styles.upgradeBtn}
                    onPress={() => navigation.navigate('SubscriptionScreen')}
                >
                    <Text style={styles.upgradeBtnText}>Upgrade</Text>
                </TouchableOpacity>
            </LinearGradient>
            <View style={{ height: 160 }} /> 
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.statusBar} />
            
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* PREMIUM HEADER */}
                <View style={[styles.header, { backgroundColor: isDark ? colors.card : 'rgba(255,255,255,0.95)', borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                    <View style={styles.headerContent}>
                        <Ionicons name="business" size={24} color={colors.primary} />
                        <Text style={[styles.headerTitle, { color: colors.text }]}>A1 Studio</Text>
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="notifications-outline" size={22} color={colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.profileAvatar}
                                onPress={() => navigation.navigate('SettingsScreen')}
                            >
                                <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {!isDark && (
                        <LinearGradient
                            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.8)']}
                            style={StyleSheet.absoluteFill}
                        />
                    )}
                </View>

                <FlatList
                    data={recentProjects}
                    renderItem={renderRecentItem}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={ListHeader}
                    ListFooterComponent={ListFooter}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                />

                {/* FAB */}
                <View style={styles.fabContainer}>
                    <View style={[styles.fabShadow, { backgroundColor: colors.primary }]} />
                    <TouchableOpacity 
                        activeOpacity={1}
                        onPress={() => navigation.navigate('DesignCanvasScreen')}
                        onPressIn={() => {
                            Animated.spring(fabScale, {
                                toValue: 0.9,
                                useNativeDriver: true,
                            }).start();
                        }}
                        onPressOut={() => {
                            Animated.spring(fabScale, {
                                toValue: 1,
                                friction: 4,
                                tension: 40,
                                useNativeDriver: true,
                            }).start();
                        }}
                    >
                        <Animated.View style={[styles.fab, { backgroundColor: colors.primary, transform: [{ scale: fabScale }] }]}>
                            <Ionicons name="add" size={32} color="#FFF" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                {/* BOTTOM NAVIGATION */}
                <View style={styles.bottomNavContainer}>
                    <View style={[styles.bottomNav, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        {!isDark && (
                            <LinearGradient
                                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                                style={StyleSheet.absoluteFill}
                            />
                        )}
                        <TouchableOpacity style={styles.navItem}>
                            <Ionicons name="home" size={22} color={colors.primary} />
                            <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('DesignCanvasScreen')}
                        >
                            <Ionicons name="brush-outline" size={22} color={colors.subText} />
                        </TouchableOpacity>

                        <View style={{ width: 68 }} />

                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('A1DesignScreen')}
                        >
                            <Ionicons name="images-outline" size={22} color={colors.subText} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('SettingsScreen')}
                        >
                            <Ionicons name="person-outline" size={22} color={colors.subText} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.navCenterItem}
                        onPress={() => navigation.navigate('A1BotScreen')}
                    >
                        <Ionicons name="sparkles" size={24} color={colors.subText} style={{ opacity: 0.6 }} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 70,
        zIndex: 10,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        borderBottomWidth: 1,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: 18,
    },
    profileAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        padding: 2,
        borderWidth: 1.5,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    avatarCircle: {
        flex: 1,
        borderRadius: 15,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    heroCardContainer: {
        height: 200,
        width: '100%',
        borderRadius: 24,
        marginBottom: 30,
        position: 'relative',
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
    },
    heroImage: {
        flex: 1,
    },
    heroImageBlur: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    heroOverlay: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    heroContent: {
        flex: 1,
        justifyContent: 'center',
    },
    heroHeading: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    heroSubheading: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 20,
        fontWeight: '600',
    },
    heroButtons: {
        flexDirection: 'row',
    },
    primaryHeroBtn: {
        borderRadius: 22,
        overflow: 'hidden',
        marginRight: 12,
    },
    btnGradient: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    primaryHeroBtnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
    secondaryHeroBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 22,
        paddingVertical: 11,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    secondaryHeroBtnText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    toolsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    toolCard: {
        width: '48%',
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    toolIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    toolLabel: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '800',
        marginRight: 4,
    },
    fullWidthCard: {
        width: '100%',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    recentIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    recentHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    fullProjectTitle: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
    projectTimeText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 10,
    },
    progressBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarBgFull: {
        height: 4,
        borderRadius: 2,
        flex: 1,
        overflow: 'hidden',
        marginRight: 12,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressPct: {
        fontSize: 11,
        fontWeight: '700',
        width: 32,
    },
    insightsBanner: {
        width: '100%',
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
        overflow: 'hidden',
    },
    shimmerLine: {
        position: 'absolute',
        top: -100,
        left: 0,
        width: 100,
        height: 300,
        backgroundColor: 'rgba(255,255,255,0.2)',
        transform: [{ rotate: '30deg' }],
    },
    insightsIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    insightsText: {
        fontSize: 15,
        fontWeight: '800',
        lineHeight: 20,
    },
    upgradeBtn: {
        backgroundColor: '#C62828',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginLeft: 12,
    },
    upgradeBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '900',
    },
    fabContainer: {
        position: 'absolute',
        bottom: 114,
        left: '50%',
        transform: [{ translateX: -30 }],
        zIndex: 100,
    },
    fabShadow: {
        position: 'absolute',
        bottom: -4,
        width: 60,
        height: 60,
        borderRadius: 30,
        opacity: 0.3,
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    bottomNavContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        zIndex: 50,
    },
    bottomNav: {
        flexDirection: 'row',
        height: 68,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 12,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: 50,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 12,
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    navCenterItem: {
        position: 'absolute',
        left: '50%',
        marginLeft: -15,
        top: 24,
    }
});

export default DashboardScreen;
