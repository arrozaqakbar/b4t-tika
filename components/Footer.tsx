"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Headphones,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              B4T
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-tight block">
                B4T - TIKA (Customer Service Portal)
              </span>
              <span className="text-[11px] text-slate-500">
                Balai Besar Standardisasi dan Pelayanan Jasa Industri Bahan dan Barang Teknik
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span>Jl. Sangkuriang No. 14 Bandung</span>
            <span>•</span>
            <span>Telp: (022) 2504088</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-400 font-mono font-bold">
              v0.1.1
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
