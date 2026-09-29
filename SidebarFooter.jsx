import React from 'react';
import { Compass, Mail } from 'lucide-react';

/**
 * SidebarFooter Component
 * 
 * Komponen pembatas bawah (sticky bottom footer) untuk Sidebar Utama WebGIS.
 * Menampilkan identitas pengguna "Evan", badge email "dermanevan@gmail.com",
 * ikon kompas spasial dengan status aktif, dan branding "Karsa Nusa 2026 • All Rights Reserved".
 */
export default function SidebarFooter() {
  return (
    <footer className="shrink-0 mt-auto border-t border-slate-800/80 bg-[#0b1329] backdrop-blur-md flex items-center gap-3 p-3 select-none">
      {/* 1. Ikon Profil (Kiri) */}
      <div className="rounded-lg bg-slate-800/80 border border-cyan-500/40 p-2 relative flex items-center justify-center shrink-0 shadow-sm shadow-cyan-500/10">
        <Compass className="w-5 h-5 text-cyan-400" />
        {/* Indikator Status: Hijau neon di sudut kanan atas bingkai */}
        <span 
          className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0b1329] shadow-sm shadow-emerald-400/50" 
          title="Status Aktif"
        />
      </div>

      {/* 2. Informasi Pengguna (Tengah/Kanan) */}
      <div className="min-w-0 flex-1">
        {/* Baris Atas: Nama Utama + Chip/Badge Email */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <span className="font-bold text-white text-sm tracking-wide shrink-0">
            Evan
          </span>
          <a
            href="mailto:dermanevan@gmail.com"
            className="bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1.5 transition-colors group max-w-full"
            title="Kirim email ke dermanevan@gmail.com"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-xs text-slate-300 font-mono group-hover:text-cyan-300 transition-colors truncate">
              dermanevan@gmail.com
            </span>
          </a>
        </div>

        {/* Baris Bawah: Teks Branding & Hak Cipta */}
        <p className="text-[11px] text-slate-400 font-sans tracking-wide mt-1 truncate hover:text-slate-300 transition-colors">
          Karsa Nusa 2026 • All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
