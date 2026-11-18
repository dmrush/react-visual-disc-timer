# react-visual-disc-timer ⏳

A lightweight, **zero-dependency SVG visual shrinking-disc countdown timer** for React (inspired by the classic physical *Time Timer* clock face).

Built for **ADHD time-blindness support**, **classroom smartboards**, **Pomodoro focus workspaces**, and **student study apps**. Extracted from the production visual clock engine powering **[TimerBox](https://timerbox.net/visual-timer)**.

---

## ✨ Live Production Demos

Try the interactive full-screen visual countdowns in your browser (no signup, zero ads):

| Preset / Use Case | Live Interactive Demo | Mode |
|---|---|---|
| **Interactive Visual Timer (Custom)** | **[timerbox.net/visual-timer](https://timerbox.net/visual-timer)** | 60m Clock & Proportional |
| **5 Minute Visual Timer** | **[5 Minute Visual Timer](https://timerbox.net/visual-timer/5-minute-visual-timer)** | Quick Classroom Transition |
| **10 Minute Visual Timer** | **[10 Minute Visual Timer](https://timerbox.net/visual-timer/10-minute-visual-timer)** | Reading & Warmup Sprint |
| **15 Minute Visual Timer** | **[15 Minute Visual Timer](https://timerbox.net/visual-timer/15-minute-visual-timer)** | Standup & Homework Block |
| **20 Minute Visual Timer** | **[20 Minute Visual Timer](https://timerbox.net/visual-timer/20-minute-visual-timer)** | Deep Focus Interval |
| **25 Minute Pomodoro Visual Timer** | **[25 Minute Visual Timer](https://timerbox.net/visual-timer/25-minute-visual-timer)** | Classic Pomodoro Session |
| **30 Minute Visual Timer** | **[30 Minute Visual Timer](https://timerbox.net/visual-timer/30-minute-visual-timer)** | Study & Exam Practice |
| **ADHD Focus & Time Blindness Timer** | **[ADHD Focus Timer](https://timerbox.net/adhd-timer)** | Sensory & Brown Noise |
| **Classroom Smartboard Timer** | **[Classroom Timer](https://timerbox.net/classroom-timer)** | Fullscreen Projector View |

> **Want to embed this timer without React?** Use the **[Free HTML / Notion Timer Embed Generator](https://timerbox.net/tools/embed-timer)** to copy a 1-line `<iframe>` widget for Notion, Google Sites, Canvas LMS, or WordPress.

---

## 📦 Installation

```bash
npm install react-visual-disc-timer
```

---

## 🚀 Quick Start

```tsx
import React, { useState } from 'react';
import { VisualDiscTimer } from 'react-visual-disc-timer';

export default function FocusSession() {
  const [running, setRunning] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <VisualDiscTimer
        minutes={25}
        isRunning={running}
        color="#10b981"
        mode="clock"
        size={300}
        onComplete={() => alert('Session complete!')}
      />
      <button onClick={() => setRunning(!running)}>
        {running ? 'Pause' : 'Start 25m Timer'}
      </button>
    </div>
  );
}
```

---

## ⚙️ Props Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `minutes` | `number` | `25` | Initial duration in minutes (`1` – `60` for `clock` mode). |
| `isRunning` | `boolean` | `false` | Starts or pauses the built-in drift-free wall-clock countdown. |
| `color` | `string` | `'#10b981'` | Hex or RGB color for the shrinking pie wedge. |
| `mode` | `'clock' \| 'proportional'` | `'clock'` | `'clock'` maps 60 minutes to 360°; `'proportional'` starts as a full 360° circle for any duration. |
| `size` | `number` | `280` | Width and height of the SVG clock in pixels. |
| `showDigitalBadge` | `boolean` | `true` | Renders the `MM:SS` digital pill inside the lower half of the dial. |
| `timeRemaining` | `number` | `undefined` | Optional controlled remaining seconds (if managing timer state externally). |
| `totalDuration` | `number` | `undefined` | Optional controlled total duration in seconds. |
| `onComplete` | `() => void` | `undefined` | Callback triggered when countdown hits `00:00`. |
| `onChangeDuration` | `(seconds: number) => void` | `undefined` | Triggered when user clicks on the dial while paused to set a new minute. |

---

## 🧠 Why Drift-Free Wall-Clock Timing Matters

Standard JavaScript `setInterval(() => setSeconds(s => s - 1), 1000)` timers freeze or throttle to 1 tick per minute when Chrome, Edge, or Safari puts a background tab to sleep.

`react-visual-disc-timer` uses the same wall-clock delta architecture (`targetTimestamp - Date.now()`) used across **[TimerBox's Minute Countdowns](https://timerbox.net/timers/minute-timers)** and **[Online Pomodoro Timer](https://timerbox.net)** so your countdown never loses a single second in background tabs.

---

## 🔗 Related Free Classroom & Productivity Tools

* **[Online Pomodoro Timer & Timeboxing Workspace](https://timerbox.net)**
* **[Interactive Teaching Clock for Kids](https://timerbox.net/tools/teaching-clock)**
* **[Classroom Noise Level Meter (Microphone Visualizer)](https://timerbox.net/tools/classroom-noise-meter)**
* **[Bomb Countdown Timer with Fuse & Explosion](https://timerbox.net/timers/bomb-timer)**
* **[Sensory & Hourglass Timers Hub](https://timerbox.net/timers/sensory-timers)**

---

## 📄 License

MIT © [TimerBox](https://timerbox.net)
