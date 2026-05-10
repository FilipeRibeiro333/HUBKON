
"use client";

import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import api from "../../services/api"; 

export default function HookTerminalPage() {
  const { user, loading } = useAuth();
  const [logs, setLogs] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchHooks() {
      try {
        // ✅ ROTA CORRIGIDA: Agora aponta para /webhooks conforme o app.js
        const response = await api.get("/webhooks");
        
        // Garante que logs seja um array (o backend envia res.json(logs))
        setLogs(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Erro ao buscar eventos do Hook:", err);
        setLogs([]);
      } finally {
        setFetching(false);
      }
    }

    if (!loading) {
      fetchHooks();
    }
  }, [loading]);

  if (loading) return <div className="p-8 text-white">Carregando Terminal...</div>;

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">
          Hook <span className="text-emerald-500">Terminal</span>
        </h1>
        <p className="text-slate-500 text-xs font-mono">Gerenciamento de conexões e Webhooks</p>
      </header>

      <div className="grid gap-6">
        {/* Card de Status */}
        <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase">Configuração Atual</h2>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded">ATIVO</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Operador Responsável</p>
              <p className="text-white font-mono text-sm">{user?.name || "Admin Hubkon"}</p>
            </div>
            
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Endpoint de Escuta</p>
              <div className="bg-black/40 p-3 rounded-lg border border-slate-800/50">
                <code className="text-emerald-400 text-[10px]">http://localhost:5000/api/webhooks/local-bank</code>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Eventos Real-Time */}
        <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-6 overflow-hidden">
          <h2 className="text-sm font-bold text-slate-300 uppercase mb-6">Logs de Atividade</h2>
          
          {fetching ? (
            <div className="flex justify-center p-10">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log._id} className="flex items-center justify-between p-3 bg-black/20 border border-slate-800/50 rounded-lg group hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
                    <div>
                      <span className="text-[11px] font-mono text-white uppercase font-bold">
                        {log.paymentMethod === 'bank-transfer' ? "BANK_TRANSFER_CONFIRMED" : "WEBHOOK_EVENT"}
                      </span>
                      <p className="text-[9px] text-slate-600 font-mono">Invoice ID: {log._id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-500 font-mono text-[11px] font-bold">+{log.amount} USD</p>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(log.atualizadoEm || log.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-800 rounded-xl">
              <div className="w-2 h-2 bg-slate-600 rounded-full animate-ping mb-4"></div>
              <p className="text-slate-500 font-mono text-[11px] uppercase">Aguardando eventos em tempo real...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}