import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Mail, Send } from 'lucide-react';

const Connect = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    area: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (value) => {
    setFormData(prev => ({ ...prev, area: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactAPI.submit(formData);
      
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. Every epic story starts with a question — I'll get back to you soon.",
      });
      
      setFormData({ name: '', email: '', area: 'general', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 via-orange-400 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Mail className="h-12 w-12" />
            <h1 className="text-5xl md:text-6xl font-bold">Connect</h1>
          </div>
          <p className="text-xl opacity-90">Ask me something. Share your story. Start your journey.</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-slate-900 text-center">Ask Me Something</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-lg mb-2 block">Your Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="text-lg py-6"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-lg mb-2 block">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-lg py-6"
              />
            </div>

            {/* Area Selection */}
            <div>
              <Label htmlFor="area" className="text-lg mb-2 block">What area are you working on?</Label>
              <Select value={formData.area} onValueChange={handleAreaChange}>
                <SelectTrigger className="text-lg py-6">
                  <SelectValue placeholder="Select an area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Question</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="focus">Focus & Productivity</SelectItem>
                  <SelectItem value="belief">Belief & Mindset</SelectItem>
                  <SelectItem value="work">Work & Career</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-lg mb-2 block">Your Message or Question</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Share your thoughts, ask a question, or tell me about your journey..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="text-lg"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white text-lg py-6 rounded-full shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Encouragement */}
        <div className="mt-12 text-center">
          <img
            src="https://images.pexels.com/photos/3759660/pexels-photo-3759660.jpeg"
            alt="Meditation by water"
            className="w-full rounded-2xl shadow-2xl mb-8"
          />
          <p className="text-xl text-slate-600 italic">
            "Every epic story starts with a question. What's yours?"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Connect;