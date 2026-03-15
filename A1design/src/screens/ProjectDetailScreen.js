import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    StatusBar,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ProjectDetailScreen = ({ route, navigation }) => {
    const { project } = route.params || { project: { title: 'New Template' } };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={require('../../assets/temple_hero.png')}
                style={styles.heroImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={28} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Project Details</Text>
                        <TouchableOpacity style={styles.headerAction}>
                            <Ionicons name="share-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.detailCard}>
                            <Text style={styles.projectTitle}>{project.title}</Text>
                            <Text style={styles.projectMeta}>Updated {project.lastEdited || 'Recently'}</Text>

                            <View style={styles.actionGrid}>
                                <TouchableOpacity
                                    style={styles.actionItem}
                                    onPress={() => navigation.navigate('DesignCanvasScreen', { project })}
                                >
                                    <View style={[styles.actionIcon, { backgroundColor: 'rgba(196, 45, 45, 0.1)' }]}>
                                        <Ionicons name="brush" size={24} color="#C42D2D" />
                                    </View>
                                    <Text style={styles.actionLabel}>Edit Design</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionItem}>
                                    <View style={[styles.actionIcon, { backgroundColor: 'rgba(212, 175, 55, 0.1)' }]}>
                                        <Ionicons name="copy-outline" size={24} color="#D4AF37" />
                                    </View>
                                    <Text style={styles.actionLabel}>Duplicate</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionItem}>
                                    <View style={[styles.actionIcon, { backgroundColor: 'rgba(102, 102, 102, 0.1)' }]}>
                                        <Ionicons name="eye-outline" size={24} color="#666" />
                                    </View>
                                    <Text style={styles.actionLabel}>Full Preview</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionItem}>
                                    <View style={[styles.actionIcon, { backgroundColor: 'rgba(196, 45, 45, 0.05)' }]}>
                                        <Ionicons name="trash-outline" size={24} color="#C42D2D" style={{ opacity: 0.6 }} />
                                    </View>
                                    <Text style={[styles.actionLabel, { opacity: 0.6 }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.infoSection}>
                                <Text style={styles.sectionHeading}>Technical Spec</Text>
                                <View style={styles.specRow}>
                                    <Text style={styles.specLabel}>Architecture Type</Text>
                                    <Text style={styles.specValue}>Vedic Classical</Text>
                                </View>
                                <View style={styles.specRow}>
                                    <Text style={styles.specLabel}>Main Material</Text>
                                    <Text style={styles.specValue}>Pink Sandstone</Text>
                                </View>
                                <View style={styles.specRow}>
                                    <Text style={styles.specLabel}>Estimated Area</Text>
                                    <Text style={styles.specValue}>12,400 sq.ft</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F5F0' },
    heroImage: { flex: 1 },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '600', color: '#FFF' },
    headerAction: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
    content: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 40 },
    detailCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 10,
    },
    projectTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
    projectMeta: { fontSize: 12, color: '#777', marginBottom: 24 },
    actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    actionItem: { alignItems: 'center', width: '22%' },
    actionIcon: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    actionLabel: { fontSize: 11, fontWeight: '800', color: '#333', textAlign: 'center' },
    infoSection: { borderTopWidth: 1, borderTopColor: '#F1F1F1', paddingTop: 24 },
    sectionHeading: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 16 },
    specRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    specLabel: { fontSize: 14, color: '#777', fontWeight: '500' },
    specValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '700' },
});

export default ProjectDetailScreen;
