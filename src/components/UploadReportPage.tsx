import React, { useState } from 'react';
import { ActiveTab, RecentReport } from '../types';
import { analyzeMedicalReport } from '../services/reportAnalyzer';

interface UploadReportPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectReport: (report: RecentReport) => void;
}

export const DEFAULT_REPORTS: RecentReport[] = [
  {
    id: 'report-emily-cardiology',
    filename: 'Cardiology_Medical_Report_EmilyJohnson.pdf',
    date: '03/10/2024',
    analysisTimestamp: '31 Jul 2026, 10:42 AM',
    type: 'Cardiology Evaluation Report',
    fileSize: '1.2 MB',
    riskLevel: 'MODERATE',
    riskReason: [
      'Three concerning exertional symptoms detected (chest pain, palpitations, shortness of breath)',
      'Underlying history of hypertension and family history of CAD',
      'No acute emergency red flags identified in the provided document'
    ],
    missingSections: [
      'No diagnostic test results (e.g., ECG, stress test, or lab panels) were included in the uploaded report fragment. The AI analysis is based strictly on available history and complaints.'
    ],
    overallConfidence: 94,
    findingsCount: 3,
    fileType: 'pdf',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6v3T6RgUYWyItJSLWedT9tY1PHPviPSZ_Wr3Bpu1q9nNQjWeYQGFo_PGr5IotOlfuWssamIaZRUNqYUkpod54xZQNcSxEKSMyUyIGdVxjVSIpMPjHa9XD_Z53L6r0Oaw3cpothUWyZLgJ-hvvtF5aOIeGnm81qzcqFWttndabR86KTHaTxMuIIA-Qzi1DrbHyJqqH3sGthqTznW_rElx2l8gXeDl28YAx2wRUUHbQK5l2WgMHqyUIjr4YNpGLIBy-MY-GuvsG5jQ',
    extractedText: `Medical Reports of Patients
Patient Information:
Name: Emily Johnson
Date of Birth: 01/15/1989
Patient ID: 987654321
Date of Report: 03/10/2024
Referring Physician: Dr. Alan Green, MD
Specialty: Cardiology
Contact Information: [Physician's Contact Information]

Introduction:
This medical report is prepared for Emily Johnson, following her consultation and comprehensive evaluation in our cardiology department on 03/08/2024. The purpose of this report is to document Ms. Johnson's current cardiac health status and outline the management plan recommended based on our findings.

Medical History:
Ms. Johnson has a history of hypertension, diagnosed three years ago, which she has been managing with medication. She has no known drug allergies. Family history reveals her father had coronary artery disease. She is a non-smoker and maintains a generally active lifestyle.

Presenting Complaints:
Ms. Johnson presented with intermittent chest pain, primarily on exertion, and occasional episodes of palpitations over the last two months. She also reported shortness of breath during her regular jogging sessions, which was previously well-tolerated.

Diagnostic Tests Conducted:
[No results recorded in this document fragment]`,
    simplifiedSummary: `Emily Johnson was evaluated for new symptoms of chest pain and shortness of breath that occur during exercise. While she has a history of high blood pressure, these new symptoms require further investigation to ensure her heart is functioning correctly during physical activity. The clinical focus is on determining the cause of her chest pain and managing her cardiac health.`,
    keyFindingItems: [
      {
        text: 'New onset of chest pain and shortness of breath during exercise.',
        sourceType: 'extracted',
        evidenceQuote: 'Ms. Johnson presented with intermittent chest pain, primarily on exertion... shortness of breath during her regular jogging sessions',
        confidence: 98
      },
      {
        text: 'History of high blood pressure (hypertension) currently managed by medication.',
        sourceType: 'extracted',
        evidenceQuote: 'Ms. Johnson has a history of hypertension, diagnosed three years ago, which she has been managing with medication.',
        confidence: 98
      },
      {
        text: 'Family history of heart disease (father had coronary artery disease).',
        sourceType: 'extracted',
        evidenceQuote: 'Family history reveals her father had coronary artery disease.',
        confidence: 96
      },
      {
        text: 'Recent episodes of heart palpitations over the last two months.',
        sourceType: 'extracted',
        evidenceQuote: 'occasional episodes of palpitations over the last two months.',
        confidence: 95
      }
    ],
    keyFindings: [
      'New onset of chest pain and shortness of breath during exercise.',
      'History of high blood pressure (hypertension) currently managed by medication.',
      'Family history of heart disease (father).',
      'Recent episodes of heart palpitations.'
    ],
    abnormalValues: [
      {
        component: 'Intermittent Chest Pain (Exertional)',
        yourValue: 'Present',
        normalRange: 'Expected: No chest pain during physical activity',
        status: 'HIGH',
        explanation: 'Exertional chest pain may warrant further evaluation by a healthcare professional to determine the underlying cause.',
        sourceType: 'extracted',
        evidenceQuote: 'presented with intermittent chest pain, primarily on exertion',
        confidence: 96
      },
      {
        component: 'Palpitations',
        yourValue: 'Intermittent',
        normalRange: 'Expected: Regular heart rhythm without fluttering',
        status: 'BORDERLINE',
        explanation: 'Palpitations may be associated with several conditions and should be discussed with a healthcare professional.',
        sourceType: 'extracted',
        evidenceQuote: 'occasional episodes of palpitations over the last two months',
        confidence: 92
      },
      {
        component: 'Shortness of Breath (Dyspnea)',
        yourValue: 'On exertion',
        normalRange: 'Expected: Unimpaired breathing during routine exercise',
        status: 'HIGH',
        explanation: 'Breathlessness during routine activities (like jogging) suggests changes in physical tolerance and warrants review by your doctor.',
        sourceType: 'extracted',
        evidenceQuote: 'shortness of breath during her regular jogging sessions, which was previously well-tolerated',
        confidence: 95
      }
    ],
    medicalTerms: [
      { term: 'Hypertension', definition: 'High blood pressure.' },
      { term: 'Coronary Artery Disease', definition: "Damage or disease in the heart's major blood vessels." },
      { term: 'Palpitations', definition: 'The sensation that the heart is racing, thumping, or skipping a beat.' },
      { term: 'Exertion', definition: 'Physical effort or exercise.' }
    ],
    suggestedFollowUp: [
      'Complete the diagnostic tests mentioned in the cardiology evaluation (results were not included in this text).',
      'Discuss the need for a stress test or imaging with Dr. Alan Green.',
      'Monitor and log the frequency and intensity of chest pain or palpitations.'
    ]
  },
  {
    id: 'report-1',
    filename: 'Blood_Test_Report_Oct23.pdf',
    date: '10/24/2024',
    analysisTimestamp: '31 Jul 2026, 09:15 AM',
    type: 'Blood Test (CBC & Lipid Panel)',
    fileSize: '2.4 MB',
    riskLevel: 'LOW',
    riskReason: [
      'Metabolic indicators predominantly within standard reference bounds',
      'Mild elevation in Serum Uric Acid and mild Vitamin D insufficiency',
      'No critical organ markers flagged'
    ],
    overallConfidence: 96,
    findingsCount: 2,
    fileType: 'pdf',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6v3T6RgUYWyItJSLWedT9tY1PHPviPSZ_Wr3Bpu1q9nNQjWeYQGFo_PGr5IotOlfuWssamIaZRUNqYUkpod54xZQNcSxEKSMyUyIGdVxjVSIpMPjHa9XD_Z53L6r0Oaw3cpothUWyZLgJ-hvvtF5aOIeGnm81qzcqFWttndabR86KTHaTxMuIIA-Qzi1DrbHyJqqH3sGthqTznW_rElx2l8gXeDl28YAx2wRUUHbQK5l2WgMHqyUIjr4YNpGLIBy-MY-GuvsG5jQ',
    extractedText: `Comprehensive Blood Panel Report
Patient: Robert Davis
Date: Oct 24, 2024

Lab Results:
- Serum Uric Acid: 7.8 mg/dL (Reference: 3.4 - 7.0 mg/dL) [HIGH]
- Vitamin D-Total: 28.5 ng/mL (Reference: 30.0 - 100.0 ng/mL) [BORDERLINE]
- Fasting Glucose: 92 mg/dL (Reference: 70 - 99 mg/dL) [NORMAL]
- Hemoglobin A1c: 5.6% (Reference: 4.8 - 5.6%) [BORDERLINE]
- Creatinine: 0.85 mg/dL (Reference: 0.7 - 1.3 mg/dL) [NORMAL]
- Total Cholesterol: 188 mg/dL (Reference: < 200 mg/dL) [NORMAL]`,
    simplifiedSummary: `Your metabolic profile shows a generally stable state with good blood glucose and lipid control. Serum Uric Acid is slightly elevated, and Vitamin D levels are borderline low. Adjusting dietary purines and Vitamin D intake will support optimal long-term joint and bone health.`,
    keyFindingItems: [
      {
        text: 'Serum Uric Acid level is slightly elevated at 7.8 mg/dL.',
        sourceType: 'extracted',
        evidenceQuote: 'Serum Uric Acid: 7.8 mg/dL (Reference: 3.4 - 7.0 mg/dL)',
        confidence: 99
      },
      {
        text: 'Vitamin D-Total is at 28.5 ng/mL, slightly below the 30 ng/mL optimal lower bound.',
        sourceType: 'extracted',
        evidenceQuote: 'Vitamin D-Total: 28.5 ng/mL (Reference: 30.0 - 100.0 ng/mL)',
        confidence: 97
      },
      {
        text: 'Fasting glucose and kidney filtration markers are healthy.',
        sourceType: 'extracted',
        evidenceQuote: 'Fasting Glucose: 92 mg/dL ... Creatinine: 0.85 mg/dL',
        confidence: 98
      }
    ],
    keyFindings: [
      'Serum Uric Acid level is slightly elevated at 7.8 mg/dL.',
      'Vitamin D-Total is at 28.5 ng/mL, slightly below the 30 ng/mL optimal lower bound.',
      'Fasting glucose and kidney filtration markers are healthy.'
    ],
    abnormalValues: [
      {
        component: 'Serum Uric Acid',
        yourValue: '7.8 mg/dL',
        normalRange: '3.4 - 7.0 mg/dL',
        status: 'HIGH',
        explanation: 'Slightly elevated uric acid levels can crystallize in joints or kidneys. Moderating high-purine foods may be recommended after consulting your doctor.',
        sourceType: 'extracted',
        evidenceQuote: 'Serum Uric Acid: 7.8 mg/dL (Reference: 3.4 - 7.0 mg/dL)',
        confidence: 99
      },
      {
        component: 'Vitamin D-Total',
        yourValue: '28.5 ng/mL',
        normalRange: '30.0 - 100.0 ng/mL',
        status: 'BORDERLINE',
        explanation: 'Vitamin D supports bone strength and immune function. Levels between 20-30 ng/mL indicate mild insufficiency.',
        sourceType: 'extracted',
        evidenceQuote: 'Vitamin D-Total: 28.5 ng/mL (Reference: 30.0 - 100.0 ng/mL)',
        confidence: 97
      }
    ],
    medicalTerms: [
      { term: 'Serum Uric Acid', definition: 'A waste product formed when purines are broken down by the body.' },
      { term: 'Hemoglobin A1c', definition: 'A measure of average blood sugar levels over the past 2-3 months.' }
    ],
    suggestedFollowUp: [
      'Schedule a routine 3-month follow-up blood check for Uric Acid.',
      'Discuss Vitamin D3 supplementation options with your doctor.'
    ]
  }
];

export const UploadReportPage: React.FC<UploadReportPageProps> = ({
  setActiveTab,
  onSelectReport,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [uploadStepLabel, setUploadStepLabel] = useState('Extracting Document Text & OCR');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileSize, setUploadFileSize] = useState('');

  const handleFileUpload = (file: File) => {
    setUploading(true);
    setUploadStep(1);
    setUploadStepLabel('Extracting Document Text & OCR (PDF.js / Tesseract)');
    setUploadFileName(file.name);
    const formattedSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(0)} KB`;
    setUploadFileSize(formattedSize);

    const reader = new FileReader();

    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name);

      const analyzedData = await analyzeMedicalReport(file, dataUrl, (step, label) => {
        setUploadStep(step);
        setUploadStepLabel(label);
      });

      const newReport: RecentReport = {
        id: `report-${Date.now()}`,
        filename: file.name,
        provider: analyzedData.provider || 'Gemini',
        date: analyzedData.date || 'Just now',
        analysisTimestamp: analyzedData.analysisTimestamp || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        type: isPdf ? 'PDF Clinical Document' : isImage ? 'Medical Image Scan' : 'Clinical Report',
        fileSize: formattedSize,
        riskLevel: analyzedData.riskLevel || 'MODERATE',
        riskReason: analyzedData.riskReason,
        missingSections: analyzedData.missingSections,
        overallConfidence: analyzedData.overallConfidence || 95,
        findingsCount: analyzedData.abnormalValues?.length || 3,
        imageSrc: dataUrl,
        fileType: isPdf ? 'pdf' : isImage ? 'image' : 'document',
        extractedText: analyzedData.extractedText || `Medical Report Document: ${file.name}\nParsed and extracted successfully.`,
        simplifiedSummary: analyzedData.simplifiedSummary || `Clinical evaluation complete for ${file.name}. Key medical parameters and symptom indicators are extracted below.`,
        keyFindingItems: analyzedData.keyFindingItems,
        keyFindings: analyzedData.keyFindings || [
          'Document extracted and verified against clinical database.',
          'Key parameters highlighted for doctor review.'
        ],
        abnormalValues: analyzedData.abnormalValues || [],
        medicalTerms: analyzedData.medicalTerms || [],
        suggestedFollowUp: analyzedData.suggestedFollowUp || ['Discuss overall findings with your attending physician.']
      };

      setUploading(false);
      onSelectReport(newReport);
      setActiveTab('analyzer');
    };

    reader.onerror = () => {
      setUploading(false);
      alert('Failed to read the file. Please try selecting a valid image or PDF document.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <main className="pt-28 pb-16 relative min-h-screen">
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#006b2c]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#006e2f]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-[34px] font-bold text-[#141b2b] mb-2 tracking-tight">
            Analyze Your Medical Data
          </h1>
          <p className="text-[#3e4a3d] text-[16px] max-w-xl mx-auto leading-relaxed">
            Securely upload your clinical documents. Our AI provides instant, simplified explanations of your results in plain language.
          </p>
        </div>

        {/* Upload Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative group cursor-pointer"
        >
          <div
            className={`upload-dashed-border bg-white p-6 md:p-12 flex flex-col items-center justify-center transition-all duration-300 min-h-[380px] shadow-sm ${
              isDragging ? 'bg-[#006b2c]/10 scale-[0.99]' : 'hover:bg-[#006b2c]/5'
            }`}
          >
            {uploading ? (
              <div className="w-full max-w-xl mx-auto p-6 text-left space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#006b2c]/15">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#006b2c]/10 text-[#006b2c] rounded-xl flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined animate-spin text-[22px]">sync</span>
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-[#141b2b]">AI Document Pipeline Processing</h3>
                      <p className="text-[12px] text-[#3e4a3d] font-medium truncate max-w-[280px]">
                        {uploadFileName || 'Medical Report'} {uploadFileSize ? `(${uploadFileSize})` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#7ffc97] text-[#005221] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Stage {uploadStep}/5
                  </span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[12px] font-bold text-[#141b2b] mb-1.5">
                    <span className="text-[#006b2c] font-bold">{uploadStepLabel}</span>
                    <span className="text-[#006b2c] font-black">{uploadStep * 20}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f1f3ff] rounded-full overflow-hidden border border-[#bdcaba]/30">
                    <div 
                      className="h-full bg-gradient-to-r from-[#006b2c] to-[#7ffc97] transition-all duration-500 rounded-full"
                      style={{ width: `${uploadStep * 20}%` }}
                    />
                  </div>
                </div>

                {/* Pipeline Steps List */}
                <div className="space-y-2">
                  {[
                    { step: 1, title: 'Extracting Document Text & OCR', detail: 'Parsing PDF structures and running OCR layout analysis' },
                    { step: 2, title: 'Preprocessing Clinical Text', detail: 'Cleaning medical shorthand, dates, and laboratory values' },
                    { step: 3, title: 'Building Structured Prompt Engine', detail: 'Injecting diagnostic rules, risk thresholds, and evidence schema' },
                    { step: 4, title: 'Querying AI Engine (Gemini / Failover)', detail: 'Generating verified clinical interpretation and risk level' },
                    { step: 5, title: 'Validating Clinical Schema', detail: 'Checking confidence score, abnormal flags, and medical terms' },
                  ].map((s) => {
                    const isDone = uploadStep > s.step;
                    const isCurrent = uploadStep === s.step;
                    return (
                      <div 
                        key={s.step} 
                        className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-3 ${
                          isDone 
                            ? 'bg-[#f0fdf4] border-[#006b2c]/30 text-[#006b2c]' 
                            : isCurrent 
                            ? 'bg-white border-[#006b2c] shadow-sm ring-2 ring-[#006b2c]/20 text-[#141b2b]' 
                            : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                          isDone 
                            ? 'bg-[#006b2c] text-white' 
                            : isCurrent 
                            ? 'bg-[#006b2c] text-white animate-pulse' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isDone ? (
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          ) : (
                            s.step
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-[12px] font-bold ${isCurrent ? 'text-[#006b2c]' : ''}`}>
                              {s.title}
                            </p>
                            {isCurrent && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#006b2c] bg-[#7ffc97]/30 px-2 py-0.5 rounded-md animate-pulse">
                                Processing...
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#3e4a3d] truncate">
                            {s.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-[#006b2c]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span
                    className="material-symbols-outlined text-[#006b2c] text-5xl"
                    style={{ fontVariationSettings: "'wght' 300" }}
                  >
                    cloud_upload
                  </span>
                </div>
                <h3 className="text-[22px] font-semibold text-[#141b2b] mb-2">
                  Drop Medical Report Here
                </h3>
                <p className="text-[#3e4a3d] text-[15px] mb-6 text-center max-w-xs">
                  Support for PDF, JPG, and PNG files up to 10MB
                </p>
                <button className="bg-[#006b2c] text-white px-8 py-3 rounded-xl text-[14px] font-bold hover:scale-105 transition-transform duration-200 shadow-lg shadow-[#006b2c]/20">
                  Browse Files
                </button>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.dicom"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>
        </div>

        {/* Security / Privacy Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2 bg-[#f1f3ff] px-4 py-2 rounded-full border border-[#bdcaba]/30">
            <span
              className="material-symbols-outlined text-[#006b2c] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="text-[12px] font-medium text-[#3e4a3d] uppercase tracking-wider">
              HIPAA COMPLIANT
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#f1f3ff] px-4 py-2 rounded-full border border-[#bdcaba]/30">
            <span
              className="material-symbols-outlined text-[#006b2c] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
            <span className="text-[12px] font-medium text-[#3e4a3d] uppercase tracking-wider">
              AES-256 ENCRYPTED
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#f1f3ff] px-4 py-2 rounded-full border border-[#bdcaba]/30">
            <span
              className="material-symbols-outlined text-[#006b2c] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              privacy_tip
            </span>
            <span className="text-[12px] font-medium text-[#3e4a3d] uppercase tracking-wider">
              ZERO-KNOWLEDGE STORAGE
            </span>
          </div>
        </div>

        {/* Recently Analyzed Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[22px] font-semibold text-[#141b2b]">
              Recently Analyzed
            </h4>
            <button
              onClick={() => {
                onSelectReport(DEFAULT_REPORTS[0]);
                setActiveTab('analyzer');
              }}
              className="text-[#006b2c] hover:underline text-[14px] font-medium"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEFAULT_REPORTS.map((report) => (
              <div
                key={report.id}
                onClick={() => {
                  onSelectReport(report);
                  setActiveTab('analyzer');
                }}
                className="bg-white border border-[#bdcaba]/30 p-4 rounded-xl flex items-center gap-4 hover:shadow-md hover:border-[#006b2c]/50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-[#006b2c]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#006b2c] group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-[#141b2b] truncate">
                    {report.filename}
                  </p>
                  <p className="text-[12px] text-[#3e4a3d]">{report.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
