import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export default function Dropzone({ tool, onFilesAdded }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
  };

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${
        isDragOver 
          ? 'border-sky-400 bg-sky-500/10 scale-[1.01]' 
          : 'border-slate-700/80 hover:border-sky-400/60 bg-slate-900/50 hover:bg-slate-900/80'
      }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 mb-3 ${
        isDragOver ? 'bg-sky-500 text-white scale-110' : 'bg-white/5 text-slate-400 group-hover:text-sky-400 group-hover:scale-110'
      }`}>
        <Upload size={26} />
      </div>
      <span className="text-sm font-bold text-slate-200">
        {isDragOver ? 'Lepaskan Berkas di Sini!' : 'Tarik & Lepas File dari Komputer ke Sini'}
      </span>
      <span className="text-xs text-slate-400 mt-1">atau klik untuk membuka File Explorer</span>
      <span className="text-[11px] text-sky-400 font-medium mt-2 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
        {tool.limitText}
      </span>
      <input 
        type="file" 
        accept={tool.accept} 
        multiple={tool.multiple}
        onChange={handleInputChange}
        className="hidden" 
      />
    </label>
  );
}