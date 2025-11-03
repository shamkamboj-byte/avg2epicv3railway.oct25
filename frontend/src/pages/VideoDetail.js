import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, ArrowLeft, Youtube } from 'lucide-react';
import DayBadge from '../components/DayBadge';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideo();
  }, [id]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const data = await videoAPI.getById(id);
      setVideo(data);
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-slate-600">Loading video...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Video not found</h1>
          <Link to="/videos">
            <Button>Back to Videos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Back Button */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <Link to="/videos">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Videos
          </Button>
        </Link>
      </div>

      {/* Video Content */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <DayBadge day={video.day} showLevel={true} size="large" />
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="h-5 w-5" />
              <span className="text-lg">
                {new Date(video.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {video.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {video.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Video Embed */}
        <div className="mb-12">
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={video.embedUrl}
              title={video.title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>

        {/* Reflection */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-slate-900">Reflection</h2>
          <p className="text-xl text-slate-700 leading-relaxed whitespace-pre-wrap">
            {video.reflection}
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">What does epic mean to you?</h3>
          <p className="text-lg mb-8 opacity-90">
            Every journey is unique. Share your thoughts, ask questions, or start your own transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/connect">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-slate-100">
                Ask Me Something
              </Button>
            </Link>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-900">
                <Youtube className="mr-2 h-5 w-5" />
                Subscribe on YouTube
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;