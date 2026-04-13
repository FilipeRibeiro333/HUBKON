'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Shield, Zap, TrendingUp, Lock } from 'lucide-react';
import api from '@/services/api'; // Ajuste o caminho conforme seu arquivo de API

export default function PaymentSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('basic');
  
  // Estados vinculados ao seu settingsService.js
  const [settings, setSettings] = useState({
    escrow_fee_percent: 2.0,
    penalty_percent: 5.0,
    staking_bonus_percent: 12.0
  });

  // 1. Atualiza as taxas globais (Chama o settingsService no Backend)
  const handleUpdateProtocol = async () => {
    setLoading(true);
    try {
      // Itera sobre as chaves permitidas no seu service
      const keys = Object.keys(settings);
      
      await Promise.all(keys.map(key => 
        api.post('/settings', { key, value: Number(settings[key]) })
      ));

      console.log("LOG: [GOVERNANCE_UPDATE] Parameters anchored to database.");
      alert("Protocolo HUBKON atualizado na rede com sucesso!");
    } catch (err) {
      console.error("CRITICAL_ERROR:", err);
      alert("Erro ao atualizar protocolo.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Realiza o Upgrade de Plano (Chama o subscriptionService no Backend)
  const handleUpgrade = async (newPlan) => {
    if (!confirm(`Confirmar upgrade para o nível ${newPlan.toUpperCase()}?`)) return;

    try {
      // Assume que o ID da empresa está no token/user logado ou via contexto
      const response = await api.post('/subscription/renew', { newPlan });
      
      if (response.data.success) {
        setPlan(newPlan);
        alert(`Sistema escalado para ${newPlan.toUpperCase()}!`);
      }
    } catch (err) {
      console.error("PROVISIONING_ERROR:", err);
      alert("Falha na transição de plano.");
    }
  };

  return (
    <div className="flex-1 bg-[#080c14] p-8 font-mono overflow-y-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-2">
          <Settings className="text-emerald-500" size={24} />
          PAYMENT_GOVERNANCE_v1.0
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.3em]">
          Hubkon Protocol // Treasury & Economic Parameters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA: GOVERNANÇA ECONÔMICA */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0c121d] border border-slate-800 p-6 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            
            <h2 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase">
              <Zap size={16} className="text-emerald-500" /> 
              Economic Levers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1 uppercase">Escrow Fee (%)</label>
                  <input 
                    type="number"
                    value={settings.escrow_fee_percent}
                    onChange={(e) => setSettings({...settings, escrow_fee_percent: e.target.value})}
                    className="w-full bg-[#080c14] border border-slate-800 p-3 text-emerald-400 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1 uppercase">Penalty Rate (%)</label>
                  <input 
                    type="number"
                    value={settings.penalty_percent}
                    onChange={(e) => setSettings({...settings, penalty_percent: e.target.value})}
                    className="w-full bg-[#080c14] border border-slate-800 p-3 text-emerald-400 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div className="bg-[#080c14]/50 border border-slate-800/50 p-4 flex flex-col justify-center">
                <div className="text-[10px] text-slate-600 mb-2 italic">PROTOCOL_PREVIEW</div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  Taxa de Escrow: <span className="text-emerald-500">{settings.escrow_fee_percent}%</span><br/>
                  Penalidade Disputa: <span className="text-red-500">{settings.penalty_percent}%</span>
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              onClick={handleUpdateProtocol}
              className="mt-8 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Commit Changes to Ledger'}
            </button>
          </div>
        </div>

        {/* COLUNA DIREITA: PLANOS E ACESSO */}
        <div className="lg:col-span-5">
          <div className="bg-[#0c121d] border border-slate-800 p-6 rounded-sm relative">
            <h2 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase">
              <Shield size={16} className="text-purple-500" /> 
              Tier Authorization
            </h2>

            <div className="mb-6">
              <div className="text-[9px] text-slate-500 uppercase mb-1">Status Ativo</div>
              <div className="px-3 py-1 inline-block rounded-full text-[10px] font-black uppercase bg-purple-900/30 text-purple-400 border border-purple-500/30">
                {plan}
              </div>
            </div>

            <div className="space-y-3">
              {['pro', 'enterprise'].map((tier) => (
                <div key={tier} className={`flex items-center justify-between p-3 border border-slate-800 transition-all ${plan === tier ? 'bg-purple-900/10 border-purple-500/30' : 'hover:border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                      {tier === 'enterprise' ? <Lock size={14} className="text-slate-500" /> : <TrendingUp size={14} className="text-slate-500" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-300 uppercase">{tier}</div>
                      <div className="text-[9px] text-slate-600">
                        {tier === 'enterprise' ? 'Blockchain Sealing' : 'KPI Analytics'}
                      </div>
                    </div>
                  </div>
                  {plan !== tier && (
                    <button 
                      onClick={() => handleUpgrade(tier)}
                      className="text-[9px] font-bold text-emerald-500 hover:underline"
                    >
                      UPGRADE_PATH
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800/50">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 uppercase">Staking Yield:</span>
                <span className="text-emerald-500 font-bold">+{settings.staking_bonus_percent}% APY</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
