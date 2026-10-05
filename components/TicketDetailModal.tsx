"use client";

import React, { useState, useEffect } from "react";
import { CustomerTicket } from "@/data/ticketsData";
import {
  X,
  MessageCircle,
  Mail,
  Building,
  User,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Copy,
  ExternalLink,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  FileText,
  BadgeCheck,
} from "lucide-react";

interface TicketDetailModalProps {
  ticket: CustomerTicket | null;
  onClose: () => void;
  onUpdateTicket: (updated: CustomerTicket) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function TicketDetailModal({
  ticket,
  onClose,
  onUpdateTicket,
  onNavigatePrev,
  onNavigateNext,
  hasPrev,
  hasNext,
}: TicketDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<
    "Belum Ditangani" | "Sedang Diproses" | "Selesai"
  >("Belum Ditangani");
  const [currentCS, setCurrentCS] = useState<string>("Akbar");
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (ticket) {
      setCurrentStatus(ticket.statusRespon);
      setCurrentCS(ticket.customerService || "Akbar");
      setCurrentResponse(ticket.responCS || "");
      setSavedSuccess(false);
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleSave = () => {
    const updated: CustomerTicket = {
      ...ticket,
      statusRespon: currentStatus,
      customerService: currentCS,
      responCS: currentResponse,
    };
    onUpdateTicket(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const cleanPhone = ticket.nomorWA.replace(/[^0-9]/g, "");
  const waNumber = cleanPhone.startsWith("0")
    ? "62" + cleanPhone.slice(1)
    : cleanPhone.startsWith("62")
    ? cleanPhone
    : "62" + cleanPhone;

  const handleCopyQuestion = () => {
    navigator.clipboard.writeText(ticket.pertanyaan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Selesai":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Selesai Ditangani
          </span>
        );
      case "Sedang Diproses":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Sedang Diproses
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Belum Ditangani
          </span>
        );
    }
  };

  const isComplaint =
    ticket.bidangLayanan === "Keluhan" ||
    ticket.bidangLayanan === "Aduan" ||
    Boolean(ticket.jenisKeluhan);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm tracking-tight text-white shadow-sm">
              TX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg font-mono tracking-wide text-cyan-300">
                  {ticket.id}
                </h3>
                {isComplaint && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-red-400" />
                    {ticket.bidangLayanan}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Diterima pada: {ticket.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onNavigatePrev && (
              <button
                onClick={onNavigatePrev}
                disabled={!hasPrev}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Tiket Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {onNavigateNext && (
              <button
                onClick={onNavigateNext}
                disabled={!hasNext}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Tiket Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 ml-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Status and Action Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Status Saat Ini:
              </span>
              {getStatusBadge(ticket.statusRespon)}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(
                  ticket.sapaan + " " + ticket.nama
                )}%2C%20saya%20dari%20Customer%20Service%20B4T%20(BBSPJIBBT)%20Bandung%20menindaklanjuti%20pertanyaan%20Anda%20dengan%20nomor%20tiket%20${
                  ticket.id
                }.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Balas via WA ({ticket.nomorWA})</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              {ticket.email && ticket.email !== "-" && (
                <a
                  href={`mailto:${ticket.email}?subject=Tanggapan%20Tiket%20B4T%20${ticket.id}&body=Yth.%20${ticket.sapaan}%20${ticket.nama}%2C%0A%0ATerkait%20pertanyaan%20Anda%20pada%20layanan%20B4T%20Bandung%3A`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Kirim Email</span>
                </a>
              )}
            </div>
          </div>

          {/* Customer Profile Grid */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Profil & Kontak Konsumen</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Nama Pelanggan</span>
                <span className="text-slate-900 font-bold text-sm">
                  {ticket.sapaan} {ticket.nama}
                </span>
                <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {ticket.jenisPenanya}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Perusahaan / Instansi</span>
                <span className="text-slate-900 font-bold text-sm flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{ticket.perusahaan || "Perorangan"}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Nomor WhatsApp</span>
                <span className="text-slate-900 font-mono font-bold text-sm">
                  {ticket.nomorWA}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Email</span>
                <span className="text-slate-800 font-mono text-xs break-all">
                  {ticket.email || "-"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Sumber Informasi</span>
                <span className="text-slate-800 font-medium">
                  {ticket.sumberInfo || "-"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Status Pelanggan</span>
                <span
                  className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] ${
                    ticket.pertamaKali === "Tidak"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {ticket.pertamaKali === "Tidak"
                    ? "Pelanggan Lama (Repeat)"
                    : "Pelanggan Baru (Pertama Kali)"}
                </span>
              </div>
            </div>
          </div>

          {/* Category & Service Classification */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>Klasifikasi Layanan & Kebutuhan</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Bidang Layanan (Kategori)</span>
                <span className="font-bold text-blue-800 text-sm">
                  {ticket.bidangLayanan}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Sub Kategori</span>
                <span className="font-semibold text-slate-900">
                  {ticket.subKategori || "-"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Detail Kebutuhan</span>
                <span className="font-semibold text-slate-900">
                  {ticket.detailKebutuhan || "-"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Kode Booking / No. VA</span>
                <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-300 inline-block">
                  {ticket.kodeBooking || "-"}
                </span>
              </div>
            </div>

            {ticket.jenisKeluhan && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold text-red-600 uppercase">
                  Jenis Aduan / Keluhan:
                </span>
                <p className="text-xs font-bold text-red-800 mt-0.5">
                  {ticket.jenisKeluhan}
                </p>
              </div>
            )}
          </div>

          {/* The Customer's Question (CORE FOCUS) */}
          <div className="bg-gradient-to-br from-blue-50/70 to-slate-50 p-5 rounded-2xl border-2 border-blue-200 shadow-sm relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">
                  Pertanyaan / Keterangan dari Konsumen
                </h4>
              </div>
              <button
                onClick={handleCopyQuestion}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1 shadow-2xs transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Tersalin!" : "Salin Teks"}</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-inner">
              <p className="text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                {ticket.pertanyaan || "(Tidak ada rincian pertanyaan tambahan)"}
              </p>
            </div>
          </div>

          {/* Customer Service Follow-up Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              <span>Tindak Lanjut & Respon Petugas Customer Service</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ubah Status Respon Tiket
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) =>
                    setCurrentStatus(
                      e.target.value as
                        | "Belum Ditangani"
                        | "Sedang Diproses"
                        | "Selesai"
                    )
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Belum Ditangani">Belum Ditangani</option>
                  <option value="Sedang Diproses">Sedang Diproses</option>
                  <option value="Selesai">Selesai (Sudah Dijawab)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Petugas CS Penanggung Jawab
                </label>
                <select
                  value={currentCS}
                  onChange={(e) => setCurrentCS(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Akbar">Akbar</option>
                  <option value="Lia">Lia</option>
                  <option value="Nurul">Nurul</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Auliya">Auliya</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Respon dari Customer Service
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan jawaban yang telah disampaikan ke konsumen, disposisi ke laboratorium, nomor surat balasan, atau keterangan follow-up..."
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none focus:bg-white leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                {savedSuccess && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Data tiket berhasil diperbarui!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Tutup
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
