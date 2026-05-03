import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    Dimensions, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCanvas, snapPoint } from './hooks/useCanvas';
import { Grid, RenderShapes, DraftShape, AssetGhost, SnapIndicator } from './CanvasEngine';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue, useAnimatedStyle, withSpring, runOnJS,
} from 'react-native-reanimated';
import Svg, { G } from 'react-native-svg';
import * as Crypto from 'expo-crypto';

const { width: SW, height: SH } = Dimensions.get('window');
const PANEL_H = 360;
const SPRING = { damping: 22, stiffness: 180, mass: 0.8 };
const GOLD = '#D4AF37';

// ─── Clamp helper (worklet) ───────────────────────────────────────────────────
function clamp(val, min, max) { 'worklet'; return Math.min(Math.max(val, min), max); }

export default function CanvasScreen({ navigation }) {
    const canvas = useCanvas();

    // ── Camera shared values (worklet-safe) ──────────────────────────────────
    const scale         = useSharedValue(1);
    const savedScale    = useSharedValue(1);
    const translateX    = useSharedValue(0);
    const translateY    = useSharedValue(0);
    const savedTX       = useSharedValue(0);
    const savedTY       = useSharedValue(0);
    const isPinching    = useSharedValue(false);
    const canvasW       = useSharedValue(SW);
    const canvasH       = useSharedValue(SH - 60);
    const panelY        = useSharedValue(PANEL_H);
    // For render (JSX) — mirrors the shared values
    const [canvasSize, setCanvasSize] = useState({ w: SW, h: SH - 60 });

    // ── Drawing state ────────────────────────────────────────────────────────
    const [draftStart,   setDraftStart]   = useState(null);
    const [draftCurrent, setDraftCurrent] = useState(null);
    const [ghostPos,     setGhostPos]     = useState(null);
    const [snapPos,      setSnapPos]      = useState(null);
    const [interMode,    setInterMode]    = useState(null);
    const [activeCategory, setActiveCategory] = useState('Pillars');
    const [zoomPct, setZoomPct] = useState(100);

    const draftStartRef   = useRef(null);
    const draftCurrentRef = useRef(null);
    const interStartRef   = useRef(null);
    const initShapeRef    = useRef(null);
    const canvasRef       = useRef(canvas);
    canvasRef.current = canvas;

    // ── Coord conversion (worklet) ────────────────────────────────────────────
    const toCanvas = (sx, sy) => {
        'worklet';
        return {
            x: (sx - translateX.value - canvasW.value / 2) / scale.value,
            y: (sy - translateY.value - canvasH.value / 2) / scale.value,
        };
    };

    // ── JS-thread handlers ────────────────────────────────────────────────────
    const onTap = useCallback((raw) => {
        const c = canvasRef.current;
        if (!c) return;
        const coords = snapPoint(raw.x, raw.y, c.snapEnabled);
        if (c.activeTool === 'asset' && c.selectedAssetType) {
            c.addShape({
                id: Crypto.randomUUID(), type: 'asset',
                assetType: c.selectedAssetType.id,
                assetLabel: c.selectedAssetType.name,
                assetColor: c.selectedAssetType.color || GOLD,
                x: coords.x, y: coords.y,
                assetScale: 1, assetRotation: 0,
            });
            setGhostPos(null);
            return;
        }
        if (c.activeTool === 'select') c.setSelectedShapeId(null);
    }, []);

    const onDrawStart = useCallback((raw) => {
        const c = canvasRef.current;
        if (!c || c.activeTool === 'asset') return;
        if (c.activeTool === 'select') {
            // Hit-test for asset shapes
            const hit = [...c.shapes].reverse().find(s => {
                if (s.type === 'asset') return Math.abs(raw.x - s.x) < 55 && Math.abs(raw.y - s.y) < 55;
                return false;
            });
            if (hit) {
                c.setSelectedShapeId(hit.id);
                setInterMode('move');
                interStartRef.current = raw;
                initShapeRef.current = { ...hit };
            } else {
                c.setSelectedShapeId(null);
                setInterMode(null);
            }
            return;
        }
        const coords = snapPoint(raw.x, raw.y, c.snapEnabled);
        setInterMode('draw');
        setDraftStart(coords);
        setDraftCurrent(coords);
        setSnapPos(coords);
        draftStartRef.current = coords;
        draftCurrentRef.current = coords;
    }, []);

    const onDrawUpdate = useCallback((raw) => {
        const c = canvasRef.current;
        if (!c || !interMode) return;
        if (interMode === 'draw') {
            const coords = snapPoint(raw.x, raw.y, c.snapEnabled);
            setDraftCurrent(coords);
            setSnapPos(coords);
            draftCurrentRef.current = coords;
        } else if (interMode === 'move' && c.selectedShapeId && initShapeRef.current) {
            const dx = raw.x - interStartRef.current.x;
            const dy = raw.y - interStartRef.current.y;
            const ini = initShapeRef.current;
            if (ini.type === 'asset') {
                c.updateShape(c.selectedShapeId, { x: ini.x + dx, y: ini.y + dy }, true);
            } else {
                c.updateShape(c.selectedShapeId, {
                    x1: ini.x1 + dx, y1: ini.y1 + dy,
                    x2: ini.x2 + dx, y2: ini.y2 + dy,
                }, true);
            }
        }
    }, [interMode]);

    const onDrawEnd = useCallback(() => {
        const c = canvasRef.current;
        if (!c) return;
        if (interMode === 'draw') {
            const start = draftStartRef.current;
            const end   = draftCurrentRef.current;
            if (start && end) {
                const dist = Math.hypot(end.x - start.x, end.y - start.y);
                if (dist > 4) {
                    c.addShape({ id: Crypto.randomUUID(), type: c.activeTool, x1: start.x, y1: start.y, x2: end.x, y2: end.y });
                }
            }
        } else if (interMode === 'move') {
            c.commitHistory();
        }
        setInterMode(null);
        setDraftStart(null);
        setDraftCurrent(null);
        setSnapPos(null);
        draftStartRef.current = null;
        draftCurrentRef.current = null;
    }, [interMode]);

    const updateZoomPct = useCallback((s) => {
        setZoomPct(Math.round(s * 100));
    }, []);

    // ── Gestures ──────────────────────────────────────────────────────────────
    const pinch = Gesture.Pinch()
        .onStart(() => { isPinching.value = true; })
        .onUpdate(e => {
            scale.value = clamp(savedScale.value * e.scale, 0.2, 6);
            runOnJS(updateZoomPct)(scale.value);
        })
        .onEnd(() => {
            savedScale.value = scale.value;
            isPinching.value = false;
        });

    const pan2 = Gesture.Pan()
        .minPointers(2).maxPointers(5)
        .onUpdate(e => {
            translateX.value = savedTX.value + e.translationX;
            translateY.value = savedTY.value + e.translationY;
        })
        .onEnd(() => {
            savedTX.value = translateX.value;
            savedTY.value = translateY.value;
        });

    const tap = Gesture.Tap()
        .maxDuration(280)
        .onEnd(e => {
            if (isPinching.value) return;
            const raw = toCanvas(e.x, e.y);
            runOnJS(onTap)(raw);
        });

    const draw = Gesture.Pan()
        .maxPointers(1).minDistance(3)
        .onStart(e => {
            if (isPinching.value) return;
            runOnJS(onDrawStart)(toCanvas(e.x, e.y));
        })
        .onUpdate(e => {
            if (isPinching.value) return;
            runOnJS(onDrawUpdate)(toCanvas(e.x, e.y));
        })
        .onEnd(() => runOnJS(onDrawEnd)());

    const composed = Gesture.Simultaneous(
        Gesture.Simultaneous(pinch, pan2),
        Gesture.Race(draw, tap),
    );

    // ── Animated styles ───────────────────────────────────────────────────────
    const canvasAnim = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    const panelAnim = useAnimatedStyle(() => ({
        transform: [{ translateY: panelY.value }],
    }));

    // ── Helpers ───────────────────────────────────────────────────────────────
    const togglePanel = useCallback(() => {
        const open = !canvas.isAssetPanelOpen;
        canvas.setAssetPanelOpen(open);
        panelY.value = withSpring(open ? 0 : PANEL_H, SPRING);
    }, [canvas, panelY]);

    const closePanel = useCallback(() => {
        canvas.setAssetPanelOpen(false);
        panelY.value = withSpring(PANEL_H, SPRING);
    }, [canvas, panelY]);

    const zoomBy = useCallback((factor) => {
        const next = clamp(savedScale.value * factor, 0.2, 6);
        scale.value = withSpring(next, SPRING);
        savedScale.value = next;
        setZoomPct(Math.round(next * 100));
    }, [scale, savedScale]);

    const resetCamera = useCallback(() => {
        scale.value = withSpring(1, SPRING);
        translateX.value = withSpring(0, SPRING);
        translateY.value = withSpring(0, SPRING);
        savedScale.value = 1; savedTX.value = 0; savedTY.value = 0;
        setZoomPct(100);
    }, [scale, translateX, translateY, savedScale, savedTX, savedTY]);

    const rotateSelected = useCallback((deg) => {
        if (!canvas.selectedShapeId) return;
        const shape = canvas.shapes.find(s => s.id === canvas.selectedShapeId);
        if (shape?.type === 'asset') {
            canvas.updateShape(canvas.selectedShapeId, {
                assetRotation: ((shape.assetRotation || 0) + deg + 360) % 360,
            });
            canvas.commitHistory();
        }
    }, [canvas]);

    // ── Grouped assets ────────────────────────────────────────────────────────
    const groupedAssets = useMemo(() => canvas.svgAssets.reduce((acc, a) => {
        if (!acc[a.category]) acc[a.category] = [];
        acc[a.category].push(a);
        return acc;
    }, {}), [canvas.svgAssets]);
    const categories = Object.keys(groupedAssets);

    useEffect(() => {
        if (categories.length && !categories.includes(activeCategory)) setActiveCategory(categories[0]);
    }, [categories]);

    const selectedShape = canvas.shapes.find(s => s.id === canvas.selectedShapeId);
    const isAssetSelected = selectedShape?.type === 'asset';

    const tools = [
        { key: 'select', icon: 'navigate-outline' },
        { key: 'line',   icon: 'remove-outline'   },
        { key: 'rect',   icon: 'square-outline'   },
        { key: 'circle', icon: 'ellipse-outline'  },
        { key: 'asset',  icon: 'cube-outline'     },
    ];

    return (
        <SafeAreaView style={s.root}>
            {/* ── TOP BAR ── */}
            <View style={s.topBar}>
                <View style={s.topLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn}>
                        <Ionicons name="arrow-back" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <TextInput
                        style={s.projName}
                        value={canvas.projectName}
                        onChangeText={canvas.setProjectName}
                        placeholder="Project Name"
                        placeholderTextColor="rgba(255,255,255,0.25)"
                    />
                </View>
                <View style={s.topRight}>
                    <TouchableOpacity onPress={() => canvas.setSnapEnabled(v => !v)} style={[s.iconBtn, canvas.snapEnabled && s.activeIconBtn]}>
                        <Ionicons name="magnet-outline" size={18} color={canvas.snapEnabled ? GOLD : 'rgba(255,255,255,0.5)'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={canvas.undo} disabled={!canvas.canUndo} style={[s.iconBtn, !canvas.canUndo && s.dimmed]}>
                        <Ionicons name="arrow-undo-outline" size={18} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={canvas.redo} disabled={!canvas.canRedo} style={[s.iconBtn, !canvas.canRedo && s.dimmed]}>
                        <Ionicons name="arrow-redo-outline" size={18} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => canvas.saveProject(canvas.shapes, canvas.projectName)} style={s.saveBtn}>
                        <Ionicons name="cloud-upload-outline" size={15} color="#0A0A1A" />
                        <Text style={s.saveTxt}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── CANVAS ── */}
            <GestureDetector gesture={composed}>
                <View
                    style={s.canvasWrap}
                    onLayout={e => {
                        const { width, height } = e.nativeEvent.layout;
                        canvasW.value = width;
                        canvasH.value = height;
                        setCanvasSize({ w: width, h: height });
                    }}
                >
                    <Animated.View style={[s.canvasInner, canvasAnim]}>
                        {/* Grid is inside transformed view → scales naturally */}
                        <Grid center={{ x: canvasSize.w / 2, y: canvasSize.h / 2 }} />

                        <View style={s.svgLayer} pointerEvents="none">
                            <Svg width="100%" height="100%">
                                <G transform={`translate(${canvasSize.w / 2},${canvasSize.h / 2})`}>
                                    <RenderShapes
                                        shapes={canvas.shapes}
                                        selectedShapeId={canvas.selectedShapeId}
                                        onSelectShape={canvas.setSelectedShapeId}
                                    />
                                    <DraftShape type={canvas.activeTool} startPoint={draftStart} currentPoint={draftCurrent} />
                                    {canvas.activeTool === 'asset' && <AssetGhost asset={canvas.selectedAssetType} position={ghostPos} />}
                                    {canvas.snapEnabled && snapPos && interMode === 'draw' && <SnapIndicator position={snapPos} />}
                                </G>
                            </Svg>
                        </View>
                    </Animated.View>

                    {/* ── RIGHT TOOLBAR ── */}
                    <View style={s.toolbar}>
                        {tools.map(t => (
                            <TouchableOpacity key={t.key} style={[s.toolBtn, canvas.activeTool === t.key && s.toolBtnActive]}
                                onPress={() => {
                                    if (t.key === 'asset') togglePanel();
                                    else {
                                        canvas.setActiveTool(t.key);
                                        canvas.setSelectedAssetType(null);
                                        closePanel();
                                    }
                                }}>
                                <Ionicons name={t.icon} size={22} color={canvas.activeTool === t.key ? GOLD : 'rgba(255,255,255,0.65)'} />
                                {canvas.activeTool === t.key && <View style={s.toolDot} />}
                            </TouchableOpacity>
                        ))}
                        <View style={s.toolSep} />
                        {/* Rotate (asset only) */}
                        {isAssetSelected && <>
                            <TouchableOpacity style={s.toolBtn} onPress={() => rotateSelected(-15)}>
                                <Ionicons name="arrow-undo-circle-outline" size={22} color="rgba(255,255,255,0.65)" />
                            </TouchableOpacity>
                            <TouchableOpacity style={s.toolBtn} onPress={() => rotateSelected(15)}>
                                <Ionicons name="arrow-redo-circle-outline" size={22} color="rgba(255,255,255,0.65)" />
                            </TouchableOpacity>
                            <View style={s.toolSep} />
                        </>}
                        <TouchableOpacity
                            style={[s.toolBtn, !canvas.selectedShapeId && s.dimmed]}
                            disabled={!canvas.selectedShapeId}
                            onPress={() => canvas.selectedShapeId && canvas.deleteShape(canvas.selectedShapeId)}>
                            <Ionicons name="trash-outline" size={20} color={canvas.selectedShapeId ? '#FF5252' : 'rgba(255,255,255,0.2)'} />
                        </TouchableOpacity>
                    </View>

                    {/* ── HUD ── */}
                    <View style={s.hud}>
                        <Text style={s.hudTool}>
                            {canvas.activeTool === 'asset' && canvas.selectedAssetType
                                ? `▣ ${canvas.selectedAssetType.name.toUpperCase()}`
                                : canvas.activeTool.toUpperCase()}
                        </Text>
                        <Text style={s.hudInfo}>{canvas.shapes.length} elements  ·  {zoomPct}%</Text>
                    </View>

                    {/* ── ZOOM CONTROLS ── */}
                    <View style={s.zoomCtrl}>
                        <TouchableOpacity style={s.zoomBtn} onPress={() => zoomBy(1.25)}>
                            <Ionicons name="add" size={18} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={s.zoomBtn} onPress={resetCamera}>
                            <Text style={s.zoomReset}>1:1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={s.zoomBtn} onPress={() => zoomBy(0.8)}>
                            <Ionicons name="remove" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </GestureDetector>

            {/* ── ASSET PANEL ── */}
            <Animated.View style={[s.panel, panelAnim]}>
                <TouchableOpacity style={s.panelHandle} onPress={closePanel} activeOpacity={0.7}>
                    <View style={s.panelBar} />
                </TouchableOpacity>
                <Text style={s.panelTitle}>Architectural Foundry</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                    {categories.map(cat => (
                        <TouchableOpacity key={cat}
                            style={[s.catBtn, activeCategory === cat && s.catBtnActive]}
                            onPress={() => setActiveCategory(cat)}>
                            <Text style={[s.catTxt, activeCategory === cat && s.catTxtActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <ScrollView contentContainerStyle={s.assetGrid} showsVerticalScrollIndicator={false}>
                    {(groupedAssets[activeCategory] || []).map(asset => (
                        <TouchableOpacity key={asset.id}
                            style={[s.assetCard, canvas.selectedAssetType?.id === asset.id && s.assetCardActive]}
                            onPress={() => canvas.selectAsset(asset)}>
                            <View style={[s.assetDot, { backgroundColor: asset.color + '30', borderColor: asset.color + '60' }]}>
                                <Ionicons name="cube-outline" size={24} color={asset.color} />
                            </View>
                            <Text style={s.assetLbl} numberOfLines={1}>{asset.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Dimmed overlay when panel open */}
            {canvas.isAssetPanelOpen && (
                <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closePanel} />
            )}
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#05050A' },

    // Top bar
    topBar: {
        height: 56, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', paddingHorizontal: 12,
        backgroundColor: '#0A0A1F',
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    topLeft:  { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    topRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    iconBtn:  { padding: 8, borderRadius: 10 },
    activeIconBtn: { backgroundColor: 'rgba(212,175,55,0.12)' },
    projName: { color: '#FFF', fontSize: 13, fontWeight: '700', letterSpacing: 0.4, maxWidth: 140 },
    saveBtn:  {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: GOLD, paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: 10, marginLeft: 6,
    },
    saveTxt:  { color: '#0A0A1A', fontWeight: '900', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
    dimmed:   { opacity: 0.25 },

    // Canvas
    canvasWrap:  { flex: 1, overflow: 'hidden', backgroundColor: '#05050A' },
    canvasInner: { position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%' },
    svgLayer:    { ...StyleSheet.absoluteFillObject },

    // Toolbar
    toolbar: {
        position: 'absolute', right: 12, top: '50%', marginTop: -160,
        backgroundColor: 'rgba(14,14,28,0.94)',
        borderRadius: 22, padding: 6, gap: 2,
        borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)',
        elevation: 12,
    },
    toolBtn:       { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    toolBtnActive: { backgroundColor: 'rgba(212,175,55,0.14)' },
    toolDot:       { position: 'absolute', right: 3, width: 3, height: 10, borderRadius: 2, backgroundColor: GOLD },
    toolSep:       { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 6, marginHorizontal: 8 },

    // HUD
    hud: {
        position: 'absolute', top: 14, left: 14,
        backgroundColor: 'rgba(10,10,25,0.82)',
        paddingHorizontal: 12, paddingVertical: 7,
        borderRadius: 10, borderWidth: 1, borderColor: 'rgba(212,175,55,0.25)',
    },
    hudTool: { color: GOLD, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
    hudInfo: { color: 'rgba(255,255,255,0.35)', fontSize: 9, marginTop: 2 },

    // Zoom controls
    zoomCtrl: {
        position: 'absolute', bottom: 24, right: 14,
        backgroundColor: 'rgba(14,14,28,0.94)',
        borderRadius: 16, padding: 4, gap: 2,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        elevation: 8,
    },
    zoomBtn:   { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    zoomReset: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '800' },

    // Asset panel
    panel: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: PANEL_H, backgroundColor: '#0B0B20',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        borderTopWidth: 1, borderColor: 'rgba(212,175,55,0.25)',
        paddingHorizontal: 20, zIndex: 100, elevation: 20,
    },
    panelHandle: { alignItems: 'center', paddingVertical: 10 },
    panelBar:    { width: 32, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.12)' },
    panelTitle:  {
        color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '900',
        letterSpacing: 2.5, textTransform: 'uppercase', textAlign: 'center', marginBottom: 16,
    },
    catBtn:       {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    },
    catBtnActive: { backgroundColor: 'rgba(212,175,55,0.14)', borderColor: 'rgba(212,175,55,0.3)' },
    catTxt:       { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '700' },
    catTxtActive: { color: GOLD },
    assetGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 30 },
    assetCard:    {
        width: '30%', aspectRatio: 1, borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.025)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    assetCardActive: { backgroundColor: 'rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.35)' },
    assetDot:        { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    assetLbl:        { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' },

    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 99 },
});
