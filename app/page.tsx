"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CustomerServicePortal } from "@/components/CustomerServicePortal";
import { CategoriesView } from "@/components/CategoriesView";
import { TicketDetailModal } from "@/components/TicketDetailModal";
import { initialTickets, CustomerTicket } from "@/data/ticketsData";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("tickets");
  const [tickets, setTickets] = useState<CustomerTicket[]>(initialTickets);
  const [selectedTicketFromCategory, setSelectedTicketFromCategory] =
    useState<CustomerTicket | null>(null);

  const handleUpdateTicket = (updated: CustomerTicket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    setSelectedTicketFromCategory(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Area */}
      <main className="flex-1">
        {activeTab === "tickets" && <CustomerServicePortal />}

        {activeTab === "categories" && (
          <CategoriesView
            tickets={tickets}
            onSelectTicket={(t) => setSelectedTicketFromCategory(t)}
          />
        )}
      </main>

      {/* Detail Card View for category drilldown */}
      <TicketDetailModal
        ticket={selectedTicketFromCategory}
        onClose={() => setSelectedTicketFromCategory(null)}
        onUpdateTicket={handleUpdateTicket}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
