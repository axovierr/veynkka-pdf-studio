import React, { useState } from 'react';
import { GripVertical, Trash2, Check, FileText } from 'lucide-react';

export default function PreviewGrid({ 
  toolId, 
  files, 
  previews, 
  splitPages, 
  onReorderFiles, 
  onRemoveFile, 
  onToggleSplitPage 
}) {
  const [draggedIdx, setDraggedIdx] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    onReorderFiles(draggedIdx, targetIdx);
    setDraggedIdx(null);
  };

  // 1. GRID KARTU PERSEGI 1:1 (MERGE & IMAGE TO PDF)
  if (toolId === 'merge' || toolId === 'imgToPdf') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Pratinjau Berkas ({files.length})
            </h4>
          </div>
          <span className="text-[11px] text-sky-400 font-medium bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
            Tahan & Geser Kartu untuk Mengatur Urutan
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-3 bg-slate-950/60 rounded-3xl border border-white/5 shadow-inner">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              className={`group relative aspect-square rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-300 border cursor-grab active:cursor-grabbing backdrop-blur-xl ${
                draggedIdx === idx 
                  ? 'border-sky-400 bg-sky-500/20 scale-95 shadow-2xl shadow-sky-500/30 ring-2 ring-sky-400/50' 
                  : 'bg-slate-900/70 border-white/10 hover:border-sky-400/50 hover:bg-slate-800/80 hover:-translate-y-1 hover:shadow-xl'
              }`}
            >
              {/* Header Kartu: Badge Nomor & Tombol Hapus */}
              <div className="flex items-center justify-between z-10">
                <span className="w-6 h-6 rounded-lg bg-slate-950/80 border border-sky-400/40 text-sky-400 text-[11px] font-black flex items-center justify-center shadow-md">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemoveFile(idx); }}
                  className="w-6 h-6 rounded-lg bg-slate-950/80 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 border border-white/10 flex items-center justify-center transition shadow-md"
                  title="Hapus berkas"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {/* Area Gambar 1:1 Tengah */}
              <div className="absolute inset-2.5 rounded-xl bg-slate-950/80 border border-white/5 overflow-hidden flex items-center justify-center shadow-inner">
                {previews[idx] ? (
                  <img 
                    src={previews[idx]} 
                    alt={`Preview ${file.name}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-600 gap-1">
                    <FileText size={28} className="text-sky-400/60 animate-pulse" />
                    <span className="text-[10px] font-mono">Memuat...</span>
                  </div>
                )}

                {/* Overlay Hover Geser */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                  <p className="text-[11px] font-bold text-white truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-sky-300 font-mono mt-0.5">
                    <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    <span className="flex items-center gap-0.5"><GripVertical size={11} /> Geser</span>
                  </div>
                </div>
              </div>

              {/* Label Bawah Default (Saat Tidak Hover) */}
              <div className="z-10 mt-auto bg-slate-950/85 backdrop-blur-md rounded-lg px-2 py-1 border border-white/5 group-hover:opacity-0 transition-opacity">
                <p className="text-[10px] font-semibold text-slate-200 truncate">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. GRID KARTU PERSEGI 1:1 (SPLIT PDF)
  if (toolId === 'split' && splitPages.length > 0) {
    const selectedCount = splitPages.filter(p => p.selected).length;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Pilih Lembar Halaman
            </h4>
            <p className="text-[11px] text-slate-400">Klik kartu persegi untuk memilih atau membatalkan.</p>
          </div>
          <span className="text-[11px] text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            {selectedCount} dari {splitPages.length} Dipilih
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 max-h-[500px] overflow-y-auto p-3 bg-slate-950/60 rounded-3xl border border-white/5 shadow-inner">
          {splitPages.map((page, idx) => (
            <div
              key={idx}
              onClick={() => onToggleSplitPage(idx)}
              className={`group relative aspect-square rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 transform p-2 flex flex-col justify-between ${
                page.selected 
                  ? 'border-indigo-400 bg-indigo-500/15 ring-2 ring-indigo-400/40 shadow-lg shadow-indigo-500/20 scale-[1.02]' 
                  : 'border-slate-800/80 bg-slate-900/40 opacity-40 hover:opacity-80 grayscale'
              }`}
            >
              <div className="absolute inset-2 rounded-xl bg-white overflow-hidden flex items-center justify-center">
                <img src={page.dataUrl} alt={`Halaman ${page.pageNum}`} className="w-full h-full object-cover" />
              </div>

              {/* Status Header */}
              <div className="relative z-10 flex justify-between items-center pointer-events-none w-full">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-950/90 text-white border border-white/10 shadow">
                  Hal {page.pageNum}
                </span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition shadow-md ${
                  page.selected ? 'bg-indigo-500 text-white' : 'bg-slate-900/90 text-transparent border border-white/20'
                }`}>
                  <Check size={12} className={page.selected ? 'opacity-100' : 'opacity-0'} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. KARTU RINGKASAN UNTUK KOMPRESI, PASSWORD, & PDF TO IMG
  return (
    <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center justify-between shadow-inner">
      <div className="flex items-center gap-3.5 truncate max-w-[80%]">
        <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
          <FileText size={22} />
        </div>
        <div className="truncate">
          <p className="text-sm font-bold text-slate-100 truncate">{files[0]?.name}</p>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Ukuran: {(files[0]?.size / (1024 * 1024)).toFixed(2)} MB • Berkas Terkonfirmasi
          </p>
        </div>
      </div>
      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
        Siap Dieksekusi
      </span>
    </div>
  );
}