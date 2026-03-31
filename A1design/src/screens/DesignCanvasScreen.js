import React, { useState, useCallback, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    TextInput,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// --- COMPONENTS ---
import CanvasElement from '../components/CanvasElement';
import Toolbar from '../components/Toolbar';
import ControlPanel from '../components/ControlPanel';

// --- SVG ASSET IMPORTS ---
import Temple1 from '../../assets/svg/temple1.svg';
import Temple2 from '../../assets/svg/temple2.svg';
import Pillar from '../../assets/svg/Pillar.svg';
import Bottom from '../../assets/svg/Bottom.svg';
import Chaat from '../../assets/svg/Chaat.svg';

const { width, height } = Dimensions.get('window');

const generateId = () => Math.random().toString(36).substr(2, 9);

const DesignCanvasScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [elements, setElements] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [history, setHistory] = useState([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Project Name State
    const [projectName, setProjectName] = useState('Untitled Project');
    const [isEditingName, setIsEditingName] = useState(false);

    const updateHistory = (newElements) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            setElements(history[prevIndex]);
            setHistoryIndex(prevIndex);
            setSelectedId(null);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            setElements(history[nextIndex]);
            setHistoryIndex(nextIndex);
            setSelectedId(null);
        }
    };

    const handleAction = (type) => {
        let newElement = null;
        const baseProps = {
            id: generateId(),
            x: 100,
            y: 100,
            scale: 1,
            color: colors.primary,
        };

        switch (type) {
            case 'rect':
                newElement = { ...baseProps, type: 'rect', width: 100, height: 100 };
                break;
            case 'circle':
                newElement = { ...baseProps, type: 'circle', radius: 50, width: 100, height: 100 };
                break;
            case 'line':
                newElement = { ...baseProps, type: 'line', width: 100, height: 100 };
                break;
            case 'svg':
                // Default to Temple1 or we could pass a subtype
                newElement = { ...baseProps, type: 'svg', component: Temple1, width: 120, height: 120 };
                break;
            case 'pillar':
                newElement = { ...baseProps, type: 'svg', component: Pillar, width: 80, height: 200 };
                break;
            case 'bottom':
                newElement = { ...baseProps, type: 'svg', component: Bottom, width: 250, height: 100 };
                break;
            case 'chaat':
                newElement = { ...baseProps, type: 'svg', component: Chaat, width: 200, height: 150 };
                break;
            case 'delete':
                if (selectedId) {
                    const newElements = elements.filter(el => el.id !== selectedId);
                    setElements(newElements);
                    updateHistory(newElements);
                    setSelectedId(null);
                }
                return;
            default:
                return;
        }

        if (newElement) {
            const newElements = [...elements, newElement];
            setElements(newElements);
            updateHistory(newElements);
            setSelectedId(newElement.id);
        }
    };

    const handleUpdateElement = (id, updates) => {
        const newElements = elements.map(el => {
            if (el.id === id) return { ...el, ...updates };
            return el;
        });
        setElements(newElements);
    };

    const handleDragCommit = (id, x, y) => {
        const newElements = elements.map(el => {
            if (el.id === id) return { ...el, x: Math.round(x), y: Math.round(y) };
            return el;
        });
        updateHistory(newElements);
    };

    const selectedElement = elements.find(el => el.id === selectedId);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.statusBar} />
            
            {/* CANVAS LAYER */}
            <TouchableOpacity 
                activeOpacity={1} 
                style={styles.canvasBackground}
                onPress={() => setSelectedId(null)}
            >
                {elements.map(el => (
                    <CanvasElement
                        key={el.id}
                        element={el}
                        isSelected={selectedId === el.id}
                        onSelect={setSelectedId}
                        onDrag={handleUpdateElement}
                        onDragEnd={handleDragCommit}
                    />
                ))}
            </TouchableOpacity>

            {/* UI OVERLAY */}
            <SafeAreaView style={styles.overlay} pointerEvents="box-none">
                <View style={[styles.header, { backgroundColor: colors.card + '99', borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    
                    <View style={styles.titleContainer}>
                        {isEditingName ? (
                            <TextInput
                                style={[styles.titleInput, { color: colors.text }]}
                                value={projectName}
                                onChangeText={setProjectName}
                                onBlur={() => setIsEditingName(false)}
                                onSubmitEditing={() => setIsEditingName(false)}
                                autoFocus
                                selectTextOnFocus
                                maxLength={25}
                            />
                        ) : (
                            <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.titleWrapper}>
                                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                                    {projectName}
                                </Text>
                                <Ionicons name="pencil-outline" size={14} color={colors.primary} style={{ marginLeft: 6 }} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="share-outline" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <ControlPanel
                    selectedElement={selectedElement}
                    onUpdate={handleUpdateElement}
                />

                <Toolbar
                    onAction={handleAction}
                    canUndo={historyIndex > 0}
                    canRedo={historyIndex < history.length - 1}
                    onUndo={undo}
                    onRedo={redo}
                    selectedId={selectedId}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    canvasBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 64,
        zIndex: 10,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    titleInput: {
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
        width: '100%',
        paddingVertical: 4,
    },
    iconBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DesignCanvasScreen;
