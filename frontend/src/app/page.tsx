'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EcgMonitor } from '../components/EcgMonitor';
import { ClinicalAssessmentForm } from '../components/ClinicalAssessmentForm';
import { PredictionResultCard } from '../components/PredictionResultCard';
import { MedicalReportModal } from '../components/MedicalReportModal';
import { ModelExplorer } from '../components/ModelExplorer';
import { BatchPredictor } from '../components/BatchPredictor';
import { HeartDiseaseInput, PredictionResponse, ModelInfo, PatientProfile } from '../lib/types';
import { DEFAULT_PATIENT_INPUT } from '../lib/constants';
import { checkBackendHealth, fetchModelInfo, predictHeartDisease } from '../lib/api';
import { Stethoscope } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'assessment' | 'model' | 'batch'>('assessment');
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    name: 'Mohammad Rahim',
    patientId: 'MRN-849201',
    doctorName: 'Dr. Cardiology Consultant',
    notes: 'Exertional retrosternal discomfort and elevated blood pressure.',
  });
  const [formData, setFormData] = useState<HeartDiseaseInput>(DEFAULT_PATIENT_INPUT);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{ status: string; model_loaded: boolean }>({
    status: 'checking',
    model_loaded: false,
  });
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  // Poll backend health & fetch model info
  useEffect(() => {
    const init = async () => {
      const health = await checkBackendHealth();
      setBackendStatus(health);
      const info = await fetchModelInfo();
      setModelInfo(info);
    };
    init();
    const interval = setInterval(async () => {
      const health = await checkBackendHealth();
      setBackendStatus(health);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await predictHeartDisease(formData);
      setPrediction(result);
    } catch (err) {
      console.error('Prediction failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCohortPatient = (patientData: HeartDiseaseInput & { patientId?: string; name?: string }) => {
    setFormData(patientData);
    if (patientData.name) {
      setPatientProfile({
        name: patientData.name,
        patientId: patientData.patientId || `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
        doctorName: 'Dr. Cardiology Consultant',
        notes: `Cohort imported patient record (${patientData.patientId})`,
      });
    }
    setActiveTab('assessment');
    // Trigger instant prediction for loaded patient
    predictHeartDisease(patientData).then(setPrediction);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 medical-grid-bg relative selection:bg-rose-500 selection:text-white">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-rose-600/10 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-96 w-96 rounded-full bg-pink-600/5 blur-3xl" />
      </div>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 space-y-6">
        {/* Dynamic ECG Live Rhythm Bar (Persistent Telemetry) */}
        <div className="transition-all duration-300">
          <EcgMonitor
            heartRate={formData.thalach || 75}
            stDepression={formData.oldpeak || 0.0}
            hasAbnormality={formData.restecg > 0 || (prediction ? prediction.heart_disease : false)}
          />
        </div>

        {/* Tab 1: Clinical Assessment & AI Prediction */}
        {activeTab === 'assessment' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Form: 7 Columns */}
            <div className="lg:col-span-7 space-y-6">
              <ClinicalAssessmentForm
                formData={formData}
                setFormData={setFormData}
                patientProfile={patientProfile}
                setPatientProfile={setPatientProfile}
                onSubmit={handleAssessmentSubmit}
                isLoading={isLoading}
              />
            </div>

            {/* Right Results & Assistant: 5 Columns */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <PredictionResultCard
                prediction={prediction}
                inputData={formData}
                onOpenReport={() => setIsReportOpen(true)}
              />

              {/* Clinical Quick Reference Guide */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md space-y-3 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-slate-200 font-semibold pb-2 border-b border-slate-800">
                  <Stethoscope className="w-4 h-4 text-cyan-400" />
                  <span>Clinical Diagnostic Guidelines</span>
                </div>
                <p className="leading-relaxed">
                  Evaluates 13 key physiological and biochemical indicators to assist clinicians with early detection and risk stratification of cardiovascular pathology.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-cyan-400 font-medium">Diagnostic Sensitivity: 87.5%</span>
                  <span className="text-emerald-400 font-medium">Reliability Score: High</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Model Architecture & Analytics */}
        {activeTab === 'model' && <ModelExplorer modelInfo={modelInfo} />}

        {/* Tab 3: Cohort Batch Evaluation */}
        {activeTab === 'batch' && (
          <BatchPredictor onSelectPatient={handleSelectCohortPatient} />
        )}
      </main>

      {/* Printable Clinical Report Modal */}
      <MedicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        prediction={prediction}
        inputData={formData}
        patientProfile={patientProfile}
      />

      {/* Professional Medical Footer */}
      <Footer onNavigateTab={setActiveTab} />
    </div>
  );
}
