# 🏗️ MedExplain AI — System Architecture & Workflow Document

This document describes the complete system design, component architecture, processing pipeline, and security boundaries of MedExplain AI.

---

## 📐 System Overview

MedExplain AI is a **full-stack medical document extraction engine** designed to convert unstructured clinical reports, lab PDFs, and medical scans into patient-friendly structured visual dashboards.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BROWSER / CLIENT UI                               │
│                                                                             │
│   ┌─────────────────────┐   ┌───────────────────────┐   ┌───────────────┐   │
│   │  Upload / Drag-Drop │   │  5-Stage Progress Bar │   │ Dashboard UI  │   │
│   └──────────┬──────────┘   └───────────▲───────────┘   └───────▲───────┘   │
│              │                          │                       │           │
│              ▼                          │                       │           │
│   ┌─────────────────────┐               │                       │           │
│   │ Client OCR Parser   ├───────────────┴───────────────────────┘           │
│   │(PDF.js/Tesseract)   │                                                   │
│   └──────────┬──────────┘                                                   │
└──────────────┼──────────────────────────────────────────────────────────────┘
               │
               │ HTTP POST /api/analyze
               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EXPRESS BACKEND SERVER (Node.js)                        │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    Central AI Orchestrator                          │   │
│   │                   (src/services/aiService.ts)                        │   │
│   └──────┬──────────────────────────┬──────────────────────────┬────────┘   │
│          │                          │                          │            │
│          ▼                          ▼                          ▼            │
│   ┌──────────────┐          ┌──────────────┐          ┌──────────────┐      │
│   │ Gemini 3.6   │          │  Claude 3.5  │          │ Groq Llama 3 │      │
│   │ Flash Client │          │ (OpenRouter) │          │  70B Client  │      │
│   └──────┬───────┘          └──────┬───────┘          └──────┬───────┘      │
│          │                         │                         │              │
│          └─────────────────────────┼─────────────────────────┘              │
│                                    │ Fallback on Error / Timeout            │
│                                    ▼                                        │
│                           ┌──────────────────┐                              │
│                           │ Local Smart      │                              │
│                           │ Clinical Parser  │                              │
│                           └────────┬─────────┘                              │
│                                    │                                        │
│                                    ▼                                        │
│                           ┌──────────────────┐                              │
│                           │ Schema Validation│                              │
│                           │ & Normalization  │                              │
│                           └────────┬─────────┘                              │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     │ JSON Response
                                     ▼
                      Render Dashboard & Model Badge
```

---

## ⚡ Multi-Provider Failover Matrix

The core AI engine uses a four-tier failover mechanism to guarantee 100% uptime:

| Tier | Engine / Provider | Latency | Primary Role |
|------|-------------------|---------|--------------|
| **Tier 1** | **Google Gemini 3.6 Flash** | ~1.8s | Multimodal Vision + JSON mode extraction |
| **Tier 2** | **Anthropic Claude 3.5 Sonnet (OpenRouter)** | ~2.1s | High-reasoning textual clinical analysis |
| **Tier 3** | **Groq Llama 3.3 70B Versatile** | ~0.8s | Ultra-low latency fallback |
| **Tier 4** | **Smart Local Clinical Parser** | <0.1s | Deterministic Regex & Rule Engine |

---

## 🔒 Security & Privacy Boundaries

1. **API Keys Protection**: All API keys (`GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `GROQ_API_KEY`) remain strictly on the server side (`server.ts`).
2. **Zero Permanent Storage**: Medical documents and OCR text are processed transiently in memory and are never persisted to a database or disk.
3. **Stateless Processing**: Each request is isolated and scrubbed immediately after response generation.
