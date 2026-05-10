"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import { Box, Cpu, Activity, Search, ShieldCheck } from "lucide-react";

export default function BlockchainExplorer() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalBlocks: 0, lastMining: "" });

  const fetchBlockchain = async () => {
    try {
      /**
       * ✅ ROTA CORRIGIDA: 
       * Removido o "/api" manual, pois o seu axios (api.js) já o inclui na baseURL.
       * O caminho final será: BASE_URL + /blockchain/blocks
       */
      const res = await api.get("/blockchain/blocks");

      /**
       * ✅ NORMALIZAÇÃO DE DADOS:
       * Seu backend retorna: { success: true, count: X, blocks: [...] }
       */
      const chainData = res.data.blocks || [];
      
      const reversedChain = [...chainData].reverse();
      setBlocks(reversedChain);
      setStats({
        totalBlocks: chainData.length,
        lastMining: chainData[chainData.length - 1]?.timestamp || new Date()
      });
    } catch (err) {
      // Log detalhado para capturar erros de permissão (401/403)
      console.error("Erro ao ler ledger soberano:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchain();
  }, []);

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <Cpu className="text-emerald-500 animate-spin" size={40} />
      <p className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase">Sincronizando Ledger...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* 🛰️ HEADER DO EXPLORADOR */}
        <header className="flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sovereign Mainnet Live</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Hubkon <span className="text-emerald-500">Explorer</span>
            </h1>
            <p className="text-slate-600 font-mono text-xs">Protocolo de Prova de Confiança (PoT) v1.0.5</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-right min-w-[120px]">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Blocos Selados</p>
              <p className="text-2xl font-mono font-bold text-white">{stats.totalBlocks}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Dificuldade</p>
              <p className="text-2xl font-mono font-bold text-emerald-500">LOW</p>
            </div>
          </div>
        </header>

        {/* 🔎 SEARCH BAR */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por Hash, Bloco ou Transação..." 
            className="w-full bg-slate-900/30 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-emerald-500/50 transition-all outline-none" 
          />
        </div>

        {/* ⛓️ BLOCK STREAM */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity size={16} /> Histórico de Blocos Imutáveis 
          </h2>

          {blocks.length > 0 ? (
            blocks.map((block) => (
              <div key={block._id || block.index} className="group bg-slate-900/20 border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-900/40 hover:border-emerald-500/30 transition-all">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Box className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <p className="text-emerald-500 font-mono text-sm font-bold">BLOCK # {block.index}</p>
                      <p className="text-[10px] text-slate-600 uppercase font-bold mt-1">
                        {block.timestamp ? new Date(block.timestamp).toLocaleString() : 'Timestamp Indisponível'}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 w-20 uppercase">Hash</span>
                      <span className="text-xs font-mono text-slate-300 break-all">{block.hash || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 w-20 uppercase">Prev</span>
                      <span className="text-xs font-mono text-slate-600 break-all">{block.previousHash || 'Genesis Block'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 md:border-l border-slate-800 md:pl-6">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Nonce</p>
                      <p className="text-lg font-mono text-white">{block.nonce || 0}</p>
                    </div>
                    <div className="flex items-center justify-center bg-emerald-500/20 w-10 h-10 rounded-full border border-emerald-500/30">
                      <ShieldCheck className="text-emerald-500" size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-500 font-mono text-sm uppercase">Nenhum bloco minerado na Ledger Enterprise.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
