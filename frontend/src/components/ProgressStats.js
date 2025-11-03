import React from 'react';
import { Trophy, Target, Zap, Calendar } from 'lucide-react';

const ProgressStats = ({ totalVideos = 0, currentDay = 0 }) => {
  const totalDays = 100;
  const progress = Math.round((currentDay / totalDays) * 100);
  const currentLevel = Math.ceil(currentDay / 12);
  const daysInLevel = ((currentDay - 1) % 12) + 1;
  const levelProgress = Math.round((daysInLevel / 12) * 100);
  
  return (
    <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-2xl p-6 shadow-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Current Day */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="text-3xl font-bold">{currentDay}</div>
          <div className="text-sm opacity-90">of 100 Days</div>
        </div>
        
        {/* Current Level */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-6 w-6" />
          </div>
          <div className="text-3xl font-bold">Level {currentLevel}</div>
          <div className="text-sm opacity-90">{levelProgress}% Complete</div>
        </div>
        
        {/* Total Videos */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-6 w-6" />
          </div>
          <div className="text-3xl font-bold">{totalVideos}</div>
          <div className="text-sm opacity-90">Videos Shared</div>
        </div>
        
        {/* Overall Progress */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="text-3xl font-bold">{progress}%</div>
          <div className="text-sm opacity-90">Journey Complete</div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-6">
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;