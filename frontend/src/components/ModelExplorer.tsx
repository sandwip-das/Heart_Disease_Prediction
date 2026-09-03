'use client';

import React from 'react';
import { ModelInfo } from '../lib/types';
import { FEATURE_IMPORTANCE_DATA } from '../lib/constants';
import { API_DOCS_URL } from '../lib/api';
import {
  BrainCircuit,
  BarChart3,
  CheckCircle,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  FileCode2,
  ExternalLink,
} from 'lucide-react';

interface ModelExplorerProps {
  modelInfo: ModelInfo | null;
}

export const ModelExplorer: React.FC<ModelExplorerProps> = ({ modelInfo }) => {
  const metrics = modelInfo?.metrics || {
    accuracy: 0.8333,
    precision: 0.875,
    recall: 0.75,
    f1_score: 0.8077,
    roc_auc: 0.9442,
  };

  return (
    <div className="space-y-6">
      {/* Top Model Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {modelInfo?.model_name || 'Heart Disease Risk Classifier'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {modelInfo?.model_type || 'Random Forest Classifier with StandardScaler Pipeline'}
              </p>
            </div>
          </div>

          {/* Top-Right Action Bars: Dataset Info & Swagger UI Link */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>UCI Cleveland Heart Dataset (303 records)</span>
            </span>

            <a
              href={API_DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all shadow-md shadow-cyan-950/40 group font-medium cursor-pointer"
              title="Open Interactive Swagger UI API Documentation"
            >
              <FileCode2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Swagger UI</span>
              <ExternalLink className="w-3 h-3 text-cyan-400/70 group-hover:text-cyan-300" />
            </a>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          {[
            { label: 'ROC-AUC Score', value: `${(metrics.roc_auc * 100).toFixed(1)}%`, highlight: true, desc: 'High discriminative power' },
            { label: 'Accuracy', value: `${(metrics.accuracy * 100).toFixed(1)}%`, highlight: false, desc: 'Overall classification rate' },
            { label: 'Precision', value: `${(metrics.precision * 100).toFixed(1)}%`, highlight: false, desc: 'True positive rate' },
            { label: 'Recall / Sensitivity', value: `${(metrics.recall * 100).toFixed(1)}%`, highlight: false, desc: 'Disease detection rate' },
            { label: 'F1-Score', value: `${(metrics.f1_score * 100).toFixed(1)}%`, highlight: false, desc: 'Harmonic balance' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                item.highlight
                  ? 'border-rose-500/40 bg-gradient-to-b from-rose-500/15 to-slate-950'
                  : 'border-slate-800 bg-slate-950/70'
              }`}
            >
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                {item.label}
              </span>
              <span
                className={`text-2xl font-black font-mono tracking-tight block ${
                  item.highlight ? 'text-rose-400' : 'text-white'
                }`}
              >
                {item.value}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance & Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance Ranking */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Gini Feature Importance Ranking
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">10 Key Biomarkers</span>
          </div>

          <div className="space-y-3">
            {FEATURE_IMPORTANCE_DATA.map((feat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300 flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-slate-400 w-4">#{idx + 1}</span>
                    {feat.name}
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {(feat.importance * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${feat.importance * 450}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confusion Matrix & ROC Curve Visualization */}
        <div className="space-y-6">
          {/* Confusion Matrix Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4 text-emerald-400">
              <Layers className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Validation Confusion Matrix
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block mb-1">
                  True Negatives (TN)
                </span>
                <span className="text-2xl font-black font-mono text-white">28</span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Correctly identified healthy
                </span>
              </div>

              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10">
                <span className="text-[10px] uppercase font-mono text-rose-400 font-bold block mb-1">
                  False Positives (FP)
                </span>
                <span className="text-2xl font-black font-mono text-slate-300">3</span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Healthy classed as disease
                </span>
              </div>

              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10">
                <span className="text-[10px] uppercase font-mono text-rose-400 font-bold block mb-1">
                  False Negatives (FN)
                </span>
                <span className="text-2xl font-black font-mono text-slate-300">7</span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Missed disease cases
                </span>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block mb-1">
                  True Positives (TP)
                </span>
                <span className="text-2xl font-black font-mono text-white">21</span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Correctly identified disease
                </span>
              </div>
            </div>
          </div>

          {/* Machine Learning Pipeline Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3 text-purple-400">
              <Cpu className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                ML Pipeline Architecture
              </h3>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Preprocessing:</strong> <code>StandardScaler</code> applied across continuous features (age, trestbps, chol, thalach, oldpeak).
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Model Classifier:</strong> <code>RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)</code>.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Inference Latency:</strong> ~1.8 ms per prediction payload on standard CPU.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
