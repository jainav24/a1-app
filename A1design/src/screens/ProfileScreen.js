import React, { useState, useEffect } from 'react';
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
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    const { theme, colors } = useTheme();
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('profileImage').then((uri) => {
            if (uri) setProfileImage(uri);
        });
    }, []);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(
                'Permission Required',
                'Please allow access to your photo library to set a profile picture.',
                [{ text: 'OK' }]
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setProfileImage(uri);
            await AsyncStorage.setItem('profileImage', uri);
        }
    };

    const menuItems = [
        { id: '1', title: 'My Subscription', icon: 'ribbon-outline', color: '#D4AF37', screen: 'SubscriptionScreen' },
        { id: '2', title: 'Project History', icon: 'time-outline', color: theme === 'dark' ? '#AAA' : '#666', screen: 'SavedProjectsScreen' },
        { id: '3', title: 'App Settings', icon: 'settings-outline', color: theme === 'dark' ? '#AAA' : '#666', screen: 'SettingsScreen' },
        { id: '4', title: 'Help & Support', icon: 'help-circle-outline', color: theme === 'dark' ? '#AAA' : '#666' },
        { id: '5', title: 'Terms of Service', icon: 'document-text-outline', color: theme === 'dark' ? '#AAA' : '#666', screen: 'TermsScreen' },
        { id: '6', title: 'Privacy Policy', icon: 'shield-checkmark-outline', color: theme === 'dark' ? '#AAA' : '#666', screen: 'PrivacyScreen' },
    ];

    const isDark = theme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.statusBar} />
            {!isDark ? (
                <ImageBackground
                    source={require('../../assets/marble_bg.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={[colors.overlayLight, colors.overlayMid, colors.overlayStrong]}
                        style={StyleSheet.absoluteFill}
                    />
                    {renderContent()}
                </ImageBackground>
            ) : (
                renderContent()
            )}
        </View>
    );

    function renderContent() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
                    <TouchableOpacity style={styles.headerAction}>
                        <Ionicons name="log-out-outline" size={24} color="#C42D2D" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* PROFILE CARD */}
                    <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
                        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper} activeOpacity={0.8}>
                            <View style={[styles.avatarCircle, { backgroundColor: colors.inputBg }]}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                                ) : (
                                    <Ionicons name="person" size={50} color={isDark ? '#555' : '#DDD'} />
                                )}
                            </View>
                            <View style={styles.editBadge}>
                                <Ionicons name="camera" size={14} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.userName, { color: colors.text }]}>Jainav Shah</Text>
                        <Text style={[styles.userEmail, { color: colors.subText }]}>jainavtech24@gmail.com</Text>

                        <LinearGradient
                            colors={['#D4AF37', '#F3E5AB']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.planBadge}
                        >
                            <Ionicons name="ribbon" size={14} color="#FFF" />
                            <Text style={styles.planText}>Platinum Designer</Text>
                        </LinearGradient>
                    </View>

                    {/* STATS AREA */}
                    <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>24</Text>
                            <Text style={[styles.statLabel, { color: colors.subText }]}>Projects</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>128</Text>
                            <Text style={[styles.statLabel, { color: colors.subText }]}>Assets</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>Pro</Text>
                            <Text style={[styles.statLabel, { color: colors.subText }]}>Tier</Text>
                        </View>
                    </View>

                    {/* MENU LIST */}
                    <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => item.screen && navigation.navigate(item.screen)}
                            >
                                <View style={[styles.menuIconWrapper, { backgroundColor: item.color + '15' }]}>
                                    <Ionicons name={item.icon} size={20} color={item.color} />
                                </View>
                                <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                                <Ionicons name="chevron-forward" size={18} color={colors.subText} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.logoutBtn, { backgroundColor: isDark ? 'rgba(196, 45, 45, 0.1)' : 'rgba(196, 45, 45, 0.05)' }]}
                        onPress={() => navigation.replace('LoginScreen')}
                    >
                        <Text style={styles.logoutBtnText}>Sign Out</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1 },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '600' },
    headerAction: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 12 },
    profileCard: {
        borderRadius: 20,
        padding: 16,
        paddingVertical: 24,
        alignItems: 'center',
        marginBottom: 16,
        boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
        elevation: 4,
    },
    avatarWrapper: { marginBottom: 16, position: 'relative' },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(212,175,55,0.3)',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#C42D2D',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    userName: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
    userEmail: { fontSize: 13, fontWeight: '500', marginBottom: 16 },
    planBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
    planText: { color: '#FFF', fontSize: 11, fontWeight: '800', marginLeft: 6, letterSpacing: 0.5 },
    statsContainer: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.04)',
        elevation: 2,
    },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: '700' },
    statLabel: { fontSize: 12, fontWeight: '600', marginTop: 2 },
    statDivider: { width: 1, height: 30 },
    menuContainer: {
        borderRadius: 20,
        padding: 8,
        marginBottom: 16,
        boxShadow: '0px 0px 10px rgba(0,0,0,0.04)',
        elevation: 2,
    },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16 },
    menuIconWrapper: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuTitle: { flex: 1, fontSize: 15, fontWeight: '700' },
    logoutBtn: { backgroundColor: 'rgba(196, 45, 45, 0.05)', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
    logoutBtnText: { color: '#C42D2D', fontSize: 16, fontWeight: '800' },
});

export default ProfileScreen;
