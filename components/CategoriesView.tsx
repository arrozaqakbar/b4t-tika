"use client";

import React, { useState, useMemo } from "react";
import { CustomerTicket, initialTickets } from "@/data/ticketsData";
import {
  Layers,
  Tag,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  FileQuestion,
  Building,
  User,
  ExternalLink,
  ShieldAlert,
  FolderTree,
} from "lucide-react";

interface CategoriesViewProps {
  tickets: CustomerTicket[];
  onSelectTicket: (ticket: CustomerTicket) => void;
}

export function CategoriesView({
  tickets,
  onSelectTicket,
}: CategoriesViewProps) {
  // Group by category and subcategory
  const categoryTree = useMemo(() => {
    const map: Record<
      string,
      {
        count: number;
        subCategories: Record<string, CustomerTicket[]>;
      }
    > = {};

    tickets.forEach((t) => {
      const cat = t.bidangLayanan || "Lainnya";
      const sub = t.subKategori || t.detailKebutuhan || "Umum";

      if (!map[cat]) {
        map[cat] = { count: 0, subCategories: {} };
      }
      map[cat].count += 1;

      if (!map[cat].subCategories[sub]) {
        map[cat].subCategories[sub] = [];
      }
      map[cat].subCategories[sub].push(t);
    });

    return map;
  }, [tickets]);

  const categories = Object.keys(categoryTree);
  const [selectedCat, setSelectedCat] = useState<string>(categories[0] || "");
  const [selectedSub, setSelectedSub] = useState<string>("Semua");

  const currentCategoryData = categoryTree[selectedCat];
  const subCategoryList = currentCategoryData
    ? Object.keys(currentCategoryData.subCategories)
    : [];

  const displayedTickets = useMemo(() => {
    if (!currentCategoryData) return [];
    if (selectedSub === "Semua") {
      const all: CustomerTicket[] = [];
      Object.values(currentCategoryData.subCategories).forEach((arr) => {
        all.push(...arr);
      });
      return all;
    }
    return currentCategoryData.subCategories[selectedSub] || [];
  }, [currentCategoryData, selectedSub]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mb-2">
          <FolderTree className="w-3.5 h-3.5 text-blue-700" />
          <span>Struktur Taksonomi Buku Tamu CS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Kategori & Sub-Kategori Pertanyaan Konsumen
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Eksplorasi pengelompokan pertanyaan, permohonan sertifikasi, kalibrasi,
          dan keluhan konsumen B4T berdasarkan bidang teknis.
        </p>
      </div>

      {/* Main Grid: Left category selector, Right detail list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Categories List */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">
            Pilih Bidang Layanan (Kategori)
          </div>
          {categories.map((cat) => {
            const isSelected = selectedCat === cat;
            const data = categoryTree[cat];
            const isComplaint = cat === "Keluhan" || cat === "Aduan";

            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCat(cat);
                  setSelectedSub("Semua");
                }}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    {isComplaint && (
                      <ShieldAlert
                        className={`w-4 h-4 ${
                          isSelected ? "text-red-200" : "text-red-500"
                        }`}
                      />
                    )}
                    <span className="font-bold text-xs sm:text-sm">{cat}</span>
                  </div>
                  <span
                    className={`text-[11px] block mt-0.5 ${
                      isSelected ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {Object.keys(data.subCategories).length} Sub Kategori
                  </span>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                    isSelected
                      ? "bg-blue-700 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {data.count}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Sub-Categories & Customer Questions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Sub-category pills */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-2">
              Sub Kategori Pada "{selectedCat}":
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSub("Semua")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSub === "Semua"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Semua ({currentCategoryData?.count || 0})
              </button>
              {subCategoryList.map((sub) => {
                const count = currentCategoryData.subCategories[sub].length;
                const isSelected = selectedSub === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => setSelectedSub(sub)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>{sub}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? "bg-blue-800 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of customer questions in this subcategory */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Menampilkan <strong>{displayedTickets.length}</strong> pertanyaan
                konsumen
              </span>
              <span>Klik kartu untuk melihat rincian & respon CS</span>
            </div>

            {displayedTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTicket(t)}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-blue-700 group-hover:underline">
                      {t.id}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs font-bold text-slate-900">
                      {t.sapaan} {t.nama}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {t.perusahaan || "Perorangan"}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.statusRespon === "Selesai"
                        ? "bg-emerald-100 text-emerald-800"
                        : t.statusRespon === "Sedang Diproses"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {t.statusRespon}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-blue-700 block uppercase mb-1">
                    Isi Pertanyaan Konsumen:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                    {t.pertanyaan}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="font-semibold text-slate-700">
                      Sub: {t.subKategori}
                    </span>
                    {t.kodeBooking && (
                      <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-semibold">
                        KB: {t.kodeBooking}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">
                      CS: <strong>{t.customerService || "-"}</strong>
                    </span>
                    <span className="text-blue-600 font-bold flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition-transform">
                      <span>Buka Card View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
