import React from 'react';

export const SkeletonPost = () => (
  <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-xs mb-4 animate-pulse">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-11 h-11 bg-gray-200 dark:bg-slate-800 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="w-36 h-3.5 bg-gray-200 dark:bg-slate-800 rounded-md" />
        <div className="w-56 h-2.5 bg-gray-200 dark:bg-slate-800 rounded-md" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="w-full h-3 bg-gray-200 dark:bg-slate-800 rounded-md" />
      <div className="w-5/6 h-3 bg-gray-200 dark:bg-slate-800 rounded-md" />
      <div className="w-3/4 h-3 bg-gray-200 dark:bg-slate-800 rounded-md" />
    </div>
    <div className="w-full h-48 bg-gray-200 dark:bg-slate-800 rounded-xl mb-4" />
    <div className="flex justify-between border-t border-gray-100 dark:border-slate-800 pt-3">
      <div className="w-16 h-4 bg-gray-200 dark:bg-slate-800 rounded-md" />
      <div className="w-16 h-4 bg-gray-200 dark:bg-slate-800 rounded-md" />
      <div className="w-16 h-4 bg-gray-200 dark:bg-slate-800 rounded-md" />
    </div>
  </div>
);

export const SkeletonProject = () => (
  <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs overflow-hidden animate-pulse">
    <div className="h-44 w-full bg-gray-200 dark:bg-slate-800" />
    <div className="p-5 space-y-3">
      <div className="w-40 h-4 bg-gray-200 dark:bg-slate-800 rounded-md" />
      <div className="w-full h-3 bg-gray-200 dark:bg-slate-800 rounded-md" />
      <div className="w-3/4 h-3 bg-gray-200 dark:bg-slate-800 rounded-md" />
      <div className="flex gap-2 pt-2">
        <div className="w-16 h-5 bg-gray-200 dark:bg-slate-800 rounded-md" />
        <div className="w-16 h-5 bg-gray-200 dark:bg-slate-800 rounded-md" />
      </div>
    </div>
  </div>
);

export const SkeletonJob = () => (
  <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-xs animate-pulse space-y-3">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-gray-200 dark:bg-slate-800 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="w-48 h-3.5 bg-gray-200 dark:bg-slate-800 rounded-md" />
        <div className="w-32 h-2.5 bg-gray-200 dark:bg-slate-800 rounded-md" />
      </div>
    </div>
    <div className="w-full h-10 bg-gray-200 dark:bg-slate-800 rounded-xl" />
    <div className="w-full h-3 bg-gray-200 dark:bg-slate-800 rounded-md" />
  </div>
);
