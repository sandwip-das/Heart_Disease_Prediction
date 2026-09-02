'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PredictionResponse, HeartDiseaseInput, PatientProfile } from '../lib/types';
import {
  X,
  Printer,
  Download,
  HeartPulse,
  Calendar,
  Stethoscope,
  AlertCircle,
  ShieldCheck,
  Loader2,
  Activity,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionResponse | null;
  inputData: HeartDiseaseInput;
  patientProfile: PatientProfile;
}

export const MedicalReportModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  prediction,
  inputData,
  patientProfile,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printSheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !prediction) return null;

  const getCleanFileName = () => {
    const name = (patientProfile.name || 'Patient')
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const id = (patientProfile.patientId || 'MRN')
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    return `${name}_${id}_Medical_Report.pdf`;
  };

  // Direct 1-Click Client-Side PDF Generation (Single A4 Page)
  const handleDownloadPdf = async () => {
    if (!printSheetRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const element = printSheetRef.current;
      element.style.display = 'block';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 800,
      });

      element.style.display = 'none';

      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 8;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      const finalHeight = Math.min(contentHeight, pdfHeight - margin * 2);

      pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, finalHeight);

      const fileName = getCleanFileName();
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF Generation error:', err);
      handlePrint();
    } finally {
      if (printSheetRef.current) printSheetRef.current.style.display = 'none';
      setIsGeneratingPdf(false);
    }
  };

  // Browser Print Option
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = getCleanFileName().replace('.pdf', '');
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getChestPainLabel = (cp: number) => {
    switch (cp) {
      case 0: return 'Typical Angina (Ischemic)';
      case 1: return 'Atypical Angina';
      case 2: return 'Non-Anginal Discomfort';
      default: return 'Asymptomatic';
    }
  };

  const getThalLabel = (thal: number) => {
    switch (thal) {
      case 1: return 'Fixed Infarct Scar';
      case 2: return 'Reversible Perfusion Defect';
      case 3: return 'Normal Perfusion';
      default: return 'Indeterminate';
    }
  };

  const getRestEcgLabel = (restecg: number) => {
    switch (restecg) {
      case 1: return 'ST-T Wave Abnormality';
      case 2: return 'Left Ventricular Hypertrophy';
      default: return 'Normal Rest ECG';
    }
  };

  const getSlopeLabel = (slope: number) => {
    switch (slope) {
      case 0: return 'Upsloping (Normal)';
      case 1: return 'Flat (Ischemic Trend)';
      case 2: return 'Downsloping (Severe Ischemia)';
      default: return 'Normal';
    }
  };

  return (
    <>
      {/* 1. ON-SCREEN REPORT MODAL: Dark Theme matching the entire Web App */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="screen-only-report fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-150"
      >
        <div className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl shadow-black/90 overflow-hidden ring-1 ring-slate-800/80">
          
          {/* Modal Header: Dark theme with ONLY the Cross (X) Close button on top-right */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white tracking-tight">
                  Cardiovascular Clinical Diagnostic Summary
                </h2>
                <p className="text-xs text-slate-400">
                  Patient: <span className="text-slate-200 font-medium">{patientProfile.name || 'Patient'}</span> ({patientProfile.patientId || 'MRN-849201'})
                </p>
              </div>
            </div>

            {/* Top-Right Cross Button (Returns to results) */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/30 border border-slate-800 transition-all cursor-pointer group"
              title="Close & Return to Results (Esc)"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-rose-400 transition-colors" />
            </button>
          </div>

          {/* Modal Body: Sleek Dark UI matching the website */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-950 text-slate-100 custom-scrollbar">
            
            {/* Header / Clinic Banner */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-6 h-6 text-rose-500" />
                  <h1 className="text-xl font-black tracking-tight text-white uppercase">
                    CardioPulse Diagnostic Labs
                  </h1>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clinical Decision Support & Cardiovascular Risk Stratification
                </p>
              </div>

              <div className="text-right text-xs space-y-0.5">
                <p className="font-mono text-cyan-400 font-semibold">
                  REPORT ID: {patientProfile.patientId || 'MRN-849201'}
                </p>
                <p className="text-slate-400 flex items-center justify-end gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> {reportDate}
                </p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                  Confidential Clinical Evaluation
                </span>
              </div>
            </div>

            {/* Patient Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  Patient Name
                </span>
                <span className="font-bold text-sm text-white">
                  {patientProfile.name || 'Mohammad Rahim'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  Medical Record No.
                </span>
                <span className="font-bold text-sm font-mono text-cyan-400">
                  {patientProfile.patientId || 'MRN-849201'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  Age & Gender
                </span>
                <span className="font-bold text-sm text-slate-200">
                  {inputData.age} Years · {inputData.sex === 1 ? 'Male' : 'Female'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  Attending Clinician
                </span>
                <span className="font-bold text-sm text-slate-200">
                  {patientProfile.doctorName || 'Dr. Cardiology Consultant'}
                </span>
              </div>
            </div>

            {/* Clinical Notes (if available) */}
            {patientProfile.notes && (
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                <span className="font-bold text-slate-300 block text-[11px] mb-1">
                  Clinical History & Presenting Symptoms:
                </span>
                <p className="text-slate-400 italic">
                  "{patientProfile.notes}"
                </p>
              </div>
            )}

            {/* AI Risk Assessment Callout */}
            <div
              className={`p-5 rounded-xl border ${
                prediction.risk_level === 'High'
                  ? 'bg-rose-950/30 border-rose-500/50'
                  : prediction.risk_level === 'Moderate'
                  ? 'bg-amber-950/30 border-amber-500/50'
                  : 'bg-emerald-950/30 border-emerald-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Diagnostic Inference Result
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                    prediction.risk_level === 'High'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : prediction.risk_level === 'Moderate'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  }`}
                >
                  {prediction.risk_level} Risk Category
                </span>
              </div>
              <div className="flex items-baseline gap-4">
                <span
                  className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                    prediction.risk_level === 'High'
                      ? 'text-rose-400'
                      : prediction.risk_level === 'Moderate'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {Math.round(prediction.probability * 100)}%
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {prediction.risk_level === 'High'
                    ? 'Elevated statistical probability of underlying coronary heart disease. Clinical correlation and secondary cardiological diagnostics advised.'
                    : prediction.risk_level === 'Moderate'
                    ? 'Intermediate cardiovascular risk profile identified. Regular clinical follow-up and monitoring recommended.'
                    : 'Low statistical probability of coronary pathology based on evaluated non-invasive biomarkers.'}
                </p>
              </div>
            </div>

            {/* Complete 13 Clinical Biomarkers Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider">
                Full 13 Clinical Biomarkers & Reference Standards
              </h3>
              
              <table className="w-full text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 text-left font-semibold">
                    <th className="py-2 px-3 border border-slate-800">Biomarker Feature</th>
                    <th className="py-2 px-3 border border-slate-800">Observed Value</th>
                    <th className="py-2 px-3 border border-slate-800">Standard Range</th>
                    <th className="py-2 px-3 border border-slate-800">Clinical Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">1. Resting BP (trestbps)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-rose-400 font-bold">{inputData.trestbps} mm Hg</td>
                    <td className="py-2 px-3 border border-slate-800">&lt; 120 mm Hg</td>
                    <td className="py-2 px-3 border border-slate-800">{inputData.trestbps > 140 ? 'Hypertensive' : inputData.trestbps > 120 ? 'Pre-hypertensive' : 'Normotensive'}</td>
                  </tr>
                  <tr className="bg-slate-900/30 hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">2. Serum Cholesterol (chol)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-rose-400 font-bold">{inputData.chol} mg/dl</td>
                    <td className="py-2 px-3 border border-slate-800">&lt; 200 mg/dl</td>
                    <td className="py-2 px-3 border border-slate-800">{inputData.chol > 240 ? 'High (Hypercholesterolemia)' : inputData.chol > 200 ? 'Borderline High' : 'Desirable Range'}</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">3. Fasting Blood Sugar (fbs)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-slate-200">{inputData.fbs === 1 ? '> 120 mg/dl' : '≤ 120 mg/dl'}</td>
                    <td className="py-2 px-3 border border-slate-800">≤ 120 mg/dl</td>
                    <td className="py-2 px-3 border border-slate-800">{inputData.fbs === 1 ? 'Elevated (Diabetic Risk)' : 'Normal Fasting Glycemia'}</td>
                  </tr>
                  <tr className="bg-slate-900/30 hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">4. Chest Pain Type (cp)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-slate-200">Type {inputData.cp}</td>
                    <td className="py-2 px-3 border border-slate-800">Non-anginal</td>
                    <td className="py-2 px-3 border border-slate-800">{getChestPainLabel(inputData.cp)}</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">5. Resting ECG (restecg)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-slate-200">Code {inputData.restecg}</td>
                    <td className="py-2 px-3 border border-slate-800">Normal (0)</td>
                    <td className="py-2 px-3 border border-slate-800">{getRestEcgLabel(inputData.restecg)}</td>
                  </tr>
                  <tr className="bg-slate-900/30 hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">6. Max Heart Rate (thalach)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-cyan-400 font-bold">{inputData.thalach} BPM</td>
                    <td className="py-2 px-3 border border-slate-800">120 - 190 BPM</td>
                    <td className="py-2 px-3 border border-slate-800">{inputData.thalach < 130 ? 'Low Chronotropic Reserve' : 'Normal Response'}</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">7. Exercise Induced Angina (exang)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-slate-200">{inputData.exang === 1 ? 'Positive (1)' : 'Negative (0)'}</td>
                    <td className="py-2 px-3 border border-slate-800">Negative (0)</td>
                    <td className="py-2 px-3 border border-slate-800">{inputData.exang === 1 ? 'Exertional Angina Present' : 'No Exertional Angina'}</td>
                  </tr>
                  <tr className="bg-slate-900/30 hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">8. ST Depression (oldpeak)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-rose-400 font-bold">{inputData.oldpeak.toFixed(1)} mm</td>
                    <td className="py-2 px-3 border border-slate-800">&lt; 1.0 mm</td>
                    <td className="py-2 px-3 border border-slate-800">{inputData.oldpeak >= 1.5 ? 'Significant Subendocardial Ischemia' : 'Normal / Low Displacement'}</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">9. Slope of ST Segment (slope)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-slate-200">Code {inputData.slope}</td>
                    <td className="py-2 px-3 border border-slate-800">Upsloping (0)</td>
                    <td className="py-2 px-3 border border-slate-800">{getSlopeLabel(inputData.slope)}</td>
                  </tr>
                  <tr className="bg-slate-900/30 hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">10. Fluoroscopy Vessels (ca)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-cyan-400 font-bold">{inputData.ca} vessels</td>
                    <td className="py-2 px-3 border border-slate-800">0 vessels</td>
                    <td className="py-2 px-3 border border-slate-800">{inputData.ca > 0 ? `${inputData.ca} Stenosed Vessel(s)` : 'Clear Fluoroscopy'}</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">11. Thallium Perfusion (thal)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-slate-200">Code {inputData.thal}</td>
                    <td className="py-2 px-3 border border-slate-800">Normal (3)</td>
                    <td className="py-2 px-3 border border-slate-800">{getThalLabel(inputData.thal)}</td>
                  </tr>
                  <tr className="bg-slate-900/30 hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">12. Patient Age (age)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-slate-200">{inputData.age} years</td>
                    <td className="py-2 px-3 border border-slate-800">N/A</td>
                    <td className="py-2 px-3 border border-slate-800">{inputData.age > 55 ? 'Elevated Age Risk Factor' : 'Standard Baseline'}</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-2 px-3 border border-slate-800 font-semibold text-white">13. Patient Sex (sex)</td>
                    <td className="py-2 px-3 border border-slate-800 font-mono text-slate-200">{inputData.sex === 1 ? 'Male' : 'Female'}</td>
                    <td className="py-2 px-3 border border-slate-800">N/A</td>
                    <td className="py-2 px-3 border border-slate-800">{inputData.sex === 1 ? 'Male Demographic Profile' : 'Female Demographic Profile'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Clinical Action Plan */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-rose-400" />
                Recommended Clinical Follow-Up Plan:
              </h4>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {prediction.risk_level === 'High' ? (
                  <>
                    <li>Schedule comprehensive 12-lead exercise stress echocardiography or coronary CT angiography for <strong>{patientProfile.name}</strong>.</li>
                    <li>Evaluate initiation or optimization of guideline-directed medical therapy (statin, beta-blocker, ACEi/ARB).</li>
                    <li>Target strict blood pressure (&lt;130/80 mmHg) and lipid goals (LDL-C &lt;70 mg/dl).</li>
                  </>
                ) : prediction.risk_level === 'Moderate' ? (
                  <>
                    <li>Repeat fasting lipid profile and glucose evaluation in 3 months with clinical dietitian consultation.</li>
                    <li>Initiate moderate aerobic exercise program (150 min/week) following baseline medical clearance.</li>
                    <li>Log home blood pressure twice daily for 14 consecutive days and review in clinic.</li>
                  </>
                ) : (
                  <>
                    <li>Maintain routine annual cardiovascular and metabolic health wellness check-ups.</li>
                    <li>Encourage adherence to a Mediterranean dietary pattern and active daily physical routine.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Signature & Disclaimer Footer */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs">
              <div className="text-[10px] text-slate-400 leading-relaxed max-w-lg">
                <AlertCircle className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                <strong>Notice:</strong> This automated decision support report was generated based on patient clinical parameters. All findings must be corroborated by an authorized medical doctor.
              </div>

              <div className="text-right border-t border-slate-700 pt-2 min-w-[200px]">
                <p className="font-serif italic text-sm text-slate-200">
                  {patientProfile.doctorName || 'Dr. Cardiology Consultant'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Cardiology Department · MD Signature
                </p>
              </div>
            </div>

          </div>

          {/* Modal Footer Controls: BOTH Print and Download PDF buttons available */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 hidden sm:flex">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Diagnostic Report Ready</span>
            </span>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Return to Results
              </button>

              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer font-medium"
                title="Print Report"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>Print</span>
              </button>

              {/* Direct PDF Download Button */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-500 font-medium transition-all shadow-lg shadow-rose-600/25 active:scale-95 cursor-pointer disabled:opacity-75"
                title="Download / Save as PDF"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download / Save as PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. DEDICATED OFF-SCREEN A4 SINGLE-PAGE PDF & PRINT TEMPLATE (Pure White, All 13 Features) */}
      <div
        ref={printSheetRef}
        className="pdf-a4-document-container hidden print:block"
        style={{
          width: '794px',
          padding: '28px 32px',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          margin: '0 auto',
        }}
      >
        {/* Print Header */}
        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '10px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: '0', textTransform: 'uppercase' }}>
                CARDIOPULSE DIAGNOSTIC CENTER
              </h1>
              <p style={{ fontSize: '10.5px', color: '#475569', margin: '2px 0 0 0', fontWeight: '600' }}>
                Department of Cardiovascular Medicine & Clinical Telemetry
              </p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '10px', color: '#475569' }}>
              <p style={{ margin: '0', fontWeight: 'bold', color: '#0f172a' }}>RECORD ID: {patientProfile.patientId || 'MRN-849201'}</p>
              <p style={{ margin: '2px 0' }}>{reportDate}</p>
              <p style={{ margin: '0', fontSize: '9px', textTransform: 'uppercase', fontWeight: '600' }}>Confidential Medical Record</p>
            </div>
          </div>
        </div>

        {/* Print Patient Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '8.5px', textTransform: 'uppercase', fontWeight: 'bold', color: '#64748b', display: 'block' }}>Patient Name</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>{patientProfile.name || 'Mohammad Rahim'}</span>
          </div>
          <div>
            <span style={{ fontSize: '8.5px', textTransform: 'uppercase', fontWeight: 'bold', color: '#64748b', display: 'block' }}>MRN</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>{patientProfile.patientId || 'MRN-849201'}</span>
          </div>
          <div>
            <span style={{ fontSize: '8.5px', textTransform: 'uppercase', fontWeight: 'bold', color: '#64748b', display: 'block' }}>Age & Gender</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>{inputData.age} Yrs · {inputData.sex === 1 ? 'Male' : 'Female'}</span>
          </div>
          <div>
            <span style={{ fontSize: '8.5px', textTransform: 'uppercase', fontWeight: 'bold', color: '#64748b', display: 'block' }}>Clinician</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>{patientProfile.doctorName || 'Dr. Cardiology Consultant'}</span>
          </div>
        </div>

        {/* Print Risk Banner */}
        <div style={{
          padding: '10px 14px',
          borderRadius: '6px',
          border: prediction.risk_level === 'High' ? '1px solid #fca5a5' : prediction.risk_level === 'Moderate' ? '1px solid #fcd34d' : '1px solid #86efac',
          backgroundColor: prediction.risk_level === 'High' ? '#fff1f2' : prediction.risk_level === 'Moderate' ? '#fffbeb' : '#f0fdf4',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', color: '#475569', display: 'block' }}>Cardiovascular Risk Tier</span>
            <span style={{ fontSize: '18px', fontWeight: '900', color: prediction.risk_level === 'High' ? '#be123c' : prediction.risk_level === 'Moderate' ? '#b45309' : '#15803d' }}>
              {Math.round(prediction.probability * 100)}% Probability · {prediction.risk_level} Risk Category
            </span>
          </div>
        </div>

        {/* Print 13 Biomarkers Table */}
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '9.5px', fontWeight: 'bold', textTransform: 'uppercase', color: '#334155', margin: '0 0 4px 0' }}>
            Full 13 Clinical Biomarkers & Reference Standards
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px', border: '1px solid #cbd5e1' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', textAlign: 'left' }}>
                <th style={{ padding: '4px 6px', border: '1px solid #cbd5e1' }}>Biomarker Feature</th>
                <th style={{ padding: '4px 6px', border: '1px solid #cbd5e1' }}>Observed Value</th>
                <th style={{ padding: '4px 6px', border: '1px solid #cbd5e1' }}>Standard Range</th>
                <th style={{ padding: '4px 6px', border: '1px solid #cbd5e1' }}>Clinical Evaluation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>1. Resting BP (trestbps)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{inputData.trestbps} mm Hg</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>&lt; 120 mm Hg</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.trestbps > 140 ? 'Hypertensive' : inputData.trestbps > 120 ? 'Pre-hypertensive' : 'Normotensive'}</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>2. Serum Cholesterol (chol)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{inputData.chol} mg/dl</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>&lt; 200 mg/dl</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.chol > 240 ? 'High (Hypercholesterolemia)' : inputData.chol > 200 ? 'Borderline High' : 'Desirable'}</td>
              </tr>
              <tr>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>3. Fasting Blood Sugar (fbs)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.fbs === 1 ? '> 120 mg/dl' : '≤ 120 mg/dl'}</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>≤ 120 mg/dl</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.fbs === 1 ? 'Elevated (Diabetic Risk)' : 'Normal Fasting Glycemia'}</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>4. Chest Pain Type (cp)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>Type {inputData.cp}</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>Non-anginal</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{getChestPainLabel(inputData.cp)}</td>
              </tr>
              <tr>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>5. Resting ECG (restecg)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>Code {inputData.restecg}</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>Normal (0)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{getRestEcgLabel(inputData.restecg)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>6. Max Heart Rate (thalach)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{inputData.thalach} BPM</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>120 - 190 BPM</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.thalach < 130 ? 'Low Chronotropic Reserve' : 'Normal Response'}</td>
              </tr>
              <tr>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>7. Exercise Angina (exang)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.exang === 1 ? 'Positive (1)' : 'Negative (0)'}</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>Negative (0)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.exang === 1 ? 'Exertional Angina Present' : 'No Exertional Angina'}</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>8. ST Depression (oldpeak)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{inputData.oldpeak.toFixed(1)} mm</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>&lt; 1.0 mm</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.oldpeak >= 1.5 ? 'Significant Subendocardial Ischemia' : 'Normal / Low Shift'}</td>
              </tr>
              <tr>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>9. Slope of ST (slope)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>Code {inputData.slope}</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>Upsloping (0)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{getSlopeLabel(inputData.slope)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>10. Fluoroscopy Vessels (ca)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{inputData.ca} vessels</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>0 vessels</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.ca > 0 ? `${inputData.ca} Stenosed Vessel(s)` : 'Clear Fluoroscopy'}</td>
              </tr>
              <tr>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>11. Thallium Perfusion (thal)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>Code {inputData.thal}</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>Normal (3)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{getThalLabel(inputData.thal)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>12. Patient Age (age)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.age} years</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>N/A</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.age > 55 ? 'Elevated Age Risk Factor' : 'Standard Baseline'}</td>
              </tr>
              <tr>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>13. Patient Sex (sex)</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.sex === 1 ? 'Male' : 'Female'}</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>N/A</td>
                <td style={{ padding: '3.5px 6px', border: '1px solid #e2e8f0' }}>{inputData.sex === 1 ? 'Male Profile' : 'Female Profile'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Print Action Protocol */}
        <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '9.5px', marginBottom: '12px' }}>
          <strong style={{ color: '#0f172a', display: 'block', marginBottom: '3px' }}>Clinical Action Protocol:</strong>
          <ul style={{ margin: '0', paddingLeft: '16px', color: '#334155', lineHeight: '1.35' }}>
            {prediction.risk_level === 'High' ? (
              <>
                <li>Schedule 12-lead exercise stress echocardiography or coronary CT angiography for <strong>{patientProfile.name}</strong>.</li>
                <li>Evaluate guideline-directed medical therapy (statin, beta-blocker, ACEi/ARB). Strict blood pressure (&lt;130/80 mmHg).</li>
              </>
            ) : prediction.risk_level === 'Moderate' ? (
              <>
                <li>Repeat fasting lipid profile and glucose evaluation in 3 months with clinical dietitian consultation.</li>
                <li>Log home blood pressure twice daily for 14 consecutive days. Initiate moderate aerobic exercise (150 min/week).</li>
              </>
            ) : (
              <>
                <li>Maintain routine annual cardiovascular and metabolic health check-ups with Mediterranean diet.</li>
              </>
            )}
          </ul>
        </div>

        {/* Print Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #cbd5e1', paddingTop: '8px', fontSize: '9px', color: '#64748b' }}>
          <div style={{ maxWidth: '420px', lineHeight: '1.3' }}>
            <strong>Advisory:</strong> Decision support summary for authorized medical practitioners. Clinical management remains the responsibility of the attending physician.
          </div>
          <div style={{ textAlign: 'right', borderTop: '1px solid #0f172a', paddingTop: '3px', minWidth: '150px' }}>
            <p style={{ margin: '0', fontWeight: 'bold', color: '#0f172a' }}>{patientProfile.doctorName || 'Dr. Cardiology Consultant'}</p>
            <p style={{ margin: '0', fontSize: '8px' }}>Cardiology Department · MD Signature</p>
          </div>
        </div>
      </div>
    </>
  );
};
