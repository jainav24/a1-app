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
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SettingsScreen = ({ navigation }) => {
    const [notifs, setNotifs] = useState(true);
    const [cloudSync, setCloudSync] = useState(true);
    const [biometrics, setBiometrics] = useState(false);

    const settingSections = [
        {
            title: 'App Preferences',
            items: [
                { id: '1', title: 'Notifications', type: 'switch', value: notifs, setter: setNotifs },
                { id: '2', title: 'Cloud Sync', type: 'switch', value: cloudSync, setter: setCloudSync },
                { id: '3', title: 'Dark Mode', type: 'label', value: 'System Default' },
            ]
        },
        {
            title: 'Security',
            items: [
                { id: '4', title: 'Biometric Lock', type: 'switch', value: biometrics, setter: setBiometrics },
                { id: '5', title: 'Change Password', type: 'button' },
            ]
        }
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
                        <Text style={styles.headerTitle}>Settings</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {settingSections.map((section, idx) => (
                            <View key={idx} style={styles.section}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <View style={styles.sectionCard}>
                                    {section.items.map((item, i) => (
                                        <View key={item.id} style={[styles.settingItem, i === section.items.length - 1 && { borderBottomWidth: 0 }]}>
                                            <Text style={styles.itemTitle}>{item.title}</Text>

                                            {item.type === 'switch' && (
                                                <Switch
                                                    value={item.value}
                                                    onValueChange={item.setter}
                                                    trackColor={{ false: '#DDD', true: '#D4AF37' }}
                                                    thumbColor="#FFF"
                                                />
                                            )}

                                            {item.type === 'label' && (
                                                <Text style={styles.itemValue}>{item.value}</Text>
                                            )}

                                            {item.type === 'button' && (
                                                <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                            )}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}

                        <View style={styles.footer}>
                            <Text style={styles.version}>A1 Temple Studio v2.4.0</Text>
                            <Text style={styles.copyright}>© 2026 A1 Architecture Group</Text>
                        </View>
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
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginLeft: 10, marginBottom: 12 },
    sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
    settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F8F8F8' },
    itemTitle: { fontSize: 15, fontWeight: '700', color: '#333' },
    itemValue: { fontSize: 14, color: '#999', fontWeight: '600' },
    footer: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
    version: { fontSize: 12, color: '#BBB', fontWeight: '700', marginBottom: 4 },
    copyright: { fontSize: 11, color: '#DDD', fontWeight: '600' },
});

export default SettingsScreen;
