import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { videoAPI, adminAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { Plus, Youtube, Video, LogOut, Edit, Trash2 } from 'lucide-react';
import DayBadge from '../components/DayBadge';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    youtubeId: '',
    embedUrl: '',
    day: '',
    date: '',
    reflection: '',
    tags: ''
  });

  // Check auth and load videos
  useEffect(() => {
    verifyAuth();
    loadVideos();
  }, []);

  const verifyAuth = async () => {
    try {
      await adminAPI.verify();
    } catch (error) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the admin panel.",
        variant: "destructive",
      });
      navigate('/admin/login');
    }
  };

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await videoAPI.getAll(1, 100); // Get all videos for admin
      setVideos(data.videos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast({
      title: "Logged out",
      description: "Successfully logged out of admin panel.",
    });
    navigate('/admin/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVideo(prev => ({ ...prev, [name]: value }));
  };

  const handleImportFromYouTube = () => {
    if (newVideo.youtubeId) {
      const embedUrl = `https://www.youtube.com/embed/${newVideo.youtubeId}`;
      setNewVideo(prev => ({ ...prev, embedUrl }));
      toast({
        title: "YouTube video imported",
        description: "Embed URL has been generated.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a YouTube video ID first.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const video = {
        title: newVideo.title,
        youtubeId: newVideo.youtubeId,
        embedUrl: newVideo.embedUrl || `https://www.youtube.com/embed/${newVideo.youtubeId}`,
        day: parseInt(newVideo.day),
        date: newVideo.date,
        reflection: newVideo.reflection,
        tags: newVideo.tags.split(',').map(t => t.trim())
      };

      await videoAPI.create(video);
      
      toast({
        title: "Video added!",
        description: "Day " + video.day + " has been added successfully.",
      });
      
      setNewVideo({ title: '', youtubeId: '', embedUrl: '', day: '', date: '', reflection: '', tags: '' });
      setShowAddForm(false);
      loadVideos(); // Reload videos
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to add video",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await videoAPI.delete(id);
      toast({
        title: "Video deleted",
        description: "Video has been removed from the catalog.",
      });
      loadVideos(); // Reload videos
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setNewVideo({
      title: video.title,
      youtubeId: video.youtubeId,
      embedUrl: video.embedUrl,
      day: String(video.day),
      date: video.date,
      reflection: video.reflection,
      tags: video.tags.join(', ')
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const video = {
        title: newVideo.title,
        youtubeId: newVideo.youtubeId,
        embedUrl: newVideo.embedUrl || `https://www.youtube.com/embed/${newVideo.youtubeId}`,
        day: parseInt(newVideo.day),
        date: newVideo.date,
        reflection: newVideo.reflection,
        tags: newVideo.tags.split(',').map(t => t.trim())
      };

      await videoAPI.update(editingVideo.id, video);
      
      toast({
        title: "Video updated!",
        description: "Day " + video.day + " has been updated successfully.",
      });
      
      setNewVideo({ title: '', youtubeId: '', embedUrl: '', day: '', date: '', reflection: '', tags: '' });
      setShowEditForm(false);
      setEditingVideo(null);
      loadVideos(); // Reload videos
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update video",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingVideo(null);
    setNewVideo({ title: '', youtubeId: '', embedUrl: '', day: '', date: '', reflection: '', tags: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="opacity-90">Manage your Average2Epic content</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="bg-white text-purple-900 hover:bg-slate-100">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Add Video Button */}
        <div className="mb-8 flex justify-between items-center">
          <Button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowEditForm(false);
              setEditingVideo(null);
              setNewVideo({ title: '', youtubeId: '', embedUrl: '', day: '', date: '', reflection: '', tags: '' });
            }}
            className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 min-h-12"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            {showAddForm ? 'Cancel' : 'Add New Video'}
          </Button>
        </div>

        {/* Floating Add Button for Mobile */}
        {!showAddForm && !showEditForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-95 transition-transform hover:scale-110"
            aria-label="Add Video"
          >
            <Plus className="h-6 w-6" />
          </button>
        )}

        {/* Edit Video Form */}
        {showEditForm && editingVideo && (
          <Card className="p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Edit Video (Day {editingVideo.day})</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="edit-title">Video Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={newVideo.title}
                    onChange={handleChange}
                    placeholder="Day X: Title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-day">Day Number</Label>
                  <Input
                    id="edit-day"
                    name="day"
                    type="number"
                    value={newVideo.day}
                    onChange={handleChange}
                    placeholder="1-100"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  name="date"
                  type="date"
                  value={newVideo.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-youtubeId">YouTube Video ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-youtubeId"
                    name="youtubeId"
                    value={newVideo.youtubeId}
                    onChange={handleChange}
                    placeholder="e.g., dQw4w9WgXcQ"
                    required
                  />
                  <Button type="button" onClick={handleImportFromYouTube} variant="outline">
                    <Youtube className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-embedUrl">Embed URL (auto-generated)</Label>
                <Input
                  id="edit-embedUrl"
                  name="embedUrl"
                  value={newVideo.embedUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/embed/..."
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  name="tags"
                  value={newVideo.tags}
                  onChange={handleChange}
                  placeholder="Consistency, Fitness, Mindset"
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-reflection">Reflection</Label>
                <Textarea
                  id="edit-reflection"
                  name="reflection"
                  value={newVideo.reflection}
                  onChange={handleChange}
                  placeholder="Write your reflection for this day..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600" size="lg">
                  <Video className="mr-2 h-5 w-5" />
                  Update Video
                </Button>
                <Button type="button" onClick={handleCancelEdit} variant="outline" size="lg">
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Add Video Form */}
        {showAddForm && (
          <Card className="p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Add New Video</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newVideo.title}
                    onChange={handleChange}
                    placeholder="Day X: Title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="day">Day Number</Label>
                  <Input
                    id="day"
                    name="day"
                    type="number"
                    value={newVideo.day}
                    onChange={handleChange}
                    placeholder="1-100"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newVideo.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeId">YouTube Video ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="youtubeId"
                    name="youtubeId"
                    value={newVideo.youtubeId}
                    onChange={handleChange}
                    placeholder="e.g., dQw4w9WgXcQ"
                    required
                  />
                  <Button type="button" onClick={handleImportFromYouTube} variant="outline">
                    <Youtube className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </div>
                <p className="text-sm text-slate-500">Or paste full YouTube URL and extract ID</p>
              </div>

              <div>
                <Label htmlFor="embedUrl">Embed URL (auto-generated)</Label>
                <Input
                  id="embedUrl"
                  name="embedUrl"
                  value={newVideo.embedUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/embed/..."
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={newVideo.tags}
                  onChange={handleChange}
                  placeholder="Consistency, Fitness, Mindset"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reflection">Reflection</Label>
                <Textarea
                  id="reflection"
                  name="reflection"
                  value={newVideo.reflection}
                  onChange={handleChange}
                  placeholder="Write your reflection for this day..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600" size="lg">
                <Video className="mr-2 h-5 w-5" />
                Add Video to Catalog
              </Button>
            </form>
          </Card>
        )}

        {/* Videos List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-slate-900">All Videos ({videos.length})</h2>
          <div className="grid gap-4">
            {videos.map(video => (
              <Card key={video.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <DayBadge day={video.day} showLevel={true} size="small" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-slate-500">{video.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{video.title}</h3>
                      <p className="text-slate-600 mb-3 whitespace-pre-wrap line-clamp-3">{video.excerpt}</p>
                      <div className="flex flex-wrap gap-2">
                        {video.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(video)} className="min-h-10 min-w-10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(video.id)} className="min-h-10 min-w-10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;