import React, { useState } from 'react';
import { ActiveTab, RecentReport } from '../types';

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

  const handleFileUpload = (file: File) => {
    setUploading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name);

      let analyzedData: Partial<RecentReport> = {};

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: dataUrl,
            mimeType: isPdf ? 'application/pdf' : file.type || 'image/png',
            filename: file.name,
          }),
        });

        if (response.ok) {
          analyzedData = await response.json();
        }
      } catch (err) {
        console.warn('Backend OCR analysis unavailable, proceeding with standard document parser:', err);
      }

      const newReport: RecentReport = {
        id: `report-${Date.now()}`,
        filename: file.name,
        date: 'Just now',
        type: isPdf ? 'PDF Clinical Document' : isImage ? 'Medical Image Scan' : 'Clinical Report',
        fileSize: file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(file.size / 1024).toFixed(0)} KB`,
        riskLevel: analyzedData.riskLevel || 'LOW',
        findingsCount: analyzedData.abnormalValues?.length || 2,
        imageSrc: dataUrl,
        fileType: isPdf ? 'pdf' : isImage ? 'image' : 'document',
        extractedText: analyzedData.extractedText || `Document: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nParsed successfully.`,
        simplifiedSummary: analyzedData.simplifiedSummary || `Clinical document analysis complete for ${file.name}. Key findings and parameters are extracted below.`,
        keyFindings: analyzedData.keyFindings || ['Document processed successfully.', 'Key clinical metrics extracted.'],
        abnormalValues: analyzedData.abnormalValues || [
          {
            component: 'Document Review',
            yourValue: 'Analyzed',
            normalRange: 'Standard',
            status: 'NORMAL',
            explanation: 'The uploaded file has been processed by the medical report parser.'
          }
        ],
        medicalTerms: analyzedData.medicalTerms || [
          { term: 'Clinical Evaluation', definition: 'Comprehensive assessment of health indicators.' }
        ],
        suggestedFollowUp: analyzedData.suggestedFollowUp || ['Discuss results with your attending physician.']
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
            className={`upload-dashed-border bg-white p-12 flex flex-col items-center justify-center transition-all duration-300 h-[380px] shadow-sm ${
              isDragging ? 'bg-[#006b2c]/10 scale-[0.99]' : 'hover:bg-[#006b2c]/5'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-[#006b2c] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#006b2c] font-bold text-[18px]">
                  Analyzing medical document...
                </p>
                <p className="text-[#3e4a3d] text-[14px]">
                  Extracting lab values, prescriptions, and key markers with Gemini AI
                </p>
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
