import React from 'react';
import { Badge } from './ui/badge';

const DayBadge = ({ day, showLevel = false, size = 'default' }) => {
  // Calculate level (12 days per level)
  const level = Math.ceil(day / 12);
  const dayInLevel = ((day - 1) % 12) + 1;
  const progress = (dayInLevel / 12) * 100;
  
  // Level colors
  const levelColors = {
    1: 'from-blue-400 to-blue-600',
    2: 'from-green-400 to-green-600',
    3: 'from-yellow-400 to-yellow-600',
    4: 'from-orange-400 to-orange-600',
    5: 'from-red-400 to-red-600',
    6: 'from-purple-400 to-purple-600',
    7: 'from-pink-400 to-pink-600',
    8: 'from-indigo-400 to-indigo-600',
    9: 'from-cyan-400 to-cyan-600'
  };
  
  const sizeClasses = {
    small: 'w-12 h-12 text-xs',
    default: 'w-16 h-16 text-sm',
    large: 'w-20 h-20 text-base'
  };
  
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Progress ring */}
      <svg className={`${sizeClasses[size]} absolute`} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
        {/* Progress circle */}
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      
      {/* Badge content */}
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${levelColors[level] || 'from-gray-400 to-gray-600'} flex flex-col items-center justify-center text-white font-bold shadow-lg z-10`}>
        <span className="text-[0.6em] opacity-90">Day</span>
        <span>{day}</span>
        {showLevel && <span className="text-[0.5em] opacity-75">L{level}</span>}
      </div>
    </div>
  );
};

export default DayBadge;