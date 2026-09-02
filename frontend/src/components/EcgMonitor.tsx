'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Activity, Heart, Volume2, VolumeX } from 'lucide-react';

interface EcgMonitorProps {
  heartRate: number; // e.g. 75 or thalach value
  stDepression?: number; // e.g. oldpeak (0.0 to 6.0)
  hasAbnormality?: boolean;
}

export const EcgMonitor: React.FC<EcgMonitorProps> = ({
  heartRate = 75,
  stDepression = 0.0,
  hasAbnormality = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play subtle cardiology beep if enabled
  const playBeep = () => {
    if (!isPlayingSound) return;
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 tone
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // History of points for smooth sweep
    const trailLength = 80;
    const points: { x: number; y: number }[] = [];

    // ECG waveform generation parameters
    // Standard P-Q-R-S-T wave model
    let cycleTime = 0;
    const bpm = Math.max(45, Math.min(220, heartRate || 75));
    const cycleDuration = (60 / bpm) * 60; // frames per beat at 60fps
    let lastBeepFrame = 0;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      cycleTime = (cycleTime + 1) % cycleDuration;
      const progress = cycleTime / cycleDuration;

      // Base baseline
      let y = centerY;

      // P wave (0.10 - 0.20)
      if (progress >= 0.1 && progress < 0.2) {
        const pProg = (progress - 0.1) / 0.1;
        y -= Math.sin(pProg * Math.PI) * 10;
      }
      // Q wave (0.28 - 0.32)
      else if (progress >= 0.28 && progress < 0.32) {
        const qProg = (progress - 0.28) / 0.04;
        y += Math.sin(qProg * Math.PI) * 8;
      }
      // R wave spike (0.32 - 0.38)
      else if (progress >= 0.32 && progress < 0.38) {
        const rProg = (progress - 0.32) / 0.06;
        y -= Math.sin(rProg * Math.PI) * 45;
        // Trigger beep at peak of R wave
        if (rProg > 0.4 && rProg < 0.6 && frameCount - lastBeepFrame > 20) {
          playBeep();
          lastBeepFrame = frameCount;
        }
      }
      // S wave dip (0.38 - 0.43)
      else if (progress >= 0.38 && progress < 0.43) {
        const sProg = (progress - 0.38) / 0.05;
        y += Math.sin(sProg * Math.PI) * 16;
      }
      // ST Segment & T wave (0.43 - 0.70)
      else if (progress >= 0.43 && progress < 0.70) {
        const tProg = (progress - 0.43) / 0.27;
        // Apply ST depression or inverted T-wave if ischemic abnormality
        const stDisplacement = (stDepression || 0) * 4.5;
        let tWaveHeight = 14;
        if (hasAbnormality) {
          tWaveHeight = -8; // Inverted T wave
        }
        y += stDisplacement; // Depression goes down in standard voltage
        y -= Math.sin(tProg * Math.PI) * tWaveHeight;
      } else {
        // Small baseline noise / micro-fluctuation
        y += (Math.random() - 0.5) * 1.5;
      }

      points.push({ x, y });
      if (points.length > width) {
        points.shift();
      }

      // Draw background grid
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 0, width, height);

      // Minor grid lines
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 12;
      for (let gx = 0; gx < width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Major grid lines
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)';
      const majorGridSize = 48;
      for (let gx = 0; gx < width; gx += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Draw ECG wave
      if (points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = hasAbnormality || (stDepression && stDepression > 1.5) ? '#f43f5e' : '#10b981';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = hasAbnormality || (stDepression && stDepression > 1.5) ? 'rgba(244, 63, 94, 0.6)' : 'rgba(16, 185, 129, 0.6)';
        ctx.shadowBlur = 8;
        ctx.lineJoin = 'round';

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // Sweep head highlight
      const currentPoint = points[points.length - 1];
      if (currentPoint) {
        ctx.beginPath();
        ctx.arc(currentPoint.x, currentPoint.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      x += 2.2;
      if (x > width) {
        x = 0;
        points.length = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [heartRate, stDepression, hasAbnormality, isPlayingSound]);

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md overflow-hidden">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono text-cyan-400 font-semibold tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> LEAD II CONTINUOUS ECG
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
            25mm/s · 10mm/mV
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlayingSound(!isPlayingSound)}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-800/60"
            title={isPlayingSound ? 'Mute Heart Tone' : 'Enable Heart Tone Audio'}
          >
            {isPlayingSound ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 animate-heartbeat" />
            <span className="text-white font-bold text-sm">{heartRate}</span>
            <span className="text-slate-400 text-[11px]">BPM</span>
          </div>
        </div>
      </div>

      {/* Canvas Display */}
      <div className="relative w-full overflow-hidden rounded-lg border border-slate-800/80 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={650}
          height={110}
          className="w-full h-[110px] block"
        />

        {/* Real-time Overlay Badges */}
        <div className="absolute bottom-2 left-3 flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
            hasAbnormality || (stDepression && stDepression > 1.5)
              ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
          }`}>
            {hasAbnormality || (stDepression && stDepression > 1.5) ? 'ISCHEMIC ST-DISPLACEMENT' : 'SINUS RHYTHM'}
          </div>
          {stDepression > 0 && (
            <div className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/80 border border-slate-700 text-amber-300">
              ST-Dep: -{stDepression}mm
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
