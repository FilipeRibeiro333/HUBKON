"use client";
import { useEffect, useState } from "react";
import api from "@/services/api"; 
import { 
  Settings, ShieldAlert, TrendingUp, Save, 
  RefreshCw, AlertTriangle, ShieldCheck, 
  CheckCircle, XCircle, ZapOff, Zap, Clock, Shield
} from "lucide-react";

export default function AdminGovernance() {
  const [settings, setSettings] = useState({ 
    fee: 0, 
    advanceFee: 0, 
    riskMultiplier: 0,
    instantLimit: 1000,
    criticalLimit: 10000,
    hourlyMax: 3000,
    timelockHours: 24 
  });
  
  const [riskQueue, setRiskQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  const fetchData = async () => {
    try {
      // 🛡️ Otimização: Promise.allSettled evita que falhas em rotas individuais tranquem o sistema
      const results = await Promise.allSettled([
        api.get("/admin/settings"),
        api.get("/admin/dashboard/stats"),
        api.get("/admin/risk-audit")
      ]);
      
      // Processamento de Configurações
      if (results[0].status === "fulfilled") {
        const allSettings = results[0].value.data?.settings || [];
        const rules = allSettings.find(s => s.key === 'escrow_rules')?.value || {};
        setSettings(prev => ({ ...prev, ...rules }));
      }
      
      // Processamento de Stats/Kill Switch
      if (results[1].status === "fulfilled") {
        setKillSwitchActive(results[1].value.data?.data?.isPaused || false);
      }

      // Processamento de Fila de Risco
      if (results[2].status === "fulfilled") {
        setRiskQueue(results[2].value.data?.data || []);
      }

    } catch (err) {
      console.error("Erro na governança HUBKON:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateSettings = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings", { key: "escrow_rules", value: settings });
      alert("⚠️ Protocolos de Risco e Taxas Atualizados!");
    } catch (err) {
      alert("Falha na atualização: " + (err.response?.data?.message || err.message));
    } finally { 
      setSaving(false); 
    }
  };

  const handleApprove = async (txId) => {
    if (!confirm("Confirmar assinatura digital de SuperAdmin?")) return;
    try {
      await api.post("/admin/transactions/approve", { transactionId: txId });
      alert("✅ Assinatura Registada no Cofre!");
      fetchData();
    } catch (err) {
      alert("Erro na aprovação: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRevoke = async (txId) => {
    const reason = prompt("Motivo da Revogação Institucional:");
    if (!reason) return;
    try {
      await api.post("/admin/transactions/revoke", { transactionId: txId, reason });
      alert("🛑 Transação Revogada com Sucesso.");
      fetchData();
    } catch (err) {
      alert("Erro ao revogar.");
    }
  };

  const handleToggleKillSwitch = async () => {
    const newState = !killSwitchActive;
    if (!confirm(newState ? "🚨 CONGELAR SISTEMA?" : "🚀 RESTAURAR SISTEMA?")) return;
    try {
      await api.post("/admin/system/toggle-kill", { active: newState });
      setKillSwitchActive(newState);
    } catch (err) {
      alert("Erro no Kill Switch. Verifique a conexão com o Redis no Ubuntu.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#080c14] text-amber-500 font-mono italic animate-pulse">
      ACESSANDO TERMINAL DE SEGURANÇA SOBERANO...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-300 p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-12 border-b border-amber-500/20 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3 italic">
              <Settings className="text-amber-500" /> GOVERNANÇA <span className="text-amber-500">MACRO</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-widest text-[10px]">Hubkon Global Sovereign v1.0.7</p>
          </div>
          
          <div className="flex gap-4">
             <button onClick={handleToggleKillSwitch} className={`flex items-center gap-3 px-6 py-2 rounded-lg border font-black text-[10px] transition-all ${killSwitchActive ? 'bg-red-600 border-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.6)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-red-500'}`}>
                {killSwitchActive ? <ZapOff size={16} /> : <Zap size={16} />}
                {killSwitchActive ? "SISTEMA CONGELADO" : "KILL SWITCH: READY"}
             </button>
             <div className="flex items-center gap-4 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/30">
               <ShieldCheck className="text-amber-500 w-5 h-5" />
               <span className="text-xs font-bold text-amber-500 uppercase tracking-tighter">Super_Admin</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 shadow-2xl backdrop-blur-sm">
              <h2 className="text-sm font-black text-white mb-8 flex items-center gap-2 uppercase tracking-[0.2em]">
                <TrendingUp size={18} className="text-emerald-500" /> Parâmetros de Risco
              </h2>
              
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-black text-slate-500 block mb-1 font-mono">Taxa Escrow (%)</label>
                    <input type="number" value={settings.fee * 100} onChange={(e) => setSettings({...settings, fee: Number(e.target.value) / 100})} className="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono outline-none focus:border-amber-500""")/>>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-black text-slate-500 block mb-1 font-mono">Antecipação (%)</label>
                    <input type="number" value={settings.advanceFee * 100} onChange={(e) => setSettings({...settings, advanceFee: Number(e.target.value) / 100})} className="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono outline-none focus:border-amber-500""")/>>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <label className="text-[9px] uppercase font-black text-emerald-500 block mb-3 font-mono flex items-center gap-2"><Shield size={12}/> Limites de Saída (USD)</label>
                  <div className="space-y-3">
                    <input type="number" value={settings.instantLimit} placeholder="INSTANT" onChange={(e) => setSettings({...settings, instantLimit: Number(e.target.value)})} className="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono""")/>>
                    <input type="number" value={settings.criticalLimit} placeholder="CRITICAL" onChange={(e) => setSettings({...settings, criticalLimit: Number(e.target.value)})} className="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono""")/>>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <label className="text-[9px] uppercase font-black text-blue-500 block mb-3 font-mono flex items-center gap-2"><Clock size={12}/> Motor de Velocidade</label>
                  <div className="space-y-3">
                    <input type="number" value={settings.hourlyMax} placeholder="MAX/HOUR" onChange={(e) => setSettings({...settings, hourlyMax: Number(e.target.value)})} className="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono""")/>>
                    <input type="number" value={settings.timelockHours} placeholder="HOURS" onChange={(e) => setSettings({...settings, timelockHours: Number(e.target.value)})} className="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono""")/>>
                  </div>
                </div>
                
                <button onClick={handleUpdateSettings} disabled={saving} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all shadow-lg text-[10px] tracking-widest uppercase">
                  {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                  {saving ? "SINCRONIZANDO..." : "ATUALIZAR PROTOCOLO"}
                </button>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-sm min-h-[500px]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-[0.2em]">
                  <ShieldAlert size={22} className="text-red-500" /> Fila de Custódia
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-500 px-4 py-1 rounded-full font-black border border-amber-500/30 uppercase">
                  {riskQueue.length} Retidas
                </span>
              </div>
              
              <div className="space-y-4">
                {riskQueue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-slate-700">
                    <ShieldCheck size={60} className="opacity-10 mb-4" />
                    <p className="text-xs font-mono italic tracking-widest uppercase">Rede Soberana em Conformidade.</p>
                  </div>
                ) : (
                  riskQueue.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-5 bg-black/40 rounded-[1.5rem] border-l-4 border-amber-500 group transition-all border border-slate-800/50">
                      <div className="flex items-center gap-5">
                        <AlertTriangle className="text-amber-500" size={24} />
                        <div>
                          <p className="text-sm font-black text-white font-mono">{tx.amount}</p>
                          <p className="text-[9px] text-slate-500 mt-1 uppercase">
                            STATUS: <span className="text-amber-500">{tx.status}</span> | SIGS: {4 - tx.approvalsNeeded}/4
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleApprove(tx.id)} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle size={20} /></button>
                        <button onClick={() => handleRevoke(tx.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><XCircle size={20} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
