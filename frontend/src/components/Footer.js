import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">A2E</span>
              </div>
              <span className="text-xl font-bold">Average2Epic</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              A 100-day journey of transformation through consistency, discipline, and belief.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-slate-400 hover:text-white transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/connect" className="text-slate-400 hover:text-white transition-colors">
                  Connect
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Connect */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow the Journey</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <Link to="/connect" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
              </Link>
            </div>
            <p className="text-slate-400 text-sm">
              Questions? <Link to="/connect" className="text-orange-400 hover:text-orange-300">Ask me something</Link>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-400">
            © 2025 Average2Epic. Every day is a chance to choose epic over average.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;