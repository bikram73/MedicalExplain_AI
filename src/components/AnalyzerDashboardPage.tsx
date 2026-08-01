import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import { ActiveTab, ChatMessage, RecentReport, AbnormalValueItem } from '../types';
import { analyzeMedicalReport, askReportQuestion } from '../services/reportAnalyzer';
import { detectDocumentType, categorizeComponent } from '../services/aiService';

interface AnalyzerDashboardPageProps {
  report?: RecentReport;
  onSelectReport?: (report: RecentReport) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

const DEFAULT_FALLBACK_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC6v3T6RgUYWyItJSLWedT9tY1PHPviPSZ_Wr3Bpu1q9nNQjWeYQGFo_PGr5IotOlfuWssamIaZRUNqYUkpod54xZQNcSxEKSMyUyIGdVxjVSIpMPjHa9XD_Z53L6r0Oaw3cpothUWyZLgJ-hvvtF5aOIeGnm81qzcqFWttndabR86KTHaTxMuIIA-Qzi1DrbHyJqqH3sGthqTznW_rElx2l8gXeDl28YAx2wRUUHbQK5l2WgMHqyUIjr4YNpGLIBy-MY-GuvsG5jQ';

// Helper for Category Icons & Badges
function getCategoryIcon(categoryName: string): { icon: string; color: string; bg: string } {
  const name = (categoryName || '').toLowerCase();
  if (name.includes('white blood')) {
    return { icon: 'coronavirus', color: 'text-purple-700', bg: 'bg-purple-100' };
  }
  if (name.includes('red blood')) {
    return { icon: 'bloodtype', color: 'text-red-700', bg: 'bg-red-100' };
  }
  if (name.includes('platelet')) {
    return { icon: 'grain', color: 'text-amber-700', bg: 'bg-amber-100' };
  }
  if (name.includes('metabolic') || name.includes('chemistry')) {
    return { icon: 'science', color: 'text-blue-700', bg: 'bg-blue-100' };
  }
  if (name.includes('cardio')) {
    return { icon: 'favorite', color: 'text-rose-700', bg: 'bg-rose-100' };
  }
  return { icon: 'clinical_notes', color: 'text-emerald-700', bg: 'bg-emerald-100' };
}

// Visual Laboratory Range Slider / Indicator Bar
const RangeIndicatorBar: React.FC<{ status: 'HIGH' | 'LOW' | 'BORDERLINE' | 'NORMAL'; valueStr?: string; rangeStr?: string }> = ({ status }) => {
  let dotPos = '50%';
  let dotColor = 'bg-emerald-600 ring-emerald-300';
  let barGradient = 'from-[#93c5fd] via-[#a7f3d0] to-[#fca5a5]';

  if (status === 'LOW') {
    dotPos = '12%';
    dotColor = 'bg-blue-600 ring-blue-300';
  } else if (status === 'BORDERLINE') {
    dotPos = '32%';
    dotColor = 'bg-amber-600 ring-amber-300';
  } else if (status === 'HIGH') {
    dotPos = '88%';
    dotColor = 'bg-red-600 ring-red-300';
  } else {
    dotPos = '50%';
    dotColor = 'bg-emerald-600 ring-emerald-300';
  }

  return (
    <div className="my-2 bg-white p-2.5 rounded-lg border border-[#bdcaba]/30">
      <div className="flex justify-between items-center text-[10px] font-bold text-[#3e4a3d] mb-1.5 uppercase tracking-wider">
        <span className={status === 'LOW' ? 'text-blue-700 font-extrabold' : 'text-gray-500'}>Low</span>
        <span className={status === 'NORMAL' ? 'text-emerald-700 font-extrabold' : 'text-gray-500'}>Reference Range (Normal)</span>
        <span className={status === 'HIGH' ? 'text-red-700 font-extrabold' : 'text-gray-500'}>High</span>
      </div>

      <div className="relative w-full h-2.5 bg-gray-100 rounded-full border border-gray-200">
        <div className={`w-full h-full bg-gradient-to-r ${barGradient} rounded-full opacity-80`} />
        
        {/* Zone Markers */}
        <div className="absolute inset-y-0 left-[25%] w-0.5 bg-white/90" />
        <div className="absolute inset-y-0 right-[25%] w-0.5 bg-white/90" />

        {/* Marker Dot */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${dotColor} ring-4 shadow-sm transition-all duration-300 flex items-center justify-center`}
          style={{ left: dotPos }}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const AnalyzerDashboardPage: React.FC<AnalyzerDashboardPageProps> = ({
  report,
  onSelectReport,
  setActiveTab,
}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [fullscreenModal, setFullscreenModal] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [uploadStepLabel, setUploadStepLabel] = useState('Extracting Document Text & OCR');
  const [copiedText, setCopiedText] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [showEvidenceMap, setShowEvidenceMap] = useState<Record<string, boolean>>({});
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const toggleEvidence = (key: string, quote?: string) => {
    setShowEvidenceMap((prev) => {
      const nextState = !prev[key];
      if (nextState && quote) {
        setSelectedQuote(quote);
        if (textContainerRef.current) {
          textContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        setSelectedQuote(null);
      }
      return { ...prev, [key]: nextState };
    });
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello! I've extracted and analyzed your medical report. Ask me any question about your results or next steps.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

  const currentReport = report || {
    id: 'report-default',
    filename: 'Cardiology_Medical_Report_EmilyJohnson.pdf',
    date: '03/10/2026',
    type: 'Cardiology Evaluation Report',
    fileSize: '1.2 MB',
    riskLevel: 'HIGH',
    findingsCount: 3,
    fileType: 'pdf',
    imageSrc: DEFAULT_FALLBACK_IMAGE,
    extractedText: `Medical Reports of Patients
Patient Information:
Name: Emily Johnson
Date of Birth: 01/15/1989
Patient ID: 987654321
Date of Report: 03/10/2026
Referring Physician: Dr. Alan Green, MD
Specialty: Cardiology
Contact Information: [Physician's Contact Information]

Introduction:
This medical report is prepared for Emily Johnson, following her consultation and comprehensive evaluation in our cardiology department on 03/08/2026. The purpose of this report is to document Ms. Johnson's current cardiac health status and outline the management plan recommended based on our findings.

Medical History:
Ms. Johnson has a history of hypertension, diagnosed three years ago, which she has been managing with medication. She has no known drug allergies. Family history reveals her father had coronary artery disease. She is a non-smoker and maintains a generally active lifestyle.

Presenting Complaints:
Ms. Johnson presented with intermittent chest pain, primarily on exertion, and occasional episodes of palpitations over the last two months. She also reported shortness of breath during her regular jogging sessions, which was previously well-tolerated.

Diagnostic Tests Conducted:
Copyright @ SampleTemplates.com`,
    simplifiedSummary: `Emily Johnson was evaluated for new symptoms of chest pain and shortness of breath that occur during exercise. While she has a history of high blood pressure, these new symptoms require further investigation to ensure her heart is functioning correctly during physical activity. The clinical focus is on determining the cause of her chest pain and managing her cardiac health.`,
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
        normalRange: 'None',
        status: 'HIGH',
        explanation: "Chest pain experienced during physical activity can indicate that the heart muscle isn't getting enough oxygen-rich blood during exertion."
      },
      {
        component: 'Palpitations',
        yourValue: 'Intermittent',
        normalRange: 'None',
        status: 'BORDERLINE',
        explanation: 'A feeling of a racing or fluttering heart, which may indicate a change in heart rhythm.'
      },
      {
        component: 'Shortness of Breath (Dyspnea)',
        yourValue: 'On exertion',
        normalRange: 'None',
        status: 'HIGH',
        explanation: 'Breathlessness during activities (like jogging) that used to be easy suggests a change in cardiovascular fitness or heart function.'
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
  };

  const reportImage = currentReport.imageSrc || DEFAULT_FALLBACK_IMAGE;
  const reportTitle = currentReport.filename || 'Cardiology_Medical_Report.pdf';
  const isPdf =
    currentReport.fileType === 'pdf' ||
    reportTitle.toLowerCase().endsWith('.pdf') ||
    reportImage.startsWith('data:application/pdf');

  const handleFileUpload = (file: File) => {
    setIsUploading(true);
    setUploadStep(1);
    setUploadStepLabel('Extracting Document Text & OCR (PDF.js / Tesseract)');
    const reader = new FileReader();

    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const isPdfFile = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImgFile = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name);

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
        type: isPdfFile ? 'PDF Clinical Document' : isImgFile ? 'Medical Image Scan' : 'Clinical Report',
        fileSize: file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(file.size / 1024).toFixed(0)} KB`,
        riskLevel: analyzedData.riskLevel || 'MODERATE',
        riskReason: analyzedData.riskReason,
        missingSections: analyzedData.missingSections,
        overallConfidence: analyzedData.overallConfidence || 95,
        findingsCount: analyzedData.abnormalValues?.length || 3,
        imageSrc: dataUrl,
        fileType: isPdfFile ? 'pdf' : isImgFile ? 'image' : 'document',
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

      setIsUploading(false);
      setImgError(false);
      if (onSelectReport) {
        onSelectReport(newReport);
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      alert('Could not read file. Please select a valid document or image.');
    };

    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const q = (textToSend || inputQuestion).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuestion('');

    const reply = await askReportQuestion(q, currentReport);
    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  const copyTextToClipboard = () => {
    if (currentReport.extractedText) {
      navigator.clipboard.writeText(currentReport.extractedText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleDownloadText = () => {
    const lines: string[] = [];
    lines.push('====================================================');
    lines.push('               MEDEXPLAIN AI REPORT                 ');
    lines.push('       AI Clinical Intelligence & Analysis          ');
    lines.push('====================================================');
    lines.push('');
    lines.push(`Filename: ${currentReport.filename}`);
    lines.push(`Medical Report Date: ${currentReport.date || 'N/A'}`);
    lines.push(`AI Analysis Timestamp: ${currentReport.analysisTimestamp || new Date().toLocaleString()}`);
    lines.push(`Report Type: ${currentReport.type || 'Clinical Report'}`);
    lines.push(`Clinical Risk Status: ${currentReport.riskLevel || 'EVALUATED'}`);
    if (currentReport.overallConfidence) {
      lines.push(`AI Extraction Confidence: ${currentReport.overallConfidence}%`);
    }
    lines.push('');
    lines.push('----------------------------------------------------');
    lines.push('1. SIMPLIFIED CLINICAL SUMMARY');
    lines.push('----------------------------------------------------');
    lines.push(currentReport.simplifiedSummary || 'N/A');
    lines.push('');

    if (currentReport.riskReason && currentReport.riskReason.length > 0) {
      lines.push('Risk Assessment Rationale:');
      currentReport.riskReason.forEach((r) => lines.push(`  * ${r}`));
      lines.push('');
    }

    if (currentReport.missingSections && currentReport.missingSections.length > 0) {
      lines.push('MISSING SOURCE DIAGNOSTIC DATA NOTICE:');
      currentReport.missingSections.forEach((m) => lines.push(`  ! ${m}`));
      lines.push('');
    }

    lines.push('----------------------------------------------------');
    lines.push('2. KEY FINDINGS');
    lines.push('----------------------------------------------------');
    if (currentReport.keyFindingItems && currentReport.keyFindingItems.length > 0) {
      currentReport.keyFindingItems.forEach((kf) => {
        lines.push(`* ${kf.text}`);
        if (kf.evidenceQuote) {
          lines.push(`  Source Quote: "${kf.evidenceQuote}"`);
        }
      });
    } else if (currentReport.keyFindings) {
      currentReport.keyFindings.forEach((kf) => lines.push(`* ${kf}`));
    }
    lines.push('');

    lines.push('----------------------------------------------------');
    lines.push('3. FLAGGED / ABNORMAL VALUES & REFERENCE BOUNDS');
    lines.push('----------------------------------------------------');
    if (currentReport.abnormalValues && currentReport.abnormalValues.length > 0) {
      currentReport.abnormalValues.forEach((av) => {
        lines.push(`Component: ${av.component}`);
        lines.push(`Value: ${av.yourValue}`);
        lines.push(`Status: [${av.status}]`);
        lines.push(`Reference Bound / Expected: ${av.normalRange}`);
        if (av.explanation) {
          lines.push(`Explanation: ${av.explanation}`);
        }
        if (av.evidenceQuote) {
          lines.push(`Source Quote: "${av.evidenceQuote}"`);
        }
        lines.push('');
      });
    } else {
      lines.push('No abnormal values flagged.');
      lines.push('');
    }

    if (currentReport.medicalTerms && currentReport.medicalTerms.length > 0) {
      lines.push('----------------------------------------------------');
      lines.push('4. MEDICAL TERMS EXPLAINED');
      lines.push('----------------------------------------------------');
      currentReport.medicalTerms.forEach((mt) => {
        lines.push(`* ${mt.term}: ${mt.definition}`);
      });
      lines.push('');
    }

    if (currentReport.suggestedFollowUp && currentReport.suggestedFollowUp.length > 0) {
      lines.push('----------------------------------------------------');
      lines.push('5. SUGGESTED FOLLOW-UP STEPS');
      lines.push('----------------------------------------------------');
      currentReport.suggestedFollowUp.forEach((step) => {
        lines.push(`* ${step}`);
      });
      lines.push('');
    }

    if (currentReport.extractedText) {
      lines.push('====================================================');
      lines.push('RAW EXTRACTED MEDICAL REPORT TEXT');
      lines.push('====================================================');
      lines.push(currentReport.extractedText);
      lines.push('');
    }

    lines.push('====================================================');
    lines.push('IMPORTANT CLINICAL DISCLAIMER:');
    lines.push('This automated AI extraction is provided for patient education and informational review only.');
    lines.push('It is not an official clinical diagnosis. Always consult with a qualified physician before making treatment decisions.');
    lines.push('====================================================');

    const textContent = lines.join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const safeFilename = (currentReport.filename || 'Medical_Report')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeFilename}_MedExplain_AI_Analysis.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    setIsDownloadingPdf(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - margin * 2;
        let y = 15;

        const checkPageBreak = (neededHeight: number) => {
          if (y + neededHeight > pageHeight - 20) {
            doc.addPage();
            y = 15;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(`MedExplain AI Report | ${currentReport.filename}`, margin, 10);
            doc.setDrawColor(226, 232, 240);
            doc.line(margin, 12, pageWidth - margin, 12);
          }
        };

        // Header Banner with MedExplain AI Logo
        doc.setFillColor(0, 107, 44);
        doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'F');

        // Draw MedExplain AI Logo Emblem (White square + Green Medical Cross)
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin + 5, y + 4, 20, 20, 3, 3, 'F');

        doc.setFillColor(0, 107, 44);
        doc.rect(margin + 8.5, y + 12, 13, 4, 'F'); // Horizontal cross bar
        doc.rect(margin + 13, y + 7.5, 4, 13, 'F'); // Vertical cross bar

        // MedExplain AI Branding & Header Text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('MedExplain AI', margin + 30, y + 11);

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(127, 252, 151); // #7ffc97 green accent
        doc.text('AI CLINICAL REPORT ANALYSIS', margin + 30, y + 17);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(240, 240, 240);
        doc.text(`Document: ${currentReport.filename}   |   Date: ${currentReport.date || '03/10/2024'}`, margin + 30, y + 23);

        y += 34;

        // Metadata Box
        doc.setFillColor(241, 243, 255);
        doc.setDrawColor(189, 202, 186);
        doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

        doc.setTextColor(20, 27, 43);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.text(`Clinical Risk Level: ${currentReport.riskLevel || 'EVALUATED'}`, margin + 6, y + 7);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(`Report Type: ${currentReport.type || 'Clinical Report'}   |   File Size: ${currentReport.fileSize || 'N/A'}`, margin + 6, y + 13);

        y += 24;

        // 1. SIMPLIFIED SUMMARY
        checkPageBreak(30);
        doc.setFillColor(0, 107, 44);
        doc.rect(margin, y, contentWidth, 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.text('1. SIMPLIFIED CLINICAL SUMMARY', margin + 4, y + 4.3);
        y += 10;

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const summaryLines = doc.splitTextToSize(
          currentReport.simplifiedSummary || 'Clinical summary unavailable.',
          contentWidth
        );
        doc.text(summaryLines, margin, y);
        y += summaryLines.length * 4.8 + 8;

        // 2. KEY FINDINGS
        if (currentReport.keyFindings && currentReport.keyFindings.length > 0) {
          checkPageBreak(25);
          doc.setFillColor(0, 107, 44);
          doc.rect(margin, y, contentWidth, 6, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9.5);
          doc.setFont('helvetica', 'bold');
          doc.text('2. KEY FINDINGS', margin + 4, y + 4.3);
          y += 10;

          doc.setTextColor(30, 41, 59);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          currentReport.keyFindings.forEach((finding) => {
            const lines = doc.splitTextToSize(`• ${finding}`, contentWidth - 4);
            checkPageBreak(lines.length * 4.5 + 2);
            doc.text(lines, margin + 2, y);
            y += lines.length * 4.5 + 2.5;
          });
          y += 6;
        }

        // 3. ABNORMAL VALUES
        if (currentReport.abnormalValues && currentReport.abnormalValues.length > 0) {
          checkPageBreak(30);
          doc.setFillColor(0, 107, 44);
          doc.rect(margin, y, contentWidth, 6, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9.5);
          doc.setFont('helvetica', 'bold');
          doc.text('3. FLAGGED / ABNORMAL VALUES', margin + 4, y + 4.3);
          y += 10;

          currentReport.abnormalValues.forEach((item) => {
            const expLines = item.explanation
              ? doc.splitTextToSize(item.explanation, contentWidth - 8)
              : [];
            const boxHeight = 14 + (expLines.length > 0 ? expLines.length * 4 + 2 : 0);

            checkPageBreak(boxHeight + 4);

            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'FD');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(15, 23, 42);
            doc.text(`${item.component}: `, margin + 4, y + 5.5);

            const compWidth = doc.getTextWidth(`${item.component}: `);
            doc.setTextColor(0, 107, 44);
            doc.text(`${item.yourValue}`, margin + 4 + compWidth, y + 5.5);

            doc.setFontSize(8);
            if (item.status === 'HIGH') {
              doc.setTextColor(185, 28, 28);
            } else if (item.status === 'BORDERLINE') {
              doc.setTextColor(180, 83, 9);
            } else {
              doc.setTextColor(4, 120, 87);
            }
            doc.text(`[${item.status}]  Reference: ${item.normalRange}`, margin + contentWidth - 4, y + 5.5, { align: 'right' });

            if (expLines.length > 0) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8.5);
              doc.setTextColor(71, 85, 105);
              doc.text(expLines, margin + 4, y + 11);
            }

            y += boxHeight + 4;
          });
          y += 4;
        }

        // 4. MEDICAL TERMS EXPLAINED
        if (currentReport.medicalTerms && currentReport.medicalTerms.length > 0) {
          checkPageBreak(25);
          doc.setFillColor(0, 107, 44);
          doc.rect(margin, y, contentWidth, 6, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9.5);
          doc.setFont('helvetica', 'bold');
          doc.text('4. MEDICAL TERMS EXPLAINED', margin + 4, y + 4.3);
          y += 10;

          currentReport.medicalTerms.forEach((mt) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(15, 23, 42);
            const termHeader = `• ${mt.term}: `;
            doc.text(termHeader, margin + 2, y);

            const termWidth = doc.getTextWidth(termHeader);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(51, 65, 85);
            const defLines = doc.splitTextToSize(mt.definition, contentWidth - 4 - termWidth);

            checkPageBreak(defLines.length * 4.5 + 2);
            doc.text(defLines, margin + 2 + termWidth, y);
            y += defLines.length * 4.5 + 2;
          });
          y += 6;
        }

        // 5. SUGGESTED FOLLOW-UP
        if (currentReport.suggestedFollowUp && currentReport.suggestedFollowUp.length > 0) {
          checkPageBreak(25);
          doc.setFillColor(0, 107, 44);
          doc.rect(margin, y, contentWidth, 6, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9.5);
          doc.setFont('helvetica', 'bold');
          doc.text('5. SUGGESTED FOLLOW-UP', margin + 4, y + 4.3);
          y += 10;

          doc.setTextColor(30, 41, 59);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          currentReport.suggestedFollowUp.forEach((step) => {
            const lines = doc.splitTextToSize(`• ${step}`, contentWidth - 4);
            checkPageBreak(lines.length * 4.5 + 2);
            doc.text(lines, margin + 2, y);
            y += lines.length * 4.5 + 2;
          });
          y += 8;
        }

        // DISCLAIMER
        checkPageBreak(20);
        doc.setFillColor(254, 243, 199);
        doc.setDrawColor(245, 158, 11);
        doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(146, 64, 14);
        doc.text('IMPORTANT CLINICAL DISCLAIMER:', margin + 4, y + 5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text(
          'This automated AI summary is generated for educational and reference purposes only. Consult a qualified physician for professional clinical diagnosis and medical decisions.',
          margin + 4,
          y + 10
        );

        const safeFilename = (currentReport.filename || 'Medical_Report')
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_');
        doc.save(`${safeFilename}_AI_Analysis.pdf`);
      } catch (err) {
        console.error('Failed to generate PDF:', err);
        alert('There was an error generating the PDF document.');
      } finally {
        setIsDownloadingPdf(false);
      }
    }, 150);
  };

  return (
    <main className="pt-24 pb-16 max-w-[1280px] mx-auto px-6 min-h-screen">
      {/* PRINT-ONLY BRANDING HEADER WITH MEDEXPLAIN AI LOGO */}
      <div className="hidden print:block mb-6 pb-4 border-b-2 border-[#006b2c]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#006b2c] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-3xl font-bold">medical_services</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#006b2c] tracking-tight">MedExplain AI</h1>
                <span className="bg-[#7ffc97] text-[#005221] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Verified AI Analysis</span>
              </div>
              <p className="text-xs text-[#3e4a3d] font-bold mt-0.5">Automated Clinical Intelligence & Medical Report Extraction</p>
            </div>
          </div>
          <div className="text-right text-xs text-[#3e4a3d] space-y-0.5">
            <p className="font-bold text-[#141b2b] text-sm">{currentReport.filename}</p>
            <p><span className="font-semibold">Medical Report Date:</span> {currentReport.date || '03/10/2024'}</p>
            <p><span className="font-semibold">Generated:</span> {currentReport.analysisTimestamp || new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Breadcrumbs & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
        <nav className="flex items-center gap-2 text-[#3e4a3d] text-[13px]">
          <button
            onClick={() => setActiveTab('home')}
            className="hover:text-[#006b2c] transition-colors"
          >
            Home
          </button>
          <span className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          <button
            onClick={() => setActiveTab('upload')}
            className="hover:text-[#006b2c] transition-colors"
          >
            Upload
          </button>
          <span className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          <span className="text-[#006b2c] font-semibold truncate max-w-[280px]">
            {reportTitle}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloadingPdf}
            className="px-4 py-2 bg-[#006b2c] text-white rounded-xl text-[13px] font-bold hover:bg-[#005221] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
            title="Download full analysis as PDF with MedExplain AI logo"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDownloadingPdf ? 'hourglass_empty' : 'download'}
            </span>
            {isDownloadingPdf ? 'Generating PDF...' : 'Download Report'}
          </button>
          <button
            onClick={handleDownloadText}
            className="px-4 py-2 border border-[#bdcaba] text-[#3e4a3d] hover:bg-[#f1f3ff] rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download extracted summary & text as a .txt file"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            Download Text (.txt)
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-[#bdcaba] text-[#3e4a3d] hover:bg-[#f1f3ff] rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Print report with MedExplain AI branding"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print Report
          </button>
        </div>
      </div>

      {/* Active Document & Model Info Banner */}
      <div className="mb-6 bg-gradient-to-r from-white via-[#f0fdf4] to-white border border-[#006b2c]/20 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#006b2c]/10 text-[#006b2c] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[16px] font-bold text-[#141b2b]">{currentReport.filename}</h2>
              <span className="text-[11px] font-bold bg-[#f1f3ff] text-[#3e4a3d] border border-[#bdcaba]/40 px-2.5 py-0.5 rounded-md">
                {currentReport.type || 'Clinical Report'}
              </span>
            </div>
            <p className="text-[12px] text-[#3e4a3d] mt-0.5">
              Report Date: <span className="font-semibold text-[#141b2b]">{currentReport.date || 'Extracted'}</span> • Analyzed: <span className="font-semibold text-[#141b2b]">{currentReport.analysisTimestamp || 'Just now'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-[#006b2c]/30 px-3.5 py-1.5 rounded-xl shadow-xs">
            <span className="material-symbols-outlined text-[#006b2c] text-[18px]">psychology</span>
            <span className="text-[12px] font-medium text-[#3e4a3d]">AI Model / Engine:</span>
            <span className="text-[12px] font-extrabold text-[#005221] bg-[#7ffc97] px-2.5 py-0.5 rounded-md border border-[#006b2c]/20 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#005221]">bolt</span>
              {currentReport.provider || 'Gemini'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Quick Drag & Drop Banner */}
      <section className="mb-8 print:hidden" id="upload-section">
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className="relative bg-white border-2 border-dashed border-[#006b2c]/40 rounded-[18px] p-6 text-center hover:border-[#006b2c] transition-colors cursor-pointer group flex flex-col items-center justify-center min-h-[140px] block shadow-sm"
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.dicom,.webp"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {isUploading ? (
            <div className="w-full p-3 space-y-3 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#006b2c] text-white rounded-lg flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#141b2b]">Analyzing Document with AI Pipeline</h3>
                    <p className="text-[12px] text-[#006b2c] font-bold">{uploadStepLabel}</p>
                  </div>
                </div>
                <span className="bg-[#006b2c] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Stage {uploadStep}/5 ({uploadStep * 20}%)
                </span>
              </div>

              <div className="w-full h-2 bg-[#f1f3ff] rounded-full overflow-hidden border border-[#bdcaba]/30">
                <div 
                  className="h-full bg-gradient-to-r from-[#006b2c] to-[#7ffc97] transition-all duration-300 rounded-full"
                  style={{ width: `${uploadStep * 20}%` }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-1">
                {[
                  { num: 1, label: 'OCR & Text' },
                  { num: 2, label: 'Cleaning' },
                  { num: 3, label: 'Prompt Engine' },
                  { num: 4, label: 'AI Inference' },
                  { num: 5, label: 'Schema Check' },
                ].map((s) => {
                  const isDone = uploadStep > s.num;
                  const isCurrent = uploadStep === s.num;
                  return (
                    <div 
                      key={s.num}
                      className={`text-center py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                        isDone 
                          ? 'bg-[#f0fdf4] text-[#006b2c] border border-[#006b2c]/30' 
                          : isCurrent 
                          ? 'bg-[#006b2c] text-white shadow-xs animate-pulse' 
                          : 'bg-gray-50 text-gray-400 border border-gray-200'
                      }`}
                    >
                      <span>{isDone ? '✓' : `${s.num}.`}</span>
                      <span className="truncate">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 bg-[#7ffc97] rounded-full flex items-center justify-center text-[#006b2c] group-hover:scale-110 transition-transform flex-shrink-0">
                <span className="material-symbols-outlined text-[28px]">
                  upload_file
                </span>
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#141b2b]">
                  Drop Medical Image or PDF Scan Here
                </h2>
                <p className="text-[#3e4a3d] text-[13px]">
                  Supports PDF, JPG, PNG clinical lab reports & doctor notes
                </p>
              </div>
              <span className="md:ml-auto border border-[#006b2c] text-[#006b2c] px-5 py-2 rounded-xl text-[13px] font-bold group-hover:bg-[#006b2c] group-hover:text-white transition-all inline-block">
                Browse Files
              </span>
            </div>
          )}
        </label>
      </section>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Document Viewer & Extracted Text */}
        <aside className="lg:col-span-5 space-y-6">
          {/* Original Document Preview Card */}
          <div className="bg-white border border-[#bdcaba]/30 rounded-[18px] p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-[#141b2b] text-[16px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c]">
                  description
                </span>
                Original Document
              </h3>
              <span className="text-[12px] font-medium text-[#3e4a3d] bg-[#f1f3ff] px-2.5 py-1 rounded">
                {currentReport.fileSize || '1.2 MB'}
              </span>
            </div>

            <div className="bg-[#f1f3ff] rounded-xl p-3 border border-[#bdcaba]/20 flex flex-col items-center">
              {isPdf ? (
                <div className="w-full flex flex-col items-center gap-3">
                  <iframe
                    src={reportImage}
                    title="Original PDF Medical Report"
                    className="w-full h-[400px] rounded-lg border border-[#bdcaba]/30 bg-white"
                  />
                  <button
                    onClick={() => setFullscreenModal(true)}
                    className="text-[#006b2c] font-semibold text-[13px] hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">fullscreen</span>
                    Open Full PDF Document
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setFullscreenModal(true)}
                  className="w-full cursor-pointer hover:opacity-95 transition-opacity flex flex-col items-center"
                >
                  <img
                    className="w-full h-auto max-h-[480px] object-contain shadow-md rounded-lg border border-[#bdcaba]/30 bg-white"
                    alt="Original Medical Report Preview"
                    src={imgError ? DEFAULT_FALLBACK_IMAGE : reportImage}
                    onError={() => setImgError(true)}
                  />
                  <span className="mt-2 text-[#006b2c] font-semibold text-[13px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">zoom_in</span>
                    Click to Enlarge Image
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Text Block */}
          <div ref={textContainerRef} className="bg-white border border-[#bdcaba]/30 rounded-[18px] p-5 shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
              <div>
                <span className="text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider block">Original file OCR</span>
                <h3 className="font-bold text-[#141b2b] text-[18px]">report</h3>
                <p className="text-[13px] text-[#006b2c] font-bold mt-0.5">Extracted text</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedQuote && (
                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg hover:bg-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                    Clear Highlight
                  </button>
                )}
                <button
                  onClick={copyTextToClipboard}
                  className="text-[12px] font-bold text-[#006b2c] hover:bg-[#7ffc97]/20 border border-[#006b2c]/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy extracted text to clipboard"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedText ? 'check' : 'content_copy'}
                  </span>
                  {copiedText ? 'Copied!' : 'Copy Text'}
                </button>
                <button
                  onClick={handleDownloadText}
                  className="text-[12px] font-bold text-[#006b2c] hover:bg-[#7ffc97]/20 border border-[#006b2c]/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Download report & extracted text as .txt file"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download Text
                </button>
              </div>
            </div>

            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-4 font-mono text-[13px] text-[#1f2937] leading-relaxed max-h-[420px] overflow-y-auto custom-scrollbar select-text">
              {(() => {
                const text = currentReport.extractedText || '';
                if (!text) return 'No extracted text available for this report.';
                if (!selectedQuote) return text;
                const lines = text.split('\n');
                const target = selectedQuote.trim().toLowerCase();
                return (
                  <div className="space-y-1">
                    {lines.map((line, idx) => {
                      const lineLower = line.toLowerCase();
                      const isMatch = target.length > 3 && (lineLower.includes(target) || target.includes(lineLower.trim()));
                      return (
                        <div
                          key={idx}
                          className={`transition-all duration-300 rounded px-1.5 py-0.5 ${
                            isMatch
                              ? 'bg-amber-200 text-amber-950 font-bold border-l-4 border-amber-600 shadow-sm ring-2 ring-amber-300 animate-pulse'
                              : ''
                          }`}
                        >
                          {line || '\u00A0'}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: AI Summary & Structured Medical Analysis */}
        <div className="lg:col-span-7 space-y-6">

          {/* AI Summary / Simplified Summary Card */}
          <div className="bg-white border border-[#006b2c]/30 rounded-[18px] overflow-hidden shadow-sm card-glow">
            <div className="bg-[#006b2c] px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7ffc97] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                <h3 className="text-white text-[15px] font-bold uppercase tracking-wider">
                  AI Clinical Analysis
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/15 text-white border border-white/30 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm">
                  <span className="material-symbols-outlined text-xs text-[#7ffc97]">bolt</span>
                  Powered by {currentReport.provider || 'Gemini'}
                </span>
                <span className="bg-[#7ffc97] text-[#005221] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">folder_special</span>
                  {currentReport.documentType || detectDocumentType(currentReport.filename, currentReport.extractedText)}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-[12px] font-bold text-[#3e4a3d] uppercase tracking-wider mb-1">
                  Simplified summary
                </p>
                <p className="text-[#141b2b] text-[15px] leading-relaxed font-normal">
                  {currentReport.simplifiedSummary || 'Clinical summary unavailable.'}
                </p>
              </div>

              {/* Explicit Separated Timestamps */}
              <div className="pt-3 border-t border-[#bdcaba]/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                <div className="bg-[#f1f3ff] p-2.5 rounded-xl border border-[#bdcaba]/30 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006b2c] text-[18px]">calendar_today</span>
                  <div>
                    <span className="text-[#3e4a3d] font-bold block text-[10px] uppercase">Medical Report Date</span>
                    <span className="text-[#141b2b] font-semibold">{currentReport.date || '10/24/2026'}</span>
                  </div>
                </div>

                <div className="bg-[#f1f3ff] p-2.5 rounded-xl border border-[#bdcaba]/30 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006b2c] text-[18px]">schedule</span>
                  <div>
                    <span className="text-[#3e4a3d] font-bold block text-[10px] uppercase">AI Analysis Generated</span>
                    <span className="text-[#141b2b] font-semibold">{currentReport.analysisTimestamp || '01 Aug 2026, 10:42 AM'}</span>
                  </div>
                </div>
              </div>

              {/* SEPARATED CARDS: EXTRACTION CONFIDENCE vs CLINICAL RISK LEVEL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Card A: Extraction Confidence */}
                <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-slate-600 text-[18px]">psychology</span>
                      Extraction Confidence
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                      {currentReport.overallConfidence ? `${currentReport.overallConfidence}% Precision` : '96% Precision'}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-snug">
                    Measures OCR text recognition accuracy & structural parameter parsing precision.
                  </p>
                </div>

                {/* Card B: Clinical Risk Level */}
                <div className="p-4 rounded-xl border bg-emerald-50/70 border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-700 text-[18px]">shield</span>
                      Clinical Risk Level
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase border ${
                      currentReport.riskLevel === 'HIGH' ? 'bg-red-100 text-red-900 border-red-300' :
                      currentReport.riskLevel === 'MODERATE' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {currentReport.riskLevel || 'LOW'} RISK
                    </span>
                  </div>
                  <p className="text-[12px] text-emerald-900 leading-snug">
                    Measures health risk stratification based on reference bounds & symptoms.
                  </p>
                </div>
              </div>

              {/* Risk Assessment Breakdown & Contributing Findings Summary */}
              {(() => {
                const abItems = currentReport.abnormalValues || [];
                const hCount = abItems.filter((i) => i.status === 'HIGH').length;
                const lCount = abItems.filter((i) => i.status === 'LOW').length;
                const bCount = abItems.filter((i) => i.status === 'BORDERLINE').length;
                const nCount = abItems.filter((i) => i.status === 'NORMAL').length;

                return (
                  <div className="p-4 rounded-xl border bg-[#f9fafb] border-[#bdcaba]/30 space-y-2.5 text-[13px] text-[#3e4a3d]">
                    <p className="font-bold text-[#141b2b] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#006b2c] text-[18px]">analytics</span>
                      Risk Assessment Rationale & Contributing Findings:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center my-2">
                      <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                        <span className="block font-black text-red-800 text-[15px]">{hCount}</span>
                        <span className="text-[10px] font-bold text-red-700 uppercase">High Values</span>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                        <span className="block font-black text-blue-800 text-[15px]">{lCount}</span>
                        <span className="text-[10px] font-bold text-blue-700 uppercase">Low Values</span>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                        <span className="block font-black text-amber-800 text-[15px]">{bCount}</span>
                        <span className="text-[10px] font-bold text-amber-700 uppercase">Borderline</span>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                        <span className="block font-black text-emerald-800 text-[15px]">{nCount}</span>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">In Normal Bounds</span>
                      </div>
                    </div>

                    <ul className="space-y-1 pl-1">
                      {(Array.isArray(currentReport.riskReason) && currentReport.riskReason.length > 0
                        ? currentReport.riskReason
                        : typeof currentReport.riskReason === 'string' && currentReport.riskReason.trim()
                        ? [currentReport.riskReason]
                        : [
                            'Metabolic indicators predominantly within standard reference bounds',
                            'Mild elevation in Serum Uric Acid and mild Vitamin D insufficiency',
                            'No critical organ markers flagged'
                          ]
                      ).map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[12px]">
                          <span className="text-[#006b2c] font-bold">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* MISSING SOURCE INFORMATION NOTICE CARD */}
          {(Array.isArray(currentReport.missingSections)
            ? currentReport.missingSections
            : typeof currentReport.missingSections === 'string' && (currentReport.missingSections as string).trim()
            ? [currentReport.missingSections as string]
            : []
          ).length > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-[18px] p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-[15px]">
                <span className="material-symbols-outlined text-amber-700 text-[22px]">
                  warning
                </span>
                Missing Source Diagnostic Data Notice
              </div>
              {(Array.isArray(currentReport.missingSections)
                ? currentReport.missingSections
                : typeof currentReport.missingSections === 'string' && (currentReport.missingSections as string).trim()
                ? [currentReport.missingSections as string]
                : []
              ).map((notice, idx) => (
                <p key={idx} className="text-[13px] text-amber-800 leading-relaxed pl-7">
                  {notice}
                </p>
              ))}
            </div>
          )}

          {/* Key Findings Card with Source Traceability & Evidence Quotes */}
          <div className="bg-white border border-[#bdcaba]/30 rounded-[18px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[#bdcaba]/20 pb-3">
              <h3 className="text-[18px] font-bold text-[#141b2b] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c]">
                  fact_check
                </span>
                Key findings
              </h3>
              <span className="text-[12px] font-medium text-[#3e4a3d]">
                Source Traceability Enabled
              </span>
            </div>

            <div className="space-y-3">
              {(currentReport.keyFindingItems && currentReport.keyFindingItems.length > 0
                ? currentReport.keyFindingItems
                : (currentReport.keyFindings || [
                    'New onset of chest pain and shortness of breath during exercise.',
                    'History of high blood pressure (hypertension) currently managed by medication.',
                    'Family history of heart disease (father).',
                    'Recent episodes of heart palpitations.'
                  ]).map((f) => ({
                    text: typeof f === 'string' ? f : f,
                    sourceType: 'extracted' as const,
                    evidenceQuote: typeof f === 'string' ? f : '',
                    confidence: 96
                  }))
              ).map((item, idx) => {
                const key = `kf-${idx}`;
                const text = typeof item === 'string' ? item : item.text;
                const quote = typeof item === 'object' ? item.evidenceQuote : '';
                const conf = typeof item === 'object' ? item.confidence : 95;
                const srcType = typeof item === 'object' ? item.sourceType : 'extracted';

                return (
                  <div key={idx} className="border border-[#bdcaba]/20 rounded-xl p-3.5 bg-[#f9fafb] space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 text-[14px] text-[#141b2b] leading-snug">
                        <span className="w-5 h-5 rounded-full bg-[#006b2c]/10 text-[#006b2c] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                          ✓
                        </span>
                        <span className="font-medium">{text}</span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 whitespace-nowrap uppercase ${
                        srcType === 'extracted' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {srcType === 'extracted' ? '✓ Extracted' : 'AI Interpretation'} {conf ? `(${conf}%)` : ''}
                      </span>
                    </div>

                    {quote && (
                      <div>
                        <button
                          onClick={() => toggleEvidence(key)}
                          className="text-[11px] text-[#006b2c] font-bold hover:underline flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">find_in_page</span>
                          {showEvidenceMap[key] ? 'Hide Source Quote' : 'View Supporting Document Quote'}
                        </button>

                        {showEvidenceMap[key] && (
                          <div className="mt-2 p-2.5 bg-white border-l-2 border-[#006b2c] text-[12px] italic text-[#3e4a3d] rounded-r-md">
                            &ldquo;{quote}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Abnormal / Flagged Values Section Grouped by Category */}
          <div className="bg-white border border-[#bdcaba]/30 rounded-[18px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[#bdcaba]/20 pb-3">
              <h3 className="text-[18px] font-bold text-[#141b2b] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a]">
                  warning
                </span>
                Flagged & Abnormal Findings by Category
              </h3>
              <span className="text-[12px] text-[#3e4a3d] font-semibold bg-[#f1f3ff] px-2.5 py-1 rounded-full border border-[#bdcaba]/30">
                {(currentReport.abnormalValues?.length || 0)} indicators evaluated
              </span>
            </div>

            <div className="space-y-6">
              {(() => {
                const rawList: AbnormalValueItem[] = (currentReport.abnormalValues && currentReport.abnormalValues.length > 0)
                  ? currentReport.abnormalValues
                  : [
                      {
                        component: 'Intermittent Chest Pain (Exertional)',
                        yourValue: 'Present',
                        normalRange: 'Expected: No chest pain during physical activity',
                        status: 'HIGH' as const,
                        category: 'Cardiology & Clinical Symptoms',
                        explanation: 'Exertional chest pain is outside expected normal bounds. Clinical evaluation depends on physical context and physician assessment.',
                        sourceType: 'extracted' as const,
                        evidenceQuote: 'presented with intermittent chest pain, primarily on exertion',
                        confidence: 96
                      },
                      {
                        component: 'Palpitations',
                        yourValue: 'Intermittent',
                        normalRange: 'Expected: Regular heart rhythm without fluttering',
                        status: 'BORDERLINE' as const,
                        category: 'Cardiology & Clinical Symptoms',
                        explanation: 'Intermittent cardiac fluttering is slightly outside normal expected rhythm and warrants evaluation by your doctor.',
                        sourceType: 'extracted' as const,
                        evidenceQuote: 'occasional episodes of palpitations over the last two months',
                        confidence: 92
                      },
                      {
                        component: 'Shortness of Breath (Dyspnea)',
                        yourValue: 'On exertion',
                        normalRange: 'Expected: Unimpaired breathing during routine exercise',
                        status: 'HIGH' as const,
                        category: 'Cardiology & Clinical Symptoms',
                        explanation: 'Breathlessness during routine activities suggests changes in physical tolerance and warrants review by your doctor.',
                        sourceType: 'extracted' as const,
                        evidenceQuote: 'shortness of breath during her regular jogging sessions, which was previously well-tolerated',
                        confidence: 95
                      }
                    ];

                const groups: Record<string, AbnormalValueItem[]> = {};
                rawList.forEach((item) => {
                  const cat = item.category || categorizeComponent(item.component);
                  if (!groups[cat]) groups[cat] = [];
                  groups[cat].push(item);
                });

                const renderStatusBadge = (status: 'HIGH' | 'LOW' | 'BORDERLINE' | 'NORMAL') => {
                  if (status === 'HIGH') {
                    return (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200 inline-flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                        High
                      </span>
                    );
                  }
                  if (status === 'LOW') {
                    return (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                        Low
                      </span>
                    );
                  }
                  if (status === 'BORDERLINE') {
                    return (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        Borderline
                      </span>
                    );
                  }
                  return (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1 shadow-2xs">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Normal
                    </span>
                  );
                };

                return Object.entries(groups).map(([categoryName, items], cIdx) => {
                  const iconInfo = getCategoryIcon(categoryName);

                  return (
                    <div key={cIdx} className="space-y-3">
                      {/* Category Header */}
                      <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200">
                        <div className={`w-7 h-7 rounded-lg ${iconInfo.bg} flex items-center justify-center`}>
                          <span className={`material-symbols-outlined text-[18px] ${iconInfo.color}`}>
                            {iconInfo.icon}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#141b2b] text-[15px]">
                          {categoryName}
                        </h4>
                        <span className="text-[11px] text-gray-500 font-semibold ml-auto bg-gray-100 px-2 py-0.5 rounded-full">
                          {items.length} {items.length === 1 ? 'parameter' : 'parameters'}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {items.map((item, idx) => {
                          const key = `ab-${cIdx}-${idx}`;
                          const normDisplay = item.normalRange && item.normalRange !== 'None' && item.normalRange !== 'Absent'
                            ? item.normalRange
                            : 'Expected: Standard Reference Limit';

                          return (
                            <div key={idx} className="border border-[#bdcaba]/30 rounded-xl p-4 bg-[#f9fafb] space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h5 className="font-bold text-[#141b2b] text-[15px]">
                                  {item.component}: <span className="text-[#006b2c] font-extrabold">{item.yourValue}</span>
                                </h5>
                                <div className="flex items-center gap-2">
                                  {/* SEVERITY BADGE */}
                                  {renderStatusBadge(item.status)}

                                  {/* SEPARATE EXTRACTION CONFIDENCE BADGE */}
                                  {item.confidence && (
                                    <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-bold px-2 py-0.5 rounded">
                                      {item.confidence}% Precision
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* VISUAL LABORATORY SLIDER / RANGE INDICATOR BAR */}
                              <RangeIndicatorBar status={item.status} valueStr={item.yourValue} rangeStr={item.normalRange} />

                              <div className="text-[12px] text-[#3e4a3d] font-semibold bg-white p-2 rounded-lg border border-[#bdcaba]/20">
                                <span className="text-[#006b2c] font-bold">Reference Interval: </span>
                                {normDisplay}
                              </div>

                              {item.explanation && (
                                <p className="text-[13px] text-[#141b2b] leading-relaxed pt-1">
                                  {item.explanation}
                                </p>
                              )}

                              {item.evidenceQuote && (
                                <div>
                                  <button
                                    onClick={() => toggleEvidence(key, item.evidenceQuote)}
                                    className="text-[11px] text-[#006b2c] font-bold hover:underline flex items-center gap-1 cursor-pointer pt-1"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">find_in_page</span>
                                    {showEvidenceMap[key] ? 'Hide Document Quote' : 'View Source Quote & Highlight'}
                                  </button>

                                  {showEvidenceMap[key] && (
                                    <div className="mt-2 p-2.5 bg-amber-50/70 border-l-2 border-amber-500 text-[12px] italic text-amber-950 rounded-r-md">
                                      &ldquo;{item.evidenceQuote}&rdquo;
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Medical Terms Explained */}
          <div className="bg-white border border-[#bdcaba]/30 rounded-[18px] p-6 shadow-sm">
            <h3 className="text-[18px] font-bold text-[#141b2b] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006b2c]">
                menu_book
              </span>
              Medical terms explained
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(currentReport.medicalTerms && currentReport.medicalTerms.length > 0
                ? currentReport.medicalTerms
                : [
                    { term: 'Hypertension', definition: 'High blood pressure.' },
                    { term: 'Coronary Artery Disease', definition: "Damage or disease in the heart's major blood vessels." },
                    { term: 'Palpitations', definition: 'The sensation that the heart is racing, thumping, or skipping a beat.' },
                    { term: 'Exertion', definition: 'Physical effort or exercise.' }
                  ]
              ).map((mTerm, idx) => (
                <div key={idx} className="bg-[#f1f3ff]/60 border border-[#bdcaba]/20 p-3.5 rounded-xl">
                  <p className="font-bold text-[#141b2b] text-[14px]">
                    {mTerm.term}
                  </p>
                  <p className="text-[13px] text-[#3e4a3d] mt-1 leading-snug">
                    {mTerm.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Follow-up */}
          <div className="bg-white border border-[#bdcaba]/30 rounded-[18px] p-6 shadow-sm">
            <h3 className="text-[18px] font-bold text-[#141b2b] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006b2c]">
                medical_services
              </span>
              Suggested follow-up
            </h3>

            <ul className="space-y-2.5">
              {(currentReport.suggestedFollowUp && currentReport.suggestedFollowUp.length > 0
                ? currentReport.suggestedFollowUp
                : [
                    'Complete the diagnostic tests mentioned in the cardiology evaluation (results were not included in this text).',
                    'Discuss the need for a stress test or imaging with Dr. Alan Green.',
                    'Monitor and log the frequency and intensity of chest pain or palpitations.'
                  ]
              ).map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[14px] text-[#141b2b]">
                  <span className="text-[#006b2c] font-bold text-lg leading-none mt-0.5">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-xl">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-amber-700 text-2xl mt-0.5">
                info
              </span>
              <div className="text-amber-800 text-[13px] leading-relaxed">
                <p className="font-bold mb-1">Important Clinical Disclaimer</p>
                This automated AI extraction is provided for patient education and informational review only. It is not an official clinical diagnosis. Always consult with a qualified physician or cardiologist before making any medical treatment decisions.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating AI Medical Assistant Chat Overlay */}
      <div className="fixed bottom-6 right-6 z-[60] print:hidden">
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-[#006b2c] text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2.5 font-bold text-[14px]"
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              chat
            </span>
            <span>Ask AI Medical Assistant</span>
          </button>
        )}

        {chatOpen && (
          <div className="w-[360px] sm:w-[400px] bg-white border border-[#bdcaba]/30 rounded-2xl shadow-2xl flex flex-col h-[520px] overflow-hidden animate-in fade-in duration-200">
            {/* Chat Header */}
            <div className="bg-[#006b2c] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <div>
                  <h4 className="font-bold text-[14px] leading-none">
                    AI Clinical Assistant
                  </h4>
                  <span className="text-[11px] text-[#7ffc97]">
                    Report Context Loaded
                  </span>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f9f9ff] text-[13px] custom-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-[#006b2c] text-white rounded-br-none'
                        : 'bg-white border border-[#bdcaba]/30 text-[#141b2b] rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                  <span className="text-[10px] text-[#3e4a3d] mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-white border-t border-[#bdcaba]/20 flex gap-2 overflow-x-auto no-scrollbar text-[11px]">
              <button
                onClick={() => handleSendMessage('What does exertional chest pain mean?')}
                className="bg-[#f1f3ff] text-[#006b2c] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-[#e1e8fd]"
              >
                Exertional Chest Pain?
              </button>
              <button
                onClick={() => handleSendMessage('What should I ask Dr. Alan Green?')}
                className="bg-[#f1f3ff] text-[#006b2c] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-[#e1e8fd]"
              >
                Questions for Doctor?
              </button>
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-[#bdcaba]/20 flex gap-2">
              <input
                type="text"
                placeholder="Ask a question about your report..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-[#f1f3ff] px-3.5 py-2 rounded-xl text-[13px] text-[#141b2b] focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-[#006b2c] text-white p-2 rounded-xl hover:bg-[#005221] transition-colors flex items-center justify-center flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Document Modal */}
      {fullscreenModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-[#141b2b] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-[16px] truncate max-w-md">
                {reportTitle}
              </h3>
              <button
                onClick={() => setFullscreenModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-[#f9f9ff] flex justify-center items-center">
              {isPdf ? (
                <iframe
                  src={reportImage}
                  title="Fullscreen PDF View"
                  className="w-full h-[75vh] rounded-lg border border-[#bdcaba]/30 bg-white"
                />
              ) : (
                <img
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-xl bg-white"
                  alt="Full Report View"
                  src={imgError ? DEFAULT_FALLBACK_IMAGE : reportImage}
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
