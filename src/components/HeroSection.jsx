import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  FileText, 
  Layers, 
  CheckCircle2, 
  ArrowDown
} from 'lucide-react';
import { HIGHLIGHT_CARDS } from '../utils/constants';

export default function HeroSection() {
  // Efek Mengetik Animasi Berganti Kata
  const words = ['Fast, Private, Unlimited Quota'];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIdx];
    const updateRate = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentWord.substring(0, displayedText.length + 1));
        if (displayedText.length + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setDisplayedText(currentWord.substring(0, displayedText.length - 1));
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % words.length);
        }
      }
    }, updateRate);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentWordIdx]);

  return (
    <div className="relative pt-4 pb-12 overflow-hidden">
      
      {/* Background Grid Pattern Cyber */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Hero Utama */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4">
        
        {/* Shimmer Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full shimmer-badge border border-sky-400/40 text-xs font-bold text-sky-300 mb-6 shadow-lg shadow-sky-500/10">
          <Sparkles size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
          <span>Platform Studio PDF Modern Generasi Cloud</span>
        </div>

        {/* Dynamic Animated Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] mb-5 text-white">
          Veynkka CloudPDF Studio <br />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
            {displayedText}
          </span>
          <span className="text-sky-400 animate-pulse font-normal">|</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-6 leading-relaxed">
          Karya eksklusif yang diarsiteki oleh <strong className="text-sky-300 font-bold">Khevin</strong>. 
          Semua proses pengolahan PDF dieksekusi murni di memori RAM browser Anda tanpa risiko kebocoran server database, mendukung ukuran hingga 100 MB dan kapasitas gabung 500 file.
        </p>

        {/* Badge Hak Cipta Khevin */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 border border-sky-500/30 text-xs text-slate-300 mb-10 shadow-lg shadow-sky-500/10">
          <ShieldCheck size={16} className="text-sky-400" />
          <span>Hak Cipta Eksklusif & Dikelola Penuh oleh <strong>Khevin</strong></span>
        </div>

        {/* 3 Visual Live Stat Cards (Interactive Floating Banners) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-12">
          
          <div className="glass-card-interactive p-4 rounded-2xl flex items-center gap-3.5 animate-float-1 border border-white/10 text-left">
            <div className="w-11 h-11 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center flex-shrink-0">
              <Cpu size={22} />
            </div>
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Arsitektur</p>
              <h4 className="text-xs font-bold text-white">Client-Side Memory</h4>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">● 0 KB Server Log</p>
            </div>
          </div>

          <div className="glass-card-interactive p-4 rounded-2xl flex items-center gap-3.5 animate-float-2 border border-white/10 text-left">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Kapasitas Maks</p>
              <h4 className="text-xs font-bold text-white">500 Berkas Bersamaan</h4>
              <p className="text-[10px] text-sky-400 font-semibold mt-0.5">● High Throughput</p>
            </div>
          </div>

          <div className="glass-card-interactive p-4 rounded-2xl flex items-center gap-3.5 animate-float-1 border border-white/10 text-left">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Zap size={22} />
            </div>
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Kecepatan</p>
              <h4 className="text-xs font-bold text-white">Eksekusi WebAssembly</h4>
              <p className="text-[10px] text-indigo-400 font-semibold mt-0.5">● Respon Instan</p>
            </div>
          </div>

        </div>

      </div>

      {/* Auto-Scroll Marquee Highlights */}
      <div className="overflow-hidden relative py-2">
        <div className="animate-marquee gap-4 flex">
          {[...HIGHLIGHT_CARDS, ...HIGHLIGHT_CARDS].map((item, idx) => (
            <div key={idx} className="glass-card-interactive w-72 p-4 rounded-2xl flex-shrink-0 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                  {item.tag}
                </span>
                <CheckCircle2 size={13} className="text-sky-400/70" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}