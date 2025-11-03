import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await adminAPI.login(credentials);
      
      // Store token
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', data.user.username);
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to admin panel.",
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.detail || "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 via-orange-400 to-purple-600 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-600 mt-2">Access the Average2Epic dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-base mb-2 block">
              <User className="inline h-4 w-4 mr-2" />
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="py-5"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-base mb-2 block">
              <Lock className="inline h-4 w-4 mr-2" />
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="py-5"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white py-6 rounded-full"
          >
            {isLoading ? 'Logging in...' : 'Login to Dashboard'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Demo: admin / epic2025
        </p>
      </Card>
    </div>
  );
};

export default AdminLogin;