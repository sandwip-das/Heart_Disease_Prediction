'use client';

import React from 'react';
import {
  HeartPulse,
  ShieldCheck,
  Activity,
  FileCheck2,
  Lock,
  Stethoscope,
  ExternalLink,
  BookOpen,
  Info,
} from 'lucide-react';

interface FooterProps {
  onNavigateTab?: (tab: 'assessment' | 'model' | 'batch') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-400 relative z-10">
      {/* Upper Footer: Multi-column Medical Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 shadow-md shadow-rose-500/20 text-white">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                Cardio<span className="text-rose-500">Pulse</span> AI
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Next-generation cardiovascular risk stratification and clinical decision support system
              engineered for evidence-based patient evaluations and preventive cardiology workflows.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>HIPAA-Compliant Diagnostic Protocol</span>
            </div>
          </div>

          {/* Column 2: Clinical Modules */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>Clinical Modules</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('assessment')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Individual Risk Assessment
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('model')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Model Architecture & Metrics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('batch')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Cohort Batch Processing
                </button>
              </li>
              <li>
                <span className="text-slate-400">
                  Telemetry & ECG Lead Monitoring
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Evidence & Methodology */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Evidence & Validation</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-slate-400">
                <span>Validation AUC-ROC</span>
                <span className="font-mono text-emerald-400 font-semibold">94.4%</span>
              </li>
              <li className="flex items-center justify-between text-slate-400">
                <span>Diagnostic Accuracy</span>
                <span className="font-mono text-cyan-400 font-semibold">83.3%</span>
              </li>
              <li className="text-slate-400">
                <span>Ensemble: Random Forest & Scaling</span>
              </li>
              <li className="text-slate-400">
                <span>13 Multivariable Clinical Biomarkers</span>
              </li>
            </ul>
          </div>

          {/* Column 4: System Governance & Security */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Governance & Privacy</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="leading-relaxed">
                Zero telemetry retention on unsecured endpoints. Model inferences are processed in memory with client-side isolation.
              </p>
              <div className="pt-2 flex flex-col gap-1.5 text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <FileCheck2 className="w-3 h-3 text-slate-400" />
                  ISO 27001 Architecture Standard
                </span>
                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 font-medium"
                >
                  <span>API Integration Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer Box */}
        <div className="mt-10 rounded-xl border border-slate-800/90 bg-slate-900/50 p-4 text-[11px] leading-relaxed text-slate-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-300 font-medium">Medical Advisory & Disclaimer: </strong>
            CardioPulse AI is designed solely as a clinical decision support and educational aid for healthcare professionals. It does not provide medical diagnoses, replace physician clinical judgment, or establish definitive treatment plans. All assessments should be corroborated with comprehensive diagnostic testing and specialist consultation.
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {currentYear} CardioPulse AI Medical Systems. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-400">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">
              Clinical Guidelines
            </span>
            <span>·</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">
              Data Privacy & HIPAA
            </span>
            <span>·</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">
              Model Governance
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
