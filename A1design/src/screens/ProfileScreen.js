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
    Image,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    const menuItems = [
        { id: '1', title: 'My Subscription', icon: 'ribbon-outline', color: '#D4AF37', screen: 'SubscriptionScreen' },
        { id: '2', title: 'Project History', icon: 'time-outline', color: '#666', screen: 'SavedProjectsScreen' },
        { id: '3', title: 'App Settings', icon: 'settings-outline', color: '#666', screen: 'SettingsScreen' },
        { id: '4', title: 'Help & Support', icon: 'help-circle-outline', color: '#666' },
        { id: '5', title: 'Terms & Privacy', icon: 'document-text-outline', color: '#666' },
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
                        <Text style={styles.headerTitle}>Profile</Text>
                        <TouchableOpacity style={styles.headerAction}>
                            <Ionicons name="log-out-outline" size={24} color="#C42D2D" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* PROFILE CARD */}
                        <View style={styles.profileCard}>
                            <View style={styles.avatarWrapper}>
                                <View style={styles.avatarCircle}>
                                    <Ionicons name="person" size={50} color="#DDD" />
                                </View>
                                <View style={styles.editBadge}>
                                    <Ionicons name="camera" size={14} color="#FFF" />
                                </View>
                            </View>
                            <Text style={styles.userName}>Jainav Shah</Text>
                            <Text style={styles.userEmail}>jainavtech24@gmail.com</Text>

                            <LinearGradient
                                colors={['#D4AF37', '#F3E5AB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.planBadge}
                            >
                                <Ionicons name="ribbon" size={14} color="#FFF" />
                                <Text style={styles.planText}>Platinum Designer</Text>
                            </LinearGradient>
                        </View>

                        {/* STATS AREA */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>24</Text>
                                <Text style={styles.statLabel}>Projects</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>128</Text>
                                <Text style={styles.statLabel}>Assets</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>Pro</Text>
                                <Text style={styles.statLabel}>Tier</Text>
                            </View>
                        </View>

                        {/* MENU LIST */}
                        <View style={styles.menuContainer}>
                            {menuItems.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.menuItem}
                                    onPress={() => item.screen && navigation.navigate(item.screen)}
                                >
                                    <View style={[styles.menuIconWrapper, { backgroundColor: item.color + '10' }]}>
                                        <Ionicons name={item.icon} size={20} color={item.color} />
                                    </View>
                                    <Text style={styles.menuTitle}>{item.title}</Text>
                                    <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.logoutBtn}
                            onPress={() => navigation.replace('LoginScreen')}
                        >
                            <Text style={styles.logoutBtnText}>Sign Out</Text>
                        </TouchableOpacity>
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
    headerAction: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        paddingVertical: 24,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    avatarWrapper: { marginBottom: 16 },
    avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12 },
    editBadge: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#C42D2D', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
    userName: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
    userEmail: { fontSize: 13, color: '#777', fontWeight: '500', marginBottom: 16 },
    planBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
    planText: { color: '#FFF', fontSize: 11, fontWeight: '800', marginLeft: 6, letterSpacing: 0.5 },
    statsContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16, justifyContent: 'space-around', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
    statLabel: { fontSize: 12, color: '#999', fontWeight: '600', marginTop: 2 },
    statDivider: { width: 1, height: 30, backgroundColor: 'rgba(0,0,0,0.05)' },
    menuContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 8, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16 },
    menuIconWrapper: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#333' },
    logoutBtn: { backgroundColor: 'rgba(196, 45, 45, 0.05)', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
    logoutBtnText: { color: '#C42D2D', fontSize: 16, fontWeight: '800' },
});

export default ProfileScreen;
