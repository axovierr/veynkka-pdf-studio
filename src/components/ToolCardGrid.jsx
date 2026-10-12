import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TOOLS } from '../utils/constants';

export default function ToolCardGrid({ onSelectTool }) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
          Pilih Fitur Veynkka Studio
        </h2>
        <p className="text-slate-400 text-xs md:text-sm">
          Klik langsung fitur yang ingin Anda gunakan sekarang.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <div 
              key={t.id}
              onClick={() => onSelectTool(t)}
              className="glass-card-interactive rounded-3xl p-6 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border bg-gradient-to-br ${t.gradient}`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {t.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">{t.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-semibold text-sky-400">
                <span>Jalankan Fitur</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}