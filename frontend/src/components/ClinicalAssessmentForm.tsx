'use client';

import React from 'react';
import { HeartDiseaseInput, PatientPreset, PatientProfile } from '../lib/types';
import { PATIENT_PRESETS, DEFAULT_PATIENT_INPUT } from '../lib/constants';
import {
  User,
  Heart,
  Activity,
  Flame,
  Stethoscope,
  Info,
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  BadgeCheck,
  UserCheck,
  Hash,
} from 'lucide-react';

interface FormProps {
  formData: HeartDiseaseInput;
  setFormData: React.Dispatch<React.SetStateAction<HeartDiseaseInput>>;
  patientProfile: PatientProfile;
  setPatientProfile: React.Dispatch<React.SetStateAction<PatientProfile>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ClinicalAssessmentForm: React.FC<FormProps> = ({
  formData,
  setFormData,
  patientProfile,
  setPatientProfile,
  onSubmit,
  isLoading,
}) => {
  const handleChange = (key: keyof HeartDiseaseInput, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleProfileChange = (key: keyof PatientProfile, value: string) => {
    setPatientProfile((prev) => ({ ...prev, [key]: value }));
  };

  const loadPreset = (preset: PatientPreset) => {
    setFormData(preset.data);
    setPatientProfile({
      name: preset.name,
      patientId: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
      doctorName: 'Dr. Cardiology Consultant',
      notes: preset.subtitle,
    });
  };

  const handleReset = () => {
    setFormData(DEFAULT_PATIENT_INPUT);
    setPatientProfile({
      name: 'John Doe',
      patientId: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
      doctorName: 'Dr. Cardiology Consultant',
      notes: '',
    });
  };

  const generateNewId = () => {
    setPatientProfile((prev) => ({
      ...prev,
      patientId: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* 1. Patient Identification & Demographics Info Card */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/20 via-slate-900/60 to-slate-900/60 p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                Patient Demographics & Medical Record
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Required
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Enter the patient's identity and clinical details for personal risk stratification.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={generateNewId}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 transition-colors"
            title="Generate new Medical Record Number"
          >
            <Hash className="w-3 h-3" />
            <span>New MRN</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Patient Full Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Patient Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={patientProfile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                placeholder="e.g. Mohammad Rahim, Sarah Jenkins"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/50 transition-all"
                required
              />
            </div>
          </div>

          {/* Patient MRN / ID */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Medical Record No. (MRN / ID)
            </label>
            <input
              type="text"
              value={patientProfile.patientId}
              onChange={(e) => handleProfileChange('patientId', e.target.value)}
              placeholder="e.g. MRN-849201"
              className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-slate-950 border border-slate-800 text-cyan-400 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              required
            />
          </div>

          {/* Attending Physician */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Attending Physician / Doctor
            </label>
            <input
              type="text"
              value={patientProfile.doctorName || ''}
              onChange={(e) => handleProfileChange('doctorName', e.target.value)}
              placeholder="e.g. Dr. S. Ahmed, Cardiologist"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/50 transition-all"
            />
          </div>
        </div>

        {/* Clinical History / Notes */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Clinical History / Chief Complaint Notes (Optional)
          </label>
          <input
            type="text"
            value={patientProfile.notes || ''}
            onChange={(e) => handleProfileChange('notes', e.target.value)}
            placeholder="e.g. Complains of exertional retrosternal discomfort and shortness of breath for 3 weeks..."
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/50 transition-all"
          />
        </div>
      </div>

      {/* 2. Quick-Load Preset Profiles */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Or Choose a Quick-Load Clinical Preset
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PATIENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => loadPreset(preset)}
              className="text-left p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/70 hover:bg-slate-800/50 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                  {preset.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${preset.badgeColor}`}>
                  {preset.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                {preset.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Grid of Clinical Biomarker Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Category 1: Demographics & Hemodynamics */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-rose-400">
            <User className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Demographics & Baseline Vitals
            </h3>
          </div>

          {/* Age */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="font-medium text-slate-300">
                Patient Age (years)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={18}
                  max={100}
                  value={formData.age}
                  onChange={(e) => handleChange('age', Math.max(18, Math.min(100, Number(e.target.value) || 18)))}
                  className="w-16 px-2 py-0.5 text-right font-mono text-cyan-400 font-bold text-xs bg-slate-950 border border-slate-800 rounded-md focus:outline-none focus:border-cyan-500"
                />
                <span className="text-slate-400 font-mono text-[11px]">yrs</span>
              </div>
            </div>
            <input
              type="range"
              min={18}
              max={100}
              step={1}
              value={formData.age}
              onChange={(e) => handleChange('age', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>18 yrs</span>
              <span>Ref: 20-65</span>
              <span>100 yrs</span>
            </div>
          </div>

          {/* Sex */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Biological Sex
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Female (0)', value: 0 },
                { label: 'Male (1)', value: 1 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('sex', opt.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    formData.sex === opt.value
                      ? 'border-rose-500/50 bg-rose-500/15 text-white font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resting Blood Pressure */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="font-medium text-slate-300">
                Resting Blood Pressure (trestbps)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={80}
                  max={220}
                  value={formData.trestbps}
                  onChange={(e) => handleChange('trestbps', Math.max(80, Math.min(220, Number(e.target.value) || 120)))}
                  className="w-16 px-2 py-0.5 text-right font-mono text-cyan-400 font-bold text-xs bg-slate-950 border border-slate-800 rounded-md focus:outline-none focus:border-cyan-500"
                />
                <span className="text-slate-400 font-mono text-[11px]">mmHg</span>
              </div>
            </div>
            <input
              type="range"
              min={80}
              max={220}
              step={1}
              value={formData.trestbps}
              onChange={(e) => handleChange('trestbps', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>80</span>
              <span>Normal &lt; 120 mmHg</span>
              <span>220</span>
            </div>
          </div>

          {/* Max Heart Rate Achieved (thalach) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="font-medium text-slate-300">
                Max Heart Rate Achieved (thalach)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={60}
                  max={220}
                  value={formData.thalach}
                  onChange={(e) => handleChange('thalach', Math.max(60, Math.min(220, Number(e.target.value) || 150)))}
                  className="w-16 px-2 py-0.5 text-right font-mono text-emerald-400 font-bold text-xs bg-slate-950 border border-slate-800 rounded-md focus:outline-none focus:border-emerald-500"
                />
                <span className="text-slate-400 font-mono text-[11px]">BPM</span>
              </div>
            </div>
            <input
              type="range"
              min={60}
              max={220}
              step={1}
              value={formData.thalach}
              onChange={(e) => handleChange('thalach', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>60 bpm</span>
              <span>Target: ~150-180</span>
              <span>220 bpm</span>
            </div>
          </div>
        </div>

        {/* Category 2: Biomarkers & Chemistry */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-cyan-400">
            <Activity className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Biomarkers & Laboratory Chemistry
            </h3>
          </div>

          {/* Serum Cholesterol */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="font-medium text-slate-300">
                Serum Cholesterol (chol)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={100}
                  max={550}
                  value={formData.chol}
                  onChange={(e) => handleChange('chol', Math.max(100, Math.min(550, Number(e.target.value) || 200)))}
                  className={`w-16 px-2 py-0.5 text-right font-mono font-bold text-xs bg-slate-950 border border-slate-800 rounded-md focus:outline-none focus:border-cyan-500 ${
                    formData.chol > 240 ? 'text-rose-400' : 'text-cyan-400'
                  }`}
                />
                <span className="text-slate-400 font-mono text-[11px]">mg/dl</span>
              </div>
            </div>
            <input
              type="range"
              min={100}
              max={550}
              step={1}
              value={formData.chol}
              onChange={(e) => handleChange('chol', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>100 mg/dl</span>
              <span>Desirable &lt; 200</span>
              <span>550 mg/dl</span>
            </div>
          </div>

          {/* Fasting Blood Sugar */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Fasting Blood Sugar (fbs &gt; 120 mg/dl)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '≤ 120 mg/dl (Normal)', value: 0 },
                { label: '> 120 mg/dl (Elevated)', value: 1 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('fbs', opt.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    formData.fbs === opt.value
                      ? 'border-cyan-500/50 bg-cyan-500/15 text-white font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resting ECG */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Resting Electrocardiogram (restecg)
            </label>
            <div className="space-y-1.5">
              {[
                { label: 'Normal (0)', value: 0, desc: 'Sinus baseline' },
                { label: 'ST-T Wave Abnormality (1)', value: 1, desc: 'T-inversions or ST shift' },
                { label: 'Left Ventricular Hypertrophy (2)', value: 2, desc: 'Estes criteria LVH' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('restecg', opt.value)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs border transition-all flex items-center justify-between ${
                    formData.restecg === opt.value
                      ? 'border-cyan-500/50 bg-cyan-500/15 text-white font-medium'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="text-[10px] text-slate-400">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category 3: Symptom Presentation & Stress Test */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400">
            <Flame className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Symptom & Stress Response
            </h3>
          </div>

          {/* Chest Pain Type */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Chest Pain Type (cp)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Typical Angina (0)', value: 0 },
                { label: 'Atypical Angina (1)', value: 1 },
                { label: 'Non-Anginal (2)', value: 2 },
                { label: 'Asymptomatic (3)', value: 3 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('cp', opt.value)}
                  className={`p-2 rounded-xl text-xs border text-left transition-all ${
                    formData.cp === opt.value
                      ? 'border-amber-500/50 bg-amber-500/15 text-white font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise-Induced Angina */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Exercise-Induced Angina (exang)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'No Angina (0)', value: 0 },
                { label: 'Angina Induced (1)', value: 1 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('exang', opt.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    formData.exang === opt.value
                      ? 'border-amber-500/50 bg-amber-500/15 text-white font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ST Depression (oldpeak) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="font-medium text-slate-300">
                Exercise ST Depression (oldpeak)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0.0}
                  max={6.5}
                  step={0.1}
                  value={formData.oldpeak}
                  onChange={(e) => handleChange('oldpeak', Math.max(0.0, Math.min(6.5, parseFloat(e.target.value) || 0)))}
                  className={`w-16 px-2 py-0.5 text-right font-mono font-bold text-xs bg-slate-950 border border-slate-800 rounded-md focus:outline-none focus:border-rose-500 ${
                    formData.oldpeak >= 1.5 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                />
                <span className="text-slate-400 font-mono text-[11px]">mm</span>
              </div>
            </div>
            <input
              type="range"
              min={0.0}
              max={6.5}
              step={0.1}
              value={formData.oldpeak}
              onChange={(e) => handleChange('oldpeak', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.0 mm</span>
              <span>Normal &lt; 1.0 mm</span>
              <span>6.5 mm</span>
            </div>
          </div>

          {/* ST Slope */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Peak Exercise ST Segment Slope (slope)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Upsloping (0)', value: 0 },
                { label: 'Flat (1)', value: 1 },
                { label: 'Downsloping (2)', value: 2 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('slope', opt.value)}
                  className={`py-2 px-1.5 text-center rounded-xl text-xs font-medium border transition-all ${
                    formData.slope === opt.value
                      ? 'border-amber-500/50 bg-amber-500/15 text-white font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category 4: Angiography & Nuclear Medicine */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-purple-400">
            <Layers className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Fluoroscopy & Nuclear Perfusion
            </h3>
          </div>

          {/* Number of Major Vessels (ca) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="font-medium text-slate-300">
                Major Vessels Colored by Fluoroscopy (ca)
              </label>
              <span className={`font-mono font-bold text-sm ${formData.ca > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {formData.ca} vessels
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleChange('ca', num)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.ca === num
                      ? 'border-purple-500/60 bg-purple-500/20 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              Number of main coronary arteries obstructed under fluoroscopy.
            </p>
          </div>

          {/* Thalassemia Defect (thal) */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Thallium Nuclear Perfusion (thal)
            </label>
            <div className="space-y-1.5">
              {[
                { label: 'Normal Perfusion (3)', value: 3, desc: 'Uniform myocardial blood flow' },
                { label: 'Reversible Defect (2)', value: 2, desc: 'Ischemia with salvageable tissue' },
                { label: 'Fixed Defect (1)', value: 1, desc: 'Non-reversible prior infarct scar' },
                { label: 'Null / Other (0)', value: 0, desc: 'Indeterminate / Baseline' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('thal', opt.value)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs border transition-all flex items-center justify-between ${
                    formData.thal === opt.value
                      ? 'border-purple-500/50 bg-purple-500/15 text-white font-medium'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="text-[10px] text-slate-400">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-600 shadow-lg shadow-rose-600/30 ring-1 ring-rose-400/40 hover:ring-rose-300 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Biomarkers...</span>
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 animate-pulse text-white" />
              <span>Run AI Heart Risk Prediction</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
