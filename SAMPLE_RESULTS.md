# 📄 Sample Medical Documents & Extraction Results

This document contains sample medical reports processed by MedExplain AI along with their corresponding structured JSON output extractions.

---

## 📑 Table of Contents
1. [Sample 1: Cardiology & Referral Report (Emily Johnson)](#sample-1)
2. [Sample 2: Comprehensive Metabolic Panel & Lipid Profile (John Doe)](#sample-2)
3. [Sample 3: Radiology Chest X-Ray Impression (Sarah Miller)](#sample-3)

---

<a id="sample-1"></a>
## 📋 Sample 1: Cardiology & Referral Report

### Raw Report Text:
```
ST. JUDE MEDICAL CENTER
Department of Cardiology
123 Healthcare Blvd, Suite 400

PATIENT DEMOGRAPHICS:
Name: Emily Johnson
DOB: 01/15/1989 (Age 35)
Patient ID: 987654321
Date of Visit: 03/10/2024
Referring Physician: Dr. Alan Green, MD

CHIEF COMPLAINT & HISTORY:
Patient is a 35-year-old female presenting with a 3-week history of intermittent exertional chest discomfort and shortness of breath (dyspnea) during moderate cardiovascular exercise. She also reports occasional palpitations. She has a known history of essential hypertension currently managed with Lisinopril 10mg daily. Family history is significant for premature coronary artery disease (father had MI at age 52).

PHYSICAL EXAMINATION & VITAL SIGNS:
BP: 138/88 mmHg (Borderline Elevated)
HR: 82 bpm (Regular rhythm)
Oxygen Saturation: 98% on room air
BMI: 26.4 kg/m²

IMPRESSION & PLAN:
1. Exertional Angina / Chest Pain - Differential includes stress-induced ischemia vs musculoskeletal etiology.
2. Controlled Essential Hypertension.
3. Recommended 12-lead ECG, Exercise Stress Test, and Echocardiogram.
4. Continue Lisinopril 10mg PO daily.
```

### Extracted JSON Output:
```json
{
  "provider": "Gemini 3.6 Flash",
  "confidence": 98,
  "summary": "Emily Johnson, a 35-year-old female with a history of hypertension, was evaluated for exertional chest pain, shortness of breath, and palpitations during exercise. Her blood pressure is borderline elevated at 138/88 mmHg. Further diagnostic workup including an ECG, exercise stress test, and echocardiogram has been recommended.",
  "patientInfo": {
    "name": "Emily Johnson",
    "dob": "01/15/1989",
    "patientId": "987654321",
    "dateOfReport": "03/10/2024",
    "referringPhysician": "Dr. Alan Green, MD",
    "specialty": "Cardiology"
  },
  "conditions": [
    "Hypertension",
    "Exertional Chest Pain",
    "Dyspnea (Shortness of Breath)",
    "Palpitations"
  ],
  "medicines": [
    "Lisinopril 10mg PO Daily"
  ],
  "abnormalResults": [
    {
      "component": "Intermittent Exertional Chest Discomfort",
      "yourValue": "Present",
      "normalRange": "Expected: No chest pain during physical activity",
      "status": "HIGH",
      "explanation": "Chest pain during physical activity may indicate reduced blood flow to the heart muscle and requires cardiac evaluation.",
      "sourceType": "extracted",
      "evidenceQuote": "presenting with a 3-week history of intermittent exertional chest discomfort",
      "confidence": 99
    },
    {
      "component": "Blood Pressure (Systolic / Diastolic)",
      "yourValue": "138/88 mmHg",
      "normalRange": "< 120/80 mmHg",
      "status": "BORDERLINE",
      "explanation": "Slightly elevated blood pressure reading. While on medication, close tracking is recommended.",
      "sourceType": "extracted",
      "evidenceQuote": "BP: 138/88 mmHg (Borderline Elevated)",
      "confidence": 97
    }
  ],
  "medicalTerms": [
    {
      "term": "Dyspnea",
      "explanation": "Medical term for shortness of breath or difficulty breathing."
    },
    {
      "term": "Exertional Angina",
      "explanation": "Chest discomfort or pressure triggered by physical exertion or stress."
    },
    {
      "term": "Echocardiogram",
      "explanation": "An ultrasound picture of the heart showing its structure and pumping function."
    }
  ],
  "recommendations": [
    "Schedule 12-lead Electrocardiogram (ECG)",
    "Complete Exercise Stress Test as ordered by Dr. Alan Green",
    "Schedule Echocardiogram ultrasound",
    "Continue current Lisinopril 10mg daily prescription"
  ],
  "riskLevel": "Medium",
  "riskReason": [
    "Presence of exertional cardiac symptoms in a young patient",
    "Known history of hypertension combined with family history of premature CAD"
  ],
  "warnings": [
    "No ECG waveforms or imaging scans attached to this consultation note fragment."
  ]
}
```

---

<a id="sample-2"></a>
## 📋 Sample 2: Comprehensive Metabolic Panel & Lipid Profile

### Raw Report Text:
```
METROPOLITAN LAB SERVICES
Fast Blood Panel & Lipid Profile

Patient: John Doe | Age: 48 | Sex: M | Date: 02/18/2024
Physician: Dr. Sarah Jenkins, Internal Medicine

LAB RESULTS:
- Fasting Blood Glucose: 118 mg/dL [Reference: 70 - 99 mg/dL] -> HIGH
- Hemoglobin A1c: 6.2 % [Reference: 4.0 - 5.6 %] -> HIGH (Prediabetes)
- Total Cholesterol: 235 mg/dL [Reference: < 200 mg/dL] -> HIGH
- LDL Cholesterol: 154 mg/dL [Reference: < 100 mg/dL] -> HIGH
- HDL Cholesterol: 42 mg/dL [Reference: > 40 mg/dL] -> NORMAL
- Triglycerides: 185 mg/dL [Reference: < 150 mg/dL] -> BORDERLINE HIGH
- Serum Creatinine: 0.9 mg/dL [Reference: 0.7 - 1.3 mg/dL] -> NORMAL
- eGFR: 92 mL/min/1.73m² [Reference: > 60 mL/min/1.73m²] -> NORMAL
```

### Extracted JSON Output:
```json
{
  "provider": "Gemini 3.6 Flash",
  "confidence": 99,
  "summary": "John Doe's laboratory results indicate elevated fasting glucose (118 mg/dL) and HbA1c (6.2%), which fall into the prediabetes range. Additionally, total cholesterol (235 mg/dL), LDL (154 mg/dL), and triglycerides (185 mg/dL) are elevated, while kidney function markers (Creatinine and eGFR) remain normal.",
  "patientInfo": {
    "name": "John Doe",
    "dob": "N/A",
    "patientId": "N/A",
    "dateOfReport": "02/18/2024",
    "referringPhysician": "Dr. Sarah Jenkins",
    "specialty": "Internal Medicine"
  },
  "conditions": [
    "Prediabetes",
    "Hyperlipidemia (Elevated Cholesterol)"
  ],
  "medicines": [],
  "abnormalResults": [
    {
      "component": "Fasting Blood Glucose",
      "yourValue": "118 mg/dL",
      "normalRange": "70 - 99 mg/dL",
      "status": "HIGH",
      "explanation": "Elevated blood sugar level after fasting, indicating impaired glucose tolerance.",
      "sourceType": "extracted",
      "evidenceQuote": "Fasting Blood Glucose: 118 mg/dL",
      "confidence": 99
    },
    {
      "component": "Hemoglobin A1c",
      "yourValue": "6.2 %",
      "normalRange": "4.0 - 5.6 %",
      "status": "HIGH",
      "explanation": "Reflects average blood sugar over the last 3 months. Values between 5.7% and 6.4% indicate prediabetes.",
      "sourceType": "extracted",
      "evidenceQuote": "Hemoglobin A1c: 6.2 % [Reference: 4.0 - 5.6 %] -> HIGH (Prediabetes)",
      "confidence": 99
    },
    {
      "component": "LDL Cholesterol",
      "yourValue": "154 mg/dL",
      "normalRange": "< 100 mg/dL",
      "status": "HIGH",
      "explanation": "'Bad' cholesterol level is elevated, increasing risk for arterial plaque buildup.",
      "sourceType": "extracted",
      "evidenceQuote": "LDL Cholesterol: 154 mg/dL",
      "confidence": 98
    }
  ],
  "medicalTerms": [
    {
      "term": "Hemoglobin A1c",
      "explanation": "A blood test measuring average blood sugar levels over the past 2 to 3 months."
    },
    {
      "term": "LDL Cholesterol",
      "explanation": "Low-density lipoprotein, often called 'bad cholesterol' because high levels build up in artery walls."
    }
  ],
  "recommendations": [
    "Consult Dr. Sarah Jenkins regarding dietary and lifestyle modifications for prediabetes",
    "Consider repeat lipid panel and HbA1c in 3 months"
  ],
  "riskLevel": "Medium",
  "riskReason": [
    "Combined metabolic elevation (Prediabetes range HbA1c + Hyperlipidemia)"
  ],
  "warnings": []
}
```

---

<a id="sample-3"></a>
## 📋 Sample 3: Radiology Chest X-Ray Impression

### Raw Report Text:
```
VALLEY IMAGING RADIOLOGY REPORT
Procedure: Chest X-Ray 2 Views (PA & Lateral)
Date: 01/22/2024
Patient: Sarah Miller (DOB: 05/12/1975)
Radiologist: Dr. Robert Vance, MD

FINDINGS:
Lungs are clear bilaterally without focal consolidation, pleural effusion, or pneumothorax. Heart size is within normal limits. Mediastinal contours are unremarkable. Osseous structures are intact.

IMPRESSION:
No acute cardiopulmonary process identified.
```

### Extracted JSON Output:
```json
{
  "provider": "Gemini 3.6 Flash",
  "confidence": 99,
  "summary": "Sarah Miller's chest X-ray showed clear lungs with no signs of pneumonia, fluid buildup, or collapsed lung. Heart size and bone structures are normal. No acute heart or lung issues were found.",
  "patientInfo": {
    "name": "Sarah Miller",
    "dob": "05/12/1975",
    "patientId": "N/A",
    "dateOfReport": "01/22/2024",
    "referringPhysician": "N/A",
    "specialty": "Radiology"
  },
  "conditions": [],
  "medicines": [],
  "abnormalResults": [],
  "medicalTerms": [
    {
      "term": "Pleural Effusion",
      "explanation": "An abnormal buildup of fluid between the layers of tissue that line the lungs and chest cavity."
    },
    {
      "term": "Pneumothorax",
      "explanation": "A collapsed lung occurring when air leaks into the space between your lung and chest wall."
    }
  ],
  "recommendations": [
    "No immediate follow-up imaging required based on clear X-ray impression"
  ],
  "riskLevel": "Low",
  "riskReason": [
    "Normal diagnostic imaging with zero acute cardiopulmonary findings"
  ],
  "warnings": []
}
```
