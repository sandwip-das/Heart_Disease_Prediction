export interface PatientProfile {
  name: string;
  patientId: string;
  doctorName?: string;
  notes?: string;
}

export interface HeartDiseaseInput {
  age: number;
  sex: number; // 1 = male, 0 = female
  cp: number; // 0: typical angina, 1: atypical, 2: non-anginal, 3: asymptomatic
  trestbps: number; // Resting BP (mm Hg)
  chol: number; // Serum cholesterol (mg/dl)
  fbs: number; // Fasting blood sugar > 120 (1 = true, 0 = false)
  restecg: number; // Resting ECG (0: normal, 1: ST-T abnormality, 2: LVH)
  thalach: number; // Max heart rate achieved
  exang: number; // Exercise induced angina (1 = yes, 0 = no)
  oldpeak: number; // ST depression
  slope: number; // Peak ST slope (0: upsloping, 1: flat, 2: downsloping)
  ca: number; // Major vessels colored by fluoroscopy (0-4)
  thal: number; // Thalassemia (0: null, 1: fixed defect, 2: reversible defect, 3: normal)
}


export interface PredictionResponse {
  heart_disease: boolean;
  prediction: number;
  probability: number;
  risk_level: 'Low' | 'Moderate' | 'High';
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
}

export interface ModelInfo {
  model_name: string;
  model_type: string;
  features: string[];
  metrics?: ModelMetrics;
  description?: string;
}

export interface PatientPreset {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  data: HeartDiseaseInput;
}

export interface FeatureImpact {
  feature: keyof HeartDiseaseInput;
  label: string;
  value: string | number;
  impact: 'positive' | 'negative' | 'neutral'; // positive = elevates risk
  weight: number;
  description: string;
}
