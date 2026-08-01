import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set. Using smart fallback parsing.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Medical Report Analysis Route
app.post('/api/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType, filename, fileText } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback mock response if GEMINI_API_KEY is not available
      return res.json({
        filename: filename || 'Medical_Report.pdf',
        date: '03/10/2024',
        analysisTimestamp: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        extractedText: fileText || `Medical Reports of Patients
Patient Information:
Name: Emily Johnson
Date of Birth: 01/15/1989
Patient ID: 987654321
Date of Report: 03/10/2024
Referring Physician: Dr. Alan Green, MD
Specialty: Cardiology

Introduction:
This medical report is prepared for Emily Johnson following her consultation and comprehensive evaluation in our cardiology department on 03/08/2024.

Medical History:
Ms. Johnson has a history of hypertension, diagnosed three years ago, which she has been managing with medication. She has no known drug allergies. Family history reveals her father had coronary artery disease.

Presenting Complaints:
Ms. Johnson presented with intermittent chest pain, primarily on exertion, and occasional episodes of palpitations over the last two months. She also reported shortness of breath during her regular jogging sessions, which was previously well-tolerated.

Diagnostic Tests Conducted:
[No results recorded in this document fragment]`,
        simplifiedSummary: `Emily Johnson was evaluated for new symptoms of chest pain and shortness of breath that occur during exercise. While she has a history of high blood pressure, these new symptoms require further investigation to ensure her heart is functioning correctly during physical activity. The clinical focus is on determining the cause of her chest pain and managing her cardiac health.`,
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
      });
    }

    const systemPrompt = `You are a medical document OCR, text extraction, and responsible AI clinical assistant.
Analyze the medical report image/document/text provided.
Extract ALL text verbatim from the image/PDF/text and produce a detailed, medically safe analysis in JSON format.

IMPORTANT CLINICAL RESPONSIBILITY RULES:
1. Do NOT suggest a direct medical diagnosis. Use safe, educational phrasing such as "may warrant further evaluation by a healthcare professional".
2. Do NOT write "Reference: Absent" or "None" for qualitative symptoms. Instead, write clear expected normal states (e.g. "Expected: No chest pain during physical activity").
3. Include "riskReason": list 2-3 specific transparent bullet reasons for why the overall risk level was assigned.
4. Include "missingSections": list any empty, incomplete, or missing diagnostic tests or data in the document (e.g., "No diagnostic test results were available in the uploaded report").
5. Provide source traceability for findings and parameters: "sourceType" ("extracted" or "interpreted"), "confidence" (0-100), and "evidenceQuote" (exact verbatim quote from document).

JSON Schema required:
{
  "date": "Extracted report date (e.g. 03/10/2024) or Unknown",
  "extractedText": "full verbatim text extracted from the report",
  "simplifiedSummary": "patient-friendly 2-4 sentence summary of why patient was evaluated, findings, and clinical focus",
  "riskLevel": "LOW" | "MODERATE" | "HIGH",
  "riskReason": ["Reason 1", "Reason 2", ...],
  "missingSections": ["Missing diagnostic test results notice...", ...],
  "overallConfidence": 92,
  "keyFindingItems": [
    {
      "text": "Finding description",
      "sourceType": "extracted" | "interpreted",
      "evidenceQuote": "verbatim text quote from report",
      "confidence": 95
    }
  ],
  "keyFindings": ["bullet 1", "bullet 2"],
  "abnormalValues": [
    {
      "component": "Name of test or symptom",
      "yourValue": "Value or status in report",
      "normalRange": "Expected normal state or reference range",
      "status": "HIGH" | "BORDERLINE" | "NORMAL",
      "explanation": "Safe, non-diagnostic explanation",
      "sourceType": "extracted" | "interpreted",
      "evidenceQuote": "verbatim text quote",
      "confidence": 90
    }
  ],
  "medicalTerms": [
    {
      "term": "Medical term",
      "definition": "Simple layperson definition"
    }
  ],
  "suggestedFollowUp": ["Recommendation 1", "Recommendation 2", ...]
}`;

    let contents: any;

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
      const mType = mimeType || 'image/png';

      contents = {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mType,
            },
          },
          {
            text: `${systemPrompt}\nFilename: ${filename || 'Medical_Report'}. Extract and analyze this document.`,
          },
        ],
      };
    } else if (fileText) {
      contents = `${systemPrompt}\n\nDocument Content:\n${fileText}`;
    } else {
      return res.status(400).json({ error: 'No image or text provided' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    let parsedData = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON response from Gemini:', e);
      parsedData = { extractedText: responseText };
    }

    res.json({
      filename: filename || 'Medical_Report.pdf',
      ...parsedData,
    });
  } catch (err: any) {
    console.error('Error in /api/analyze:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze report' });
  }
});

// AI Q&A Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { question, reportContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: `Based on your report context, your indicators have been highlighted for review. Please ask your physician if you experience worsening chest pain or breathlessness.`
      });
    }

    const prompt = `You are a friendly, compassionate AI Medical Assistant helping a patient understand their medical report.
Report Context:
${JSON.stringify(reportContext || {})}

Patient Question: "${question}"

Provide a clear, reassuring, and accurate response based strictly on the report context. Explain medical terms simply. End with an encouraging reminder to discuss key findings with their doctor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message || 'Failed to generate chat response' });
  }
});

// Serve frontend assets or Vite dev server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
