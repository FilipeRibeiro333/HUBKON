'use client';

import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, Lock, CheckCircle2, RefreshCw } from 'lucide-react';
import useAuth from "../../Hook/useAuth";
import api from '@/services/api';

export default function PaymentSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [dynamicPlans, setDynamicPlans] = useState(null);

  const currentPlan = user?.plan || "basic";

  // 1. BUSCA OS PREÇOS DEFINIDOS PELA GOVERNANÇA MACRO
  useEffect(() => {
    const loadMarketRates = async () => {
      try {
        const res = await api.get("/admin/settings");
        if (res.data?.success) {
          const rules = res.data.settings.find(s => s.key === 'escrow_rules')?.value;
          if (rules) {
            setDynamicPlans({
              basic: { 
                price: "Free", 
                limit: "1k USD", 
                desc: "Core Sovereign Engine" 
              },
              pro: { 
                price: `$${rules.pro_price || 29}/mo`, 
                limit: `${(rules.pro_limit / 1000).toFixed(0)}k USD`, 
                desc: "KPI Analytics & Governance" 
              },
              enterprise: { 
                price: rules.ent_price > 0 ? `$${rules.ent_price}/mo` : "Custom", 
                limit: rules.ent_limit >= 1000000 ? "Unlimited" : `${(rules.ent_limit / 1000).toFixed(0)}k USD`, 
                desc: "Full Blockchain Access" 
              }
            });
          }
        }
      } catch (err) {
        console.error("Erro ao sincronizar tabelas de preço.");
      } finally {
        setFetching(false);
      }
    };
    loadMarketRates();
  }, []);

  const handleUpgrade = async (newPlan) => {
    if (!confirm(`Confirmar upgrade institucional para o plano ${newPlan.toUpperCase()}?`)) return;
    setLoading(true);
    try {
      const res = await api.post("/subscription/renew", { newPlan });
      if (res.data.success) {
        alert("UPGRADE_EXECUTADO: Sincronizando novas permissões de rede.");
        window.location.reload();
      }
    } catch (err) {
      alert("ERRO_SUBSCRICAO: Falha na transição de Tier.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex h-screen items-center justify-center bg-[#080c14] text-purple-500 font-mono italic animate-pulse">
      CONSULTANDO TARIFÁRIO DA REDE...
    </div>
  );

  return (
    <div className="flex-1 bg-[#080c14] p-10 font-mono min-h-screen ml-64 text-white transition-all">
      {/* HEADER */}
      <div className="mb-10 border-l-4 border-purple-500 pl-4">
        <h1 className="text-2xl font-black italic tracking-tighter flex items-center gap-2 uppercase">
          <Shield className="text-purple-500" size={24} /> 
          Subscrições de Rede
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">
          Ambiente de Gestão de Tenant // Hubkon B2B
        </p>
      </div>

      <div className="max-w-3xl space-y-4">
        {dynamicPlans && Object.keys(dynamicPlans).map((tier) => (
          <div 
            key={tier} 
            className={`relative p-6 border transition-all duration-300 rounded-sm bg-[#0c121d] ${
              currentPlan === tier 
                ? 'border-purple-500 bg-purple-900/5 shadow-[0_0_20px_rgba(168,85,247,0.1)]' 
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 flex items-center justify-center border rounded ${
                  currentPlan === tier ? 'bg-purple-500/20 border-purple-500' : 'bg-black/40 border-slate-800 text-slate-600'
                }`}>
                  {tier === 'enterprise' ? <Lock size={20} /> : <TrendingUp size={20} />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black uppercase tracking-tighter">Plan_{tier}</h2>
                    {currentPlan === tier && (
                      <span className="text-[8px] bg-purple-500 text-black px-2 py-0.5 font-black uppercase rounded-full animate-pulse">Active</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase mt-1 italic">{dynamicPlans[tier].desc}</p>
                </div>
              </div>

              <div className="text-right flex items-center gap-8">
                <div className="hidden sm:block font-mono">
                  <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Pricing / Limit</p>
                  <p className="text-xs font-bold text-white">
                    {dynamicPlans[tier].price} — <span className="text-emerald-500">{dynamicPlans[tier].limit}</span>
                  </p>
                </div>

                {currentPlan !== tier ? (
                  <button 
                    onClick={() => handleUpgrade(tier)} 
                    disabled={loading}
                    className="bg-white hover:bg-emerald-500 text-black px-6 py-2 text-[10px] font-black uppercase tracking-tighter transition-all disabled:opacity-30"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={12}/> : 'Upgrade_Path'}
                  </button>
                ) : (
                  <div className="text-purple-500 flex items-center gap-2 font-black text-[10px] uppercase">
                    <CheckCircle2 size={16} /> Current
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em] max-w-2xl">
        * Tarifário dinâmico regulado pelo protocolo central HUBKON.
      </div>
    </div>
  );
}
