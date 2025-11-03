import React, { useState } from 'react';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';

const TagCarousel = ({ tags, selectedTag, onTagChange, videoCounts = {} }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Show top 8 tags initially
  const visibleTags = showAll ? tags : tags.slice(0, 8);
  const hasMore = tags.length > 8;
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-700">Filter by Tag:</h2>
      
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden overflow-x-auto pb-2 -mx-6 px-6">
        <div className="flex gap-2" style={{ minWidth: 'min-content' }}>
          {tags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              onClick={() => onTagChange(tag)}
              className={`whitespace-nowrap flex-shrink-0 transition-all duration-200 min-h-12 ${
                selectedTag === tag 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' 
                  : 'hover:bg-slate-100 hover:border-purple-400'
              }`}
            >
              {tag}
              {videoCounts[tag] && (
                <span className="ml-1.5 text-xs opacity-75">• {videoCounts[tag]}</span>
              )}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Desktop: Wrap with show more */}
      <div className="hidden md:block">
        <div className="flex flex-wrap gap-3">
          {visibleTags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              onClick={() => onTagChange(tag)}
              className={`transition-all duration-200 min-h-12 ${
                selectedTag === tag 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg scale-105' 
                  : 'hover:bg-slate-100 hover:border-purple-400'
              }`}
            >
              {tag}
              {videoCounts[tag] && (
                <span className="ml-1.5 text-xs opacity-75">• {videoCounts[tag]}</span>
              )}
            </Button>
          ))}
          {hasMore && (
            <Button
              variant="ghost"
              onClick={() => setShowAll(!showAll)}
              className="text-purple-600 hover:text-purple-700"
            >
              {showAll ? 'Show Less' : `+${tags.length - 8} More`}
              <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
            </Button>
          )}
        </div>
      </div>
      
      {selectedTag !== 'All' && (
        <div className="text-sm text-slate-600">
          Showing videos tagged with <span className="font-semibold text-purple-600">{selectedTag}</span>
          <button 
            onClick={() => onTagChange('All')} 
            className="ml-2 text-purple-600 hover:underline font-medium"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
};

export default TagCarousel;