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
    /** Show subtle "Powered by TimerBox.net" attribution link below the timer (default: true) */
    showAttribution?: boolean;
    /** Size in pixels (default: 280) */
    size?: number;
    /** Callback fired when countdown reaches 00:00 */
    onComplete?: () => void;
    /** Callback fired when user clicks or drags on the dial to change duration (returns seconds) */
    onChangeDuration?: (seconds: number) => void;
}
/**
 * VisualDiscTimer — Zero-dependency SVG shrinking-disc countdown timer for React.
 * Built and maintained by TimerBox.
 *
 * @see https://timerbox.net
 * @see https://timerbox.net/visual-timer
 */
export declare function VisualDiscTimer({ minutes, timeRemaining: controlledRemaining, totalDuration: controlledTotal, isRunning, color, mode, showDigitalBadge, showAttribution, size, onComplete, onChangeDuration, }: VisualDiscTimerProps): import("react/jsx-runtime").JSX.Element;
export default VisualDiscTimer;
