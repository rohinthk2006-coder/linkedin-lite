import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import introLogo from '../assets/linksphere-intro.png';

export const IntroPage = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleFinish = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        handleFinish();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 sm:p-10 select-none overflow-hidden transition-opacity duration-500 bg-[#040816] text-white ${
        isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 38%, #0d1e4a 0%, #060e29 45%, #020614 100%)'
      }}
    >
      {/* Background Animated Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Centerpiece Hero Logo & Tagline */}
      <main className="flex flex-col items-center justify-center z-10 max-w-md w-full text-center">
        {/* Glowing Logo Container */}
        <div className="relative group cursor-pointer" onClick={handleFinish}>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-700 animate-pulse"></div>
          <div className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-b from-blue-400/30 to-purple-500/10 backdrop-blur-md shadow-2xl border border-white/10">
            <img
              src={introLogo}
              alt="LinkSphere - Connect, Learn, Grow"
              className="w-72 h-72 sm:w-84 sm:h-84 object-cover rounded-2xl shadow-inner transform transition duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-blue-200 text-xs shadow-xs">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Global Community</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/20 text-purple-200 text-xs shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Curated Insights</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/60 text-slate-300 text-xs shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trusted Network</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-7 w-full">
          <button
            onClick={handleFinish}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 mx-auto cursor-pointer group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </main>
    </div>
  );
};
