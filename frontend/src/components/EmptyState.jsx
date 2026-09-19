import React from 'react';
import { Sparkles, Users, FolderGit2, Briefcase, MessageSquare } from 'lucide-react';

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  const DefaultIcon = Icon || Sparkles;

  return (
    <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-gray-200 dark:border-slate-800 p-8 text-center shadow-xs flex flex-col items-center justify-center my-4">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3.5 shadow-2xs">
        <DefaultIcon className="w-7 h-7" />
      </div>
      <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
