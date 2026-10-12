import React from 'react';
import { Cloud, ArrowLeft } from 'lucide-react';

export default function Navbar({ onReset, hasActiveView }) {
  return (
    <nav className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b border-white/10 bg-[#060913]/70 backdrop-blur-2xl">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onReset}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition">
          <Cloud size={20} />
        </div>
        <div>
          <span className="text-lg font-black tracking-tight">Veynkka <span className="text-sky-400">PDF Studio</span></span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Karya Resmi Khevin
        </div>
        {hasActiveView && (
          <button 
            onClick={onReset}
            className="text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Beranda
          </button>
        )}
      </div>
    </nav>
  );
}