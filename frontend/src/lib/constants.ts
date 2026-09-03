import { HeartDiseaseInput, PatientPreset } from './types';

export const DEFAULT_PATIENT_INPUT: HeartDiseaseInput = {
  age: 52,
  sex: 1,
  cp: 0,
  trestbps: 125,
  chol: 212,
  fbs: 0,
  restecg: 1,
  thalach: 168,
  exang: 0,
  oldpeak: 1.0,
  slope: 2,
  ca: 2,
  thal: 3,
};

export const PATIENT_PRESETS: PatientPreset[] = [
  {
    id: 'healthy-athlete',
    name: 'Healthy Athlete',
    subtitle: '28yo female runner with optimal cardiovascular markers',
    badge: 'Low Risk',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    data: {
      age: 28,
      sex: 0,
      cp: 2, // Non-anginal
      trestbps: 110,
      chol: 165,
      fbs: 0,
      restecg: 0,
      thalach: 185,
      exang: 0,
      oldpeak: 0.0,
      slope: 2, // Upsloping
      ca: 0,
      thal: 3, // Normal
    },
  },
  {
    id: 'hypertensive-adult',
    name: 'Borderline Adult',
    subtitle: '54yo male with mild hypertension & elevated cholesterol',
    badge: 'Moderate Risk',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    data: {
      age: 54,
      sex: 1,
      cp: 1, // Atypical
      trestbps: 142,
      chol: 245,
      fbs: 1,
      restecg: 1,
      thalach: 140,
      exang: 0,
      oldpeak: 1.2,
      slope: 1, // Flat
      ca: 1,
      thal: 2, // Reversible defect
    },
  },
  {
    id: 'ischemic-cad',
    name: 'High-Risk Ischemic',
    subtitle: '62yo male with exercise angina & ST depression',
    badge: 'High Risk',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    data: {
      age: 62,
      sex: 1,
      cp: 0, // Typical angina
      trestbps: 160,
      chol: 286,
      fbs: 1,
      restecg: 1,
      thalach: 108,
      exang: 1,
      oldpeak: 2.8,
      slope: 1, // Flat
      ca: 3,
      thal: 2, // Reversible defect
    },
  },
  {
    id: 'geriatric-post-mi',
    name: 'Geriatric Post-Infarction',
    subtitle: '67yo female with multi-vessel involvement & low chronotropic reserve',
    badge: 'Critical Risk',
    badgeColor: 'text-red-500 bg-red-500/10 border-red-500/30',
    data: {
      age: 67,
      sex: 0,
      cp: 0,
      trestbps: 175,
      chol: 310,
      fbs: 1,
      restecg: 2, // LVH
      thalach: 95,
      exang: 1,
      oldpeak: 3.5,
      slope: 0, // Upsloping abnormal
      ca: 3,
      thal: 1, // Fixed defect
    },
  },
];

export const FEATURE_DEFINITIONS = [
  {
    key: 'age',
    label: 'Patient Age',
    category: 'Demographics',
    unit: 'years',
    min: 18,
    max: 100,
    step: 1,
    normalRange: '18 - 65',
    tooltip: 'Age in completed years. Higher age correlates with cumulative cardiovascular strain.',
  },
  {
    key: 'sex',
    label: 'Biological Sex',
    category: 'Demographics',
    options: [
      { label: 'Female', value: 0 },
      { label: 'Male', value: 1 },
    ],
    tooltip: 'Biological sex assigned at birth. Males statistically exhibit earlier incidence of CAD.',
  },
  {
    key: 'cp',
    label: 'Chest Pain Type',
    category: 'Symptom Presentation',
    options: [
      { label: 'Typical Angina (0)', value: 0, desc: 'Substernal chest pressure relieved by rest or nitroglycerin' },
      { label: 'Atypical Angina (1)', value: 1, desc: 'Discomfort meeting 2 of 3 classical angina criteria' },
      { label: 'Non-Anginal Pain (2)', value: 2, desc: 'Chest wall or pleuritic pain unrelated to ischemia' },
      { label: 'Asymptomatic (3)', value: 3, desc: 'No chest discomfort reported during testing' },
    ],
    tooltip: 'Clinical categorization of chest pain presentation during physical examination.',
  },
  {
    key: 'trestbps',
    label: 'Resting Blood Pressure',
    category: 'Hemodynamics',
    unit: 'mm Hg',
    min: 80,
    max: 220,
    step: 1,
    normalRange: '< 120 mm Hg',
    tooltip: 'Systolic blood pressure measured upon hospital admission after 5 minutes of rest.',
  },
  {
    key: 'chol',
    label: 'Serum Cholesterol',
    category: 'Biomarkers',
    unit: 'mg/dl',
    min: 100,
    max: 550,
    step: 1,
    normalRange: '< 200 mg/dl',
    tooltip: 'Total fasting serum cholesterol level. Values > 240 mg/dl denote hypercholesterolemia.',
  },
  {
    key: 'fbs',
    label: 'Fasting Blood Sugar > 120 mg/dl',
    category: 'Biomarkers',
    options: [
      { label: 'Normal (≤ 120 mg/dl)', value: 0 },
      { label: 'Elevated (> 120 mg/dl)', value: 1 },
    ],
    tooltip: 'Fasting blood glucose test. Indicator for impaired glycemic control or diabetes.',
  },
  {
    key: 'restecg',
    label: 'Resting Electrocardiogram',
    category: 'Electrophysiology',
    options: [
      { label: 'Normal (0)', value: 0, desc: 'Standard baseline sinus rhythm' },
      { label: 'ST-T Abnormality (1)', value: 1, desc: 'T wave inversions or ST elevation/depression > 0.05 mV' },
      { label: 'Left Ventricular Hypertrophy (2)', value: 2, desc: 'Probable or definite LVH by Estes criteria' },
    ],
    tooltip: 'Resting 12-lead electrocardiogram evaluation.',
  },
  {
    key: 'thalach',
    label: 'Max Heart Rate Achieved',
    category: 'Stress Physiology',
    unit: 'bpm',
    min: 60,
    max: 220,
    step: 1,
    normalRange: '120 - 190 bpm',
    tooltip: 'Peak chronotropic capacity achieved during treadmill or cycle ergometry stress test.',
  },
  {
    key: 'exang',
    label: 'Exercise-Induced Angina',
    category: 'Stress Physiology',
    options: [
      { label: 'No Angina', value: 0 },
      { label: 'Angina Present', value: 1 },
    ],
    tooltip: 'Direct symptom onset of angina pectoris provoked during peak workload.',
  },
  {
    key: 'oldpeak',
    label: 'ST Depression (Oldpeak)',
    category: 'Electrophysiology',
    unit: 'mm',
    min: 0.0,
    max: 6.5,
    step: 0.1,
    normalRange: '< 1.0 mm',
    tooltip: 'ST segment depression induced by exercise relative to resting baseline.',
  },
  {
    key: 'slope',
    label: 'Peak Exercise ST Slope',
    category: 'Electrophysiology',
    options: [
      { label: 'Upsloping (0)', value: 0, desc: 'Benign physiological response' },
      { label: 'Flat / Horizontal (1)', value: 1, desc: 'Strong marker of myocardial ischemia' },
      { label: 'Downsloping (2)', value: 2, desc: 'Severe multi-vessel coronary obstruction marker' },
    ],
    tooltip: 'Slope contour of the ST segment at peak exercise workload.',
  },
  {
    key: 'ca',
    label: 'Major Vessels Colored by Fluoroscopy',
    category: 'Angiography',
    min: 0,
    max: 4,
    step: 1,
    tooltip: 'Number of major coronary arteries (0-4) visible under fluoroscopy. High score indicates severe stenosis.',
  },
  {
    key: 'thal',
    label: 'Thalassemia Scintigraphy',
    category: 'Nuclear Medicine',
    options: [
      { label: 'Null / Normal (0)', value: 0 },
      { label: 'Fixed Defect (1)', value: 1, desc: 'Prior myocardial scar / infarcted non-viable tissue' },
      { label: 'Reversible Defect (2)', value: 2, desc: 'Transient ischemia with viable myocardium' },
      { label: 'Normal Blood Flow (3)', value: 3, desc: 'Uniform perfusion throughout stress' },
    ],
    tooltip: 'Thallium-201 nuclear stress perfusion scintigraphy finding.',
  },
];

export const FEATURE_IMPORTANCE_DATA = [
  { name: 'ca (Vessels colored)', importance: 0.182, category: 'Angiography' },
  { name: 'cp (Chest pain type)', importance: 0.165, category: 'Symptoms' },
  { name: 'thalach (Max HR)', importance: 0.141, category: 'Vitals' },
  { name: 'oldpeak (ST Depression)', importance: 0.128, category: 'ECG' },
  { name: 'thal (Thalassemia)', importance: 0.104, category: 'Nuclear' },
  { name: 'age (Patient Age)', importance: 0.089, category: 'Demographics' },
  { name: 'chol (Serum Cholesterol)', importance: 0.068, category: 'Biomarkers' },
  { name: 'trestbps (Resting BP)', importance: 0.052, category: 'Hemodynamics' },
  { name: 'slope (ST Slope)', importance: 0.038, category: 'ECG' },
  { name: 'exang (Exercise Angina)', importance: 0.034, category: 'Vitals' },
];

export const SAMPLE_BATCH_PATIENTS: (HeartDiseaseInput & { patientId: string; name: string })[] = [
  { patientId: 'PT-1001', name: 'James Wilson', age: 63, sex: 1, cp: 0, trestbps: 145, chol: 233, fbs: 1, restecg: 0, thalach: 150, exang: 0, oldpeak: 2.3, slope: 0, ca: 0, thal: 1 },
  { patientId: 'PT-1002', name: 'Elena Rostova', age: 37, sex: 0, cp: 2, trestbps: 130, chol: 250, fbs: 0, restecg: 1, thalach: 187, exang: 0, oldpeak: 3.5, slope: 0, ca: 0, thal: 2 },
  { patientId: 'PT-1003', name: 'Marcus Vance', age: 41, sex: 1, cp: 1, trestbps: 130, chol: 204, fbs: 0, restecg: 0, thalach: 172, exang: 0, oldpeak: 1.4, slope: 2, ca: 0, thal: 2 },
  { patientId: 'PT-1004', name: 'Sarah Chen', age: 56, sex: 1, cp: 1, trestbps: 120, chol: 236, fbs: 0, restecg: 1, thalach: 178, exang: 0, oldpeak: 0.8, slope: 2, ca: 0, thal: 2 },
  { patientId: 'PT-1005', name: 'Robert Davis', age: 57, sex: 1, cp: 0, trestbps: 140, chol: 192, fbs: 0, restecg: 1, thalach: 148, exang: 0, oldpeak: 0.4, slope: 1, ca: 0, thal: 1 },
  { patientId: 'PT-1006', name: 'Linda Martinez', age: 58, sex: 0, cp: 0, trestbps: 100, chol: 248, fbs: 0, restecg: 0, thalach: 122, exang: 0, oldpeak: 1.0, slope: 1, ca: 0, thal: 2 },
  { patientId: 'PT-1007', name: 'David Kim', age: 60, sex: 1, cp: 0, trestbps: 140, chol: 293, fbs: 0, restecg: 0, thalach: 170, exang: 0, oldpeak: 1.2, slope: 1, ca: 2, thal: 3 },
  { patientId: 'PT-1008', name: 'Patricia Taylor', age: 44, sex: 1, cp: 1, trestbps: 120, chol: 263, fbs: 0, restecg: 1, thalach: 173, exang: 0, oldpeak: 0.0, slope: 2, ca: 0, thal: 3 },
];
