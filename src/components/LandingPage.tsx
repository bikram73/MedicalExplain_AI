import React, { useState } from 'react';
import { ActiveTab } from '../types';

interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActiveTab,
  onOpenDemo,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden pt-12 pb-24 px-8 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#6bff8f]/30 text-[#006b2c] px-4 py-1.5 rounded-full text-[14px] font-medium">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            AI-Powered Medical Intelligence
          </div>

          <h1 className="text-[40px] lg:text-[56px] font-bold leading-[1.1] text-[#141b2b] tracking-tight">
            Understand Your Medical Reports in{' '}
            <span className="text-[#006b2c]">Plain English</span>
          </h1>

          <p className="text-[#3e4a3d] text-[16px] leading-relaxed max-w-lg">
            Stop Googling scary medical terms. Our HIPAA-compliant AI decodes complex lab results, imaging reports, and prescriptions into clear, actionable summaries.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => setActiveTab('upload')}
              className="bg-[#006b2c] text-white px-8 py-4 rounded-[14px] text-[14px] font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-[#006b2c]/20"
            >
              <span className="material-symbols-outlined">upload_file</span>
              Upload Report
            </button>
            <button
              onClick={onOpenDemo}
              className="border-2 border-[#006b2c] text-[#006b2c] px-8 py-4 rounded-[14px] text-[14px] font-bold flex items-center gap-2 hover:bg-[#006b2c]/5 transition-colors"
            >
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Dashboard Mockup Graphics */}
        <div className="relative min-h-[460px] w-full max-w-[540px] mx-auto flex items-center justify-center py-6 px-4">
          {/* Main Dashboard Mockup Card */}
          <div className="w-full h-[380px] bg-white rounded-[24px] shadow-2xl border border-[#bdcaba]/30 overflow-hidden relative group">
            <div className="bg-[#f1f3ff] p-4 border-b border-[#bdcaba]/20 flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[#ba1a1a]/40"></div>
              <div className="w-3 h-3 rounded-full bg-[#6bff8f]"></div>
              <div className="w-3 h-3 rounded-full bg-[#006b2c]/30"></div>
              <div className="flex-grow"></div>
              <div className="h-2 w-32 bg-[#bdcaba]/30 rounded-full"></div>
            </div>
            <div className="p-6 space-y-4 relative overflow-hidden h-[300px]">
              {/* Background Image Layer */}
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
                alt="Medical Analysis Background"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none mix-blend-multiply"
              />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-3/4 bg-[#006b2c]/20 rounded-full"></div>
                  <span className="text-[11px] font-bold text-[#006b2c] bg-[#6bff8f]/30 px-2 py-0.5 rounded-full">Active Scan</span>
                </div>
                <div className="h-3 w-1/2 bg-[#bdcaba]/30 rounded-full"></div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="h-24 rounded-xl bg-white/80 backdrop-blur-sm border border-[#006b2c]/20 p-3 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-1.5 text-[#006b2c] text-xs font-bold">
                      <span className="material-symbols-outlined text-[16px]">monitor_heart</span>
                      <span>Heart Metrics</span>
                    </div>
                    <div className="text-lg font-bold text-[#141b2b]">72 BPM <span className="text-xs text-[#006b2c] font-normal">(Normal)</span></div>
                  </div>
                  <div className="h-24 rounded-xl bg-white/80 backdrop-blur-sm border border-[#bdcaba]/30 p-3 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-1.5 text-[#3e4a3d] text-xs font-bold">
                      <span className="material-symbols-outlined text-[16px]">bloodtype</span>
                      <span>Blood Panel</span>
                    </div>
                    <div className="text-lg font-bold text-[#141b2b]">CBC <span className="text-xs text-[#006b2c] font-normal">Analyzed</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-[#006b2c] text-white p-3 rounded-xl shadow-2xl flex items-center gap-2 scale-90">
              <span className="material-symbols-outlined">psychology</span>
              <span className="text-[13px] font-medium">AI Insights Generated</span>
            </div>
          </div>

          {/* Floating Glass Cards (Positioned outside overflow-hidden with high z-index) */}
          <div className="absolute -top-1 right-0 sm:-right-4 z-20 glass-card p-3.5 px-4 rounded-2xl shadow-2xl flex items-center gap-3 floating-anim border border-[#006b2c]/20 bg-white/95">
            <div className="w-10 h-10 rounded-full bg-[#006b2c]/10 flex items-center justify-center text-[#006b2c] flex-shrink-0">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                medical_services
              </span>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#3e4a3d] font-bold">
                Prescription
              </div>
              <div className="font-bold text-[#006b2c] text-[14px]">
                Amoxicillin 500mg
              </div>
            </div>
          </div>

          <div
            className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-6 z-20 glass-card p-3.5 px-4 rounded-2xl shadow-2xl flex items-center gap-3 floating-anim border border-[#ba1a1a]/20 bg-white/95"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="w-10 h-10 rounded-full bg-[#ba1a1a]/10 flex items-center justify-center text-[#ba1a1a] flex-shrink-0">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#3e4a3d] font-bold">
                Heart Rate
              </div>
              <div className="font-bold text-[#ba1a1a] text-[14px]">
                72 BPM (Normal)
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-2 right-0 sm:-right-4 z-20 glass-card p-3.5 px-4 rounded-2xl shadow-2xl flex items-center gap-3 floating-anim border border-[#006b2c]/20 bg-white/95"
            style={{ animationDelay: '1.2s' }}
          >
            <div className="w-10 h-10 rounded-full bg-[#6bff8f] flex items-center justify-center text-[#007432] flex-shrink-0">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bloodtype
              </span>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#3e4a3d] font-bold">
                Blood Test
              </div>
              <div className="font-bold text-[#006b2c] text-[14px]">
                CBC Analyzed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-[#bdcaba]/20 bg-white">
        <div className="px-8 max-w-[1280px] mx-auto text-center">
          <p className="font-medium text-[#3e4a3d] mb-8 uppercase tracking-widest text-[13px]">
            Trusted by medical communities worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 font-bold text-[22px] text-[#3e4a3d]">
            <span>Patients</span>
            <span>Students</span>
            <span>Doctors</span>
            <span>Healthcare Learners</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-8 max-w-[1280px] mx-auto" id="features">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-[34px] font-bold text-[#141b2b] tracking-tight">
            Powerful AI Diagnostic Toolkit
          </h2>
          <p className="text-[#3e4a3d] text-[16px] max-w-2xl mx-auto">
            Everything you need to demystify your medical journey with institutional-grade precision and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-[18px] border border-[#bdcaba]/30 hover:shadow-2xl hover:shadow-[#006b2c]/10 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-[#006b2c]/10 flex items-center justify-center text-[#006b2c] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <h3 className="text-[22px] font-semibold text-[#141b2b] mb-3">
              Upload Reports
            </h3>
            <p className="text-[#3e4a3d] text-[15px] leading-relaxed">
              Simply drag and drop PDFs, JPEGs, or DICOM images for instant scanning.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-[18px] border border-[#bdcaba]/30 hover:shadow-2xl hover:shadow-[#006b2c]/10 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-[#006b2c]/10 flex items-center justify-center text-[#006b2c] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">summarize</span>
            </div>
            <h3 className="text-[22px] font-semibold text-[#141b2b] mb-3">
              AI Medical Summary
            </h3>
            <p className="text-[#3e4a3d] text-[15px] leading-relaxed">
              Get a concise executive summary of your entire health report in seconds.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-[18px] border border-[#bdcaba]/30 hover:shadow-2xl hover:shadow-[#006b2c]/10 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-[#006b2c]/10 flex items-center justify-center text-[#006b2c] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">analytics</span>
            </div>
            <h3 className="text-[22px] font-semibold text-[#141b2b] mb-3">
              Abnormal Value Detection
            </h3>
            <p className="text-[#3e4a3d] text-[15px] leading-relaxed">
              Automatically flags markers that fall outside of standard reference ranges.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-8 rounded-[18px] border border-[#bdcaba]/30 hover:shadow-2xl hover:shadow-[#006b2c]/10 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-[#006b2c]/10 flex items-center justify-center text-[#006b2c] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">medication</span>
            </div>
            <h3 className="text-[22px] font-semibold text-[#141b2b] mb-3">
              Medicine Extraction
            </h3>
            <p className="text-[#3e4a3d] text-[15px] leading-relaxed">
              Identifies prescribed medications and explains their purpose and interactions.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-8 rounded-[18px] border border-[#bdcaba]/30 hover:shadow-2xl hover:shadow-[#006b2c]/10 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-[#006b2c]/10 flex items-center justify-center text-[#006b2c] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">stethoscope</span>
            </div>
            <h3 className="text-[22px] font-semibold text-[#141b2b] mb-3">
              Doctor Recommendations
            </h3>
            <p className="text-[#3e4a3d] text-[15px] leading-relaxed">
              Suggested questions to ask your doctor during your next follow-up appointment.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-8 rounded-[18px] border border-[#bdcaba]/30 hover:shadow-2xl hover:shadow-[#006b2c]/10 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-[#006b2c]/10 flex items-center justify-center text-[#006b2c] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">chat_paste_go</span>
            </div>
            <h3 className="text-[22px] font-semibold text-[#141b2b] mb-3">
              AI Chat Assistant
            </h3>
            <p className="text-[#3e4a3d] text-[15px] leading-relaxed">
              Ask anything about your report and get context-aware, medically-backed answers.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="py-20 bg-[#f1f3ff]" id="how-it-works">
        <div className="px-8 max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[34px] font-bold text-[#141b2b]">How It Works</h2>
            <p className="text-[#3e4a3d] mt-2 text-[16px]">Simple. Fast. Secure.</p>
          </div>

          <div className="relative">
            {/* Connector Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-[#bdcaba]/30 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-[#006b2c] text-white flex items-center justify-center mb-6 shadow-lg shadow-[#006b2c]/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">upload</span>
                </div>
                <h4 className="text-[22px] font-semibold text-[#141b2b] mb-2">
                  Upload
                </h4>
                <p className="text-[#3e4a3d] text-[13px] max-w-[200px]">
                  Securely upload your document or photo.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-[#006b2c] text-white flex items-center justify-center mb-6 shadow-lg shadow-[#006b2c]/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">visibility</span>
                </div>
                <h4 className="text-[22px] font-semibold text-[#141b2b] mb-2">
                  AI Reads
                </h4>
                <p className="text-[#3e4a3d] text-[13px] max-w-[200px]">
                  OCR technology extracts text from your files.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-[#006b2c] text-white flex items-center justify-center mb-6 shadow-lg shadow-[#006b2c]/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">
                    psychology_alt
                  </span>
                </div>
                <h4 className="text-[22px] font-semibold text-[#141b2b] mb-2">
                  Gemini Analysis
                </h4>
                <p className="text-[#3e4a3d] text-[13px] max-w-[200px]">
                  Clinical models analyze the context of findings.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-[#006b2c] text-white flex items-center justify-center mb-6 shadow-lg shadow-[#006b2c]/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">task_alt</span>
                </div>
                <h4 className="text-[22px] font-semibold text-[#141b2b] mb-2">
                  Easy Summary
                </h4>
                <p className="text-[#3e4a3d] text-[13px] max-w-[200px]">
                  View your report decoded in simple language.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-8 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-[24px] overflow-hidden shadow-2xl border border-[#bdcaba]/30">
              <img
                className="w-full aspect-square object-cover"
                alt="A professional hospital lab with modern tablet displaying clinical report interface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtOS7393qA2NJIdkVNm4VzSDvvytNYoHRAkD3oS-2uKtKIX0LzNY7RiEB9QOKmmoDjm7ozDd9f_9qRsVmdZEajWZu5bikWipB6hTu6LsttQNYbpQW_MM7RoznFhPkm3g3TNUM2iUjgQ4h8kBjBGk6NRIbq6t_GtU9FZcIndtq1MgbHFFAUbjKcgDVLj_mpPZbis7mWk6us020TbWuAWirj_DoJ21h9sRPNuCwZKAP4M99Plte1c-XHQfB--1fB4wAbSto1i7no6JA"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-[18px] shadow-2xl max-w-xs border-[#006b2c]/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#006b2c] animate-pulse"></div>
                <span className="text-[#006b2c] font-bold text-[14px]">
                  Privacy Guaranteed
                </span>
              </div>
              <p className="text-[12px] text-[#3e4a3d]">
                All reports are encrypted with AES-256 and HIPAA compliant protocols.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[34px] font-bold text-[#141b2b] tracking-tight">
              Why Choose MedExplain AI?
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-4 p-6 bg-[#f1f3ff] rounded-xl border-l-4 border-[#006b2c]">
                <div className="text-[#006b2c]">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#141b2b]">Clinically Referenced</h4>
                  <p className="text-[#3e4a3d] text-[15px] mt-1">
                    Our AI leverages established medical journals and diagnostic guidelines.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-[#f1f3ff] rounded-xl border-l-4 border-[#006b2c]">
                <div className="text-[#006b2c]">
                  <span className="material-symbols-outlined text-2xl">speed</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#141b2b]">Instant Results</h4>
                  <p className="text-[#3e4a3d] text-[15px] mt-1">
                    No more waiting weeks for a follow-up call. Understand it today.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-[#f1f3ff] rounded-xl border-l-4 border-[#006b2c]">
                <div className="text-[#006b2c]">
                  <span className="material-symbols-outlined text-2xl">diversity_1</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#141b2b]">Inclusive Language</h4>
                  <p className="text-[#3e4a3d] text-[15px] mt-1">
                    Complex jargon translated into terminology anyone can understand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Explainer Demo Panel */}
      <section className="py-12 px-8 max-w-[1280px] mx-auto">
        <div className="ai-explainer-panel p-8 rounded-2xl shadow-sm border border-[#bdcaba]/30">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="material-symbols-outlined text-[#006b2c] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              smart_toy
            </span>
            <span className="font-bold text-[#006b2c] text-[13px] tracking-widest uppercase">
              AI Insight Engine
            </span>
          </div>
          <div className="space-y-6">
            <div className="p-4 bg-white/70 rounded-lg border border-[#bdcaba]/20">
              <div className="text-[10px] text-[#3e4a3d] mb-1 font-bold tracking-wider">
                RAW REPORT SEGMENT
              </div>
              <p className="italic text-[#141b2b] text-[15px]">
                "Patient displays elevated levels of Alanine Aminotransferase (ALT) at 65 U/L."
              </p>
            </div>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-[#006b2c] text-2xl mt-1">
                arrow_forward
              </span>
              <div>
                <div className="text-[10px] text-[#006b2c] mb-1 font-bold tracking-wider">
                  MEDEXPLAIN DECODING
                </div>
                <p className="text-[#141b2b] font-medium text-[15px] leading-relaxed">
                  Your ALT level is slightly higher than the typical range. This enzyme is mostly found in your liver. A higher level sometimes suggests the liver is working harder than usual. It's often related to diet, medication, or temporary stress on the organ. We recommend discussing liver health specifics with your GP.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-8 max-w-[800px] mx-auto" id="faq">
        <h2 className="text-[34px] font-bold text-[#141b2b] text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {/* Accordion 1 */}
          <div className="bg-[#f1f3ff] rounded-xl border border-[#bdcaba]/30 overflow-hidden">
            <button
              onClick={() => toggleFaq(0)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-[#e1e8fd] transition-colors"
            >
              <span className="font-bold text-[#141b2b] text-[16px]">
                Is my medical data secure?
              </span>
              <span
                className={`material-symbols-outlined transition-transform duration-200 ${
                  openFaq === 0 ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {openFaq === 0 && (
              <div className="p-6 pt-0 text-[#3e4a3d] text-[15px] border-t border-[#bdcaba]/20 leading-relaxed bg-[#f1f3ff]">
                Absolutely. We use enterprise-grade encryption (AES-256) and are fully HIPAA compliant. Your data is processed in a secure sandbox and never shared with third parties or used to train public models.
              </div>
            )}
          </div>

          {/* Accordion 2 */}
          <div className="bg-[#f1f3ff] rounded-xl border border-[#bdcaba]/30 overflow-hidden">
            <button
              onClick={() => toggleFaq(1)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-[#e1e8fd] transition-colors"
            >
              <span className="font-bold text-[#141b2b] text-[16px]">
                Can it replace a real doctor?
              </span>
              <span
                className={`material-symbols-outlined transition-transform duration-200 ${
                  openFaq === 1 ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {openFaq === 1 && (
              <div className="p-6 pt-0 text-[#3e4a3d] text-[15px] border-t border-[#bdcaba]/20 leading-relaxed bg-[#f1f3ff]">
                No. MedExplain AI is an educational tool designed to help you understand your reports so you can have more meaningful conversations with your healthcare provider. It does not provide medical diagnoses or treatment plans.
              </div>
            )}
          </div>

          {/* Accordion 3 */}
          <div className="bg-[#f1f3ff] rounded-xl border border-[#bdcaba]/30 overflow-hidden">
            <button
              onClick={() => toggleFaq(2)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-[#e1e8fd] transition-colors"
            >
              <span className="font-bold text-[#141b2b] text-[16px]">
                What types of reports can I upload?
              </span>
              <span
                className={`material-symbols-outlined transition-transform duration-200 ${
                  openFaq === 2 ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {openFaq === 2 && (
              <div className="p-6 pt-0 text-[#3e4a3d] text-[15px] border-t border-[#bdcaba]/20 leading-relaxed bg-[#f1f3ff]">
                We support Blood Tests (CBC, CMP), Imaging (X-Ray, MRI, CT scans via text descriptions), Biopsy results, Prescription orders, and General clinical notes.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
