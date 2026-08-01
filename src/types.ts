export type ActiveTab = 'home' | 'features' | 'how-it-works' | 'faq' | 'upload' | 'analyzer';

export type MedDocumentType =
  | 'CBC_REPORT'
  | 'HEMATOLOGY_REPORT'
  | 'BIOCHEMISTRY_REPORT'
  | 'LIPID_PROFILE'
  | 'LIVER_FUNCTION_TEST'
  | 'KIDNEY_FUNCTION_TEST'
  | 'ECG_REPORT'
  | 'MRI_REPORT'
  | 'CT_REPORT'
  | 'XRAY_REPORT'
  | 'ULTRASOUND_REPORT'
  | 'PATHOLOGY_REPORT'
  | 'PRESCRIPTION'
  | 'DISCHARGE_SUMMARY'
  | 'CONSULTATION_NOTE'
  | 'GENERAL_MEDICAL_REPORT'
  | 'UNKNOWN';

export interface PatientInfo {
  name?: string;
  age?: string | number;
  gender?: string;
  id?: string;
  dob?: string;
}

export interface VitalSigns {
  bloodPressure?: {
    systolic: number | null;
    diastolic: number | null;
  };
  heartRate?: number | string | null;
  temperature?: number | string | null;
  oxygenSaturation?: number | string | null;
}

export interface ImagingFindingItem {
  scanType?: string;
  bodyPart?: string;
  clinicalFindings?: string;
  radiologistImpression?: string;
  observedAbnormalities?: string[];
  recommendations?: string[];
  sourceType?: 'extracted' | 'interpreted';
  evidenceQuote?: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  purpose?: string;
}

export interface SourceTraceabilityItem {
  finding: string;
  evidenceQuote: string;
}

export interface ConfidenceScores {
  ocr: number;
  extraction: number;
  classification: number;
}

export interface MedicalFinding {
  component: string;
  normalRange: string;
  yourValue: string;
  status: 'HIGH' | 'LOW' | 'BORDERLINE' | 'NORMAL';
  explanation?: string;
  category?: string;
}

export interface Medication {
  name: string;
  purpose: string;
  location?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export interface KeyFindingItem {
  text: string;
  sourceType?: 'extracted' | 'interpreted';
  evidenceQuote?: string;
  confidence?: number;
  category?: string;
}

export interface AbnormalValueItem {
  component: string;
  yourValue: string;
  normalRange: string;
  status: 'HIGH' | 'LOW' | 'BORDERLINE' | 'NORMAL';
  explanation?: string;
  sourceType?: 'extracted' | 'interpreted';
  evidenceQuote?: string;
  confidence?: number;
  category?: string;
}

export interface MedicalTermItem {
  term: string;
  definition: string;
}

export interface RecentReport {
  id: string;
  filename: string;
  provider?: string; // AI Provider badge
  date: string; // Report date extracted from document
  analysisTimestamp?: string; // AI processing timestamp
  type: string;
  documentType?: MedDocumentType | string; // Detected type e.g. "CBC_REPORT", "MRI_REPORT", "PRESCRIPTION", etc.
  documentConfidence?: number;
  fileSize: string;
  imageSrc?: string;
  fileType?: 'image' | 'pdf' | 'document';
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  riskReason?: string[];
  missingSections?: string[];
  overallConfidence?: number;
  findingsCount: number;
  extractedText?: string;
  simplifiedSummary?: string;

  // Patient & Clinical info
  patient?: PatientInfo;
  vitalSigns?: VitalSigns;

  // Findings & Labs
  keyFindings?: string[];
  keyFindingItems?: KeyFindingItem[];
  abnormalValues?: AbnormalValueItem[];

  // Imaging specific
  imagingFindings?: ImagingFindingItem[];

  // Diagnosis, Prescriptions, Hospital Stay
  diagnosis?: string | null;
  medicines?: PrescriptionMedicine[];
  hospitalStay?: {
    admissionDate?: string;
    dischargeDate?: string;
    hospitalName?: string;
    treatmentGiven?: string;
  };

  // Recommendations split
  doctorRecommendations?: string[];
  educationalAdvice?: string[];
  suggestedFollowUp?: string[];

  // Medical terms & traceability
  medicalTerms?: MedicalTermItem[];
  sourceTraceability?: SourceTraceabilityItem[];

  // Confidence details
  confidenceDetails?: ConfidenceScores;
}



