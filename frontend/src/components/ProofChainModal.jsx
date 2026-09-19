import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  FolderGit2, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  Sparkles, 
  ThumbsUp,
  AlertCircle,
  Clock
} from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { mockProofChains } from '../data/mockProofChains';

export const ProofChainModal = ({ skillName, isOpen, onClose, onSelectProject }) => {
  if (!isOpen || !skillName) return null;

  const data = mockProofChains[skillName] || {
    skill: skillName,
    status: "Verified",
    verifiedDate: "2026",
    endorsements: 10,
    credibilityScore: "90/100",
    summary: `Verified capability in ${skillName} evidenced through verified project contributions and skill challenge outcomes.`,
    chain: [
      {
        step: 1,
        type: "Skill",
        title: `${skillName} Core Competency`,
        issuer: "Primary Skill Tag",
        status: "Confirmed",
        date: "2026",
        description: `Hands-on proficiency demonstrated in real-world application scenarios for ${skillName}.`,
        verified: true,
      },
      {
        step: 2,
        type: "Project",
        title: "Portfolio Project Integration",
        issuer: "Production Codebase",
        date: "2026",
        description: `Applied ${skillName} in multi-tier architecture with clean patterns and unit testing.`,
        verified: true,
      },
      {
        step: 3,
        type: "Assessment",
        title: "LinkSphere Sandbox Evaluation",
        issuer: "LinkSphere Verified CodeBench",
        score: "92/100",
        date: "2026",
        description: "Passed automated sandbox test coverage and performance benchmarks.",
        verified: true,
      }
    ]
  };

  const [endorsements, setEndorsements] = useState(data.endorsements);
  const [hasEndorsed, setHasEndorsed] = useState(false);

  const handleEndorse = () => {
    if (!hasEndorsed) {
      setEndorsements((prev) => prev + 1);
      setHasEndorsed(true);
    } else {
      setEndorsements((prev) => prev - 1);
      setHasEndorsed(false);
    }
  };

  const isVerified = data.status === "Verified";

  const getStepIcon = (type) => {
    switch (type) {
      case 'Skill':
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case 'Certificate':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'Project':
        return <FolderGit2 className="w-4 h-4 text-emerald-500" />;
      case 'Repository':
        return <GithubIcon className="w-4 h-4 text-purple-500" />;
      case 'Assessment':
        return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#131b2e] dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-full">
                Proof Chain™ Verified
              </span>
              <span className="text-[11px] text-gray-500 dark:text-slate-400">
                • Prototype Proof Engine
              </span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>{data.skill}</span>
              {isVerified ? (
                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                  Verified Skill
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  Pending Proof
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 max-w-lg">
              {data.summary}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Chain Metric Bar */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-slate-800 border-b border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900/40 py-3 px-6 text-center text-xs">
          <div>
            <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Proof Level</span>
            <span className="font-bold text-gray-900 dark:text-white">{data.chain.length} Verification Nodes</span>
          </div>
          <div>
            <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Credibility Score</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400">{data.credibilityScore}</span>
          </div>
          <div>
            <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Endorsements</span>
            <span className="font-bold text-gray-900 dark:text-white">{endorsements} Peers</span>
          </div>
        </div>

        {/* Interactive Step-by-Step Proof Pipeline */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
            Verifiable Evidence Pipeline (Why It's Verified)
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-emerald-500">
            {data.chain.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full border-2 border-white dark:border-[#131b2e] flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                  step.verified ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>

                <div className="bg-gray-50/80 dark:bg-slate-900/60 p-4 rounded-xl border border-gray-200/70 dark:border-slate-800 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition duration-200">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 rounded-md bg-white dark:bg-slate-800 shadow-2xs border border-gray-100 dark:border-slate-700">
                        {getStepIcon(step.type)}
                      </div>
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {step.type}
                      </span>
                    </div>
                    {step.date && (
                      <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">
                        {step.date}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    {step.title}
                  </h4>
                  
                  {step.issuer && (
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      {step.issuer} {step.credentialId ? `• ID: ${step.credentialId}` : ''} {step.score ? `• Score: ${step.score}` : ''}
                    </p>
                  )}

                  {step.description && (
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {step.description}
                    </p>
                  )}

                  {step.linkText && (
                    <div className="mt-3 pt-2 border-t border-gray-200/50 dark:border-slate-800 flex items-center">
                      <a
                        href={step.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline gap-1"
                        onClick={(e) => {
                          if (step.url === '#projects' && onSelectProject) {
                            e.preventDefault();
                            onSelectProject();
                            onClose();
                          }
                        }}
                      >
                        <span>{step.linkText}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Prototype Transparency Notice */}
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 flex items-start space-x-2.5 text-xs text-blue-900 dark:text-blue-200">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Transparent Proof Verification: </span>
              LinkSphere validates skill authenticity by correlating GitHub repos, test submissions, and accredited course completions into a tamper-resistant chain.
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={handleEndorse}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs ${
              hasEndorsed
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{hasEndorsed ? 'Endorsed by You' : 'Endorse Skill'}</span>
            <span className="ml-1 opacity-75">({endorsements})</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer"
          >
            Close Chain
          </button>
        </div>
      </div>
    </div>
  );
};
