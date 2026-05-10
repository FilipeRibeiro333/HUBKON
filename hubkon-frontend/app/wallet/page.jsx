"use client";

import { useEffect, useState } from "react";
import api from "../../services/api"; 
import { Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function Wallet() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      // ✅ ROTA CORRIGIDA: /admin (do app.js) + /dashboard/stats (do adminRoutes.js)
      const res = await api.get("/admin/dashboard/stats");
      
      // Mapeia o saldo conforme a estrutura do seu adminController
      const amount = res.data.data?.liquidity || 0;
      setBalance(amount);
    } catch (err) {
      console.error("Erro na leitura da carteira soberana:", err);
      // Fallback para evitar que a tela fique em branco
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Sovereign <span className="text-emerald-500">Wallet</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono uppercase mt-1 tracking-widest">
            Protocolo de Liquidez HUB v0.3.3
          </p>
        </header>

        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Efeito visual de profundidade */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500">
              <WalletIcon size={32} />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 uppercase tracking-widest mb-2">
                Rede Ativa
              </span>
              <p className="text-[9px] font-mono text-slate-600 uppercase">Status: Sincronizado</p>
            </div>
          </div>

          <p className="text-slate-500 text-xs font-black uppercase tracking-widest relative z-10">
            Saldo Total em Custódia
          </p>
          
          <div className="relative z-10">
            {loading ? (
              <div className="h-16 flex items-center">
                <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-emerald-500 animate-pulse"></div>
                </div>
              </div>
            ) : (
              <h2 className="text-6xl font-mono font-bold text-white mt-4 tracking-tighter flex items-baseline gap-3">
                {balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-2xl text-emerald-500 italic">USD</span>
              </h2>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-12 relative z-10">
            <button 
              onClick={() => alert("Função de recebimento em desenvolvimento")}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase text-white transition-all"
            >
              <ArrowDownLeft size={16} className="text-emerald-500" /> Receber
            </button>
            <button 
              onClick={() => alert("Função de envio em desenvolvimento")}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl text-[10px] font-black uppercase text-white transition-all shadow-lg shadow-emerald-900/20"
            >
              <ArrowUpRight size={16} /> Enviar
            </button>
          </div>
        </div>

        {/* Info adicional para o terminal de teste */}
        <div className="mt-6 px-4">
          <p className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">
            🛡️ Ativos protegidos por Smart Contracts e Multisig 4/4
          </p>
        </div>
      </div>
    </div>
  );
}
