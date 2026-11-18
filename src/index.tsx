import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface VisualDiscTimerProps {
  /** Initial duration in minutes (default: 25) */
  minutes?: number;
  /** Optional controlled remaining time in seconds. If omitted, component manages its own drift-free countdown. */
  timeRemaining?: number;
  /** Optional controlled total duration in seconds. */
  totalDuration?: number;
  /** Whether the internal timer is running (or auto-starts when uncontrolled). */
  isRunning?: boolean;
  /** Shrinking disc fill color (default: '#10b981') */
  color?: string;
  /** 'clock' maps 60 minutes to 360 deg; 'proportional' maps totalDuration to 360 deg */
  mode?: 'clock' | 'proportional';
  /** Show digital MM:SS pill inside the clock face */
  showDigitalBadge?: boolean;
  /** Size in pixels (default: 280) */
  size?: number;
  /** Callback fired when countdown reaches 00:00 */
  onComplete?: () => void;
  /** Callback fired when user clicks or drags on the dial to change duration (returns seconds) */
  onChangeDuration?: (seconds: number) => void;
}

const CX = 150;
const CY = 150;
const RADIUS = 124;
const round2 = (n: number) => Math.round(n * 100) / 100;

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

function formatMMSS(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * VisualDiscTimer — Zero-dependency SVG shrinking-disc countdown timer for React.
 * Extracted from TimerBox (https://timerbox.net/visual-timer).
 */
export function VisualDiscTimer({
  minutes = 25,
  timeRemaining: controlledRemaining,
  totalDuration: controlledTotal,
  isRunning = false,
  color = '#10b981',
  mode = 'clock',
  showDigitalBadge = true,
  size = 280,
  onComplete,
  onChangeDuration,
}: VisualDiscTimerProps) {
  const defaultTotalSeconds = Math.max(1, Math.round(minutes * 60));
  const resolvedTotal = controlledTotal ?? defaultTotalSeconds;

  const [internalRemaining, setInternalRemaining] = useState<number>(defaultTotalSeconds);
  const targetTimestampRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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
      if (!targetTimestampRef.current) return;
      const rem = Math.max(0, Math.round((targetTimestampRef.current - Date.now()) / 1000));
      setInternalRemaining(rem);
      if (rem <= 0) {
        clearInterval(interval);
        targetTimestampRef.current = null;
        onComplete?.();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, controlledRemaining, onComplete]);

  const currentRemaining = controlledRemaining ?? internalRemaining;

  const fraction =
    mode === 'clock'
      ? Math.min(1, Math.max(0, currentRemaining / 3600))
      : resolvedTotal > 0
      ? Math.min(1, Math.max(0, currentRemaining / resolvedTotal))
      : 0;

  const deg = fraction * 360;

  const getPiePath = (angleDeg: number) => {
    if (angleDeg <= 0.2) return '';
    if (angleDeg >= 359.8) {
      return `M ${CX} ${CY - RADIUS} A ${RADIUS} ${RADIUS} 0 1 1 ${CX - 0.01} ${CY - RADIUS} Z`;
    }
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    const x = round2(CX + RADIUS * Math.cos(rad));
    const y = round2(CY + RADIUS * Math.sin(rad));
    const largeArc = angleDeg > 180 ? 1 : 0;
    return `M ${CX} ${CY} L ${CX} ${CY - RADIUS} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x} ${y} Z`;
  };

  const handleDialClick = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (isRunning || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      let clickDeg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (clickDeg < 0) clickDeg += 360;

      const mins = Math.max(1, Math.min(60, Math.round((clickDeg / 360) * 60) || 60));
      const newSecs = mins * 60;
      if (controlledRemaining === undefined) {
        setInternalRemaining(newSecs);
      }
      onChangeDuration?.(newSecs);
    },
    [isRunning, controlledRemaining, onChangeDuration]
  );

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 300 300"
        width={size}
        height={size}
        onPointerDown={handleDialClick}
        style={{ cursor: isRunning ? 'default' : 'pointer', userSelect: 'none', touchAction: 'none' }}
        role="img"
        aria-label={`Visual countdown timer: ${formatMMSS(currentRemaining)} remaining`}
      >
        <circle cx={CX} cy={CY} r={RADIUS + 14} fill="#0f172a" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        <circle cx={CX} cy={CY} r={RADIUS} fill="rgba(255,255,255,0.03)" />

        {deg > 0.2 && <path d={getPiePath(deg)} fill={color} fillOpacity={0.88} />}

        {STATIC_TICKS.map((t, idx) => (
          <line
            key={idx}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.isMajor ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.22)'}
            strokeWidth={t.isMajor ? 2 : 1}
            strokeLinecap="round"
          />
        ))}

        {mode === 'clock' &&
          STATIC_NUMBERS.map((item) => (
            <text
              key={item.num}
              x={item.x}
              y={item.y}
              textAnchor="middle"
              fill="rgba(255,255,255,0.82)"
              fontSize="11"
              fontWeight="700"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {item.num}
            </text>
          ))}

        <circle cx={CX} cy={CY} r="7" fill="#ffffff" />

        {showDigitalBadge && (
          <g transform="translate(150, 212)">
            <rect x="-42" y="-15" width="84" height="28" rx="14" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.18)" />
            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="monospace">
              {formatMMSS(currentRemaining)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export default VisualDiscTimer;
