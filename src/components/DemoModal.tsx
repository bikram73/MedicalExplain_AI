import React from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAnalysis: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  onStartAnalysis,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-2xl w-full p-8 relative shadow-2xl overflow-hidden border border-[#bdcaba]/30 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#3e4a3d] hover:text-[#006b2c] p-1 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="flex items-center gap-2 text-[#006b2c] font-bold text-[14px] uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined">play_circle</span>
          Interactive Video Walkthrough
        </div>

        <h3 className="text-[26px] font-bold text-[#141b2b] mb-4">
          See How MedExplain AI Works
        </h3>

        <div className="relative aspect-video bg-[#141b2b] rounded-2xl overflow-hidden mb-6 flex items-center justify-center group border border-[#bdcaba]/20 shadow-inner">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtOS7393qA2NJIdkVNm4VzSDvvytNYoHRAkD3oS-2uKtKIX0LzNY7RiEB9QOKmmoDjm7ozDd9f_9qRsVmdZEajWZu5bikWipB6hTu6LsttQNYbpQW_MM7RoznFhPkm3g3TNUM2iUjgQ4h8kBjBGk6NRIbq6t_GtU9FZcIndtq1MgbHFFAUbjKcgDVLj_mpPZbis7mWk6us020TbWuAWirj_DoJ21h9sRPNuCwZKAP4M99Plte1c-XHQfB--1fB4wAbSto1i7no6JA"
            alt="Demo Video Preview"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
          />

          <div className="absolute flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#006b2c] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
              <span className="material-symbols-outlined text-4xl">
                play_arrow
              </span>
            </div>
            <span className="text-white text-[13px] font-semibold tracking-wide">
              Click to view 1-minute AI summary demo
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2 border-t border-[#bdcaba]/20">
          <p className="text-[13px] text-[#3e4a3d]">
            Ready to decode your own clinical lab report?
          </p>
          <button
            onClick={() => {
              onClose();
              onStartAnalysis();
            }}
            className="bg-[#006b2c] text-white px-6 py-3 rounded-xl text-[14px] font-bold hover:scale-105 transition-transform shadow-lg shadow-[#006b2c]/20 w-full sm:w-auto"
          >
            Try It Now with Sample Report
          </button>
        </div>
      </div>
    </div>
  );
};
