"use client";
import { useEffect, useState } from "react";
import api from "../../services/api"; // ✅ Caminho corrigido
import { Wallet as WalletIcon, TrendingUp, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function Wallet() {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    api.get("/wallet/balance")
      .then(res => setBalance(res.data.balance))
      .catch(err => console.error("Erro na carteira:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Sovereign <span className="text-emerald-500">Wallet</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono uppercase mt-1 tracking-widest text-[8px]">Protocolo de Liquidez HUB</p>
        </header>

        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-sm border-dashed">
          <div className="flex justify-between items-start mb-8">
            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500">
              <WalletIcon size={32} />
            </div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 uppercase tracking-widest">Ativa</span>
          </div>
          
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Saldo Disponível</p>
          <h2 className="text-6xl font-mono font-bold text-white mt-4 tracking-tighter">
            {balance !== null ? balance.toLocaleString() : "---"} <span className="text-2xl text-emerald-500">HUB</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
