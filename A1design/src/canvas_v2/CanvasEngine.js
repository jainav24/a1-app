import React from 'react';
import Svg, { Line, Rect, Circle, Defs, Pattern, Path, Text as SvgText, Polygon, G, SvgUri } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

const GOLD       = '#D4AF37';
const GOLD_DIM   = 'rgba(212,175,55,0.35)';
const DRAFT_CLR  = '#A29BFE';
const SNAP_CLR   = '#00F5FF';

// ─── Grid ─────────────────────────────────────────────────────────────────────
export const Grid = ({ center = { x: 0, y: 0 } }) => {
    const minor = 25;
    const major = 100;
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width="100%" height="100%">
                <Defs>
                    <Pattern id="minorGrid" width={minor} height={minor} patternUnits="userSpaceOnUse">
                        <Path d={`M ${minor} 0 L 0 0 0 ${minor}`} fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.5" />
                    </Pattern>
                    <Pattern id="majorGrid" width={major} height={major} patternUnits="userSpaceOnUse">
                        <Rect width={major} height={major} fill="url(#minorGrid)" />
                        <Path d={`M ${major} 0 L 0 0 0 ${major}`} fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="0.8" />
                    </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#majorGrid)" />
                {/* Axis lines */}
                <Line x1={center.x} y1="0%" x2={center.x} y2="100%" stroke="rgba(212,175,55,0.22)" strokeWidth="1" />
                <Line x1="0%" y1={center.y} x2="100%" y2={center.y} stroke="rgba(212,175,55,0.22)" strokeWidth="1" />
                {/* Origin crosshair */}
                <G transform={`translate(${center.x},${center.y})`}>
                    <Circle r="4" fill="none" stroke={GOLD} strokeWidth="1" opacity={0.5} />
                    <Path d="M -8 0 L 8 0 M 0 -8 L 0 8" stroke={GOLD} strokeWidth="1" opacity={0.6} />
                </G>
            </Svg>
        </View>
    );
};

// ─── Snap Indicator ────────────────────────────────────────────────────────────
export const SnapIndicator = ({ position }) => {
    if (!position) return null;
    return (
        <G transform={`translate(${position.x},${position.y})`}>
            <Circle r="5" fill="none" stroke={SNAP_CLR} strokeWidth="1.5" opacity={0.9} />
            <Path d="M -10 0 L 10 0 M 0 -10 L 0 10" stroke={SNAP_CLR} strokeWidth="1" opacity={0.9} />
        </G>
    );
};

// ─── Temple Asset SVGs ─────────────────────────────────────────────────────────
const PillarSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '18';
    return (<G>
        <Rect x={-8} y={-40} width={16} height={80} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2 : 1.2} />
        <Rect x={-14} y={-44} width={28} height={8} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2 : 1} />
        <Rect x={-14} y={36} width={28} height={8} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2 : 1} />
        <Path d="M -8 -36 L 8 -36 M -8 -20 L 8 -20 M -8 0 L 8 0 M -8 20 L 8 20" stroke={s} strokeWidth={0.5} opacity={0.4} />
    </G>);
};

const CornerPillarSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '15';
    return (<G>
        <Rect x={-30} y={-30} width={15} height={60} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2 : 1.2} />
        <Rect x={15} y={-30} width={15} height={60} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2 : 1.2} />
        <Rect x={-34} y={-34} width={23} height={8} rx={1} fill={f} stroke={s} strokeWidth={sel ? 2 : 1} />
        <Rect x={11} y={-34} width={23} height={8} rx={1} fill={f} stroke={s} strokeWidth={sel ? 2 : 1} />
    </G>);
};

const TwinPillarSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '15';
    return (<G>
        <Rect x={-22} y={-40} width={12} height={80} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2 : 1.2} />
        <Rect x={10} y={-40} width={12} height={80} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2 : 1.2} />
        <Rect x={-27} y={-44} width={22} height={7} rx={1} fill={f} stroke={s} strokeWidth={1} />
        <Rect x={5} y={-44} width={22} height={7} rx={1} fill={f} stroke={s} strokeWidth={1} />
        <Line x1={-10} y1={0} x2={10} y2={0} stroke={s} strokeWidth={0.6} strokeDasharray="3 2" />
    </G>);
};

const MainHallSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '08';
    return (<G>
        <Rect x={-50} y={-35} width={100} height={70} rx={3} fill={f} stroke={s} strokeWidth={sel ? 2.5 : 1.5} />
        <Rect x={-42} y={-27} width={84} height={54} rx={2} fill="none" stroke={s} strokeWidth={0.6} opacity={0.4} />
        <Line x1={0} y1={-35} x2={0} y2={35} stroke={s} strokeWidth={0.6} strokeDasharray="4 3" opacity={0.4} />
        <Line x1={-50} y1={0} x2={50} y2={0} stroke={s} strokeWidth={0.6} strokeDasharray="4 3" opacity={0.4} />
        <Rect x={-12} y={18} width={24} height={17} rx={1} fill={f} stroke={s} strokeWidth={1} />
    </G>);
};

const MandapaSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '08';
    return (<G>
        <Polygon points="0,-45 50,10 35,35 -35,35 -50,10" fill={f} stroke={s} strokeWidth={sel ? 2 : 1.5} />
        <Rect x={-35} y={35} width={70} height={10} rx={1} fill={f} stroke={s} strokeWidth={1} />
        <Line x1={-50} y1={10} x2={50} y2={10} stroke={s} strokeWidth={0.5} opacity={0.4} />
        <Circle cx={0} cy={-45} r={3} fill={s} opacity={0.7} />
    </G>);
};

const AntaralaSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '08';
    return (<G>
        <Rect x={-25} y={-30} width={50} height={60} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2 : 1.5} />
        <Line x1={-25} y1={0} x2={25} y2={0} stroke={s} strokeWidth={0.6} strokeDasharray="3 2" opacity={0.5} />
        <Rect x={-8} y={10} width={16} height={20} rx={1} fill="none" stroke={s} strokeWidth={1} />
    </G>);
};

const ShikharaSVG = ({ sel, color = '#FFD700' }) => {
    const s = sel ? GOLD : color; const f = color + '15';
    return (<G>
        <Polygon points="0,-55 15,-20 10,0 -10,0 -15,-20" fill={f} stroke={s} strokeWidth={sel ? 2 : 1.5} />
        <Rect x={-18} y={0} width={36} height={8} rx={1} fill={f} stroke={s} strokeWidth={1} />
        <Circle cx={0} cy={-55} r={5} fill={s} />
        <Path d="M 0 -55 L 0 -40 M -10 -35 L 10 -35 M -12 -20 L 12 -20" stroke={s} strokeWidth={0.6} opacity={0.4} />
    </G>);
};

const FlatRoofSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '08';
    return (<G>
        <Rect x={-45} y={-10} width={90} height={20} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2 : 1.5} />
        <Rect x={-40} y={-6} width={80} height={12} rx={1} fill="none" stroke={s} strokeWidth={0.5} opacity={0.3} />
        <Line x1={-45} y1={0} x2={45} y2={0} stroke={s} strokeWidth={0.5} strokeDasharray="5 3" opacity={0.3} />
    </G>);
};

const PyramidRoofSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '12';
    return (<G>
        <Polygon points="0,-40 45,15 -45,15" fill={f} stroke={s} strokeWidth={sel ? 2 : 1.5} />
        <Rect x={-48} y={15} width={96} height={8} rx={1} fill={f} stroke={s} strokeWidth={1} />
        <Circle cx={0} cy={-40} r={4} fill={s} />
        <Line x1={0} y1={-40} x2={0} y2={15} stroke={s} strokeWidth={0.5} strokeDasharray="4 3" opacity={0.3} />
    </G>);
};

const ToranaSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color;
    return (<G>
        <Path d="M -28 35 L -28 0 A 28 28 0 0 1 28 0 L 28 35" fill="none" stroke={s} strokeWidth={sel ? 3 : 2} />
        <Rect x={-32} y={32} width={8} height={8} rx={1} fill={s} opacity={0.7} />
        <Rect x={24} y={32} width={8} height={8} rx={1} fill={s} opacity={0.7} />
        <Path d="M 0 -28 L 0 -22 M -14 -18 L 14 -18" stroke={s} strokeWidth={1.5} opacity={0.5} />
    </G>);
};

const MainGateSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '10';
    return (<G>
        <Rect x={-40} y={-30} width={80} height={65} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2 : 1.5} />
        <Path d="M -16 35 L -16 5 A 16 16 0 0 1 16 5 L 16 35" fill={f} stroke={s} strokeWidth={1.5} />
        <Rect x={-40} y={-36} width={80} height={10} rx={2} fill={f} stroke={s} strokeWidth={1} />
        <Polygon points="0,-50 40,-36 -40,-36" fill={f} stroke={s} strokeWidth={1} />
    </G>);
};

const SideEntrySVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '10';
    return (<G>
        <Rect x={-20} y={-30} width={40} height={60} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2 : 1.5} />
        <Path d="M -10 30 L -10 5 A 10 10 0 0 1 10 5 L 10 30" fill={f} stroke={s} strokeWidth={1.5} />
        <Line x1={-20} y1={-20} x2={20} y2={-20} stroke={s} strokeWidth={0.8} opacity={0.4} />
    </G>);
};

const ThickWallSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '08';
    return (<G>
        <Rect x={-45} y={-15} width={90} height={30} rx={2} fill={f} stroke={s} strokeWidth={sel ? 2.5 : 1.5} />
        <Rect x={-38} y={-8} width={76} height={16} rx={1} fill="none" stroke={s} strokeWidth={0.5} opacity={0.3} />
        {[-20, 0, 20].map(x => (
            <Line key={x} x1={x} y1={-15} x2={x} y2={15} stroke={s} strokeWidth={0.5} strokeDasharray="2 2" opacity={0.3} />
        ))}
    </G>);
};

const PartitionSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '06';
    return (<G>
        <Rect x={-45} y={-6} width={90} height={12} rx={1} fill={f} stroke={s} strokeWidth={sel ? 2 : 1.2} />
        {[-30, -15, 0, 15, 30].map(x => (
            <Line key={x} x1={x} y1={-6} x2={x} y2={6} stroke={s} strokeWidth={0.5} opacity={0.3} />
        ))}
    </G>);
};

const CompoundWallSVG = ({ sel, color = '#FFF' }) => {
    const s = sel ? GOLD : color; const f = color + '06';
    return (<G>
        <Rect x={-50} y={-50} width={100} height={100} rx={3} fill="none" stroke={s} strokeWidth={sel ? 2.5 : 2} />
        <Rect x={-43} y={-43} width={86} height={86} rx={2} fill={f} stroke={s} strokeWidth={0.6} opacity={0.4} />
        {[-25, 25].map(p => [
            <Line key={`t${p}`} x1={p} y1={-50} x2={p} y2={-40} stroke={s} strokeWidth={1.5} />,
            <Line key={`b${p}`} x1={p} y1={40} x2={p} y2={50} stroke={s} strokeWidth={1.5} />,
            <Line key={`l${p}`} x1={-50} y1={p} x2={-40} y2={p} stroke={s} strokeWidth={1.5} />,
            <Line key={`r${p}`} x1={40} y1={p} x2={50} y2={p} stroke={s} strokeWidth={1.5} />,
        ])}
    </G>);
};

export const ASSET_SVG_MAP = {
    pillar:        PillarSVG,
    corner_pillar: CornerPillarSVG,
    twin_pillar:   TwinPillarSVG,
    main_hall:     MainHallSVG,
    mandapa:       MandapaSVG,
    antarala:      AntaralaSVG,
    shikhara:      ShikharaSVG,
    flat_roof:     FlatRoofSVG,
    pyramid_roof:  PyramidRoofSVG,
    torana:        ToranaSVG,
    main_gate:     MainGateSVG,
    side_entry:    SideEntrySVG,
    thick_wall:    ThickWallSVG,
    partition:     PartitionSVG,
    compound_wall: CompoundWallSVG,
};

// ─── Selection Handles ──────────────────────────────────────────────────────────
const Handles = ({ shape }) => {
    const H = 8;
    const dot = (x, y, key) => (
        <G key={key}>
            <Circle cx={x} cy={y} r={7} fill="rgba(212,175,55,0.15)" />
            <Rect x={x - H / 2} y={y - H / 2} width={H} height={H} fill={GOLD} stroke="#000" strokeWidth={0.5} rx={2} />
        </G>
    );
    if (shape.type === 'line' || shape.type === 'rect' || shape.type === 'circle') {
        return <>{dot(shape.x1, shape.y1, 'h1')}{dot(shape.x2 ?? shape.x1, shape.y2 ?? shape.y1, 'h2')}</>;
    }
    return null;
};

// ─── Asset Rotation Handle ───────────────────────────────────────────────────────
const RotationHandle = ({ assetScale = 1 }) => {
    const yOff = -55 * assetScale - 18;
    return (
        <G>
            <Line x1={0} y1={-55 * assetScale - 4} x2={0} y2={yOff} stroke={GOLD} strokeWidth={1} strokeDasharray="3 2" />
            <Circle cx={0} cy={yOff - 8} r={8} fill="rgba(212,175,55,0.2)" stroke={GOLD} strokeWidth={1.5} />
            <Path d="M -5 -3 A 5 5 0 1 1 5 -3 L 5 0" stroke={GOLD} strokeWidth={1.5} fill="none"
                transform={`translate(0,${yOff - 8})`} />
        </G>
    );
};

// ─── Render Shapes ─────────────────────────────────────────────────────────────
export const RenderShapes = ({ shapes, selectedShapeId, onSelectShape }) => {
    if (!shapes?.length) return null;
    return (
        <>
            {shapes.map((shape) => {
                if (!shape?.id) return null;
                const sel = shape.id === selectedShapeId;
                const stroke = sel ? GOLD : '#FFFFFF';
                const sw = sel ? 2 : 1.5;
                const onPress = () => onSelectShape?.(shape.id);

                // ─── Asset ───────────────────────────────────────────────
                if (shape.type === 'asset') {
                    const AssetComp = ASSET_SVG_MAP[shape.assetType];
                    const sc = shape.assetScale || 1;
                    const rot = shape.assetRotation || 0;
                    const assetColor = shape.assetColor || '#FFFFFF';
                    return (
                        <G key={shape.id} onPress={onPress}
                            transform={`translate(${shape.x ?? 0},${shape.y ?? 0}) rotate(${rot}) scale(${sc})`}>
                            {sel && <Circle r={65} fill="none" stroke={GOLD_DIM} strokeWidth={2} strokeDasharray="6 3" />}
                            {AssetComp
                                ? <AssetComp sel={sel} color={assetColor} />
                                : <Circle r={20} fill="none" stroke={assetColor} strokeWidth={1.5} />}
                            <SvgText x={0} y={62} textAnchor="middle"
                                fill={sel ? GOLD : assetColor + '80'} fontSize={8} fontWeight="bold">
                                {(shape.assetLabel || shape.assetType || '').toUpperCase()}
                            </SvgText>
                            {sel && <RotationHandle assetScale={sc} />}
                        </G>
                    );
                }

                // ─── Line ────────────────────────────────────────────────
                if (shape.type === 'line') {
                    const len = Math.hypot(shape.x2 - shape.x1, shape.y2 - shape.y1).toFixed(0);
                    return (
                        <G key={shape.id} onPress={onPress}>
                            <Line x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2}
                                stroke={stroke} strokeWidth={sw} />
                            {sel && <>
                                <Handles shape={shape} />
                                <SvgText x={(shape.x1 + shape.x2) / 2} y={(shape.y1 + shape.y2) / 2 - 10}
                                    fill={GOLD} fontSize={11} fontWeight="bold" textAnchor="middle">{len}px</SvgText>
                            </>}
                        </G>
                    );
                }

                // ─── Rect ────────────────────────────────────────────────
                if (shape.type === 'rect') {
                    const x = Math.min(shape.x1, shape.x2);
                    const y = Math.min(shape.y1, shape.y2);
                    const w = Math.abs(shape.x2 - shape.x1);
                    const h = Math.abs(shape.y2 - shape.y1);
                    return (
                        <G key={shape.id} onPress={onPress}>
                            <Rect x={x} y={y} width={w} height={h}
                                stroke={stroke} strokeWidth={sw} fill="rgba(255,255,255,0.04)" />
                            {sel && <>
                                <Handles shape={shape} />
                                <SvgText x={x + w / 2} y={y - 8}
                                    fill={GOLD} fontSize={11} fontWeight="bold" textAnchor="middle">
                                    {w.toFixed(0)} × {h.toFixed(0)}
                                </SvgText>
                            </>}
                        </G>
                    );
                }

                // ─── Circle ──────────────────────────────────────────────
                if (shape.type === 'circle') {
                    const r = Math.hypot(shape.x2 - shape.x1, shape.y2 - shape.y1);
                    return (
                        <G key={shape.id} onPress={onPress}>
                            <Circle cx={shape.x1} cy={shape.y1} r={r}
                                stroke={stroke} strokeWidth={sw} fill="rgba(255,255,255,0.04)" />
                            {sel && <>
                                <Handles shape={shape} />
                                <SvgText x={shape.x1} y={shape.y1 - r - 8}
                                    fill={GOLD} fontSize={11} fontWeight="bold" textAnchor="middle">
                                    R: {r.toFixed(0)}
                                </SvgText>
                            </>}
                        </G>
                    );
                }
                return null;
            })}
        </>
    );
};

// ─── Draft Shape ────────────────────────────────────────────────────────────────
export const DraftShape = ({ type, startPoint, currentPoint }) => {
    if (!startPoint || !currentPoint) return null;
    const dx = currentPoint.x - startPoint.x;
    const dy = currentPoint.y - startPoint.y;

    if (type === 'line') {
        const len = Math.hypot(dx, dy).toFixed(0);
        return (<G>
            <Line x1={startPoint.x} y1={startPoint.y} x2={currentPoint.x} y2={currentPoint.y}
                stroke={DRAFT_CLR} strokeWidth={1.5} strokeDasharray="5 4" />
            <SvgText x={(startPoint.x + currentPoint.x) / 2} y={(startPoint.y + currentPoint.y) / 2 - 10}
                fill={DRAFT_CLR} fontSize={11} fontWeight="bold" textAnchor="middle">{len}px</SvgText>
        </G>);
    }
    if (type === 'rect') {
        const x = Math.min(startPoint.x, currentPoint.x);
        const y = Math.min(startPoint.y, currentPoint.y);
        const w = Math.abs(dx); const h = Math.abs(dy);
        return (<G>
            <Rect x={x} y={y} width={w} height={h}
                stroke={DRAFT_CLR} strokeWidth={1.5} strokeDasharray="5 4" fill="rgba(162,155,254,0.08)" />
            <SvgText x={x + w / 2} y={y - 8}
                fill={DRAFT_CLR} fontSize={11} fontWeight="bold" textAnchor="middle">
                {w.toFixed(0)} × {h.toFixed(0)}
            </SvgText>
        </G>);
    }
    if (type === 'circle') {
        const r = Math.hypot(dx, dy);
        return (<G>
            <Circle cx={startPoint.x} cy={startPoint.y} r={r}
                stroke={DRAFT_CLR} strokeWidth={1.5} strokeDasharray="5 4" fill="rgba(162,155,254,0.08)" />
            <SvgText x={startPoint.x} y={startPoint.y - r - 8}
                fill={DRAFT_CLR} fontSize={11} fontWeight="bold" textAnchor="middle">R: {r.toFixed(0)}</SvgText>
        </G>);
    }
    return null;
};

// ─── Asset Ghost (placement preview) ────────────────────────────────────────────
export const AssetGhost = ({ asset, position }) => {
    if (!asset || !position) return null;
    const Comp = ASSET_SVG_MAP[asset.id];
    return (
        <G transform={`translate(${position.x},${position.y})`} opacity={0.45}>
            {Comp ? <Comp sel={false} color={asset.color || '#FFF'} /> : <Circle r={20} fill="none" stroke={GOLD} strokeWidth={1.5} />}
            <Path d="M -10 0 L 10 0 M 0 -10 L 0 10" stroke={GOLD} strokeWidth={1} />
        </G>
    );
};
