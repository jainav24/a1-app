import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    ImageBackground,
    Animated,
    Dimensions,
    StatusBar,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const navUnderlineAnim = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 40,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(shimmerAnim, {
                        toValue: 1,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shimmerAnim, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    })
                ])
            )
        ]).start();
    }, []);

    const designTools = [
        { id: '1', title: 'Temple Templates', icon: 'home-outline', color: '#D4AF37', tint: 'rgba(212, 175, 55, 0.1)', screen: 'TemplatesScreen' },
        { id: '2', title: 'AI Layout Generator', icon: 'sparkles-outline', color: '#D4AF37', tint: 'rgba(212, 175, 55, 0.1)', screen: 'A1BotScreen' },
        { id: '3', title: 'Marble & Pillar Library', icon: 'grid-outline', color: '#D4AF37', tint: 'rgba(212, 175, 55, 0.1)', screen: 'A1DesignScreen' },
        { id: '4', title: 'Saved Projects', icon: 'folder-open-outline', color: '#D4AF37', tint: 'rgba(212, 175, 55, 0.1)', screen: 'SavedProjectsScreen' },
    ];

    const recentProjects = [
        { id: '1', title: 'Grand Shiva Temple', time: '2 hours ago', progress: 0.75 },
        { id: '2', title: 'Modern Vedic Hall', time: 'Yesterday', progress: 0.40 },
        { id: '3', title: 'Zen Meditation Pavillion', time: '3 days ago', progress: 0.90 },
    ];

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width * 1.5],
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <ImageBackground
                source={require('../../assets/marble_bg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.85)']}
                    style={StyleSheet.absoluteFill}
                />

                <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                    {/* PRO GLASS HEADER */}
                    <View style={styles.header}>
                        <LinearGradient
                            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.headerContent}>
                            <Ionicons name="business-outline" size={24} color="#333" />
                            <Text style={styles.headerTitle}>A1 Temple Studio</Text>
                            <View style={styles.headerRight}>
                                <TouchableOpacity style={styles.iconButton}>
                                    <Ionicons name="notifications-outline" size={22} color="#333" />
                                    <View style={styles.notifBadge} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.profileAvatar}
                                    onPress={() => navigation.navigate('ProfileScreen')}
                                >
                                    <View style={styles.avatarCircle} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.headerDivider} />
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                            {/* HERO CREATION CARD POLISHED */}
                            <TouchableOpacity activeOpacity={0.96} style={styles.heroCardContainer}>
                                <View style={styles.heroShadowLayer} />
                                <ImageBackground
                                    source={require('../../assets/temple_hero.png')}
                                    style={styles.heroImage}
                                    imageStyle={{ borderRadius: 30 }}
                                >
                                    <View style={styles.heroImageBlur} />
                                    <LinearGradient
                                        colors={['rgba(196,45,45,0.8)', 'rgba(196,45,45,0.2)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.heroOverlay}
                                    >
                                        {/* Subtle corner light glow */}
                                        <View style={styles.heroLightCorner} />

                                        <View style={styles.heroContent}>
                                            <Text style={styles.heroHeading}>Create Your Next Temple Design</Text>
                                            <Text style={styles.heroSubheading}>Design layouts, domes and carvings with precision</Text>

                                            <View style={styles.heroButtons}>
                                                <TouchableOpacity
                                                    style={styles.primaryHeroBtn}
                                                    onPress={() => navigation.navigate('DesignCanvasScreen')}
                                                >
                                                    <LinearGradient
                                                        colors={['#C42D2D', '#911D1D']}
                                                        style={styles.btnGradient}
                                                    >
                                                        <Text style={styles.primaryHeroBtnText}>New Project</Text>
                                                    </LinearGradient>
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

                            {/* SMART DESIGN TOOLS POLISHED */}
                            <Text style={styles.sectionTitle}>Smart Design Tools</Text>
                            <View style={styles.toolsGrid}>
                                {designTools.map((tool) => (
                                    <Pressable
                                        key={tool.id}
                                        style={({ pressed }) => [styles.toolCard, pressed && { transform: [{ scale: 0.97 }] }]}
                                        onPress={() => navigation.navigate(tool.screen)}
                                    >
                                        <View style={[styles.toolIconWrapper, { backgroundColor: tool.tint }]}>
                                            <Ionicons name={tool.icon} size={26} color={tool.color} />
                                        </View>
                                        <Text style={styles.toolLabel}>{tool.title}</Text>
                                    </Pressable>
                                ))}
                            </View>

                            {/* RECENT DESIGNS POLISHED */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent Designs</Text>
                                <View style={styles.swipeDots}>
                                    <View style={[styles.dot, styles.activeDot]} />
                                    <View style={styles.dot} />
                                    <View style={styles.dot} />
                                </View>
                            </View>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.recentScroll}
                                snapToInterval={width * 0.72 + 14}
                                decelerationRate="fast"
                            >
                                {recentProjects.map((project) => (
                                    <View key={project.id} style={styles.recentCard}>
                                        <View style={styles.recentPreview}>
                                            {/* Blueprint texture grid overlay */}
                                            <View style={styles.blueprintGrid} />
                                            <Ionicons name="cube-outline" size={36} color="#D4AF37" />
                                        </View>
                                        <View style={styles.recentInfo}>
                                            <Text style={styles.projectTitle} numberOfLines={1}>{project.title}</Text>
                                            <Text style={styles.projectTime}>{project.time}</Text>
                                            <View style={styles.progressBarBg}>
                                                <LinearGradient
                                                    colors={['#D4AF37', '#F3E5AB']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={[styles.progressBarFill, { width: `${project.progress * 100}%` }]}
                                                />
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.recentActionBtn}
                                            onPress={() => navigation.navigate('ProjectDetailScreen', { project })}
                                        >
                                            <Ionicons name="arrow-forward" size={16} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>

                            {/* INSIGHTS BANNER POLISHED */}
                            <LinearGradient
                                colors={['#D4AF37', '#F3E5AB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.insightsBanner}
                            >
                                <Animated.View style={[styles.shimmerLine, { transform: [{ translateX: shimmerTranslate }] }]} />
                                <View style={styles.insightsIconWrapper}>
                                    <Ionicons name="ribbon" size={24} color="#FFF" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.insightsText}>Upgrade to A1 Pro for 3D Preview & AI Automation</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.upgradeBtn}
                                    onPress={() => navigation.navigate('SubscriptionScreen')}
                                >
                                    <Text style={styles.upgradeBtnText}>Upgrade</Text>
                                </TouchableOpacity>
                            </LinearGradient>

                        </Animated.View>
                    </ScrollView>
                </SafeAreaView>

                {/* FAB WITH REALISM SHADOW */}
                <View style={styles.fabContainer}>
                    <View style={styles.fabShadow} />
                    <TouchableOpacity style={styles.fab}>
                        <Ionicons name="add" size={32} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* POLISHED FLOATING BOTTOM NAVIGATION */}
                <View style={styles.bottomNavContainer}>
                    <View style={styles.bottomNav}>
                        <LinearGradient
                            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                            style={StyleSheet.absoluteFill}
                        />
                        <TouchableOpacity style={styles.navItem}>
                            <Ionicons name="home" size={22} color="#D4AF37" />
                            <View style={styles.activeIndicator} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('DesignCanvasScreen')}
                        >
                            <Ionicons name="brush-outline" size={22} color="#666" />
                        </TouchableOpacity>

                        <View style={{ width: 68 }} />

                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('A1DesignScreen')}
                        >
                            <Ionicons name="images-outline" size={22} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('ProfileScreen')}
                        >
                            <Ionicons name="person-outline" size={22} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.navCenterItem}
                        onPress={() => navigation.navigate('A1BotScreen')}
                    >
                        <Ionicons name="sparkles" size={24} color="#666" style={{ opacity: 0.6 }} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F5F0',
    },
    backgroundImage: {
        flex: 1,
    },
    header: {
        height: 60,
        backgroundColor: '#F7F5F0',
        zIndex: 10,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: 18,
    },
    notifBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#C42D2D',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    profileAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        padding: 2,
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
    },
    avatarCircle: {
        flex: 1,
        backgroundColor: '#CCC',
        borderRadius: 14,
    },
    headerDivider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        width: '100%',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 130,
        paddingTop: 8,
    },
    heroCardContainer: {
        height: 180,
        width: '100%',
        borderRadius: 20,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    heroShadowLayer: {
        position: 'absolute',
        bottom: -10,
        width: '90%',
        height: '80%',
        alignSelf: 'center',
        backgroundColor: '#C42D2D',
        opacity: 0.15,
        borderRadius: 30,
        filter: 'blur(20px)',
    },
    heroImage: {
        flex: 1,
        overflow: 'hidden',
    },
    heroImageBlur: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(2px)',
    },
    heroOverlay: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    heroLightCorner: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 120,
        height: 120,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 60,
        filter: 'blur(30px)',
    },
    heroContent: {
        flex: 1,
        justifyContent: 'center',
    },
    heroHeading: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFF',
        marginBottom: 6,
        width: '85%',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    heroSubheading: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 20,
        width: '75%',
        fontWeight: '500',
    },
    heroButtons: {
        flexDirection: 'row',
    },
    primaryHeroBtn: {
        borderRadius: 22,
        overflow: 'hidden',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    btnGradient: {
        paddingHorizontal: 22,
        paddingVertical: 11,
    },
    primaryHeroBtnText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 14,
    },
    secondaryHeroBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    secondaryHeroBtnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    toolsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    toolCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    toolIconWrapper: {
        width: 54,
        height: 54,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    toolLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#333',
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    swipeDots: {
        flexDirection: 'row',
        gap: 5,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#DDD',
    },
    activeDot: {
        backgroundColor: '#D4AF37',
        width: 14,
    },
    recentScroll: {
        marginLeft: -20,
        paddingLeft: 20,
        marginBottom: 30,
    },
    recentCard: {
        width: width * 0.74,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    recentPreview: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    blueprintGrid: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        borderWidth: 1,
        borderColor: '#D4AF37',
        borderStyle: 'dashed',
    },
    recentInfo: {
        flex: 1,
    },
    projectTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1a1a1a',
    },
    projectTime: {
        fontSize: 12,
        color: '#999',
        marginVertical: 4,
        fontWeight: '500',
    },
    progressBarBg: {
        height: 5,
        backgroundColor: '#F0F0F0',
        borderRadius: 3,
        width: '100%',
        marginTop: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    recentActionBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    insightsBanner: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    shimmerLine: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 80,
        height: '200%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        transform: [{ rotate: '25deg' }],
    },
    insightsIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    insightsText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1a1a1a',
        width: '90%',
        lineHeight: 18,
    },
    upgradeBtn: {
        backgroundColor: '#C62828',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    upgradeBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '900',
    },
    fabContainer: {
        position: 'absolute',
        bottom: 95,
        alignSelf: 'center',
        zIndex: 100,
    },
    fabShadow: {
        position: 'absolute',
        bottom: -5,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#C42D2D',
        opacity: 0.4,
        filter: 'blur(10px)',
    },
    fab: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#C62828',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.2,
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
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 5,
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
        backgroundColor: '#D4AF37',
    },
    navCenterItem: {
        position: 'absolute',
        left: '50%',
        marginLeft: -15,
        top: 24,
    }
});

export default DashboardScreen;
