import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Youtube, MessageCircle, Trophy, Target, Zap } from 'lucide-react';
import { videoAPI } from '../services/api';
import DayBadge from '../components/DayBadge';
import ProgressStats from '../components/ProgressStats';
import { Badge } from '../components/ui/badge';

const Home = () => {
  const [latestVideos, setLatestVideos] = useState([]);
  const [stats, setStats] = useState({ total: 0, maxDay: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      // Get latest 6 videos
      const data = await videoAPI.getAll(1, 6);
      setLatestVideos(data.videos);
      
      // Calculate stats
      const maxDay = data.videos.length > 0 ? Math.max(...data.videos.map(v => v.day)) : 0;
      setStats({
        total: data.pagination.totalVideos || 0,
        maxDay: maxDay
      });
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current level
  const currentLevel = Math.ceil(stats.maxDay / 12);
  const levelsCompleted = Math.floor(stats.maxDay / 12);
  
  // Level milestones
  const levels = [
    { level: 1, days: '1-12', color: 'from-blue-400 to-blue-600', completed: stats.maxDay >= 12 },
    { level: 2, days: '13-24', color: 'from-green-400 to-green-600', completed: stats.maxDay >= 24 },
    { level: 3, days: '25-36', color: 'from-yellow-400 to-yellow-600', completed: stats.maxDay >= 36 },
    { level: 4, days: '37-48', color: 'from-orange-400 to-orange-600', completed: stats.maxDay >= 48 },
    { level: 5, days: '49-60', color: 'from-red-400 to-red-600', completed: stats.maxDay >= 60 },
    { level: 6, days: '61-72', color: 'from-purple-400 to-purple-600', completed: stats.maxDay >= 72 },
    { level: 7, days: '73-84', color: 'from-pink-400 to-pink-600', completed: stats.maxDay >= 84 },
    { level: 8, days: '85-96', color: 'from-indigo-400 to-indigo-600', completed: stats.maxDay >= 96 },
    { level: 9, days: '97-100', color: 'from-cyan-400 to-cyan-600', completed: stats.maxDay >= 97 }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1578586779319-8e4d302e9250?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxzZWxmJTIwaW1wcm92ZW1lbnR8ZW58MHx8fHwxNzYwODcwMzgyfDA&ixlib=rb-4.1.0&q=85"
            alt="Transformation Journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/90 via-orange-400/85 to-purple-600/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            Average2Epic
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-8 max-w-3xl mx-auto leading-relaxed">
            A 100-Day Journey from Consistency to Transformation
          </p>
          <p className="text-xl md:text-2xl mb-12 font-medium">
            Start where you are. End up Epic.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/videos">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-slate-100 text-lg px-8 py-6 rounded-full shadow-xl transition-all duration-300 hover:scale-105">
                <Youtube className="mr-2 h-5 w-5" />
                Watch the Journey
              </Button>
            </Link>
            <Link to="/connect">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-900 text-lg px-8 py-6 rounded-full shadow-xl transition-all duration-300 hover:scale-105">
                <MessageCircle className="mr-2 h-5 w-5" />
                Ask Me Something
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <ArrowRight className="h-8 w-8 text-white rotate-90" />
        </div>
      </div>

      {/* Introduction Section with Progress */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-8 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            A Journey of Becoming
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            This is a journey of becoming — from the average days that test patience, 
            to the epic moments that reward it. It's about belief, discipline, and showing 
            up when no one's watching.
          </p>
        </div>

        {/* Progress Stats */}
        <div className="mb-16">
          <ProgressStats totalVideos={stats.total} currentDay={stats.maxDay} />
        </div>
      </div>

      {/* Level Progress Visualization */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              The 9 Levels of Transformation
            </h2>
            <p className="text-xl text-slate-600">
              Every 12 days unlocks a new level. Currently on Level {currentLevel}.
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {levels.map((level) => (
              <div key={level.level} className="text-center">
                <div className={`relative w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg ${
                  level.completed ? 'opacity-100 scale-110' : 'opacity-40'
                } transition-all duration-300`}>
                  {level.level}
                  {level.completed && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Days {level.days}
                </div>
                {currentLevel === level.level && !level.completed && (
                  <div className="mt-1 text-xs text-purple-600 font-bold">
                    Current
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Videos Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Latest Videos
            </h2>
            <p className="text-xl text-slate-600">
              Most recent updates from the journey
            </p>
          </div>
          <Link to="/videos">
            <Button size="lg" variant="outline" className="hidden md:flex">
              View All Videos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">Loading videos...</p>
          </div>
        ) : latestVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">No videos yet. The journey begins soon!</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestVideos.map(video => (
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
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 min-h-12">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Read Reflection
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-12 text-center md:hidden">
              <Link to="/videos">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 w-full md:w-auto">
                  View All {stats.total} Videos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Stats Highlight */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.maxDay}</div>
              <div className="text-slate-600 font-medium">Days Completed</div>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">{levelsCompleted}/9</div>
              <div className="text-slate-600 font-medium">Levels Unlocked</div>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.total}</div>
              <div className="text-slate-600 font-medium">Videos Shared</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reflection CTA */}
      <div className="py-24 bg-gradient-to-r from-purple-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            What would happen if you just kept showing up?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            The goal is not just to showcase my journey, but to quietly nudge you to start your own.
          </p>
          <Link to="/videos">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-slate-100 text-lg px-8 py-6 rounded-full shadow-xl transition-all duration-300 hover:scale-105">
              Start Watching Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;