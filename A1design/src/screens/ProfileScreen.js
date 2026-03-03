import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Image,
    StatusBar,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const user = {
        name: 'A1 User',
        email: 'user@a1studio.com',
        subscription: 'GOLDEN',
    };

    const MenuButton = ({ icon, title, onPress, color = '#333' }) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
        >
            <View style={styles.menuLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={22} color={color === '#333' ? '#D4AF37' : color} />
                </View>
                <Text style={styles.menuTitle}>{title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#EEE" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="create-outline" size={24} color="#D4AF37" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={100} color="#D4AF37" />
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>{user.subscription}</Text>
                        </View>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>

                <View style={styles.menuSection}>
                    <MenuButton
                        icon="star-outline"
                        title="My Subscription"
                        onPress={() => navigation.navigate('SubscriptionScreen')}
                        color="#D4AF37"
                    />
                    <MenuButton
                        icon="settings-outline"
                        title="Settings"
                        onPress={() => navigation.navigate('SettingsScreen')}
                    />
                    <MenuButton
                        icon="help-circle-outline"
                        title="Help & Support"
                        onPress={() => { }}
                    />
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => navigation.replace('LoginScreen')}
                >
                    <Ionicons name="log-out-outline" size={22} color="#D4AF37" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
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
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#333',
    },
    editButton: {
        padding: 5,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    badgeContainer: {
        position: 'absolute',
        bottom: 5,
        right: 0,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#D4AF37',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    },
    userName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#333',
    },
    userEmail: {
        fontSize: 14,
        marginTop: 5,
        fontWeight: '500',
        color: '#777',
    },
    menuSection: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#F5F5F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginHorizontal: 20,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#FFF1F1',
        borderWidth: 1,
        borderColor: '#FEE',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#D4AF37',
        marginLeft: 10,
        letterSpacing: 1,
    },
});

export default ProfileScreen;
