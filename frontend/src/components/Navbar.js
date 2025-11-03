import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Video, Home as HomeIcon, Info, Mail, Shield } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null; // Don't show navbar on admin pages

  const links = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/videos', label: 'Videos', icon: Video },
    { to: '/about', label: 'About', icon: Info },
    { to: '/connect', label: 'Connect', icon: Mail }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A2E</span>
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:block">Average2Epic</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {links.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant="ghost"
                    className={`${
                      isActive 
                        ? 'bg-purple-100 text-purple-900' 
                        : 'text-slate-600 hover:text-slate-900'
                    } transition-colors`}
                  >
                    <Icon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Button>
                </Link>
              );
            })}
            <Link to="/admin/login">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                <Shield className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;