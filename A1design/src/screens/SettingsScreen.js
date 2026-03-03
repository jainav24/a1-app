import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const SettingRow = ({ icon, title, value, onToggle, isSwitch = false, onPress }) => (
        <TouchableOpacity
            style={styles.settingRow}
            onPress={onPress}
            activeOpacity={isSwitch ? 1 : 0.7}
        >
            <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#333' : '#F9F9F9' }]}>
                    <Ionicons name={icon} size={22} color={isDarkMode ? '#D4AF37' : '#666'} />
                </View>
                <Text style={styles.settingTitle}>{title}</Text>
            </View>
            {isSwitch ? (
                <Switch
                    value={value}
                    onToggle={onToggle}
                    trackColor={{ false: '#EEE', true: '#D4AF3750' }}
                    thumbColor={value ? '#D4AF37' : '#FFF'}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color="#DDD" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Account</Text>
                    <SettingRow icon="person-outline" title="Edit Profile" onPress={() => { }} />
                    <SettingRow icon="lock-closed-outline" title="Change Password" onPress={() => { }} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Preferences</Text>
                    <SettingRow
                        icon="moon-outline"
                        title="Dark Mode"
                        isSwitch
                        value={isDarkMode}
                        onToggle={() => setIsDarkMode(!isDarkMode)}
                    />
                    <SettingRow
                        icon="notifications-outline"
                        title="Notifications"
                        isSwitch
                        value={notifications}
                        onToggle={() => setNotifications(!notifications)}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>App Info</Text>
                    <SettingRow icon="document-text-outline" title="Privacy Policy" onPress={() => { }} />
                    <SettingRow icon="information-circle-outline" title="About Us" onPress={() => { }} />
                    <View style={styles.versionContainer}>
                        <Text style={styles.versionLabel}>Version</Text>
                        <Text style={styles.versionValue}>1.0.0 (Build 2412)</Text>
                    </View>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1A1A1A',
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: '#BBB',
        marginBottom: 10,
        marginLeft: 5,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 18,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
    },
    versionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginTop: 10,
    },
    versionLabel: {
        color: '#AAA',
        fontSize: 13,
    },
    versionValue: {
        color: '#AAA',
        fontSize: 13,
        fontWeight: '600',
    },
});

export default SettingsScreen;
