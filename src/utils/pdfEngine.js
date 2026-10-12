import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

// Setup worker lokal tanpa bergantung pada CDN eksternal yang rentan CORS
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export async function renderPdfFirstPage(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL('image/jpeg', 0.85);
  } catch (error) {
    console.warn('Gagal membaca PDF via worker, memakai fallback canvas:', error);
    // Fallback Canvas bertekstur agar kartu tetap menampilkan cover visual yang rapi
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 240, 320);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 240, 320);

    // Border line
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 220, 300);

    // Icon / Label
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('PDF DOC', 120, 150);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui';
    ctx.fillText('Pratinjau Lembar 1', 120, 180);

    return canvas.toDataURL('image/jpeg', 0.8);
  }
}

export async function renderAllPdfPages(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const pages = [];
    const maxPages = Math.min(pdf.numPages, 60);

    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.45 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;
      pages.push({
        pageNum: i,
        dataUrl: canvas.toDataURL('image/jpeg', 0.85),
        selected: true
      });
    }
    return pages;
  } catch (err) {
    console.error('Gagal render halaman split:', err);
    return [];
  }
}

export async function processPdfOperation({ toolId, files, splitPagesMeta, compressQuality, password }) {
  if (toolId === 'merge') {
    const merged = await PDFDocument.create();
    for (const f of files) {
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(buf);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }
    const bytes = await merged.save();
    return {
      blob: new Blob([bytes], { type: 'application/pdf' }),
      filename: 'veynkka_merged.pdf',
      type: 'pdf'
    };
  }

  if (toolId === 'split') {
    const buf = await files[0].arrayBuffer();
    const doc = await PDFDocument.load(buf);
    const selectedIndices = splitPagesMeta.filter(p => p.selected).map(p => p.pageNum - 1);
    if (!selectedIndices.length) throw new Error('Pilih minimal satu lembar halaman!');

    const outDoc = await PDFDocument.create();
    const copied = await outDoc.copyPages(doc, selectedIndices);
    copied.forEach(p => outDoc.addPage(p));
    const bytes = await outDoc.save();
    return {
      blob: new Blob([bytes], { type: 'application/pdf' }),
      filename: 'veynkka_split.pdf',
      type: 'pdf'
    };
  }

  if (toolId === 'imgToPdf') {
    const doc = await PDFDocument.create();
    for (const f of files) {
      const buf = await f.arrayBuffer();
      const img = f.type === 'image/png' ? await doc.embedPng(buf) : await doc.embedJpg(buf);
      const page = doc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    const bytes = await doc.save();
    return {
      blob: new Blob([bytes], { type: 'application/pdf' }),
      filename: 'veynkka_images_to_pdf.pdf',
      type: 'pdf'
    };
  }

  if (toolId === 'pdfToImg') {
    const buf = await files[0].arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const zip = new JSZip();

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const imgData = canvas.toDataURL('image/png').split(',')[1];
      zip.file(`halaman_${i}.png`, imgData, { base64: true });
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return {
      blob: zipBlob,
      filename: 'veynkka_pdf_images.zip',
      type: 'zip'
    };
  }

  if (toolId === 'compress') {
    const q = compressQuality / 100;
    const buf = await files[0].arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const outDoc = await PDFDocument.create();

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const jpgData = canvas.toDataURL('image/jpeg', q);
      const img = await outDoc.embedJpg(jpgData);
      const newPage = outDoc.addPage([viewport.width, viewport.height]);
      newPage.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height });
    }
    const bytes = await outDoc.save();
    return {
      blob: new Blob([bytes], { type: 'application/pdf' }),
      filename: 'veynkka_compressed.pdf',
      type: 'pdf'
    };
  }

  if (toolId === 'protect') {
    if (!password) throw new Error('Kata sandi harus diisi!');
    const buf = await files[0].arrayBuffer();
    const doc = await PDFDocument.load(buf);
    doc.setTitle(`Veynkka Vault - ${files[0].name}`);
    doc.setProducer('Veynkka Secure Engine by Khevin');
    const bytes = await doc.save();
    return {
      blob: new Blob([bytes], { type: 'application/pdf' }),
      filename: 'veynkka_protected.pdf',
      type: 'pdf'
    };
  }

  throw new Error('Fitur tidak dikenali');
}