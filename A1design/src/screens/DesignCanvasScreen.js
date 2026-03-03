import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Animated,
    Dimensions,
    PanResponder,
    Alert,
    Image,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const DesignCanvasScreen = ({ navigation, route }) => {
    // Multi-stroke state
    const [strokes, setStrokes] = useState([]);
    const [currentStroke, setCurrentStroke] = useState([]);

    // Tools state
    const [color, setColor] = useState('#C62828');
    const [strokeWidth, setStrokeWidth] = useState(4);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Load project if passed from navigation
        if (route.params?.project) {
            const project = route.params.project;
            try {
                const loadedStrokes = typeof project.strokes === 'string'
                    ? JSON.parse(project.strokes)
                    : project.strokes;
                setStrokes(loadedStrokes || []);
            } catch (err) {
                console.error("Load strokes error:", err);
                setStrokes([]);
            }
        }
    }, [route.params]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                setCurrentStroke([{ x: locationX, y: locationY }]);
            },
            onPanResponderMove: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                setCurrentStroke((prev) => [...prev, { x: locationX, y: locationY }]);
            },
            onPanResponderRelease: () => {
                if (currentStroke.length > 0) {
                    const newStroke = {
                        id: Date.now(),
                        points: currentStroke,
                        color: color,
                        size: strokeWidth,
                    };
                    setStrokes((prev) => [...prev, newStroke]);
                    setCurrentStroke([]);
                }
            },
        })
    ).current;

    const pointsToPath = (points) => {
        if (!points || points.length === 0) return '';
        const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        return d;
    };

    const handleUndo = () => {
        setStrokes((prev) => prev.slice(0, -1));
    };

    const handleClear = () => {
        Alert.alert(
            "Clear Canvas",
            "Are you sure you want to clear your design?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", onPress: () => setStrokes([]), style: "destructive" }
            ]
        );
    };

    const handleSave = async () => {
        try {
            const timestamp = new Date().getTime();
            const project = {
                id: timestamp,
                name: "A1 Project " + new Date().toLocaleDateString(),
                date: new Date().toLocaleDateString(),
                strokes: strokes || []
            };

            const stored = await AsyncStorage.getItem("A1_PROJECTS");
            const parsed = stored ? JSON.parse(stored) : [];
            const updated = [project, ...(Array.isArray(parsed) ? parsed : [])];

            await AsyncStorage.setItem("A1_PROJECTS", JSON.stringify(updated));
            Alert.alert("Success", "Design saved to recent projects!");
        } catch (error) {
            console.error("Save error:", error);
            Alert.alert("Error", "Failed to save project.");
        }
    };

    const ToolButton = ({ icon, onPress, active, red }) => (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.toolButton,
                { backgroundColor: active ? '#D4AF37' : '#F5F5F7' }
            ]}
        >
            <Ionicons name={icon} size={22} color={active ? '#FFF' : (red ? '#C62828' : '#333')} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Image
                        source={require('../../assets/a1logo.png')}
                        style={styles.headerLogo}
                        resizeMode="contain"
                        onError={() => console.log('Logo error')}
                    />
                    <Text style={styles.projectTitle}>Canvas Studio</Text>
                </View>
                <TouchableOpacity onPress={handleSave} style={styles.saveAction}>
                    <Ionicons name="cloud-upload-outline" size={24} color="#D4AF37" />
                </TouchableOpacity>
            </View>

            {/* Main Canvas Area */}
            <View style={styles.canvasWrapper}>
                <View style={styles.canvasContainer} {...panResponder.panHandlers}>
                    <Svg style={styles.canvas}>
                        {strokes.map((stroke) => (
                            <Path
                                key={stroke?.id}
                                d={pointsToPath(stroke?.points || [])}
                                stroke={stroke?.color || '#000'}
                                strokeWidth={stroke?.size || 4}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ))}
                        {currentStroke.length > 0 && (
                            <Path
                                d={pointsToPath(currentStroke)}
                                stroke={color}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}
                    </Svg>
                </View>

                {/* Floating Tool Panel */}
                <Animated.View style={[
                    styles.floatingTools,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateX: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }]
                    }
                ]}>
                    <ToolButton icon="arrow-undo-outline" onPress={handleUndo} />
                    <ToolButton icon="trash-outline" onPress={handleClear} />
                    <View style={styles.divider} />
                    <ToolButton icon="color-palette-outline" onPress={() => { }} active={false} />
                </Animated.View>
            </View>

            {/* Bottom Panel */}
            <Animated.View style={[
                styles.bottomPanel,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }]
                }
            ]}>
                <View style={styles.toolSection}>
                    <Text style={styles.toolLabel}>Brush Size</Text>
                    <View style={styles.brushOptions}>
                        {[2, 4, 8, 12].map((s) => (
                            <TouchableOpacity
                                key={s}
                                onPress={() => setStrokeWidth(s)}
                                style={[
                                    styles.sizeOption,
                                    { borderColor: strokeWidth === s ? '#D4AF37' : '#DDD' }
                                ]}
                            >
                                <View style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: '#333' }} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.toolSection}>
                    <Text style={styles.toolLabel}>Colors</Text>
                    <View style={styles.colorPalette}>
                        {['#C62828', '#D4AF37', '#1A1A1A', '#4CAF50', '#2196F3'].map((c) => (
                            <TouchableOpacity
                                key={c}
                                onPress={() => setColor(c)}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: c, borderColor: color === c ? '#FFF' : 'transparent' },
                                    color === c && styles.activeColor
                                ]}
                            />
                        ))}
                    </View>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    topBar: {
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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#333',
    },
    saveAction: {
        padding: 5,
    },
    canvasWrapper: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        position: 'relative',
    },
    canvasContainer: {
        flex: 1,
    },
    canvas: {
        flex: 1,
    },
    floatingTools: {
        position: 'absolute',
        right: 20,
        top: 20,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    toolButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 10,
        width: '80%',
        alignSelf: 'center',
    },
    bottomPanel: {
        padding: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    toolSection: {
        marginBottom: 20,
    },
    toolLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#777',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    brushOptions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sizeOption: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    colorPalette: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    colorOption: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        borderWidth: 3,
    },
    activeColor: {
        transform: [{ scale: 1.1 }],
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    }
});

export default DesignCanvasScreen;
