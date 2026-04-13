"use client";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { FileText, CheckCircle, Clock, Unlock, ShieldAlert, Download, ExternalLink, Loader2 } from "lucide-react";

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchContracts = async () => {
    try {
      const res = await api.get("/escrow/my-contracts");
      setContracts(res.data.escrows || []);
    } catch (err) {
      console.error("Critical: Escrow Sync Failure", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContracts(); }, []);

  /**
   * 🚀 INITIATE SMART CONTRACT (RESOLVIDO)
   * Agora solicita o 'companyB' para satisfazer a validação do Backend.
   */
  const handleInitiateContract = async () => {
    // 🎯 Captura o ID da empresa parceira (O erro da imagem pedia isso)
    const partnerId = prompt("Insira o ID ou Email da Empresa Parceira (Company B):");
    
    if (!partnerId) return alert("O ID da Empresa Parceira é obrigatório para o protocolo.");

    setProcessing(true);
    try {
      const payload = {
        amount: 5000,
        currency: "HUB",
        description: "Contrato de Liquidez Direta",
        companyB: partnerId // ✅ Agora o campo obrigatório está aqui
      };

      await api.post("/escrow/create", payload);
      alert("✅ Protocolo Escrow Iniciado com Sucesso!");
      fetchContracts(); 
    } catch (err) {
      // Exibe o erro exato do backend se algo mais faltar
      alert(err.response?.data?.message || "Erro na validação do nó.");
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm("Confirm Smart Contract milestone approval?")) return;
    try {
      await api.post(`/escrow/approve/${id}`);
      alert("Ledger Updated: Release Authorization Granted!");
      fetchContracts();
    } catch (err) { 
      alert(err.response?.data?.message || "Protocol Error."); 
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#080c14] text-emerald-500 font-mono italic animate-pulse">
      SYNCHRONIZING SECURE NODES...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-300 p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 flex justify-between items-end border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
              Escrow <span className="text-emerald-500">Custody</span>
            </h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">Active Settlement Protocols</p>
          </div>
          
          <button 
            onClick={handleInitiateContract}
            disabled={processing}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center gap-2 active:scale-95"
          >
            {processing ? <Loader2 className="animate-spin" size={14} /> : "+ Initiate Contract"}
          </button>
        </header>

        <div className="grid gap-6">
          {contracts.length === 0 ? (
            <div className="border-2 border-dashed border-slate-800 rounded-3xl p-20 text-center text-slate-600 font-bold uppercase tracking-widest">
              No active escrow protocols detected.
            </div>
          ) : (
            contracts.map((contract) => (
              <div key={contract._id} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 hover:border-emerald-500/30 transition-all group shadow-xl">
                
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-slate-800/50 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                      <FileText size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">
                        Contract <span className="text-emerald-500">#{contract._id.slice(-6)}</span>
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-mono text-blue-400 uppercase tracking-tighter">Status: {contract.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Total Settlement</p>
                    <p className="text-3xl font-mono font-bold text-emerald-400 tracking-tighter">
                      {contract.amount.toLocaleString()} <span className="text-sm font-sans opacity-50">{contract.currency || "HUB"}</span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5">
                  <div className="flex gap-10 text-[10px] uppercase font-black text-slate-500 tracking-widest">
                     Protocolo Verificado via Ledger
                  </div>

                  <div className="flex gap-3">
                    {contract.status === 'pending' && (
                      <button 
                        onClick={() => handleApprove(contract._id)}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
                      >
                        <Unlock size={14} /> Authorize Release
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
