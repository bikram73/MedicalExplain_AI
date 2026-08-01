import React, { useState } from 'react';
import { ActiveTab, RecentReport } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { UploadReportPage, DEFAULT_REPORTS } from './components/UploadReportPage';
import { AnalyzerDashboardPage } from './components/AnalyzerDashboardPage';
import { DemoModal } from './components/DemoModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedReport, setSelectedReport] = useState<RecentReport>(
    DEFAULT_REPORTS[0]
  );
  const [demoOpen, setDemoOpen] = useState(false);

  const handleUploadClick = () => {
    setActiveTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReport = (report: RecentReport) => {
    setSelectedReport(report);
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] text-[#141b2b] selection:bg-[#006b2c]/20 selection:text-[#006b2c]">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onUploadClick={handleUploadClick}
      />

      {/* Main View Area */}
      <div className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            setActiveTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDemo={() => setDemoOpen(true)}
          />
        )}

        {activeTab === 'upload' && (
          <UploadReportPage
            setActiveTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectReport={handleSelectReport}
          />
        )}

        {activeTab === 'analyzer' && (
          <AnalyzerDashboardPage
            report={selectedReport}
            onSelectReport={handleSelectReport}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>

      {/* Footer */}
      <Footer
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Demo Modal */}
      <DemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        onStartAnalysis={() => {
          setActiveTab('analyzer');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
