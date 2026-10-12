import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ToolCardGrid from './components/ToolCardGrid';
import Dropzone from './components/Dropzone';
import PreviewGrid from './components/PreviewGrid';
import ResultView from './components/ResultView';
import LoadingModal from './components/LoadingModal';

import { TOOLS } from './utils/constants';
import { 
  renderPdfFirstPage, 
  renderAllPdfPages, 
  processPdfOperation 
} from './utils/pdfEngine';
import { Sparkles, ArrowLeft, Sliders, Shield, Zap, Layers } from 'lucide-react';

function ToolWorkspace() {
  const navigate = useNavigate();
  const { toolSlug } = useParams();
  
  const currentPath = `/${toolSlug}`;
  const activeTool = TOOLS.find(t => t.path === currentPath);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [splitPages, setSplitPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [compressQuality, setCompressQuality] = useState(60);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!activeTool) {
      navigate('/');
    }
  }, [activeTool, navigate]);

  // Generate thumbnail kartu preview
  useEffect(() => {
    if (!files.length || !activeTool) {
      setPreviews([]);
      setSplitPages([]);
      return;
    }

    const loadThumbnails = async () => {
      if (activeTool.id === 'imgToPdf') {
        setPreviews(files.map(f => URL.createObjectURL(f)));
      } else if (activeTool.id === 'merge') {
        const thumbs = await Promise.all(files.map(f => renderPdfFirstPage(f)));
        setPreviews(thumbs);
      } else if (activeTool.id === 'split') {
        const pages = await renderAllPdfPages(files[0]);
        setSplitPages(pages);
      }
    };

    loadThumbnails();
  }, [files, activeTool]);

  if (!activeTool) return null;

  const handleFilesAdded = (newFiles) => {
    const valid = newFiles.filter(f => {
      const limit = activeTool.id === 'imgToPdf' ? 50 * 1024 * 1024 : 100 * 1024 * 1024;
      if (f.size > limit) {
        alert(`Berkas ${f.name} melebihi batas kapasitas.`);
        return false;
      }
      return true;
    });

    if (activeTool.multiple) {
      setFiles(prev => [...prev, ...valid].slice(0, 500));
    } else {
      setFiles(valid.slice(0, 1));
    }
  };

  const handleReorderFiles = (fromIndex, toIndex) => {
    const reordered = [...files];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setFiles(reordered);
    // Tukar urutan preview sinkron
    if (previews.length) {
      const reorderedPreviews = [...previews];
      const [movedPrev] = reorderedPreviews.splice(fromIndex, 1);
      reorderedPreviews.splice(toIndex, 0, movedPrev);
      setPreviews(reorderedPreviews);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (previews.length) {
      setPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleToggleSplitPage = (index) => {
    setSplitPages(prev => prev.map((p, i) => i === index ? { ...p, selected: !p.selected } : p));
  };

  const handleExecute = async () => {
    if (!files.length) return;
    setLoading(true);

    try {
      const output = await processPdfOperation({
        toolId: activeTool.id,
        files,
        splitPagesMeta: splitPages,
        compressQuality,
        password
      });
      setResult(output);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Gagal memproses dokumen');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
  };

  if (result) {
    return <ResultView result={result} onReset={handleReset} />;
  }

  const Icon = activeTool.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Main Studio Card Container */}
      <div className="glass-panel-deep rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Workspace Title & Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10 mb-8">
          <div className="flex items-start sm:items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border bg-gradient-to-br ${activeTool.gradient} flex-shrink-0 shadow-lg`}>
              <Icon size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400">
                  {activeTool.badge}
                </span>
                <span className="text-xs text-slate-500">Eksekusi Privat</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{activeTool.name}</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{activeTool.desc}</p>
            </div>
          </div>
        </div>

        {/* Studio Layout: 2 Columns (Kiri: Dropzone & Kontrol, Kanan: Preview Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Kolom Kiri: Dropzone & Settings Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card-interactive p-5 rounded-3xl border border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Layers size={14} className="text-sky-400" /> Masukkan Berkas
              </h3>
              <Dropzone tool={activeTool} onFilesAdded={handleFilesAdded} />
            </div>

            {/* Panel Pengaturan Khusus Fitur Tertentu */}
            {activeTool.id === 'compress' && (
              <div className="glass-card-interactive p-5 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sliders size={14} className="text-sky-400" /> Rasio Kualitas
                  </span>
                  <span className="text-xs font-black text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                    {compressQuality}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="90" 
                  value={compressQuality}
                  onChange={(e) => setCompressQuality(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <p className="text-[11px] text-slate-400">
                  Semakin rendah persentase, semakin drastis penurunan ukuran berkas.
                </p>
              </div>
            )}

            {activeTool.id === 'protect' && (
              <div className="glass-card-interactive p-5 rounded-3xl border border-white/10 space-y-3">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Shield size={14} className="text-purple-400" /> Sandi Rahasia Vault
                </label>
                <input 
                  type="password" 
                  placeholder="Ketik password dokumen di sini"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
                <p className="text-[11px] text-slate-400">
                  Sandi akan dienkripsi langsung ke metadata berkas PDF.
                </p>
              </div>
            )}

            {/* Tombol Eksekusi Berkas */}
            <button 
              onClick={handleExecute}
              disabled={!files.length || loading}
              className="btn-neon w-full py-4 px-6 rounded-2xl font-black text-xs text-white flex items-center justify-center gap-2 cursor-pointer transition uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-sky-500/20"
            >
              <Zap size={16} /> Proses & Tampilkan Hasil
            </button>
          </div>

          {/* Kolom Kanan: Preview Grid Canvas Luas */}
          <div className="lg:col-span-7">
            {files.length > 0 ? (
              <div className="glass-panel-deep p-6 rounded-3xl border border-white/10">
                <PreviewGrid 
                  toolId={activeTool.id}
                  files={files}
                  previews={previews}
                  splitPages={splitPages}
                  onReorderFiles={handleReorderFiles}
                  onRemoveFile={handleRemoveFile}
                  onToggleSplitPage={handleToggleSplitPage}
                />
              </div>
            ) : (
              <div className="border border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center min-h-[380px] bg-slate-950/30">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-4">
                  <Sparkles size={28} />
                </div>
                <h4 className="text-sm font-bold text-slate-300 mb-1">Kanvas Pratinjau Siap</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Masukkan berkas di panel sebelah kiri untuk menampilkan kartu pratinjau thumbnail visual di area ini.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {loading && <LoadingModal />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#060913] text-slate-100">
      {/* Background Animated Orbs */}
      <div className="fixed top-[-10%] left-[15%] w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[130px] orb-animate-1 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[10%] w-[650px] h-[650px] bg-indigo-600/15 rounded-full blur-[140px] orb-animate-2 pointer-events-none" />

      {/* Navbar */}
      <Navbar onReset={() => navigate('/')} />

      {/* Konten Halaman */}
      <main className="container mx-auto px-4 sm:px-6 py-8 flex-1 max-w-6xl relative z-10">
        <Routes>
          <Route 
            path="/" 
            element={
              <div>
                <HeroSection />
                <ToolCardGrid onSelectTool={(tool) => navigate(tool.path)} />
              </div>
            } 
          />
          <Route path="/:toolSlug" element={<ToolWorkspace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-white/5 relative z-10 gap-2">
        <p>© 2026 Veynkka CloudPDF Studio. Hak Cipta Dilindungi & Dirancang oleh <strong>Khevin</strong>.</p>
        <p className="text-[11px] text-slate-400">Dideploy di Infrastruktur Cloud Vercel Platform</p>
      </footer>
    </div>
  );
}