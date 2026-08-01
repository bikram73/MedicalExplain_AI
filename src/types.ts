export type ActiveTab = 'home' | 'features' | 'how-it-works' | 'faq' | 'upload' | 'analyzer';

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
  location: string;
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
  provider?: string; // AI Provider badge (e.g. Gemini, Claude 3.5 (OpenRouter), Groq Llama 3.3)
  date: string; // Report date extracted from document
  analysisTimestamp?: string; // AI processing timestamp
  type: string;
  documentType?: string; // Detected type e.g. "CBC / Hematology Panel", "Cardiology Evaluation", etc.
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
  keyFindings?: string[];
  keyFindingItems?: KeyFindingItem[];
  abnormalValues?: AbnormalValueItem[];
  medicalTerms?: MedicalTermItem[];
  suggestedFollowUp?: string[];
}


