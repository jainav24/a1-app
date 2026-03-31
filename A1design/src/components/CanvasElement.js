import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, PanResponder } from 'react-native';
import Svg, { Rect, Circle, Line } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const CanvasElement = ({ element, isSelected, onSelect, onDrag, onDragEnd }) => {
    const translateX = useSharedValue(element.x);
    const translateY = useSharedValue(element.y);

    const initialX = useRef(element.x);
    const initialY = useRef(element.y);

    // Sync Reanimated shared values with React state when it updates (e.g. undo/redo)
    useEffect(() => {
        translateX.value = element.x;
        translateY.value = element.y;
    }, [element.x, element.y]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            onSelect(element.id);
            // Record position at the start of the gesture
            initialX.current = element.x;
            initialY.current = element.y;
        },
        onPanResponderMove: (evt, gestureState) => {
            if (isSelected) {
                // Update shared values for smooth visual feedback
                translateX.value = initialX.current + gestureState.dx;
                translateY.value = initialY.current + gestureState.dy;

                // Optional: real-time updates to global state (could be intensive)
                if (onDrag) {
                    onDrag(element.id, { x: translateX.value, y: translateY.value });
                }
            }
        },
        onPanResponderRelease: () => {
            if (isSelected && onDragEnd) {
                // Commit final position to state/history
                onDragEnd(element.id, translateX.value, translateY.value);
            }
        },
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: element.scale || 1 },
        ],
    }));

    const renderShape = () => {
        const { type, color, width, height, radius } = element;
        switch (type) {
            case 'rect':
                return (
                    <Rect
                        x="0"
                        y="0"
                        width={width || 100}
                        height={height || 100}
                        fill={color}
                        rx={10}
                    />
                );
            case 'circle':
                return (
                    <Circle
                        cx={radius || 50}
                        cy={radius || 50}
                        r={radius || 50}
                        fill={color}
                    />
                );
            case 'line':
                return (
                    <Line
                        x1="0"
                        y1="0"
                        x2={width || 100}
                        y2={height || 100}
                        stroke={color}
                        strokeWidth="4"
                    />
                );
            case 'svg':
                const SvgComp = element.component;
                return SvgComp ? <SvgComp width={width || 120} height={height || 120} /> : null;
            default:
                return null;
        }
    };

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.container,
                animatedStyle,
                isSelected && styles.selected,
            ]}
        >
            <Svg
                width={element.width || 120}
                height={element.height || 120}
                viewBox={`0 0 ${element.width || 120} ${element.height || 120}`}
            >
                {renderShape()}
            </Svg>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        padding: 5,
    },
    selected: {
        borderWidth: 2,
        borderColor: '#D4AF37',
        borderStyle: 'dashed',
        borderRadius: 8,
    },
});

export default CanvasElement;
