import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiActivity, FiTool, FiAlertTriangle, FiCpu } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-['Plus_Jakarta_Sans'] bg-[#000810]">
      
      {/* Background Decor (Static & Subtle) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none"></div>
      
      {/* Scanline Overlay (Low Opacity) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        
        {/* Top Badge */}
        <div className="mb-6 flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">System Alert: Code 404</p>
        </div>

        {/* 404 Big Text */}
        <h1 className="text-[120px] md:text-[200px] font-black text-white leading-none tracking-tighter mb-4 select-none">
          404<span className="text-blue-500">.</span>
        </h1>

        {/* Content Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
              Page Under Development
            </h2>
            <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
              Modul ini sedang dalam tahap sinkronisasi infrastruktur. 
              Maaf atas ketidaknyamanannya, kami sedang bekerja di balik layar.
            </p>
          </div>

          {/* Progress Indicator (Visual Only) */}
          <div className="w-full max-w-xs mx-auto h-1.5 bg-white/5 rounded-full overflow-hidden mt-8">
            <div className="w-2/3 h-full bg-blue-500 rounded-full animate-[progress_3s_ease-in-out_infinite]"></div>
          </div>
          <p className="text-[9px] font-bold text-blue-400/50 uppercase tracking-[0.3em]">Syncing Module: 68%</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mt-12">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-10 py-4 bg-white text-black rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all duration-300 active:scale-95 shadow-2xl"
          >
            Go Back
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="w-full sm:w-auto px-10 py-4 bg-transparent border border-white/10 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Decorative Corner Label */}
      <div className="absolute bottom-10 right-10 flex items-center gap-4 opacity-30">
        <div className="text-right">
          <p className="text-[8px] font-black text-white uppercase tracking-widest">Flux Core Engine</p>
          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Maintenance Mode</p>
        </div>
        <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
          <FiCpu size={20} className="text-white" />
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;