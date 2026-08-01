import React from 'react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab?: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#ffffff] border-t border-[#bdcaba]/20 w-full py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 max-w-[1280px] mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006b2c] text-2xl">
              medical_services
            </span>
            <span className="text-[22px] text-[#006b2c] font-bold">
              MedExplain AI
            </span>
          </div>
          <p className="text-[#3e4a3d] text-[12px] leading-relaxed">
            Democratizing medical knowledge through responsible AI. Making healthcare accessible and understandable for everyone.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#141b2b] mb-4 text-[14px]">Product</h4>
          <ul className="space-y-2 text-[12px]">
            <li>
              <a
                href="#how-it-works"
                onClick={() => setActiveTab && setActiveTab('home')}
                className="text-[#3e4a3d] hover:text-[#006b2c] transition-colors"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#features"
                onClick={() => setActiveTab && setActiveTab('home')}
                className="text-[#3e4a3d] hover:text-[#006b2c] transition-colors"
              >
                Data Security
              </a>
            </li>
            <li>
              <button
                onClick={() => setActiveTab && setActiveTab('analyzer')}
                className="text-[#3e4a3d] hover:text-[#006b2c] transition-colors text-left"
              >
                Analyze Report
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#141b2b] mb-4 text-[14px]">Company</h4>
          <ul className="space-y-2 text-[12px]">
            <li>
              <a href="#faq" className="text-[#3e4a3d] hover:text-[#006b2c] transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#faq" className="text-[#3e4a3d] hover:text-[#006b2c] transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#faq" className="text-[#3e4a3d] hover:text-[#006b2c] transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#141b2b] mb-4 text-[14px]">Connect & Legal</h4>
          <div className="flex gap-3 mb-3">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#006b2c] hover:bg-[#006b2c] hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-sm">alternate_email</span>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#006b2c] hover:bg-[#006b2c] hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-sm">link</span>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="w-8 h-8 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#006b2c] hover:bg-[#006b2c] hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-sm">groups</span>
            </a>
          </div>
          <p className="text-[12px] text-[#3e4a3d]">
            HIPAA Compliant & AES-256 Encrypted Sandbox
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[#bdcaba]/10 text-center text-[12px] text-[#3e4a3d]">
        © 2024 MedExplain AI. Professional Assisted Intelligence.
      </div>
    </footer>
  );
};
