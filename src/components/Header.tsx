import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onUploadClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onUploadClick,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string, tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === 'home') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-200 bg-[#f9f9ff]/80 backdrop-blur-md border-b border-[#bdcaba]/30 print:hidden ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="flex justify-between items-center h-20 px-8 max-w-[1280px] mx-auto">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNavClick('home', 'home')}
        >
          <span className="material-symbols-outlined text-[#006b2c] text-3xl font-bold">
            medical_services
          </span>
          <span className="text-[22px] font-bold text-[#006b2c]">
            MedExplain AI
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          <button
            onClick={() => handleNavClick('home', 'home')}
            className={`transition-colors duration-200 text-[16px] font-medium ${
              activeTab === 'home'
                ? 'text-[#006b2c] font-bold border-b-2 border-[#006b2c] pb-1'
                : 'text-[#3e4a3d] hover:text-[#006b2c]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('features', 'home')}
            className="text-[#3e4a3d] hover:text-[#006b2c] transition-all hover:scale-105 duration-200 text-[16px] font-medium"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('how-it-works', 'home')}
            className="text-[#3e4a3d] hover:text-[#006b2c] transition-all hover:scale-105 duration-200 text-[16px] font-medium"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('faq', 'home')}
            className="text-[#3e4a3d] hover:text-[#006b2c] transition-all hover:scale-105 duration-200 text-[16px] font-medium"
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`transition-colors duration-200 text-[16px] font-medium ${
              activeTab === 'analyzer'
                ? 'text-[#006b2c] font-bold border-b-2 border-[#006b2c] pb-1'
                : 'text-[#3e4a3d] hover:text-[#006b2c]'
            }`}
          >
            Analyze Report
          </button>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onUploadClick}
            className="bg-[#006b2c] text-white px-6 py-3 rounded-[14px] text-[14px] font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-[#006b2c]/20"
          >
            Upload Report
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-[#141b2b]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#bdcaba]/30 px-6 py-4 space-y-3 flex flex-col shadow-lg">
          <button
            onClick={() => handleNavClick('home', 'home')}
            className="text-left text-[#141b2b] font-semibold py-2"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('features', 'home')}
            className="text-left text-[#3e4a3d] py-2"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('how-it-works', 'home')}
            className="text-left text-[#3e4a3d] py-2"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('faq', 'home')}
            className="text-left text-[#3e4a3d] py-2"
          >
            FAQ
          </button>
          <button
            onClick={() => {
              setActiveTab('analyzer');
              setMobileMenuOpen(false);
            }}
            className="text-left text-[#006b2c] font-bold py-2"
          >
            Analyze Report
          </button>
          <button
            onClick={() => {
              onUploadClick();
              setMobileMenuOpen(false);
            }}
            className="bg-[#006b2c] text-white px-6 py-3 rounded-[14px] text-[14px] font-bold w-full text-center mt-2 shadow-md"
          >
            Upload Report
          </button>
        </div>
      )}
    </header>
  );
};
