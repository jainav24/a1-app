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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SavedProjectsScreen = ({ navigation }) => {
    const projects = [
        { id: '1', title: 'Grand Shiva Temple', lastEdited: '2 hours ago', status: 'In Progress' },
        { id: '2', title: 'Modern Vedic Hall', lastEdited: 'Yesterday', status: 'Completed' },
        { id: '3', title: 'Zen Meditation Pavillion', lastEdited: '3 days ago', status: 'Draft' },
        { id: '4', title: 'Himalayan Retreat', lastEdited: '1 week ago', status: 'Archived' },
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
                    colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.9)']}
                    style={StyleSheet.absoluteFill}
                />

                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={28} color="#1a1a1a" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Saved Projects</Text>
                        <TouchableOpacity style={styles.headerAction}>
                            <Ionicons name="search-outline" size={24} color="#1a1a1a" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {projects.map((project) => (
                            <TouchableOpacity
                                key={project.id}
                                style={styles.projectCard}
                                onPress={() => navigation.navigate('ProjectDetailScreen', { project })}
                            >
                                <View style={styles.previewContainer}>
                                    <View style={styles.blueprintGrid} />
                                    <Ionicons name="cube-outline" size={40} color="#D4AF37" />
                                </View>
                                <View style={styles.projectInfo}>
                                    <Text style={styles.projectTitle}>{project.title}</Text>
                                    <Text style={styles.lastEdited}>Edited {project.lastEdited}</Text>
                                    <View style={[styles.statusBadge, {
                                        backgroundColor: project.status === 'Completed' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(212, 175, 55, 0.1)'
                                    }]}>
                                        <Text style={[styles.statusText, {
                                            color: project.status === 'Completed' ? '#2E7D32' : '#D4AF37'
                                        }]}>{project.status}</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#CCC" />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('DesignCanvasScreen')}>
                        <LinearGradient colors={['#C42D2D', '#8B1E1E']} style={styles.fabGradient}>
                            <Ionicons name="add" size={32} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>
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
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 8 },
    projectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    previewContainer: {
        width: 110,
        height: 110,
        borderRadius: 14,
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        overflow: 'hidden',
    },
    blueprintGrid: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        borderWidth: 1,
        borderColor: '#D4AF37',
        borderStyle: 'dashed',
    },
    projectInfo: { flex: 1, paddingTop: 8 },
    projectTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
    lastEdited: { fontSize: 12, color: '#777', marginBottom: 8 },
    statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: '700' },
    progressBarBg: {
        height: 4,
        backgroundColor: '#F1F1F1',
        borderRadius: 2,
        width: '100%',
        marginTop: 4,
        overflow: 'hidden',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 64,
        height: 64,
        borderRadius: 32,
        shadowColor: '000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    fabGradient: { flex: 1, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
});

export default SavedProjectsScreen;
