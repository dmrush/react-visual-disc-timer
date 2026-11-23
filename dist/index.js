import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
const CX = 150;
const CY = 150;
const RADIUS = 124;
const round2 = (n) => Math.round(n * 100) / 100;
const STATIC_TICKS = Array.from({ length: 60 }, (_, i) => {
    const isMajor = i % 5 === 0;
    const tickAngle = (i * 6 * Math.PI) / 180;
    const rInner = isMajor ? RADIUS - 10 : RADIUS - 5;
    const rOuter = RADIUS - 2;
    return {
        x1: round2(CX + rInner * Math.sin(tickAngle)),
        y1: round2(CY - rInner * Math.cos(tickAngle)),
        x2: round2(CX + rOuter * Math.sin(tickAngle)),
        y2: round2(CY - rOuter * Math.cos(tickAngle)),
        isMajor,
    };
});
const STATIC_NUMBERS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((num) => {
    const numAngle = ((num / 60) * 360 * Math.PI) / 180;
    const rNum = RADIUS - 20;
    return {
        num,
        x: round2(CX + rNum * Math.sin(numAngle)),
        y: round2(CY - rNum * Math.cos(numAngle) + 4),
    };
});
function formatMMSS(seconds) {
    const safe = Math.max(0, Math.round(seconds));
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
/**
 * VisualDiscTimer — Zero-dependency SVG shrinking-disc countdown timer for React.
 * Built and maintained by TimerBox.
 *
 * @see https://timerbox.net
 * @see https://timerbox.net/visual-timer
 */
export function VisualDiscTimer({ minutes = 25, timeRemaining: controlledRemaining, totalDuration: controlledTotal, isRunning = false, color = '#10b981', mode = 'clock', showDigitalBadge = true, showAttribution = true, size = 280, onComplete, onChangeDuration, }) {
    const defaultTotalSeconds = Math.max(1, Math.round(minutes * 60));
    const resolvedTotal = controlledTotal !== null && controlledTotal !== void 0 ? controlledTotal : defaultTotalSeconds;
    const [internalRemaining, setInternalRemaining] = useState(defaultTotalSeconds);
    const targetTimestampRef = useRef(null);
    const svgRef = useRef(null);
    useEffect(() => {
        if (controlledRemaining === undefined) {
            setInternalRemaining(defaultTotalSeconds);
        }
    }, [defaultTotalSeconds, controlledRemaining]);
    // Drift-free wall-clock countdown when uncontrolled
    useEffect(() => {
        if (controlledRemaining !== undefined || !isRunning) {
            targetTimestampRef.current = null;
            return;
        }
        targetTimestampRef.current = Date.now() + internalRemaining * 1000;
        const interval = setInterval(() => {
            if (!targetTimestampRef.current)
                return;
            const rem = Math.max(0, Math.round((targetTimestampRef.current - Date.now()) / 1000));
            setInternalRemaining(rem);
            if (rem <= 0) {
                clearInterval(interval);
                targetTimestampRef.current = null;
                onComplete === null || onComplete === void 0 ? void 0 : onComplete();
            }
        }, 200);
        return () => clearInterval(interval);
    }, [isRunning, controlledRemaining, onComplete]);
    const currentRemaining = controlledRemaining !== null && controlledRemaining !== void 0 ? controlledRemaining : internalRemaining;
    const fraction = mode === 'clock'
        ? Math.min(1, Math.max(0, currentRemaining / 3600))
        : resolvedTotal > 0
            ? Math.min(1, Math.max(0, currentRemaining / resolvedTotal))
            : 0;
    const deg = fraction * 360;
    const getPiePath = (angleDeg) => {
        if (angleDeg <= 0.2)
            return '';
        if (angleDeg >= 359.8) {
            return `M ${CX} ${CY - RADIUS} A ${RADIUS} ${RADIUS} 0 1 1 ${CX - 0.01} ${CY - RADIUS} Z`;
        }
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        const x = round2(CX + RADIUS * Math.cos(rad));
        const y = round2(CY + RADIUS * Math.sin(rad));
        const largeArc = angleDeg > 180 ? 1 : 0;
        return `M ${CX} ${CY} L ${CX} ${CY - RADIUS} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x} ${y} Z`;
    };
    const handleDialClick = useCallback((e) => {
        if (isRunning || !svgRef.current)
            return;
        const rect = svgRef.current.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        let clickDeg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        if (clickDeg < 0)
            clickDeg += 360;
        const mins = Math.max(1, Math.min(60, Math.round((clickDeg / 360) * 60) || 60));
        const newSecs = mins * 60;
        if (controlledRemaining === undefined) {
            setInternalRemaining(newSecs);
        }
        onChangeDuration === null || onChangeDuration === void 0 ? void 0 : onChangeDuration(newSecs);
    }, [isRunning, controlledRemaining, onChangeDuration]);
    return (_jsxs("div", { style: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }, children: [_jsxs("svg", { ref: svgRef, viewBox: "0 0 300 300", width: size, height: size, onPointerDown: handleDialClick, style: { cursor: isRunning ? 'default' : 'pointer', userSelect: 'none', touchAction: 'none' }, role: "img", "aria-label": `Visual countdown timer: ${formatMMSS(currentRemaining)} remaining`, children: [_jsx("circle", { cx: CX, cy: CY, r: RADIUS + 14, fill: "#0f172a", stroke: "rgba(255,255,255,0.12)", strokeWidth: "2" }), _jsx("circle", { cx: CX, cy: CY, r: RADIUS, fill: "rgba(255,255,255,0.03)" }), deg > 0.2 && _jsx("path", { d: getPiePath(deg), fill: color, fillOpacity: 0.88 }), STATIC_TICKS.map((t, idx) => (_jsx("line", { x1: t.x1, y1: t.y1, x2: t.x2, y2: t.y2, stroke: t.isMajor ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.22)', strokeWidth: t.isMajor ? 2 : 1, strokeLinecap: "round" }, idx))), mode === 'clock' &&
                        STATIC_NUMBERS.map((item) => (_jsx("text", { x: item.x, y: item.y, textAnchor: "middle", fill: "rgba(255,255,255,0.82)", fontSize: "11", fontWeight: "700", fontFamily: "system-ui, -apple-system, sans-serif", children: item.num }, item.num))), _jsx("circle", { cx: CX, cy: CY, r: "7", fill: "#ffffff" }), showDigitalBadge && (_jsxs("g", { transform: "translate(150, 212)", children: [_jsx("rect", { x: "-42", y: "-15", width: "84", height: "28", rx: "14", fill: "rgba(15, 23, 42, 0.85)", stroke: "rgba(255,255,255,0.18)" }), _jsx("text", { x: "0", y: "4", textAnchor: "middle", fill: "#ffffff", fontSize: "14", fontWeight: "800", fontFamily: "monospace", children: formatMMSS(currentRemaining) })] }))] }), showAttribution && (_jsxs("a", { href: "https://timerbox.net", target: "_blank", rel: "noopener noreferrer", title: "Free Online Visual Timer by TimerBox", style: {
                    marginTop: 6,
                    fontSize: 11,
                    lineHeight: 1.2,
                    color: 'inherit',
                    opacity: 0.65,
                    textDecoration: 'none',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }, children: ["Powered by ", _jsx("strong", { children: "TimerBox.net" })] }))] }));
}
export default VisualDiscTimer;
