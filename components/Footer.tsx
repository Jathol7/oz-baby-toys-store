
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
            OZ Baby Toys
          </span>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Providing high-quality, safe, and educational toys for your little ones to grow and explore.
          </p>
        </div>
        <div className="flex justify-center space-x-6 text-sm text-slate-400 font-medium mb-6">
          <a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-yellow-500 transition-colors">Contact Us</a>
        </div>
        <div className="text-slate-400 text-xs flex items-center justify-center gap-1">
          &copy; {new Date().getFullYear()} OZ Baby Toys Store By <strong style={{ color: '#000', fontSize: '1.2em' }}>Hammad Arshad Developer</strong>. Made with <Heart size={12} className="text-pink-400" /> for learning.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
