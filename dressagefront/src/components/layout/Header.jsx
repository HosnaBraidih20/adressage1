import React from 'react';
import { LayoutDashboard, Users, Map } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center space-x-2 group cursor-pointer">
          <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Map className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter italic">
            MAP<span className="text-indigo-600">I</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="flex items-center space-x-1 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1">
            <Users size={16} />
            <span>Inscription</span>
          </a>
          <a href="#" className="flex items-center space-x-1 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
            <LayoutDashboard size={16} />
            <span>Statistiques</span>
          </a>
        </nav>

        {/* User Profile / Status */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Découpage administratif intelligent</p>
            <p className="text-sm font-bold text-slate-700">à Settat</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold">
            DS
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;