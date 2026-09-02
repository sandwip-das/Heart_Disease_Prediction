'use client';

import React from 'react';
import { PredictionResponse, HeartDiseaseInput, FeatureImpact } from '../lib/types';
import { analyzeBiomarkerImpacts } from '../lib/api';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  TrendingUp,
  Activity,
  ArrowRight,
  Stethoscope,
  Info,
} from 'lucide-react';

interface ResultCardProps {
  prediction: PredictionResponse | null;
  inputData: HeartDiseaseInput;
  onOpenReport: () => void;
}

export const PredictionResultCard: React.FC<ResultCardProps> = ({
  prediction,
  inputData,
  onOpenReport,
}) => {
  if (!prediction) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center backdrop-blur-md flex flex-col items-center justify-center min-h-[380px]">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4 text-slate-500 ring-1 ring-slate-700/50">
          <Activity className="w-8 h-8 animate-pulse text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-slate-300 mb-1">
          Awaiting Biomarker Submission
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Select a patient preset or adjust clinical parameters on the left, then click{' '}
          <span className="text-rose-400 font-medium">"Run AI Heart Risk Prediction"</span>.
        </p>
      </div>
    );
  }

  const impacts: FeatureImpact[] = analyzeBiomarkerImpacts(inputData);
  const positiveImpacts = impacts.filter((i) => i.impact === 'positive');
  const negativeImpacts = impacts.filter((i) => i.impact === 'negative');

  const probPercent = Math.round(prediction.probability * 100);

  // Status configuration
  const config = {
    Low: {
      color: 'emerald',
      bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      ringColor: '#10b981',
      icon: ShieldCheck,
      headline: 'Low Cardiovascular Disease Risk',
      description:
        'Patient indicators reflect physiological stability with low probability of significant coronary artery disease.',
    },
    Moderate: {
      color: 'amber',
      bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      ringColor: '#f59e0b',
      icon: AlertTriangle,
      headline: 'Moderate / Borderline Cardiovascular Risk',
      description:
        'Biomarkers show intermediate risk. Secondary cardiological diagnostic evaluation and lifestyle intervention recommended.',
    },
    High: {
      color: 'rose',
      bgGradient: 'from-rose-500/15 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-500/50',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
      ringColor: '#f43f5e',
      icon: ShieldAlert,
      headline: 'High Probability of Heart Disease',
      description:
        'Strong clinical indicators of coronary ischemia and high disease probability. Immediate cardiological consultation advised.',
    },
  }[prediction.risk_level] || {
    color: 'rose',
    bgGradient: 'from-rose-500/10 to-transparent',
    borderColor: 'border-rose-500/30',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    ringColor: '#f43f5e',
    icon: ShieldAlert,
    headline: 'High Risk',
    description: 'High risk detected',
  };

  const IconComponent = config.icon;

  // SVG Gauge calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probPercent / 100) * circumference;

  return (
    <div
      className={`rounded-2xl border ${config.borderColor} bg-gradient-to-b ${config.bgGradient} bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden`}
    >
      {/* Top Header & Badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider border ${config.badgeBg}`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              {prediction.risk_level} Risk Tier
            </span>
            <span className="text-xs font-mono text-slate-400">
              Binary Prediction: {prediction.prediction === 1 ? 'Positive (1)' : 'Negative (0)'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {config.headline}
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="rgba(51, 65, 85, 0.4)"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={config.ringColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black font-mono text-white tracking-tighter">
              {probPercent}%
            </span>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
              Probability
            </span>
          </div>
        </div>
      </div>

      {/* Primary Contributing Risk Factors */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            Explainable AI Biomarker Attribution
          </span>
          <span className="text-[11px] text-slate-400">
            {positiveImpacts.length} Risk Factors · {negativeImpacts.length} Protective Factors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {impacts.slice(0, 4).map((impact, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                impact.impact === 'positive'
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : 'bg-emerald-950/20 border-emerald-500/30'
              }`}
            >
              <div className="flex items-center justify-between font-medium mb-1">
                <span className="text-slate-200 font-semibold">{impact.label}</span>
                <span
                  className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-bold ${
                    impact.impact === 'positive'
                      ? 'text-rose-400 bg-rose-500/10'
                      : 'text-emerald-400 bg-emerald-500/10'
                  }`}
                >
                  {impact.value}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {impact.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onOpenReport}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all shadow-md"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Generate Full Medical Report</span>
        </button>
      </div>
    </div>
  );
};
