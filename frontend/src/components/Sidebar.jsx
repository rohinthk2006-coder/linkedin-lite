import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Users, Award, ShieldCheck } from 'lucide-react';

export const Sidebar = ({ onNavigateProfile }) => {
  const { user } = useAuth();
  const completeness = user?.profileCompleteness || 20;

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
      {/* Cover Image Header */}
      <div className="h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.firstName}
            className="w-18 h-18 rounded-full border-4 border-white object-cover absolute left-1/2 transform -translate-x-1/2 top-10 shadow-md cursor-pointer hover:opacity-90 transition"
            onClick={onNavigateProfile}
          />
        ) : (
          <div 
            onClick={onNavigateProfile}
            className="w-18 h-18 rounded-full border-4 border-white bg-blue-700 text-white flex items-center justify-center text-2xl font-bold absolute left-1/2 transform -translate-x-1/2 top-10 shadow-md cursor-pointer"
          >
            {user?.firstName?.charAt(0)}
          </div>
        )}
      </div>

      {/* User Info Details */}
      <div className="pt-12 pb-4 px-4 text-center">
        <h2 
          onClick={onNavigateProfile} 
          className="text-lg font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition flex items-center justify-center gap-1"
        >
          {user?.firstName} {user?.lastName}
          {user?.role === 'ROLE_ADMIN' && (
            <ShieldCheck className="h-4 w-4 text-purple-600" title="Administrator" />
          )}
        </h2>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{user?.headline || 'No headline set'}</p>
        
        {user?.location && (
          <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
            <span>{user.location}</span>
          </div>
        )}
      </div>

      {/* Connection Count & Profile Strength */}
      <div className="border-t border-gray-100 py-3 px-4 text-xs">
        <div className="flex justify-between items-center py-1 text-gray-600 font-medium">
          <span className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
            Connections
          </span>
          <span className="font-bold text-blue-600">{user?.connectionCount || 0}</span>
        </div>

        {/* Profile Completeness Progress */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-600 font-medium mb-1">
            <span className="flex items-center">
              <Award className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
              Profile Strength
            </span>
            <span className="font-bold text-gray-800">{completeness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-blue-600' : 'bg-amber-500'
              }`}
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
