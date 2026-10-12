import { Files, Scissors, Image as ImageIcon, FileImage, Minimize2, Lock } from 'lucide-react';

export const HIGHLIGHT_CARDS = [
  { title: "Kapasitas Raksasa", desc: "Mendukung PDF hingga 100 MB dan Gambar 50 MB langsung di browser", tag: "100 MB Limit" },
  { title: "Privasi Absolut", desc: "100% Client-side. Dokumen tidak pernah tersimpan di server luar", tag: "Zero Server" },
  { title: "Merge 500 Berkas", desc: "Kapasitas gabung hingga 500 file secara bersamaan dan berurutan", tag: "Multi Batch" },
  { title: "Enkripsi Cepat", desc: "Amankan PDF sensitif dengan kunci sandi dan metadata instan", tag: "Vault Aman" },
  { title: "Render Resolusi Tinggi", desc: "Ekstrak setiap lembar menjadi gambar PNG jernih dalam bundel ZIP", tag: "HD Render" },
  { title: "Serverless Cloud", desc: "Didistribusikan di jaringan Vercel Edge Network berkecepatan tinggi", tag: "Vercel PaaS" },
];

export const TOOLS = [
  {
    id: 'merge',
    path: '/merge-pdf',
    name: 'Gabungkan PDF',
    badge: 'Maks 500 Berkas',
    desc: 'Satukan ratusan berkas PDF. Susun urutan kartu preview dengan drag-and-drop antar grid.',
    icon: Files,
    accept: '.pdf',
    multiple: true,
    limitText: 'Maks 500 file (Maks 100 MB per file)',
    gradient: 'from-sky-500/20 to-blue-600/20 border-sky-500/30 text-sky-400'
  },
  {
    id: 'split',
    path: '/split-pdf',
    name: 'Pisahkan PDF',
    badge: 'Visual Page Picker',
    desc: 'Lihat grid kartu lembar halaman dan klik kartu untuk memilih halaman yang diekstrak.',
    icon: Scissors,
    accept: '.pdf',
    multiple: false,
    limitText: '1 Berkas PDF (Maks 100 MB)',
    gradient: 'from-indigo-500/20 to-purple-600/20 border-indigo-500/30 text-indigo-400'
  },
  {
    id: 'imgToPdf',
    path: '/img-to-pdf',
    name: 'Gambar ke PDF',
    badge: 'JPG, PNG, WebP',
    desc: 'Ubah galeri foto resolusi tinggi menjadi 1 lembaran PDF rapi dengan susunan kartu.',
    icon: ImageIcon,
    accept: 'image/*',
    multiple: true,
    limitText: 'JPG, PNG, WebP (Maks 50 MB / gambar)',
    gradient: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30 text-emerald-400'
  },
  {
    id: 'pdfToImg',
    path: '/pdf-to-img',
    name: 'PDF ke Gambar',
    badge: 'Ekstrak PNG ZIP',
    desc: 'Render setiap lembar halaman dokumen PDF menjadi kumpulan gambar resolusi tinggi.',
    icon: FileImage,
    accept: '.pdf',
    multiple: false,
    limitText: '1 Berkas PDF (Maks 100 MB)',
    gradient: 'from-amber-500/20 to-orange-600/20 border-amber-500/30 text-amber-400'
  },
  {
    id: 'compress',
    path: '/compress-pdf',
    name: 'Kompresi PDF',
    badge: 'Slider Kualitas',
    desc: 'Kecilkan ukuran dokumen menggunakan slider rasio kompresi custom sesuai target Anda.',
    icon: Minimize2,
    accept: '.pdf',
    multiple: false,
    limitText: '1 Berkas PDF (Maks 100 MB)',
    gradient: 'from-rose-500/20 to-pink-600/20 border-rose-500/30 text-rose-400'
  },
  {
    id: 'protect',
    path: '/protect-pdf',
    name: 'Proteksi Sandi PDF',
    badge: 'Enkripsi Vault',
    desc: 'Kunci berkas penting dengan password rahasia sebelum didistribusikan ke publik.',
    icon: Lock,
    accept: '.pdf',
    multiple: false,
    limitText: '1 Berkas PDF (Maks 100 MB)',
    gradient: 'from-purple-500/20 to-fuchsia-600/20 border-purple-500/30 text-purple-400'
  }
];