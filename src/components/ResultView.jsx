import React from 'react';
import { Download, ExternalLink, RotateCcw, CheckCircle2, FileText, ArrowLeft } from 'lucide-react';

export default function ResultView({ result, onReset }) {
  const fileUrl = URL.createObjectURL(result.blob);
  const fileSizeMb = (result.blob.size / (1024 * 1024)).toFixed(2);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <button 
        onClick={onReset}
        className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 text-xs font-medium transition"
      >
        <ArrowLeft size={14} /> Proses Dokumen Lainnya
      </button>

      <div className="glass-panel-deep rounded-3xl p-8 border border-white/10 shadow-2xl text-center">
        {/* Success Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/15">
          <CheckCircle2 size={32} />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
          Dokumen Berhasil Diproses!
        </h2>
        <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto mb-8">
          Veynkka Engine telah selesai menyusun file Anda secara privat di RAM browser. Silakan periksa pratinjau sebelum mengunduh.
        </p>

        {/* Card Info Berkas Hasil */}
        <div className="glass-card-interactive p-4 rounded-2xl flex items-center justify-between mb-8 max-w-md mx-auto text-left">
          <div className="flex items-center gap-3 truncate">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 flex-shrink-0">
              <FileText size={20} />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{result.filename}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Ukuran Output: {fileSizeMb} MB</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
            Siap Unduh
          </span>
        </div>

        {/* Pratinjau PDF Embedded Jika Tipe PDF */}
        {result.type === 'pdf' && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-96 shadow-2xl">
            <iframe 
              src={`${fileUrl}#toolbar=0`} 
              className="w-full h-full" 
              title="PDF Preview"
            />
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleDownload}
            className="btn-neon w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-2"
          >
            <Download size={16} /> Unduh Berkas Sekarang
          </button>

          {result.type === 'pdf' && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="glass-card w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-xs text-slate-300 hover:text-white flex items-center justify-center gap-2"
            >
              <ExternalLink size={15} /> Buka Tab Baru
            </a>
          )}

          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2 hover:bg-white/5 transition"
          >
            <RotateCcw size={15} /> Ulangi
          </button>
        </div>
      </div>
    </div>
  );
}