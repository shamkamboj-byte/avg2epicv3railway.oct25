import React from 'react';

const VideoCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      {/* Video thumbnail skeleton */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-200 to-slate-300">
        <div className="absolute top-4 right-4">
          <div className="w-16 h-16 bg-slate-300 rounded-full"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-6 space-y-3">
        {/* Date */}
        <div className="h-4 bg-slate-200 rounded w-32"></div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-slate-300 rounded w-full"></div>
          <div className="h-5 bg-slate-300 rounded w-3/4"></div>
        </div>
        
        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
        
        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 bg-slate-200 rounded-full w-16"></div>
          <div className="h-6 bg-slate-200 rounded-full w-20"></div>
        </div>
        
        {/* Button */}
        <div className="h-10 bg-slate-300 rounded w-full"></div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;