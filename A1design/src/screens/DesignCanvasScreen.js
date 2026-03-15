import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Line, G } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASSET_LIBRARY, ASSET_CATEGORIES } from '../data/assetLibrary';

const { width, height } = Dimensions.get('window');
const ASYNC_STORAGE_KEY = 'A1_PROJECTS';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

const DesignCanvasScreen = ({ navigation, route }) => {
    const projectInfo = route.params?.project || { id: generateId(), title: 'Untitled Temple' };

    // --- CORE STATE ---
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [activeTool, setActiveTool] = useState('select');
    const [canvasScale, setCanvasScale] = useState(1);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [historyStack, setHistoryStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    // --- UI/UX STATE ---
    const [projectTitle, setProjectTitle] = useState(projectInfo.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null); 
    const [quickTab, setQuickTab] = useState('pens');

    // --- SETTINGS STATE ---
    const [strokeColor, setStrokeColor] = useState('#D4AF37');
    const [fillColor, setFillColor] = useState('transparent');
    const [strokeWidth, setStrokeWidth] = useState(2);

    // --- REFS ---
    const drawingObjectRef = useRef(null);
    const panStartRef = useRef({ x: 0, y: 0 });
    const originalObjectRef = useRef(null);
    const interactionMode = useRef(null);

    // --- LOAD & SAVE ---
    useEffect(() => {
        const load = async () => {
            try {
                const data = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
                if (data) {
                    const projects = JSON.parse(data);
                    const current = projects.find(p => p.id === projectInfo.id);
                    if (current?.objects) {
                        // We need to restore the component references for assets
                        // Since component references can't be saved in JSON, we match by id or source
                        // For this implementation, we assume assets added during this session are stored with a 'sourceId'
                        const restoredObjects = current.objects.map(obj => {
                            if (obj.type === 'asset' && obj.assetId) {
                                // Find component in library
                                for (const cat in ASSET_LIBRARY) {
                                    const asset = ASSET_LIBRARY[cat].find(a => a.id === obj.assetId);
                                    if (asset) return { ...obj, component: asset.component };
                                }
                            }
                            return obj;
                        });
                        setObjects(restoredObjects);
                    }
                    if (current?.title) setProjectTitle(current.title);
                }
            } catch (e) {
                console.error('Load error', e);
            }
        };
        load();
    }, []);

    const saveProject = async () => {
        try {
            const data = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
            let projects = data ? JSON.parse(data) : [];
            
            // Before saving, we remove the React component references which are non-serializable
            const serializableObjects = objects.map(({ component, ...rest }) => rest);
            
            const projectToSave = { 
                ...projectInfo, 
                title: projectTitle, 
                objects: serializableObjects, 
                updatedAt: new Date().toISOString() 
            };
            
            const idx = projects.findIndex(p => p.id === projectInfo.id);
            if (idx !== -1) projects[idx] = projectToSave; else projects.push(projectToSave);
            await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(projects));
            Alert.alert('Design Saved', 'Saved successfully.');
        } catch (e) {
            console.error('Save error', e);
        }
    };

    // --- UTILS ---
    const saveToHistory = useCallback((newState) => {
        setHistoryStack(prev => [...prev.slice(-19), newState]); 
        setRedoStack([]);
    }, []);

    const undo = () => {
        if (historyStack.length === 0) return;
        setRedoStack(prev => [...prev, objects]);
        const previous = historyStack[historyStack.length - 1];
        setObjects(previous);
        setHistoryStack(prev => prev.slice(0, -1));
        setSelectedObjectId(null);
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        setHistoryStack(prev => [...prev, objects]);
        const next = redoStack[redoStack.length - 1];
        setObjects(next);
        setRedoStack(prev => prev.slice(0, -1));
        setSelectedObjectId(null);
    };

    const screenToCanvas = (sx, sy) => ({
        x: (sx - canvasOffset.x) / canvasScale,
        y: (sy - 80 - canvasOffset.y) / canvasScale,
    });

    const findHitObject = (cx, cy) => {
        return [...objects].reverse().find(obj => {
            if (obj.type === 'circle') {
                const dx = cx - (obj.x + obj.width / 2);
                const dy = cy - (obj.y + obj.height / 2);
                return Math.sqrt(dx * dx + dy * dy) <= Math.max(obj.width, obj.height) / 2;
            }
            return cx >= obj.x && cx <= obj.x + obj.width && cy >= obj.y && cy <= obj.y + obj.height;
        });
    };

    const createNewObject = (type, x, y) => ({
        id: generateId(),
        type, 
        x, 
        y, 
        width: 0, 
        height: 0, 
        rotation: 0,
        strokeColor, 
        fillColor, 
        strokeWidth,
        layerIndex: objects.length,
    });

    const addAsset = (asset) => {
        saveToHistory(objects);
        const centerX = (width / 2 - canvasOffset.x) / canvasScale - 40;
        const centerY = (height / 3 - canvasOffset.y) / canvasScale - 40;
        
        const newAsset = {
            id: generateId(),
            type: "asset",
            assetId: asset.id,
            component: asset.component,
            x: centerX,
            y: centerY,
            width: 80,
            height: 80,
            rotation: 0,
            layerIndex: objects.length,
        };
        
        setObjects(prev => [...prev, newAsset]);
        setSelectedObjectId(newAsset.id);
        setActiveCategory(null);
        setActiveTool('select');
    };

    // --- GESTURE ---
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gesture) => {
            const { locationX, locationY } = evt.nativeEvent;
            const canvasPoint = screenToCanvas(locationX, locationY);
            panStartRef.current = canvasPoint;

            if (selectedObjectId) {
                const obj = objects.find(o => o.id === selectedObjectId);
                if (obj) {
                    const h = 15 / canvasScale;
                    if (Math.abs(canvasPoint.x - obj.x) < h && Math.abs(canvasPoint.y - obj.y) < h) interactionMode.current = 'resizing_tl';
                    else if (Math.abs(canvasPoint.x - (obj.x + obj.width)) < h && Math.abs(canvasPoint.y - obj.y) < h) interactionMode.current = 'resizing_tr';
                    else if (Math.abs(canvasPoint.x - obj.x) < h && Math.abs(canvasPoint.y - (obj.y + obj.height)) < h) interactionMode.current = 'resizing_bl';
                    else if (Math.abs(canvasPoint.x - (obj.x + obj.width)) < h && Math.abs(canvasPoint.y - (obj.y + obj.height)) < h) interactionMode.current = 'resizing_br';
                    
                    if (interactionMode.current) {
                        originalObjectRef.current = { ...obj };
                        return;
                    }
                }
            }

            if (activeTool === 'select') {
                const hit = findHitObject(canvasPoint.x, canvasPoint.y);
                if (hit) { 
                    setSelectedObjectId(hit.id); 
                    originalObjectRef.current = { ...hit }; 
                    interactionMode.current = 'moving'; 
                } else { 
                    setSelectedObjectId(null); 
                    interactionMode.current = 'panning'; 
                }
            } else if (activeTool !== 'move') {
                saveToHistory(objects);
                const newObj = createNewObject(activeTool, canvasPoint.x, canvasPoint.y);
                drawingObjectRef.current = newObj;
                setObjects(prev => [...prev, newObj]);
                setSelectedObjectId(newObj.id);
                interactionMode.current = 'drawing';
            } else {
                interactionMode.current = 'panning';
            }
        },
        onPanResponderMove: (evt, gesture) => {
            const { locationX, locationY } = evt.nativeEvent;
            const currentPoint = screenToCanvas(locationX, locationY);
            const dx = currentPoint.x - panStartRef.current.x;
            const dy = currentPoint.y - panStartRef.current.y;

            if (interactionMode.current === 'drawing' && drawingObjectRef.current) {
                setObjects(prev => prev.map(obj => obj.id === drawingObjectRef.current.id ? { ...obj, width: Math.abs(dx), height: Math.abs(dy), x: dx > 0 ? panStartRef.current.x : currentPoint.x, y: dy > 0 ? panStartRef.current.y : currentPoint.y } : obj));
            } else if (interactionMode.current === 'moving' && selectedObjectId && originalObjectRef.current) {
                setObjects(prev => prev.map(obj => obj.id === selectedObjectId ? { ...obj, x: originalObjectRef.current.x + dx, y: originalObjectRef.current.y + dy } : obj));
            } else if (interactionMode.current?.startsWith('resizing') && selectedObjectId && originalObjectRef.current) {
                const mode = interactionMode.current;
                const orig = originalObjectRef.current;
                setObjects(prev => prev.map(obj => {
                    if (obj.id !== selectedObjectId) return obj;
                    let { x, y, width, height } = orig;
                    if (mode === 'resizing_br') { width = Math.max(5, orig.width + dx); height = Math.max(5, orig.height + dy); }
                    else if (mode === 'resizing_tl') { x = orig.x + dx; y = orig.y + dy; width = Math.max(5, orig.width - dx); height = Math.max(5, orig.height - dy); }
                    else if (mode === 'resizing_tr') { y = orig.y + dy; width = Math.max(5, orig.width + dx); height = Math.max(5, orig.height - dy); }
                    else if (mode === 'resizing_bl') { x = orig.x + dx; width = Math.max(5, orig.width - dx); height = Math.max(5, orig.height + dy); }
                    return { ...obj, x, y, width, height };
                }));
            } else if (interactionMode.current === 'panning') {
                setCanvasOffset(prev => ({ x: prev.x + gesture.vx * 15, y: prev.y + gesture.vy * 15 }));
            }
        },
        onPanResponderRelease: () => { 
            interactionMode.current = null; 
            drawingObjectRef.current = null; 
            originalObjectRef.current = null; 
        }
    });

    const renderShape = (obj) => {
        const commonProps = { stroke: obj.strokeColor, strokeWidth: obj.strokeWidth, fill: obj.fillColor };
        switch (obj.type) {
            case 'rect': 
                return <Rect key={obj.id} {...commonProps} x={obj.x} y={obj.y} width={Math.max(1, obj.width)} height={Math.max(1, obj.height)} />;
            case 'circle': 
                return <Circle key={obj.id} {...commonProps} cx={obj.x + obj.width / 2} cy={obj.y + obj.height / 2} r={Math.max(1, (obj.width + obj.height) / 4)} />;
            case 'line': 
                return <Line key={obj.id} {...commonProps} x1={obj.x} y1={obj.y} x2={obj.x + obj.width} y2={obj.y + obj.height} />;
            case 'asset': 
                const Comp = obj.component;
                if (!Comp) return null;
                return (
                    <G key={obj.id} transform={`translate(${obj.x}, ${obj.y}) rotate(${obj.rotation || 0}, ${obj.width / 2}, ${obj.height / 2})`}>
                        <Comp width={obj.width} height={obj.height} />
                    </G>
                );
            default: return null;
        }
    };

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
                            <TextInput
                                style={styles.titleInput}
                                value={projectTitle}
                                onChangeText={setProjectTitle}
                                onBlur={() => setIsEditingTitle(false)}
                                autoFocus
                            />
                        ) : (
                            <Pressable onPress={() => setIsEditingTitle(true)} style={styles.titlePress}>
                                <Text style={styles.projectTitle}>{projectTitle}</Text>
                                <Ionicons name="create-outline" size={14} color="#D4AF37" style={{ marginLeft: 6 }} />
                            </Pressable>
                        )}
                    </View>

                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={undo} disabled={historyStack.length === 0} style={styles.actionIcon}>
                            <Ionicons name="arrow-undo-outline" size={22} color={historyStack.length > 0 ? "#1a1a1a" : "#CCC"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={redo} disabled={redoStack.length === 0} style={[styles.actionIcon, { marginLeft: 12 }]}>
                            <Ionicons name="arrow-redo-outline" size={22} color={redoStack.length > 0 ? "#1a1a1a" : "#CCC"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={saveProject} style={styles.saveBtn}>
                            <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* WORKSPACE */}
                <View style={styles.workspaceArea} {...panResponder.panHandlers}>
                    <View style={styles.gridOverlay}>
                        {[...Array(20)].map((_, i) => <View key={`v-${i}`} style={[styles.gridLineV, { left: (i * width) / 10 }]} />)}
                        {[...Array(40)].map((_, i) => <View key={`h-${i}`} style={[styles.gridLineH, { top: (i * width) / 10 }]} />)}
                    </View>

                    <Svg style={StyleSheet.absoluteFill}>
                        <G transform={`translate(${canvasOffset.x}, ${canvasOffset.y}) scale(${canvasScale})`}>
                            {objects.sort((a, b) => a.layerIndex - b.layerIndex).map(renderShape)}
                            {selectedObjectId && (() => {
                                const o = objects.find(obj => obj.id === selectedObjectId);
                                if (!o) return null;
                                return (
                                    <G>
                                        <Rect x={o.x - 2} y={o.y - 2} width={o.width + 4} height={o.height + 4} stroke="#D4AF37" strokeWidth="1" fill="none" strokeDasharray="4,4" />
                                        <Circle cx={o.x} cy={o.y} r={6 / canvasScale} fill="#FFF" stroke="#D4AF37" strokeWidth="1.5" />
                                        <Circle cx={o.x + o.width} cy={o.y} r={6 / canvasScale} fill="#FFF" stroke="#D4AF37" strokeWidth="1.5" />
                                        <Circle cx={o.x} cy={o.y + o.height} r={6 / canvasScale} fill="#FFF" stroke="#D4AF37" strokeWidth="1.5" />
                                        <Circle cx={o.x + o.width} cy={o.y + o.height} r={6 / canvasScale} fill="#FFF" stroke="#D4AF37" strokeWidth="1.5" />
                                    </G>
                                );
                            })()}
                        </G>
                    </Svg>

                    {/* FLOATING TOOLS */}
                    <View style={styles.floatingTools}>
                        {[
                            { id: 'select', icon: 'cursor-default' },
                            { id: 'move', icon: 'drag-variant' },
                            { id: 'rect', icon: 'shape-rectangle-plus' },
                            { id: 'circle', icon: 'vector-circle' },
                            { id: 'line', icon: 'format-line-style' },
                        ].map(t => (
                            <TouchableOpacity
                                key={t.id}
                                style={[styles.toolBtn, activeTool === t.id && styles.activeToolBtn]}
                                onPress={() => { setActiveTool(t.id); setSelectedObjectId(null); }}
                            >
                                <MaterialCommunityIcons 
                                    name={t.icon} 
                                    size={24} 
                                    color={activeTool === t.id ? '#FFF' : '#666'} 
                                />
                            </TouchableOpacity>
                        ))}
                        {selectedObjectId && (
                            <TouchableOpacity 
                                style={[styles.toolBtn, { backgroundColor: '#FF3B30', marginTop: 10 }]} 
                                onPress={() => { 
                                    saveToHistory(objects);
                                    setObjects(prev => prev.filter(o => o.id !== selectedObjectId)); 
                                    setSelectedObjectId(null); 
                                }}
                            >
                                <Ionicons name="trash-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* ZOOM BAR */}
                    <View style={styles.zoomContainer}>
                        <TouchableOpacity style={styles.zoomIcon} onPress={() => setCanvasScale(s => Math.min(s + 0.1, 3))}>
                            <Ionicons name="add" size={20} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.zoomIcon} onPress={() => setCanvasScale(s => Math.max(s - 0.1, 0.5))}>
                            <Ionicons name="remove" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* BOTTOM ASSETS CATEGORIES */}
                <View style={styles.assetsSection}>
                    <Text style={styles.sectionHeader}>Temple Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                        {ASSET_CATEGORIES.map(cat => (
                            <TouchableOpacity key={cat.id} style={styles.folderTile} onPress={() => setActiveCategory(cat.id)}>
                                <View style={styles.folderIcon}>
                                    <MaterialCommunityIcons name={cat.icon} size={30} color="#D4AF37" />
                                </View>
                                <Text style={styles.folderName}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* QUICK TOOL BAR */}
                <View style={styles.quickBar}>
                    {[
                        { id: 'pens', label: 'Pens', icon: 'pen' },
                        { id: 'eraser', label: 'Eraser', icon: 'eraser' },
                        { id: 'shades', label: 'Shades', icon: 'palette' },
                        { id: 'layers', label: 'Layers', icon: 'layers' },
                    ].map(tab => (
                        <TouchableOpacity 
                            key={tab.id} 
                            style={styles.quickTab} 
                            onPress={() => setQuickTab(tab.id)}
                        >
                            <MaterialCommunityIcons 
                                name={tab.icon} 
                                size={22} 
                                color={quickTab === tab.id ? '#D4AF37' : '#555'} 
                            />
                            <Text style={[styles.quickText, quickTab === tab.id && styles.activeQuickText]}>{tab.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ASSET MODAL SHEET */}
                <Modal
                    visible={!!activeCategory}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setActiveCategory(null)}
                >
                    <Pressable style={styles.modalOverlay} onPress={() => setActiveCategory(null)}>
                        <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
                            <View style={styles.modalIndicator} />
                            <Text style={styles.modalTitle}>Choose {activeCategory}</Text>
                            <ScrollView contentContainerStyle={styles.elementGrid} showsVerticalScrollIndicator={false}>
                                {(ASSET_LIBRARY[activeCategory] || []).map(el => {
                                    const ThumbComp = el.component;
                                    return (
                                        <TouchableOpacity 
                                            key={el.id} 
                                            style={styles.elementCard} 
                                            onPress={() => addAsset(el)}
                                        >
                                            <View style={styles.elementPreview}>
                                                <Svg width="40" height="40" viewBox="0 0 100 100">
                                                    <ThumbComp width="100" height="100" />
                                                </Svg>
                                            </View>
                                            <Text style={styles.elementName}>{el.name}</Text>
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
    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerBtn: { padding: 4 },
    titleContainer: { flex: 1, alignItems: 'center', marginHorizontal: 10 },
    titlePress: { flexDirection: 'row', alignItems: 'center' },
    projectTitle: { fontSize: 18, fontWeight: '900', color: '#1a1a1a' },
    titleInput: { fontSize: 18, fontWeight: '900', color: '#D4AF37', borderBottomWidth: 1, borderBottomColor: '#D4AF37', minWidth: 100, textAlign: 'center' },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    actionIcon: { padding: 4 },
    saveBtn: { backgroundColor: '#D4AF37', padding: 8, paddingHorizontal: 16, borderRadius: 12, marginLeft: 16 },
    workspaceArea: { flex: 1, backgroundColor: '#FAF9F6', overflow: 'hidden' },
    gridOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.05 },
    gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#DDD' },
    gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#DDD' },
    placeholderContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    placeholderText: { marginTop: 15, fontSize: 16, fontWeight: '700', color: '#D4AF37', opacity: 0.4 },
    floatingTools: { position: 'absolute', right: 16, top: 16, backgroundColor: '#FFF', borderRadius: 20, padding: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 8 },
    toolBtn: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
    activeToolBtn: { backgroundColor: '#D4AF37' },
    zoomContainer: { position: 'absolute', left: 16, bottom: 16, backgroundColor: '#FFF', borderRadius: 12, padding: 4, elevation: 5 },
    zoomIcon: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    assetsSection: { padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    sectionHeader: { fontSize: 16, fontWeight: '900', color: '#1a1a1a', marginBottom: 16 },
    categoryScroll: { gap: 16, paddingRight: 20 },
    folderTile: { width: 90, alignItems: 'center' },
    folderIcon: { width: 70, height: 70, borderRadius: 20, backgroundColor: '#FDFCF9', justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#F5F5F5' },
    folderName: { fontSize: 12, fontWeight: '800', color: '#555' },
    quickBar: { height: 70, flexDirection: 'row', backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    quickTab: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    quickText: { fontSize: 11, fontWeight: '700', color: '#999', marginTop: 4 },
    activeQuickText: { color: '#D4AF37' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, minHeight: height * 0.4 },
    modalIndicator: { width: 40, height: 5, backgroundColor: '#DDD', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: '900', color: '#1a1a1a', marginBottom: 20 },
    elementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    elementCard: { width: (width - 80) / 3, alignItems: 'center', marginBottom: 16 },
    elementPreview: { width: 80, height: 80, borderRadius: 15, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#F0F0F0' },
    elementName: { fontSize: 11, fontWeight: '700', color: '#666', textAlign: 'center' },
});

export default DesignCanvasScreen;
