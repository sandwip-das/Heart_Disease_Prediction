'use client';

import React, { useState } from 'react';
import { HeartDiseaseInput, PredictionResponse } from '../lib/types';
import { SAMPLE_BATCH_PATIENTS } from '../lib/constants';
import { predictHeartDisease } from '../lib/api';
import {
  Users,
  Play,
  Download,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface BatchPredictorProps {
  onSelectPatient: (patient: HeartDiseaseInput) => void;
}

interface BatchResult {
  patientId: string;
  name: string;
  input: HeartDiseaseInput;
  prediction?: PredictionResponse;
  status: 'idle' | 'loading' | 'done' | 'error';
}

export const BatchPredictor: React.FC<BatchPredictorProps> = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState<BatchResult[]>(
    SAMPLE_BATCH_PATIENTS.map((p) => ({
      patientId: p.patientId,
      name: p.name,
      input: p,
      status: 'idle',
    }))
  );
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  const runBatchPredictions = async () => {
    setIsBatchRunning(true);
    const updated = [...patients];

    for (let i = 0; i < updated.length; i++) {
      updated[i].status = 'loading';
      setPatients([...updated]);

      try {
        const pred = await predictHeartDisease(updated[i].input);
        updated[i].prediction = pred;
        updated[i].status = 'done';
      } catch {
        updated[i].status = 'error';
      }
      setPatients([...updated]);
    }
    setIsBatchRunning(false);
  };

  const exportCSV = () => {
    const headers = [
      'PatientID',
      'Name',
      'Age',
      'Sex',
      'RestBP',
      'Cholesterol',
      'MaxHR',
      'Prediction',
      'Probability',
      'RiskLevel',
    ];
    const rows = patients.map((p) => [
      p.patientId,
      `"${p.name}"`,
      p.input.age,
      p.input.sex === 1 ? 'Male' : 'Female',
      p.input.trestbps,
      p.input.chol,
      p.input.thalach,
      p.prediction ? (p.prediction.heart_disease ? 'Positive' : 'Negative') : 'N/A',
      p.prediction ? `${Math.round(p.prediction.probability * 100)}%` : 'N/A',
      p.prediction ? p.prediction.risk_level : 'N/A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cohort_cardiac_predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Batch Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Cohort Batch Inference & Patient Triage
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simultaneously analyze multi-patient clinical cohorts to prioritize high-risk cardiac cases.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={runBatchPredictions}
              disabled={isBatchRunning}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-md shadow-rose-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isBatchRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Cohort...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Batch Inference</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Cohort Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3.5">Patient ID / Name</th>
                <th className="px-4 py-3.5">Age / Sex</th>
                <th className="px-4 py-3.5">Rest BP</th>
                <th className="px-4 py-3.5">Cholesterol</th>
                <th className="px-4 py-3.5">Max HR</th>
                <th className="px-4 py-3.5">ST Depression</th>
                <th className="px-4 py-3.5">Risk Level</th>
                <th className="px-4 py-3.5">Probability</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {patients.map((p) => {
                const pred = p.prediction;
                return (
                  <tr key={p.patientId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-medium">
                      <div className="text-white font-semibold">{p.name}</div>
                      <div className="text-[10px] font-mono text-cyan-400">{p.patientId}</div>
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      {p.input.age}y · {p.input.sex === 1 ? 'M' : 'F'}
                    </td>
                    <td className="px-4 py-3.5 font-mono">{p.input.trestbps} mmHg</td>
                    <td className="px-4 py-3.5 font-mono">
                      <span className={p.input.chol > 240 ? 'text-rose-400' : ''}>
                        {p.input.chol} mg/dl
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono">{p.input.thalach} BPM</td>
                    <td className="px-4 py-3.5 font-mono">{p.input.oldpeak.toFixed(1)} mm</td>
                    <td className="px-4 py-3.5">
                      {p.status === 'loading' ? (
                        <span className="text-[10px] font-mono text-amber-400 animate-pulse">
                          Evaluating...
                        </span>
                      ) : pred ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            pred.risk_level === 'High'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : pred.risk_level === 'Moderate'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {pred.risk_level === 'High' && <ShieldAlert className="w-3 h-3" />}
                          {pred.risk_level === 'Moderate' && <AlertTriangle className="w-3 h-3" />}
                          {pred.risk_level === 'Low' && <ShieldCheck className="w-3 h-3" />}
                          {pred.risk_level}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px] font-mono">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold">
                      {pred ? (
                        <span
                          className={
                            pred.probability > 0.6
                              ? 'text-rose-400'
                              : pred.probability > 0.35
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        >
                          {Math.round(pred.probability * 100)}%
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectPatient(p.input)}
                        className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline font-medium"
                      >
                        <span>Load Profile</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
