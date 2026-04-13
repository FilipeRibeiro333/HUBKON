"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
// ✅ AJUSTADO: Sobe dois níveis para sair de app/dashboard e chegar na raiz services
import api from "../../services/api"; 

import { ShieldCheck, Wallet, Lock, Eye, EyeOff, Building2, Users, ChevronRight } from "lucide-react";

/**
 * HUBKON TERMINAL - B2B DASHBOARD V.0.3.3
 * Version: FULLY INTERACTIVE - All cards and badges are now actionable.
 */
export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then(res => {
        setDashboardData(res.data.data);
      })
      .catch(err => console.error("Critical: Dashboard Sync Failed", err));
  }, []);

  if (!dashboardData) return (
    <div className="h-screen bg-[#080c14] flex flex-col items-center justify-center text-emerald-500 font-mono italic">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500 mb-4"></div>
      SYNCHRONIZING SECURE LEDGER...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200 p-8 font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Hubkon <span className="text-emerald-500">Terminal</span>
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">
            <Building2 size={12} className="text-emerald-500" />
            {dashboardData.companyName || "Hubkon Global Business"}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 🚀 OPERATOR ACCESS - Agora clicável (Configurações/Perfil) */}
          <div 
            onClick={() => router.push("/settings")}
            className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-5 py-2 rounded-full shadow-lg cursor-pointer hover:border-emerald-500 transition-all active:scale-95 group"
          >
            <ShieldCheck className="text-emerald-500 w-4 h-4 group-hover:animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              OPERATOR ACCESS
            </span>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* 🚀 LIQUIDITY CARD - Agora interativo (Leva para Carteira/Wallet) */}
        <div 
          onClick={(e) => {
            // Evita navegar se o utilizador clicar apenas no botão de ver/esconder
            if (e.target.closest('button')) return;
            router.push("/wallet");
          }}
          className="group bg-slate-900 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden shadow-2xl transition-all cursor-pointer hover:border-emerald-500/50 active:scale-[0.98]"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Wallet size={24} />
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }} 
                className="text-slate-600 hover:text-white transition-colors p-1"
              >
                {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <ChevronRight className="text-slate-700 group-hover:text-emerald-500 transition-colors" size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Available Liquidity (USD/EUR)</p>
          <h2 className="text-4xl font-mono font-bold mt-2 tracking-tighter">
            {showBalance ? `${(dashboardData.totalPaid || 0).toLocaleString()} FX` : "••••••"}
          </h2>
          <p className="text-[9px] text-emerald-500/50 font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            VIEW DETAILED LEDGER →
          </p>
        </div>

        {/* PENDING STATUS CARD */}
        <div 
          onClick={() => router.push("/invoices?status=pending")}
          className="group bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] shadow-xl border-dashed cursor-pointer hover:bg-slate-800/50 hover:border-blue-500/50 transition-all active:scale-[0.98]"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 w-fit">
              <Lock size={24} />
            </div>
            <ChevronRight className="text-slate-700 group-hover:text-blue-500 transition-colors" size={20} />
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Pending Settlements</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-mono font-bold mt-2 text-blue-400">
              {dashboardData.pendingCount || 0}
            </h2>
            <span className="text-sm font-sans text-slate-600 font-bold uppercase">Units</span>
          </div>
          <p className="text-[9px] text-blue-500/50 font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            CLICK TO VIEW AUDIT QUEUE →
          </p>
        </div>

        {/* SETTLED DOCUMENTS CARD */}
        <div 
          onClick={() => router.push("/invoices?status=paid")}
          className="group bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] shadow-xl cursor-pointer hover:bg-slate-800/50 hover:border-purple-500/50 transition-all active:scale-[0.98]"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 w-fit">
              <Users size={24} />
            </div>
            <ChevronRight className="text-slate-700 group-hover:text-purple-500 transition-colors" size={20} />
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Global Documents</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-mono font-bold mt-2 text-purple-400">
              {dashboardData.paidCount || 0}
            </h2>
            <span className="text-sm font-sans text-slate-600 font-bold uppercase">Files</span>
          </div>
          <p className="text-[9px] text-purple-500/50 font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            CLICK TO OPEN ARCHIVE →
          </p>
        </div>

      </div>
      
      <div className="mt-20 border-t border-slate-800 pt-6 text-center">
        <p className="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-bold italic">
          Hubkon B2B Protocol v0.3.3 // Fully Interactive Terminal Active
        </p>
      </div>
    </div>
  );
}
