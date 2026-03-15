import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
    PanResponder,
    Alert,
    TextInput,
    Modal,
    Pressable,
} from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    runOnJS,
    useAnimatedProps 
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Line, G } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedLine = Animated.createAnimatedComponent(Line);

// --- SVG ASSET IMPORTS (imported as React components via transformer) ---
import Pillar1 from '../../assets/integrate/pillar/pillar1.svg';
import Patti1 from '../../assets/integrate/patti/patti1.svg';
import Chaat1 from '../../assets/integrate/chaat/chaat1.svg';
import Bg1 from '../../assets/integrate/background/bg1.svg';

const { width, height } = Dimensions.get('window');
const ASYNC_STORAGE_KEY = 'A1_PROJECTS';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

// --- ASSET LIBRARY STRUCTURE ---
const ASSET_LIBRARY = {
    pillar: [{ id: 'pillar1', name: 'Temple Pillar', component: Pillar1 }],
    patti: [{ id: 'patti1', name: 'Golden Patti', component: Patti1 }],
    chaat: [{ id: 'chaat1', name: 'Classic Chaat', component: Chaat1 }],
    background: [{ id: 'bg1', name: 'Marble Floor', component: Bg1 }],
};

const ASSET_CATEGORIES = [
    { id: 'pillar', name: 'Pillar', icon: 'pillar' },
    { id: 'patti', name: 'Patti', icon: 'border-bottom-variant' },
    { id: 'chaat', name: 'Chaat', icon: 'texture-box' },
    { id: 'background', name: 'Background', icon: 'image-filter-hdr' },
];

const COLORS = [
    { id: 'black', value: '#1a1a1a' },
    { id: 'red', value: '#FF3B30' },
    { id: 'gold', value: '#D4AF37' },
    { id: 'blue', value: '#007AFF' },
];

const DesignCanvasScreen = ({ navigation, route }) => {
    const projectInfo = route.params?.project || { id: generateId(), title: 'Untitled Temple' };

    // --- CORE STATE ---
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [activeTool, setActiveTool] = useState('select'); // select, move, rect, circle, line, insert
    const [canvasScale, setCanvasScale] = useState(1);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [historyStack, setHistoryStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [selectedColor, setSelectedColor] = useState('#D4AF37');

    // --- REANIMATED SHARED VALUES ---
    const scaleShared = useSharedValue(1);
    const offsetXShared = useSharedValue(0);
    const offsetYShared = useSharedValue(0);
    
    // Shared value map for objects: { [id]: { x, y, w, h } }
    const svMap = useRef(new Map()).current;

    // --- UI STATE ---
    const [projectTitle, setProjectTitle] = useState(projectInfo.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    // --- REFS ---
    const objectsRef = useRef([]);
    const panStartRef = useRef({ x: 0, y: 0 });
    const originalObjectRef = useRef(null);
    const interactionMode = useRef(null);
    const drawingObjectIdRef = useRef(null);

    // --- ASSET COMPONENT MAPPING (Safeguard against serializability issues) ---
    const getAssetComponent = useCallback((id) => {
        for (const cat in ASSET_LIBRARY) {
            const asset = ASSET_LIBRARY[cat].find(a => a.id === id);
            if (asset) return asset.component;
        }
        return null;
    }, []);

    useEffect(() => { objectsRef.current = objects; }, [objects]);

    // --- TOAST LOGIC ---
    const showToast = useCallback((msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 2000);
    }, []);

    // --- LOAD & SAVE ---
    useEffect(() => {
        const load = async () => {
            try {
                const data = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
                if (data) {
                    const projects = JSON.parse(data);
                    const current = projects.find(p => p.id === projectInfo.id);
                    if (current?.objects) {
                        const restored = current.objects.map(obj => {
                            if (obj.type === 'asset' && obj.assetId) {
                                for (const cat in ASSET_LIBRARY) {
                                    const asset = ASSET_LIBRARY[cat].find(a => a.id === obj.assetId);
                                    if (asset) return { ...obj, component: asset.component };
                                }
                            }
                            return obj;
                        });
                        setObjects(restored);
                    }
                    if (current?.title) setProjectTitle(current.title);
                }
            } catch (e) {
                console.error('Load error', e);
            }
        };
        load();
    }, [projectInfo.id]);

    const saveProject = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
            let projects = data ? JSON.parse(data) : [];
            const serializable = objects.map(({ component, ...rest }) => rest);
            const toSave = { ...projectInfo, title: projectTitle, objects: serializable, updatedAt: new Date().toISOString() };
            const idx = projects.findIndex(p => p.id === projectInfo.id);
            if (idx !== -1) projects[idx] = toSave; else projects.push(toSave);
            await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(projects));
            showToast('Design Saved');
        } catch (e) {
            Alert.alert('Error', 'Could not save project.');
        }
    }, [objects, projectInfo, projectTitle, showToast]);

    // --- HISTORY ---
    const saveToHistory = useCallback((state) => {
        setHistoryStack(prev => [...prev.slice(-19), state]);
        setRedoStack([]);
    }, []);

    const undo = useCallback(() => {
        if (historyStack.length === 0) return;
        setRedoStack(prev => [...prev, objects]);
        setObjects(historyStack[historyStack.length - 1]);
        setHistoryStack(prev => prev.slice(0, -1));
        setSelectedObjectId(null);
    }, [historyStack, objects]);

    const redo = useCallback(() => {
        if (redoStack.length === 0) return;
        setHistoryStack(prev => [...prev, objects]);
        setObjects(redoStack[redoStack.length - 1]);
        setRedoStack(prev => prev.slice(0, -1));
        setSelectedObjectId(null);
    }, [redoStack, objects]);

    // --- SHARED STYLES ---
    const canvasAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: offsetXShared.value },
            { translateY: offsetYShared.value },
            { scale: scaleShared.value }
        ]
    }));

    // --- INTERACTIONS ---
    const screenToCanvas = useCallback((sx, sy) => ({
        x: (sx - offsetXShared.value) / scaleShared.value,
        y: (sy - offsetYShared.value) / scaleShared.value,
    }), [offsetXShared, offsetYShared, scaleShared]);

    const findHitObject = useCallback((cx, cy) => {
        return [...objectsRef.current].reverse().find(obj => {
            if (obj.type === 'circle') {
                const dx = cx - (obj.x + obj.width / 2);
                const dy = cy - (obj.y + obj.height / 2);
                return Math.sqrt(dx * dx + dy * dy) <= Math.max(obj.width, obj.height) / 2;
            }
            return cx >= obj.x && cx <= obj.x + obj.width && cy >= obj.y && cy <= obj.y + obj.height;
        });
    }, []);

    const addAsset = useCallback((asset) => {
        saveToHistory(objectsRef.current);
        const centerX = (width / 2 - canvasOffset.x) / canvasScale - 45;
        const centerY = (height / 3 - canvasOffset.y) / canvasScale - 45;
        const newObj = {
            id: generateId(), type: 'asset', assetId: asset.id,
            x: centerX, y: centerY, width: 90, height: 90, rotation: 0,
            strokeColor: '#D4AF37', strokeWidth: 2, fillColor: 'transparent',
            layerIndex: objectsRef.current.length
        };
        setObjects(prev => [...prev, newObj]);
        setSelectedObjectId(newObj.id);
        setActiveCategory(null);
        setActiveTool('select'); 
        showToast('Asset added');
    }, [canvasOffset, canvasScale, saveToHistory, showToast]);

    const updateSelectedColor = useCallback((color) => {
        setSelectedColor(color);
        if (!selectedObjectId) return;
        saveToHistory(objects);
        setObjects(prev => prev.map(o => {
            if (o.id !== selectedObjectId) return o;
            const isShape = ['rect', 'circle', 'line'].includes(o.type);
            return { 
                ...o, 
                strokeColor: color,
                fillColor: isShape ? color : o.fillColor
            };
        }));
        showToast('Color updated');
    }, [selectedObjectId, objects, saveToHistory, showToast]);

    const handleCanvasTap = useCallback((e) => {
        if (activeTool === 'select' || activeTool === 'move') return;
        
        const { locationX, locationY } = e.nativeEvent;
        // Adjust for relative coordinates in scaled/translated space
        const pt = {
            x: (locationX - offsetXShared.value) / scaleShared.value,
            y: (locationY - offsetYShared.value) / scaleShared.value
        };
        
        saveToHistory(objectsRef.current);
        const newObj = {
            id: generateId(), 
            type: activeTool,
            x: pt.x - 60, 
            y: pt.y - 60, 
            width: 120, 
            height: 120, 
            rotation: 0,
            strokeColor: selectedColor, 
            strokeWidth: 2, 
            fillColor: activeTool === 'line' ? 'transparent' : 'transparent',
            layerIndex: objectsRef.current.length
        };
        
        setObjects(prev => [...prev, newObj]);
        setSelectedObjectId(newObj.id);
        setActiveTool('select');
        showToast(`${activeTool} added`);
    }, [activeTool, selectedColor, offsetXShared, offsetYShared, scaleShared, saveToHistory, showToast]);

    // --- GESTURES ---
    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => activeTool === 'select' || activeTool === 'move',
        onPanResponderGrant: (evt, gesture) => {
            const { locationX, locationY } = evt.nativeEvent;
            const pt = {
                x: (locationX - offsetXShared.value) / scaleShared.value,
                y: (locationY - offsetYShared.value) / scaleShared.value
            };
            panStartRef.current = pt;

            if (activeTool === 'select') {
                if (selectedObjectId) {
                    const obj = objectsRef.current.find(o => o.id === selectedObjectId);
                    if (obj) {
                        const h = 15 / scaleShared.value;
                        if (Math.abs(pt.x - obj.x) < h && Math.abs(pt.y - obj.y) < h) interactionMode.current = 'resizing_tl';
                        else if (Math.abs(pt.x - (obj.x + obj.width)) < h && Math.abs(pt.y - obj.y) < h) interactionMode.current = 'resizing_tr';
                        else if (Math.abs(pt.x - obj.x) < h && Math.abs(pt.y - (obj.y + obj.height)) < h) interactionMode.current = 'resizing_bl';
                        else if (Math.abs(pt.x - (obj.x + obj.width)) < h && Math.abs(pt.y - (obj.y + obj.height)) < h) interactionMode.current = 'resizing_br';
                        
                        if (interactionMode.current) { originalObjectRef.current = { ...obj }; return; }
                        if (pt.x >= obj.x && pt.x <= obj.x + obj.width && pt.y >= obj.y && pt.y <= obj.y + obj.height) {
                            originalObjectRef.current = { ...obj }; interactionMode.current = 'moving'; return;
                        }
                    }
                }
                const hit = findHitObject(pt.x, pt.y);
                if (hit) { setSelectedObjectId(hit.id); originalObjectRef.current = { ...hit }; interactionMode.current = 'moving'; }
                else { setSelectedObjectId(null); interactionMode.current = 'panning'; }
            } else if (activeTool === 'move') {
                interactionMode.current = 'panning';
            }
        },
        onPanResponderMove: (evt, gesture) => {
            const { locationX, locationY } = evt.nativeEvent;
            const pt = screenToCanvas(locationX, locationY);
            const dx = pt.x - panStartRef.current.x;
            const dy = pt.y - panStartRef.current.y;

            if (interactionMode.current === 'drawing' && drawingObjectIdRef.current) {
                const drawTarget = objectsRef.current.find(o => o.id === drawingObjectIdRef.current);
                const sv = svMap.get(drawingObjectIdRef.current);
                if (sv) {
                    if (drawTarget?.type === 'line') {
                        sv.w.value = dx; sv.h.value = dy;
                    } else {
                        sv.w.value = Math.abs(dx); sv.h.value = Math.abs(dy);
                        sv.x.value = dx > 0 ? panStartRef.current.x : pt.x;
                        sv.y.value = dy > 0 ? panStartRef.current.y : pt.y;
                    }
                }
            } else if (interactionMode.current === 'moving' && selectedObjectId) {
                const sv = svMap.get(selectedObjectId);
                if (sv && originalObjectRef.current) {
                    sv.x.value = originalObjectRef.current.x + dx;
                    sv.y.value = originalObjectRef.current.y + dy;
                }
            } else if (interactionMode.current?.startsWith('resizing') && selectedObjectId) {
                const mode = interactionMode.current;
                const orig = originalObjectRef.current;
                const sv = svMap.get(selectedObjectId);
                if (sv && orig) {
                    let { x: nx, y: ny, width: nw, height: nh } = orig;
                    if (mode === 'resizing_br') { nw = Math.max(5, orig.width + dx); nh = Math.max(5, orig.height + dy); }
                    else if (mode === 'resizing_tl') { nx = orig.x + dx; ny = orig.y + dy; nw = Math.max(5, orig.width - dx); nh = Math.max(5, orig.height - dy); }
                    else if (mode === 'resizing_tr') { ny = orig.y + dy; nw = Math.max(5, orig.width + dx); nh = Math.max(5, orig.height - dy); }
                    else if (mode === 'resizing_bl') { nx = orig.x + dx; nw = Math.max(5, orig.width - dx); nh = Math.max(5, orig.height + dy); }
                    sv.x.value = nx; sv.y.value = ny; sv.w.value = nw; sv.h.value = nh;
                }
            } else if (interactionMode.current === 'panning') {
                offsetXShared.value += gesture.vx * 10;
                offsetYShared.value += gesture.vy * 10;
            }
        },
        onPanResponderRelease: () => {
            if (interactionMode.current === 'moving' || interactionMode.current?.startsWith('resizing') || interactionMode.current === 'drawing') {
                // Sync back to React state to persist changes
                const id = drawingObjectIdRef.current || selectedObjectId;
                const sv = svMap.get(id);
                if (sv) {
                    setObjects(prev => prev.map(o => o.id === id ? { ...o, x: sv.x.value, y: sv.y.value, width: sv.w.value, height: sv.h.value } : o));
                }
            } else if (interactionMode.current === 'panning') {
                setCanvasOffset({ x: offsetXShared.value, y: offsetYShared.value });
            }
            interactionMode.current = null;
            originalObjectRef.current = null;
            drawingObjectIdRef.current = null;
        }
    })).current;

    // --- RENDERING ---
    const AnimatedObject = ({ obj, getAssetComponent, svMap }) => {
        const x = useSharedValue(obj.x);
        const y = useSharedValue(obj.y);
        const w = useSharedValue(obj.width || 0);
        const h = useSharedValue(obj.height || 0);

        // Register shared values in the parent map so the PanResponder can drive them
        useEffect(() => {
            svMap.set(obj.id, { x, y, w, h });
            return () => svMap.delete(obj.id);
        }, [obj.id, x, y, w, h, svMap]);

        // Sync shared values if React state changes externally
        useEffect(() => {
            x.value = obj.x;
            y.value = obj.y;
            w.value = obj.width || 0;
            h.value = obj.height || 0;
        }, [obj.x, obj.y, obj.width, obj.height]);

        const animatedStyle = useAnimatedStyle(() => {
            const isLine = obj.type === 'line';
            const left = isLine ? Math.min(x.value, x.value + w.value) : x.value;
            const top = isLine ? Math.min(y.value, y.value + h.value) : y.value;
            const width = isLine ? Math.max(1, Math.abs(w.value)) : Math.max(1, w.value);
            const height = isLine ? Math.max(1, Math.abs(h.value)) : Math.max(1, h.value);

            return {
                position: 'absolute',
                left,
                top,
                width,
                height,
                transform: [{ rotate: `${obj.rotation || 0}deg` }]
            };
        });

        const common = { stroke: obj.strokeColor, strokeWidth: obj.strokeWidth, fill: obj.fillColor };
        
        const animatedLineProps = useAnimatedProps(() => ({
            x1: w.value >= 0 ? 0 : Math.abs(w.value),
            y1: h.value >= 0 ? 0 : Math.abs(h.value),
            x2: w.value >= 0 ? Math.abs(w.value) : 0,
            y2: h.value >= 0 ? Math.abs(h.value) : 0
        }));

        const renderContent = () => {
            switch (obj.type) {
                case 'rect': return <Svg width="100%" height="100%"><Rect x="0" y="0" width="100%" height="100%" {...common} /></Svg>;
                case 'circle': return <Svg width="100%" height="100%"><Circle cx="50%" cy="50%" r="50%" {...common} /></Svg>;
                case 'line': 
                    return (
                        <Svg width="100%" height="100%">
                            <AnimatedLine 
                                animatedProps={animatedLineProps}
                                {...common}
                            />
                        </Svg>
                    );
                case 'asset':
                    const Comp = getAssetComponent(obj.assetId);
                    if (!Comp || (typeof Comp !== 'function' && typeof Comp !== 'object')) return null;
                    return <Comp width="100%" height="100%" />;
                default: return null;
            }
        };

        return (
            <Animated.View style={animatedStyle} pointerEvents="none">
                {renderContent()}
            </Animated.View>
        );
    };

    const renderObject = useCallback((obj) => {
        return <AnimatedObject key={obj.id} obj={obj} getAssetComponent={getAssetComponent} svMap={svMap} />;
    }, [getAssetComponent, svMap]);

    const SelectionBox = ({ id, svMap }) => {
        const sv = svMap.get(id);
        if (!sv) return null;

        const boxStyle = useAnimatedStyle(() => ({
            position: 'absolute',
            left: sv.x.value - 2,
            top: sv.y.value - 2,
            width: sv.w.value + 4,
            height: sv.h.value + 4,
            borderWidth: 1,
            borderColor: '#D4AF37',
            borderStyle: 'dashed',
            backgroundColor: 'rgba(212, 175, 55, 0.05)',
        }));

        const handleStyle = (corner) => useAnimatedStyle(() => {
            let left = 0, top = 0;
            if (corner === 'tl') { left = -7; top = -7; }
            else if (corner === 'tr') { left = sv.w.value - 7 + 4; top = -7; }
            else if (corner === 'bl') { left = -7; top = sv.h.value - 7 + 4; }
            else if (corner === 'br') { left = sv.w.value - 7 + 4; top = sv.h.value - 7 + 4; }
            return {
                position: 'absolute',
                left,
                top,
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: '#FFF',
                borderWidth: 2,
                borderColor: '#D4AF37',
            };
        });

        return (
            <Animated.View style={boxStyle} pointerEvents="none">
                <Animated.View style={handleStyle('tl')} />
                <Animated.View style={handleStyle('tr')} />
                <Animated.View style={handleStyle('bl')} />
                <Animated.View style={handleStyle('br')} />
            </Animated.View>
        );
    };

    const projectGrid = useMemo(() => (
        <Animated.View style={[styles.gridOverlay, canvasAnimatedStyle]}>
            {[...Array(15)].map((_, i) => <View key={`v-${i}`} style={[styles.gridLineV, { left: (i * width) / 10 }]} />)}
            {[...Array(30)].map((_, i) => <View key={`h-${i}`} style={[styles.gridLineH, { top: (i * width) / 10 }]} />)}
        </Animated.View>
    ), [canvasAnimatedStyle]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                        <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        {isEditingTitle ? (
                            <TextInput style={styles.titleInput} value={projectTitle} onChangeText={setProjectTitle} onBlur={() => setIsEditingTitle(false)} autoFocus />
                        ) : (
                            <Pressable onPress={() => setIsEditingTitle(true)} style={styles.titlePress}>
                                <Text style={styles.projectTitle}>{projectTitle}</Text>
                                <Ionicons name="pencil" size={14} color="#D4AF37" style={{ marginLeft: 6 }} />
                            </Pressable>
                        )}
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={undo} disabled={historyStack.length === 0} style={styles.actionIcon}>
                            <Ionicons name="arrow-undo" size={22} color={historyStack.length > 0 ? "#1a1a1a" : "#CCC"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={redo} disabled={redoStack.length === 0} style={[styles.actionIcon, { marginLeft: 12 }]}>
                            <Ionicons name="arrow-redo" size={22} color={redoStack.length > 0 ? "#1a1a1a" : "#CCC"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={saveProject} style={styles.saveBtn}>
                            <Ionicons name="save-outline" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* WORKSPACE */}
                <View style={styles.workspaceArea} {...panResponder.panHandlers}>
                    {projectGrid}
                    {objects.length === 0 && (
                        <View style={styles.emptyMsg}>
                            <MaterialCommunityIcons name="image-outline" size={80} color="rgba(212, 175, 55, 0.1)" />
                            <Text style={styles.emptyText}>Temple Design Workspace</Text>
                        </View>
                    )}
                    
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleCanvasTap}>
                        <Animated.View style={[StyleSheet.absoluteFill, canvasAnimatedStyle]}>
                            {objects.sort((a,b) => a.layerIndex - b.layerIndex).map(renderObject)}
                            {selectedObjectId && <SelectionBox id={selectedObjectId} svMap={svMap} />}
                        </Animated.View>
                    </Pressable>

                    {/* TOOLS */}
                    <View style={styles.sidebar}>
                        {[
                            { id: 'select', icon: 'cursor-default' },
                            { id: 'move', icon: 'arrow-all' },
                            { id: 'rect', icon: 'shape-rectangle-plus' },
                            { id: 'circle', icon: 'vector-circle' },
                            { id: 'line', icon: 'vector-line' },
                            { id: 'color', icon: 'palette' },
                        ].map(t => (
                            <TouchableOpacity key={t.id} style={[styles.toolIcon, activeTool === t.id && styles.toolActive]} onPress={() => { setActiveTool(t.id); setSelectedObjectId(null); }}>
                                <MaterialCommunityIcons name={t.icon} size={24} color={activeTool === t.id ? '#FFF' : '#666'} />
                            </TouchableOpacity>
                        ))}
                        {selectedObjectId && (
                            <TouchableOpacity style={[styles.toolIcon, { backgroundColor: '#FF3B30', marginTop: 10 }]} onPress={() => { saveToHistory(objects); setObjects(prev => prev.filter(o => o.id !== selectedObjectId)); setSelectedObjectId(null); }}>
                                <Ionicons name="trash-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* ZOOM */}
                    <View style={styles.zoomControls}>
                        <TouchableOpacity style={styles.zoomItem} onPress={() => { scaleShared.value = Math.min(scaleShared.value + 0.1, 3); setCanvasScale(scaleShared.value); }}>
                            <Ionicons name="add" size={20} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.zoomItem} onPress={() => { scaleShared.value = Math.max(scaleShared.value - 0.1, 0.5); setCanvasScale(scaleShared.value); }}>
                            <Ionicons name="remove" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* COLOR TOOLBAR (Only show when object selected) */}
                    {selectedObjectId && (
                        <View style={styles.colorToolbar}>
                            {COLORS.map(c => (
                                <TouchableOpacity 
                                    key={c.id} 
                                    style={[styles.colorChip, { backgroundColor: c.value }]} 
                                    onPress={() => updateSelectedColor(c.value)}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* CATEGORIES */}
                <View style={styles.footer}>
                    <Text style={styles.footerLabel}>Temple Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryWrap}>
                        {ASSET_CATEGORIES.map(cat => (
                            <TouchableOpacity key={cat.id} style={styles.folderTile} onPress={() => setActiveCategory(cat.id)}>
                                <View style={styles.folderBox}><MaterialCommunityIcons name={cat.icon} size={30} color="#D4AF37" /></View>
                                <Text style={styles.folderTxt}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* TOAST */}
                {toastMessage ? (
                    <View style={styles.toastContainer}>
                        <Text style={styles.toastText}>{toastMessage}</Text>
                    </View>
                ) : null}

                {/* ELEMENTS MODAL */}
                <Modal visible={!!activeCategory} transparent animationType="slide" onRequestClose={() => setActiveCategory(null)}>
                    <Pressable style={styles.overlay} onPress={() => setActiveCategory(null)}>
                        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
                            <View style={styles.handle} />
                            <Text style={styles.sheetTitle}>Select {activeCategory}</Text>
                            <ScrollView contentContainerStyle={styles.grid}>
                                {(ASSET_LIBRARY[activeCategory] || []).map(el => {
                                    const Preview = el.component;
                                    // Robust check for preview rendering
                                    const isValid = Preview && (typeof Preview === 'function' || typeof Preview === 'object');
                                    
                                    return (
                                        <TouchableOpacity key={el.id} style={styles.gridCard} onPress={() => addAsset(el)}>
                                            <View style={styles.previewBox}>
                                                {isValid ? (
                                                    <Svg width="40" height="40" viewBox="0 0 100 100">
                                                        <Preview width="100" height="100" />
                                                    </Svg>
                                                ) : (
                                                    <Ionicons name="image-outline" size={24} color="#CCC" />
                                                )}
                                            </View>
                                            <Text style={styles.gridName}>{el.name}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </Pressable>
                </Modal>

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    safeArea: { flex: 1 },
    header: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    headerBtn: { padding: 4 },
    titleContainer: { flex: 1, alignItems: 'center' },
    titlePress: { flexDirection: 'row', alignItems: 'center' },
    projectTitle: { fontSize: 17, fontWeight: '900', color: '#1a1a1a' },
    titleInput: { fontSize: 17, fontWeight: '900', color: '#D4AF37', borderBottomWidth: 1, borderBottomColor: '#D4AF37', textAlign: 'center', minWidth: 120 },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    actionIcon: { padding: 4 },
    saveBtn: { backgroundColor: '#D4AF37', padding: 8, paddingHorizontal: 16, borderRadius: 12, marginLeft: 16 },
    workspaceArea: { flex: 1, backgroundColor: '#FAF9F6', overflow: 'hidden' },
    gridOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.05 },
    gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#DDD' },
    gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#DDD' },
    emptyMsg: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    emptyText: { marginTop: 15, fontSize: 15, fontWeight: '700', color: '#D4AF37', opacity: 0.4 },
    sidebar: { position: 'absolute', right: 16, top: 16, backgroundColor: '#FFF', borderRadius: 20, padding: 6, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    toolIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
    toolActive: { backgroundColor: '#D4AF37' },
    zoomControls: { position: 'absolute', left: 16, bottom: 16, backgroundColor: '#FFF', borderRadius: 12, padding: 4, elevation: 5 },
    zoomItem: { width: 34, height: 34, justifyContent: 'center', alignItems: 'center' },
    footer: { padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    footerLabel: { fontSize: 15, fontWeight: '900', color: '#1a1a1a', marginBottom: 15 },
    categoryWrap: { gap: 16, paddingRight: 20 },
    folderTile: { width: 85, alignItems: 'center' },
    folderBox: { width: 68, height: 68, borderRadius: 18, backgroundColor: '#FDFCF9', justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#F5F5F5' },
    folderTxt: { fontSize: 11, fontWeight: '800', color: '#666' },
    toastContainer: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, zIndex: 100 },
    toastText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, minHeight: height * 0.4 },
    handle: { width: 40, height: 5, backgroundColor: '#DDD', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    sheetTitle: { fontSize: 18, fontWeight: '900', color: '#1a1a1a', marginBottom: 20, textTransform: 'capitalize' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    gridCard: { width: (width - 80) / 3, alignItems: 'center', marginBottom: 16 },
    previewBox: { width: 75, height: 75, borderRadius: 15, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#F0F0F0' },
    gridName: { fontSize: 11, fontWeight: '700', color: '#666', textAlign: 'center' },
    colorToolbar: { position: 'absolute', bottom: 20, right: 16, backgroundColor: '#FFF', borderRadius: 20, padding: 8, flexDirection: 'row', elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
    colorChip: { width: 30, height: 30, borderRadius: 15, marginHorizontal: 4, borderWidth: 1, borderColor: '#EEE' },
});

export default DesignCanvasScreen;
