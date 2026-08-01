/**
 * Common Prompt Builder for all AI Providers (Gemini, OpenRouter, Groq).
 * Single source of truth to ensure consistent output, document-type routing, and prevent prompt drift.
 */

export function detectDocCategory(filename?: string, text?: string): 'CBC' | 'IMAGING' | 'PRESCRIPTION' | 'ECG' | 'CLINICAL' | 'GENERAL' {
  const str = `${filename || ''} ${text || ''}`.toLowerCase();
  if (/cbc|hematology|complete blood count|hemoglobin|platelet|white blood|red blood|lymphocyte|monocyte|mchc/i.test(str)) {
    return 'CBC';
  }
  if (/mri|ct scan|x-ray|xray|radiology|ultrasound|brain|mri brain/i.test(str)) {
    return 'IMAGING';
  }
  if (/prescription|medication|pharmacy|rx|dosage|tablet|capsule/i.test(str)) {
    return 'PRESCRIPTION';
  }
  if (/ecg|ekg|electrocardiogram|cardiac rhythm/i.test(str)) {
    return 'ECG';
  }
  if (/discharge|consultation|clinical note|doctor note|history and physical/i.test(str)) {
    return 'CLINICAL';
  }
  return 'GENERAL';
}

export function buildMedicalSystemPrompt(filename?: string, text?: string): string {
  const category = detectDocCategory(filename, text);

  let categorySpecificInstructions = '';

  if (category === 'CBC') {
    categorySpecificInstructions = `
SPECIALIZED ROUTING: LABORATORY / CBC REPORT PROMPT
- Carefully extract numerical lab values and compare them ONLY against the report's printed reference range or standard adult bounds.
- UNIT CONVERSION & ACCURACY RULES:
  * "3.5 lakhs/cumm" or "3.5 lakh" = 350,000/cumm (or 3.5 lakhs/cumm). Normal platelet reference is 1.5 - 4.5 lakhs/cumm (150,000 - 450,000/cumm). "3.5 lakhs/cumm" is NORMAL! Do NOT convert 3.5 lakhs to 35!
  * Hemoglobin 15 g/dL is NORMAL (Reference 12.0 - 17.5 g/dL).
  * WBC 5100 /cumm is NORMAL (Reference 4,000 - 11,000 /cumm or 4.0 - 11.0 x10^3/uL).
  * Flag ONLY true abnormalities (e.g. Lymphocyte 18% [LOW, ref 20-40%], Monocyte 1% [LOW, ref 2-8%], MCHC 35.7 g/dL [HIGH, ref 31.5-34.5 g/dL]).
- STRICT CONTEXT ISOLATION: The riskReason MUST ONLY discuss the CBC lab values. NEVER mention chest pain, cardiovascular symptoms, or hypertension unless explicitly written in this CBC report text!
`;
  } else if (category === 'IMAGING') {
    categorySpecificInstructions = `
SPECIALIZED ROUTING: IMAGING / MRI / RADIOLOGY PROMPT
- Extract scan type (e.g. MRI Brain), body region, anatomical findings, radiologist impression, and recommendations.
- TEMPLATE / SAMPLE REPORT DETECTION:
  * Check if the document contains placeholder text like "Mention the site...", "Mention signal changes...", "Usually...", "Lorem ipsum", "Placeholder", "Sample".
  * If template text is present, set warnings: ["Template Report - No clinical conclusions generated. Please upload a finalized report."], riskLevel: "Low", riskReason: "Uploaded file is a template document containing instructional text rather than a finalized radiologist impression.", summary: "This report is a template or draft containing placeholder text. No finalized clinical conclusions can be drawn."
- STRICT RULE: Do NOT list laboratory blood values, blood pressure, or fake normal impressions for incomplete template scans.
`;
  } else if (category === 'PRESCRIPTION') {
    categorySpecificInstructions = `
SPECIALIZED ROUTING: PRESCRIPTION / MEDICINE PROMPT
- Extract exact medicines, dosages, frequencies, duration, and instructions.
- Do NOT invent lab values or radiology findings.
`;
  } else if (category === 'CLINICAL' || category === 'GENERAL') {
    categorySpecificInstructions = `
SPECIALIZED ROUTING: CLINICAL & VITAL SIGNS PROMPT
- BLOOD PRESSURE PARSING RULE:
  * Treat Blood Pressure as a compound measurement (Systolic / Diastolic).
  * Example: "120/80 mmHg" MUST be parsed as "Systolic 120 / Diastolic 80 mmHg".
  * Status for 120/80 mmHg is NORMAL (Optimal blood pressure). Do NOT label 120/80 as LOW or HIGH!
- Extract Heart Rate (bpm), Oxygen Saturation (%), Temperature, Respiratory Rate when present.
- If the report indicates a routine healthy checkup with normal vitals and normal labs, set riskLevel: "Low" and riskReason: "Routine health evaluation with normal vital signs and no acute clinical findings."
`;
  }

  return `You are a specialized medical document OCR analyzer and clinical assistant.
Analyze the provided medical report text and produce a detailed, medically safe analysis strictly in valid JSON format.

${categorySpecificInstructions}

CRITICAL ANTI-HALLUCINATION & CLINICAL RULES:
1. NEVER INVENT MEDICINES. If no prescription or medicine is explicitly named in the report text, return "medicines": [].
2. NEVER INVENT LABORATORY VALUES OR BLOOD PRESSURE READINGS. If no numeric blood pressure reading (e.g. 120/80) is written in the report, do NOT invent systolic/diastolic values.
3. RISK LEVEL CLASSIFICATION:
   - "High": Reserve ONLY for acute emergency findings, severe panic lab values, active acute myocardial infarction, or critical radiology findings.
   - "Medium" (MODERATE): For exertional symptoms (chest pain, shortness of breath, palpitations) or history of hypertension with diagnostic evaluation pending.
   - "Low": For normal routine reports, routine checkups, or mild isolated findings.
4. MEDICAL TERMS: Explain ONLY medical terms that EXPLICITLY appear in the uploaded report text. DO NOT include unmentioned lab terms if they are not written in the document!
5. MISSING SECTIONS: If diagnostic tests are mentioned but results are missing, return "warnings": ["Diagnostic test results were not included in the uploaded report."].
6. Do NOT suggest a direct medical diagnosis. Use safe, educational phrasing such as "may warrant further evaluation by a healthcare professional".

REQUIRED JSON SCHEMA (OUTPUT ONLY VALID UNWRAPPED JSON):
{
  "provider": "FILL_PROVIDER_NAME",
  "confidence": 95,
  "summary": "Clear, patient-friendly 2-4 sentence summary of report, symptoms, and clinical focus.",
  "documentType": "CBC_REPORT | HEMATOLOGY_REPORT | BIOCHEMISTRY_REPORT | LIPID_PROFILE | LIVER_FUNCTION_TEST | KIDNEY_FUNCTION_TEST | ECG_REPORT | MRI_REPORT | CT_REPORT | XRAY_REPORT | ULTRASOUND_REPORT | PATHOLOGY_REPORT | PRESCRIPTION | DISCHARGE_SUMMARY | CONSULTATION_NOTE | GENERAL_MEDICAL_REPORT",
  "patientInfo": {
    "name": "Patient Name if present, else Unknown",
    "dob": "Date of Birth if present",
    "patientId": "ID if present",
    "dateOfReport": "Date if present",
    "referringPhysician": "Physician if present",
    "specialty": "Specialty if present"
  },
  "conditions": ["Condition or symptom 1", "Condition or symptom 2"],
  "medicines": [],
  "abnormalResults": [
    {
      "component": "Name of test or symptom",
      "yourValue": "Value or status in report",
      "normalRange": "Expected normal state or reference range",
      "status": "HIGH | LOW | BORDERLINE | NORMAL",
      "explanation": "Safe, non-diagnostic explanation",
      "sourceType": "extracted",
      "evidenceQuote": "verbatim text quote",
      "confidence": 95
    }
  ],
  "medicalTerms": [
    {
      "term": "Medical term present in text",
      "explanation": "Simple layperson definition"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "followUp": ["Follow up action 1"],
  "riskLevel": "Low | Medium | High",
  "riskReason": "Detailed 1-2 sentence explanation of why this risk level was assigned based ONLY on findings in this document.",
  "warnings": [],
  "sourceTraceability": [
    {
      "claim": "Claim from analysis",
      "quote": "Exact verbatim quote from text"
    }
  ]
}`;
}

export function buildMedicalUserPrompt(extractedText: string, filename?: string): string {
  return `Document Filename: ${filename || 'Medical_Report.pdf'}

Extracted Medical Report Text:
---
${extractedText || 'No text extracted from document.'}
---

Extract clinical data and return the JSON adhering strictly to the schema provided.`;
}

