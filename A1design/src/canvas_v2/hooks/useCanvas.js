import { useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@a1_canvas_v2_project';
const MAX_HISTORY = 50;
export const SNAP_SIZE = 25;

export const snapToGrid = (val) => Math.round(val / SNAP_SIZE) * SNAP_SIZE;
export const snapPoint = (x, y, enabled = true) => {
    if (!enabled) return { x, y };
    return { x: snapToGrid(x), y: snapToGrid(y) };
};

const TEMPLE_ASSETS = [
    { id: 'pillar',        name: 'Pillar',       category: 'Pillars',    color: '#D4AF37' },
    { id: 'corner_pillar', name: 'Corner',        category: 'Pillars',    color: '#D4AF37' },
    { id: 'twin_pillar',   name: 'Twin',          category: 'Pillars',    color: '#C9A227' },
    { id: 'main_hall',     name: 'Main Hall',     category: 'Structure',  color: '#9B59B6' },
    { id: 'mandapa',       name: 'Mandapa',       category: 'Structure',  color: '#8E44AD' },
    { id: 'antarala',      name: 'Antarala',      category: 'Structure',  color: '#6C3483' },
    { id: 'shikhara',      name: 'Shikhara',      category: 'Roofing',    color: '#FFD700' },
    { id: 'flat_roof',     name: 'Flat Roof',     category: 'Roofing',    color: '#F1C40F' },
    { id: 'pyramid_roof',  name: 'Pyramid',       category: 'Roofing',    color: '#E67E22' },
    { id: 'torana',        name: 'Torana',        category: 'Gates',      color: '#E74C3C' },
    { id: 'main_gate',     name: 'Main Gate',     category: 'Gates',      color: '#C0392B' },
    { id: 'side_entry',    name: 'Side Entry',    category: 'Gates',      color: '#922B21' },
    { id: 'thick_wall',    name: 'Thick Wall',    category: 'Walls',      color: '#7F8C8D' },
    { id: 'partition',     name: 'Partition',     category: 'Walls',      color: '#95A5A6' },
    { id: 'compound_wall', name: 'Compound',      category: 'Walls',      color: '#BDC3C7' },
];

export const useCanvas = () => {
    const [shapes, setShapes] = useState([]);
    const [projectName, setProjectName] = useState('Untitled Temple');
    const [activeTool, setActiveTool] = useState('select');
    const [selectedShapeId, setSelectedShapeId] = useState(null);
    const [selectedAssetType, setSelectedAssetType] = useState(null);
    const [isAssetPanelOpen, setAssetPanelOpen] = useState(false);
    const [snapEnabled, setSnapEnabled] = useState(true);
    const svgAssets = TEMPLE_ASSETS;

    // ─── Undo / Redo ─────────────────────────────────────────────────────
    const historyRef = useRef([]);
    const redoRef = useRef([]);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const isUndoRedoRef = useRef(false);
    const shapesRef = useRef([]);

    const syncFlags = () => {
        setCanUndo(historyRef.current.length > 0);
        setCanRedo(redoRef.current.length > 0);
    };

    const pushToHistory = useCallback((prevShapes) => {
        const updated = [...historyRef.current, prevShapes];
        historyRef.current = updated.length > MAX_HISTORY
            ? updated.slice(updated.length - MAX_HISTORY)
            : updated;
        redoRef.current = [];
        syncFlags();
    }, []);

    const undo = useCallback(() => {
        if (historyRef.current.length === 0) return;
        isUndoRedoRef.current = true;
        const newHistory = [...historyRef.current];
        const prevState = newHistory.pop();
        redoRef.current = [...redoRef.current, shapesRef.current];
        historyRef.current = newHistory;
        setShapes(prevState);
        shapesRef.current = prevState;
        setSelectedShapeId(null);
        syncFlags();
        setTimeout(() => { isUndoRedoRef.current = false; }, 0);
    }, []);

    const redo = useCallback(() => {
        if (redoRef.current.length === 0) return;
        isUndoRedoRef.current = true;
        const newRedo = [...redoRef.current];
        const nextState = newRedo.pop();
        historyRef.current = [...historyRef.current, shapesRef.current];
        redoRef.current = newRedo;
        setShapes(nextState);
        shapesRef.current = nextState;
        setSelectedShapeId(null);
        syncFlags();
        setTimeout(() => { isUndoRedoRef.current = false; }, 0);
    }, []);

    // ─── Persistence ─────────────────────────────────────────────────────
    const saveProject = useCallback(async (currentShapes, name) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
                projectName: name, shapes: currentShapes, timestamp: Date.now(),
            }));
            return true;
        } catch (e) { console.error('Save failed', e); return false; }
    }, []);

    const loadProject = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed.shapes) { setShapes(parsed.shapes); shapesRef.current = parsed.shapes; }
            if (parsed.projectName) setProjectName(parsed.projectName);
        } catch (e) { console.error('Load failed', e); }
    }, []);

    useEffect(() => { loadProject(); }, [loadProject]);

    // ─── Shape Operations ─────────────────────────────────────────────────
    const addShape = useCallback((shape) => {
        setShapes(prev => {
            if (!isUndoRedoRef.current) pushToHistory(prev);
            const next = [...prev, shape];
            shapesRef.current = next;
            return next;
        });
    }, [pushToHistory]);

    const updateShape = useCallback((id, updates, isTransient = false) => {
        setShapes(prev => {
            if (!isUndoRedoRef.current && !isTransient) pushToHistory(prev);
            const next = prev.map(s => s.id === id ? { ...s, ...updates } : s);
            shapesRef.current = next;
            return next;
        });
    }, [pushToHistory]);

    const deleteShape = useCallback((id) => {
        setShapes(prev => {
            if (!isUndoRedoRef.current) pushToHistory(prev);
            const next = prev.filter(s => s.id !== id);
            shapesRef.current = next;
            return next;
        });
        setSelectedShapeId(null);
    }, [pushToHistory]);

    const clearCanvas = useCallback(() => {
        setShapes(prev => {
            pushToHistory(prev);
            shapesRef.current = [];
            return [];
        });
        setSelectedShapeId(null);
    }, [pushToHistory]);

    const commitHistory = useCallback(() => {
        pushToHistory(shapesRef.current);
    }, [pushToHistory]);

    const selectAsset = useCallback((asset) => {
        setSelectedAssetType(asset);
        setActiveTool('asset');
        setAssetPanelOpen(false);
    }, []);

    return {
        shapes, setShapes,
        projectName, setProjectName,
        activeTool, setActiveTool,
        selectedShapeId, setSelectedShapeId,
        selectedAssetType, setSelectedAssetType,
        isAssetPanelOpen, setAssetPanelOpen,
        svgAssets, selectAsset,
        snapEnabled, setSnapEnabled,
        addShape, updateShape, deleteShape, clearCanvas,
        saveProject, undo, redo, canUndo, canRedo,
        commitHistory,
    };
};
