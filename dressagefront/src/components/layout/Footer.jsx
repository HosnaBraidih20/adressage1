import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 mt-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:y-0">
        
        {/* Copyright */}
        <div className="text-slate-500 text-sm font-medium">
          © {currentYear} <span className="font-bold text-slate-800 tracking-tight">l'aressage v1.0</span>. Tous droits réservés.
        </div>

        {/* Security Badge */}
        <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Système Sécurisé</span>
        </div>

        {/* Support Links */}
        <div className="flex items-center space-x-6">
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase">Support</a>
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase">Documentation</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;