import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, ShieldCheck } from 'lucide-react';

export default function LoadingModal() {
  const [dots, setDots] = useState('');
  const [stepText, setStepText] = useState('Mengurai struktur berkas');

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    const steps = [
      'Mengurai struktur dokumen di memori RAM...',
      'Menyusun lembaran berkas dengan Veynkka Engine...',
      'Mengoptimasi & memverifikasi integritas file...',
      'Menyiapkan berkas pratinjau...'
    ];
    let stepIndex = 0;
    const textInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setStepText(steps[stepIndex]);
    }, 1200);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#060913]/90 backdrop-blur-2xl flex items-center justify-center p-6">
      
      {/* Container Kaca Bertingkat */}
      <div className="relative max-w-sm w-full glass-panel-deep rounded-3xl p-8 border border-sky-500/30 shadow-2xl shadow-sky-500/20 text-center flex flex-col items-center overflow-hidden">
        
        {/* Glow Ambient di Balik Lingkaran */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Lingkaran Radar & Animasi Inti */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          {/* Cincin Luar Berputar */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 border-r-indigo-500 animate-spin" style={{ animationDuration: '3s' }} />
          
          {/* Cincin Kedua Berputar Berlawanan */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-sky-400 border-l-purple-500 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
          
          {/* Efek Ping Gelombang Radar */}
          <div className="absolute inset-4 rounded-full bg-sky-500/20 animate-ping" style={{ animationDuration: '2s' }} />

          {/* Ikon Inti */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/40">
            <Cpu size={28} className="animate-pulse" />
          </div>
        </div>

        {/* Teks Judul */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-[10px] font-black uppercase tracking-widest text-sky-400 mb-2">
          <Sparkles size={12} /> Veynkka Engine Aktif
        </div>
        <h3 className="text-lg font-black text-white tracking-tight mb-1">
          Sedang Memproses Dokumen{dots}
        </h3>

        {/* Dinamis Status Progress */}
        <p className="text-xs text-slate-300 font-medium h-8 flex items-center justify-center transition-all duration-300 px-2">
          {stepText}
        </p>

        {/* Progress Bar Gradasi Neon */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/10 my-4 relative">
          <div className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-400 w-full animate-pulse rounded-full" />
        </div>

        {/* Keamanan Client Side */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Privasi Terjaga • 100% Client-Side RAM</span>
        </div>

      </div>
    </div>
  );
}