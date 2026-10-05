"use client";

import React, { useState, useMemo } from "react";
import { CustomerTicket, initialTickets } from "@/data/ticketsData";
import { TicketDetailModal } from "@/components/TicketDetailModal";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageCircle,
  Building,
  User,
  Plus,
  RefreshCw,
  Download,
  ShieldAlert,
  HelpCircle,
  BarChart3,
  Layers,
  ChevronRight,
  Phone,
  Mail,
  ArrowUpDown,
} from "lucide-react";

export function CustomerServicePortal() {
  const [tickets, setTickets] = useState<CustomerTicket[]>(initialTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("Semua");
  const [selectedCS, setSelectedCS] = useState<string>("Semua");
  const [selectedTicket, setSelectedTicket] = useState<CustomerTicket | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"list" | "analytics">("list");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    tickets.forEach((t) => {
      if (t.bidangLayanan) set.add(t.bidangLayanan);
    });
    return ["Semua", ...Array.from(set)];
  }, [tickets]);

  // Unique subcategories
  const subCategories = useMemo(() => {
    const set = new Set<string>();
    tickets.forEach((t) => {
      if (
        selectedCategory === "Semua" ||
        t.bidangLayanan === selectedCategory
      ) {
        if (t.subKategori) set.add(t.subKategori);
      }
    });
    return ["Semua", ...Array.from(set)];
  }, [tickets, selectedCategory]);

  // CS officers list
  const csOfficers = ["Semua", "Akbar", "Lia", "Nurul", "Sandy", "Auliya"];

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        // Status filter
        if (selectedStatus !== "Semua" && t.statusRespon !== selectedStatus) {
          return false;
        }

        // Category filter
        if (selectedCategory !== "Semua" && t.bidangLayanan !== selectedCategory) {
          return false;
        }

        // Subcategory filter
        if (
          selectedSubCategory !== "Semua" &&
          t.subKategori !== selectedSubCategory
        ) {
          return false;
        }

        // CS filter
        if (selectedCS !== "Semua" && t.customerService !== selectedCS) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = t.id.toLowerCase().includes(q);
          const matchName = t.nama.toLowerCase().includes(q);
          const matchPerusahaan = t.perusahaan.toLowerCase().includes(q);
          const matchWA = t.nomorWA.includes(q);
          const matchQuestion = t.pertanyaan.toLowerCase().includes(q);
          const matchBooking = t.kodeBooking?.toLowerCase().includes(q);
          return (
            matchId ||
            matchName ||
            matchPerusahaan ||
            matchWA ||
            matchQuestion ||
            matchBooking
          );
        }

        return true;
      })
      .sort((a, b) => {
        return sortOrder === "desc"
          ? b.id.localeCompare(a.id)
          : a.id.localeCompare(b.id);
      });
  }, [
    tickets,
    selectedStatus,
    selectedCategory,
    selectedSubCategory,
    selectedCS,
    searchQuery,
    sortOrder,
  ]);

  // Summary counts
  const totalCount = tickets.length;
  const pendingCount = tickets.filter(
    (t) => t.statusRespon === "Belum Ditangani"
  ).length;
  const inProgressCount = tickets.filter(
    (t) => t.statusRespon === "Sedang Diproses"
  ).length;
  const solvedCount = tickets.filter(
    (t) => t.statusRespon === "Selesai"
  ).length;
  const complaintCount = tickets.filter(
    (t) =>
      t.bidangLayanan === "Keluhan" ||
      t.bidangLayanan === "Aduan" ||
      Boolean(t.jenisKeluhan)
  ).length;

  const handleUpdateTicket = (updated: CustomerTicket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    setSelectedTicket(updated);
  };

  // Navigation inside modal
  const currentIndex = selectedTicket
    ? filteredTickets.findIndex((t) => t.id === selectedTicket.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext =
    currentIndex >= 0 && currentIndex < filteredTickets.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setSelectedTicket(filteredTickets[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setSelectedTicket(filteredTickets[currentIndex + 1]);
    }
  };

  const exportCSV = () => {
    const headers = [
      "TX Number",
      "Timestamp",
      "Nama Pelanggan",
      "Perusahaan",
      "Nomor WA",
      "Kategori",
      "Sub Kategori",
      "Pertanyaan",
      "Status Respon",
      "Customer Service",
      "Respon CS",
    ];

    const rows = filteredTickets.map((t) => [
      t.id,
      t.timestamp,
      `"${t.nama.replace(/"/g, '""')}"`,
      `"${t.perusahaan.replace(/"/g, '""')}"`,
      t.nomorWA,
      `"${t.bidangLayanan.replace(/"/g, '""')}"`,
      `"${t.subKategori.replace(/"/g, '""')}"`,
      `"${t.pertanyaan.replace(/"/g, '""')}"`,
      t.statusRespon,
      t.customerService,
      `"${(t.responCS || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `buku_tamu_b4t_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / App Title */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30">
              B4T TIKA v0.1 • Aplikasi Internal CS
            </span>
            <span className="text-xs text-slate-400">
              Buku Tamu Konsumen & Rekap WhatsApp
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Buku Tamu & Tiket Layanan Konsumen B4T
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Pusat penanganan pertanyaan teknis, aduan, pengecualian SNI, kalibrasi,
            revisi LHU, dan kendala pembayaran PNBP Balai Besar Bahan dan Barang Teknik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div
          onClick={() => setSelectedStatus("Semua")}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            selectedStatus === "Semua"
              ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">Total Tiket</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalCount}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Semua rekaman tamu</span>
        </div>

        <div
          onClick={() => setSelectedStatus("Belum Ditangani")}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            selectedStatus === "Belum Ditangani"
              ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-700">Belum Ditangani</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">{pendingCount}</div>
          <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">
            Memerlukan respon CS
          </span>
        </div>

        <div
          onClick={() => setSelectedStatus("Sedang Diproses")}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            selectedStatus === "Sedang Diproses"
              ? "bg-cyan-50 border-cyan-500 ring-2 ring-cyan-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-cyan-800">Sedang Diproses</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-cyan-800">{inProgressCount}</div>
          <span className="text-[11px] text-cyan-600 font-medium mt-0.5 block">
            Koordinasi lab / pemohon
          </span>
        </div>

        <div
          onClick={() => setSelectedStatus("Selesai")}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            selectedStatus === "Selesai"
              ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-800">Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800">{solvedCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
            Tuntas dijawab
          </span>
        </div>

        <div
          onClick={() => {
            setSelectedCategory("Keluhan");
            setSelectedStatus("Semua");
          }}
          className={`cursor-pointer p-4 rounded-2xl border transition-all col-span-2 lg:col-span-1 ${
            selectedCategory === "Keluhan"
              ? "bg-red-50 border-red-500 ring-2 ring-red-500/20 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-red-700">Keluhan & Aduan</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700">{complaintCount}</div>
          <span className="text-[11px] text-red-600 font-medium mt-0.5 block">
            LHU, TTE, billing expired
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Main Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci pertanyaan, nama pelanggan, instansi, nomor WA, kode TX..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all"
            title="Ubah Urutan"
          >
            <ArrowUpDown className="w-4 h-4 text-slate-600" />
            <span>{sortOrder === "desc" ? "Tiket Terbaru" : "Tiket Terlama"}</span>
          </button>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Kategori (Bidang Layanan)
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory("Semua");
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Sub Kategori
            </label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {subCategories.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Status Respon
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Semua">Semua Status</option>
              <option value="Belum Ditangani">Belum Ditangani</option>
              <option value="Sedang Diproses">Sedang Diproses</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Customer Service
            </label>
            <select
              value={selectedCS}
              onChange={(e) => setSelectedCS(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {csOfficers.map((cs) => (
                <option key={cs} value={cs}>
                  {cs === "Semua" ? "Semua Petugas CS" : `CS ${cs}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary and Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div>
            Menampilkan <strong className="text-slate-900 font-bold">{filteredTickets.length}</strong> dari{" "}
            {totalCount} total tiket
          </div>
          {(searchQuery ||
            selectedStatus !== "Semua" ||
            selectedCategory !== "Semua" ||
            selectedSubCategory !== "Semua" ||
            selectedCS !== "Semua") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("Semua");
                setSelectedCategory("Semua");
                setSelectedSubCategory("Semua");
                setSelectedCS("Semua");
              }}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Main List of Tickets (Interactive Table / List View) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">No. Tiket & Tanggal</th>
                <th className="p-3.5">Konsumen & Instansi</th>
                <th className="p-3.5">Kategori & Sub Kategori</th>
                <th className="p-3.5 min-w-[260px]">Pertanyaan / Aduan Konsumen</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">CS</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-sm text-slate-700">
                      Tidak ada tiket yang cocok dengan kriteria pencarian
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Coba ganti kata kunci atau ubah pengaturan filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => {
                  const cleanPhone = t.nomorWA.replace(/[^0-9]/g, "");
                  const waNumber = cleanPhone.startsWith("0")
                    ? "62" + cleanPhone.slice(1)
                    : cleanPhone.startsWith("62")
                    ? cleanPhone
                    : "62" + cleanPhone;

                  const isComplaint =
                    t.bidangLayanan === "Keluhan" ||
                    t.bidangLayanan === "Aduan" ||
                    Boolean(t.jenisKeluhan);

                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className="hover:bg-blue-50/60 cursor-pointer transition-colors group"
                    >
                      {/* TX & Time */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-blue-700 group-hover:underline block">
                          {t.id}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {t.timestamp.split(" ")[0]}
                        </span>
                      </td>

                      {/* Customer Name & Company */}
                      <td className="p-3.5 max-w-[200px]">
                        <div className="font-bold text-slate-900 line-clamp-1">
                          {t.sapaan} {t.nama}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 line-clamp-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{t.perusahaan || "Perorangan"}</span>
                        </div>
                      </td>

                      {/* Category & Subcategory */}
                      <td className="p-3.5 max-w-[180px]">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            isComplaint
                              ? "bg-red-100 text-red-800"
                              : t.bidangLayanan === "Hasil Pengujian"
                              ? "bg-purple-100 text-purple-800"
                              : t.bidangLayanan === "Sertifikasi"
                              ? "bg-emerald-100 text-emerald-800"
                              : t.bidangLayanan === "Billing (Invoice/Kuitansi)"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {t.bidangLayanan}
                        </span>
                        <div className="text-[11px] font-medium text-slate-600 line-clamp-1 mt-1">
                          {t.subKategori || t.detailKebutuhan || "-"}
                        </div>
                      </td>

                      {/* Question excerpt */}
                      <td className="p-3.5 max-w-[320px]">
                        <p className="text-slate-800 line-clamp-2 leading-relaxed">
                          {t.pertanyaan}
                        </p>
                        {t.responCS && (
                          <div className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1 line-clamp-1">
                            <span className="font-semibold">Respon:</span>
                            <span className="italic">{t.responCS}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3.5 whitespace-nowrap">
                        {t.statusRespon === "Selesai" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Selesai
                          </span>
                        ) : t.statusRespon === "Sedang Diproses" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            <Clock className="w-3 h-3 text-blue-600" />
                            Diproses
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            Belum
                          </span>
                        )}
                      </td>

                      {/* CS */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {t.customerService || "-"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="p-3.5 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(
                              t.sapaan + " " + t.nama
                            )}%2C%20terkait%20tiket%20layanan%20B4T%20${t.id}%3A`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all"
                            title="Hubungi via WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => setSelectedTicket(t)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition-all"
                            title="Buka Detail Card View"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Card View */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdateTicket={handleUpdateTicket}
        onNavigatePrev={handlePrev}
        onNavigateNext={handleNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
    </div>
  );
}
