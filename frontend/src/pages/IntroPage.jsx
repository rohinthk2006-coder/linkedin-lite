import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import introLogo from '../assets/linksphere-intro.png';

export const IntroPage = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Connecting to the network...');
  const [isExiting, setIsExiting] = useState(false);

  const handleFinish = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  useEffect(() => {
    const statusMessages = [
      { at: 15, text: 'Connecting to LinkSphere...' },
      { at: 45, text: 'Discovering knowledge & insights...' },
      { at: 75, text: 'Connecting leaders, learners & creators...' },
      { at: 95, text: 'Welcome to your professional sphere!' }
    ];

    const startTime = Date.now();
    const duration = 2800; // 2.8 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      const matched = statusMessages.slice().reverse().find(s => pct >= s.at);
      if (matched) {
        setStatusText(matched.text);
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          handleFinish();
        }, 300);
      }
    }, 40);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        handleFinish();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden transition-opacity duration-500 bg-[#040816] text-white ${
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

      {/* Top Header Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-300/80 uppercase tracking-widest">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Next-Gen Professional Network</span>
        </div>
        <button
          onClick={handleFinish}
          className="text-xs text-slate-400 hover:text-white transition-colors duration-200 px-3 py-1.5 rounded-full border border-slate-700/60 hover:border-slate-500 backdrop-blur-xs cursor-pointer flex items-center gap-1.5"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Centerpiece Hero Logo & Tagline */}
      <main className="flex flex-col items-center justify-center my-auto z-10 max-w-md w-full text-center">
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

      {/* Bottom Progress Bar & Status */}
      <footer className="w-full max-w-md flex flex-col items-center z-10">
        <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium text-slate-300">{statusText}</span>
          <span className="font-mono text-cyan-400">{progress}%</span>
        </div>
        
        {/* Progress Bar Track */}
        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-150 ease-out rounded-full shadow-sm shadow-cyan-400/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono">Enter</kbd> or click Get Started to continue
        </p>
      </footer>
    </div>
  );
};
