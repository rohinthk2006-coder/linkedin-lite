import React from 'react';
import { Sparkles, Calendar, ExternalLink, ArrowRight, UserPlus, Check, Award, Trophy } from 'lucide-react';
import { mockOpportunities, mockEvents } from '../data/mockOpportunities';

export const RightSidebar = ({ 
  recommendedUsers = [], 
  onSelectUser, 
  onConnectUser, 
  onNavigateJobs, 
  onNavigateNetwork 
}) => {
  return (
    <aside className="space-y-4">
      {/* Opportunities For You */}
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-xs border border-gray-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Opportunities For You</h3>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
            Verified
          </span>
        </div>

        <div className="space-y-3">
          {mockOpportunities.map((item) => (
            <div 
              key={item.id} 
              onClick={onNavigateJobs}
              className="p-3 rounded-xl bg-gray-50/70 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/60 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {item.type}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-md">
                  {item.matchPercentage}% match
                </span>
              </div>
              <h4 className="font-semibold text-xs text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onNavigateJobs}
          className="w-full mt-3 pt-2 text-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline border-t border-gray-100 dark:border-slate-800 flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Explore All Opportunities</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Upcoming Tech Events & Hackathons */}
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-xs border border-gray-200 dark:border-slate-800 p-4">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center space-x-2 mb-3">
          <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Upcoming Tech Events</span>
        </h3>

        <div className="space-y-2.5 text-xs">
          {mockEvents.map((evt) => (
            <div key={evt.id} className="pb-2.5 border-b border-gray-100 dark:border-slate-800 last:border-b-0 last:pb-0">
              <h4 className="font-semibold text-gray-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition">
                {evt.title}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                <span>{evt.date}</span>
                <span>{evt.attendees} going</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* People You May Know */}
      {recommendedUsers && recommendedUsers.length > 0 && (
        <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-xs border border-gray-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">People You May Know</h3>
            <button
              onClick={onNavigateNetwork}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          <div className="space-y-3">
            {recommendedUsers.slice(0, 3).map((person) => (
              <div key={person.id} className="flex items-center space-x-2.5">
                {person.profileImage ? (
                  <img
                    src={person.profileImage}
                    alt={person.firstName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700 cursor-pointer"
                    onClick={() => onSelectUser && onSelectUser(person.id)}
                  />
                ) : (
                  <div
                    onClick={() => onSelectUser && onSelectUser(person.id)}
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-xs"
                  >
                    {person.firstName?.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    onClick={() => onSelectUser && onSelectUser(person.id)}
                    className="font-bold text-xs text-gray-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                  >
                    {person.firstName} {person.lastName}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{person.headline}</p>
                </div>
                {onConnectUser && (
                  <button
                    onClick={() => onConnectUser(person.id)}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-400 dark:hover:text-blue-400 transition cursor-pointer"
                    title="Connect"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
