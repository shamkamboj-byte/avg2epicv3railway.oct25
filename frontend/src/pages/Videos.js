import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import DayBadge from '../components/DayBadge';
import TagCarousel from '../components/TagCarousel';
import VideoCardSkeleton from '../components/VideoCardSkeleton';
import ProgressStats from '../components/ProgressStats';

const VIDEOS_PER_PAGE = 12;

const Videos = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState('All');
  const [videos, setVideos] = useState([]);
  const [allTags, setAllTags] = useState(['All']);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [videoCounts, setVideoCounts] = useState({});

  // Load videos from API
  useEffect(() => {
    loadVideos();
    loadTags();
  }, [currentPage, selectedTag]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await videoAPI.getAll(currentPage, VIDEOS_PER_PAGE, selectedTag);
      setVideos(data.videos);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tags = await videoAPI.getTags();
      setAllTags(tags);
      
      // Get video counts per tag
      const counts = {};
      for (const tag of tags) {
        if (tag !== 'All') {
          const data = await videoAPI.getAll(1, 1, tag);
          counts[tag] = data.pagination.totalVideos;
        }
      }
      setVideoCounts(counts);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  // Calculate stats for progress
  const maxDay = videos.length > 0 ? Math.max(...videos.map(v => v.day)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 via-orange-400 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">The Journey</h1>
          <p className="text-xl opacity-90">100 days of transformation, one video at a time</p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 mb-8 relative z-10">
        <ProgressStats totalVideos={pagination.totalVideos || 0} currentDay={maxDay} />
      </div>

      {/* Tag Filter */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <TagCarousel 
          tags={allTags} 
          selectedTag={selectedTag} 
          onTagChange={handleTagChange}
          videoCounts={videoCounts}
        />
      </div>

      {/* Videos Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, idx) => (
              <VideoCardSkeleton key={idx} />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">No videos found. Add your first video from the admin panel!</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map(video => (
                <div key={video.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 active:scale-95">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-sky-400 to-purple-600">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                    <div className="absolute top-4 right-4">
                      <DayBadge day={video.day} showLevel={true} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <Calendar className="h-4 w-4" />
                      {new Date(video.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-2 whitespace-pre-wrap">
                      {video.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {video.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Link to={`/video/${video.id}`}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 min-h-12 active:scale-95 transition-transform">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Read The Extra Byte
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-slate-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={!pagination.hasNext}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
};

export default Videos;