import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B4T TIKA - Sistem Layanan & Ekstraksi Dokumen B4T",
  description:
    "Platform terpadu layanan pengujian, kalibrasi, sertifikasi SNI, tracking permohonan, dan analisis ekstraksi metadata dokumen Balai Besar Bahan dan Barang Teknik Kementerian Perindustrian RI.",
  openGraph: {
    title: "B4T TIKA - Sistem Layanan & Ekstraksi Dokumen B4T",
    description:
      "Platform terpadu layanan pengujian, kalibrasi, sertifikasi SNI, tracking permohonan, dan analisis ekstraksi metadata dokumen Balai Besar Bahan dan Barang Teknik Kementerian Perindustrian RI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
