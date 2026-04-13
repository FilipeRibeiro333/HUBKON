"use client";
import { useState } from "react";
import api from "../../services/api";
import { ShieldCheck, Upload, User, Landmark, Camera, AlertCircle, CheckCircle2 } from "lucide-react";

export default function KYCPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", nationalId: "", country: "Angola" });
  const [files, setFiles] = useState({ documentFront: null, documentBack: null, selfie: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("nationalId", formData.nationalId);
    data.append("country", formData.country);
    data.append("documentFront", files.documentFront);
    data.append("documentBack", files.documentBack);
    data.append("selfie", files.selfie);

    try {
      await api.post("/kyc/submit", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setStep(3); // Sucesso
    } catch (err) {
      alert("Erro no upload: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-8 flex items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl">
        
        {/* 🛡️ PROGRESS TRACKER */}
        <div className="flex justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 w-16 rounded-full transition-all ${step >= s ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-slate-800"}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-white mb-2 italic uppercase">VERIFICAÇÃO <span className="text-emerald-500 text-sm align-top">V.1</span></h2>
            <p className="text-slate-500 text-sm mb-8 font-mono">IDENTIDADE JURÍDICA E SOBERANIA DE DADOS</p>
            
            <div className="space-y-6">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 focus-within:border-emerald-500/50 transition-colors">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Nome Completo (Registo Legal)</label>
                <div className="flex items-center gap-3">
                  <User size={18} className="text-emerald-500" />
                  <input 
                    className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-700" 
                    placeholder="Ex: Manuel dos Santos"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Número do Bilhete / ID Nacional</label>
                <div className="flex items-center gap-3">
                  <Landmark size={18} className="text-emerald-500" />
                  <input 
                    className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-700" 
                    placeholder="000123456LA042"
                    onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg active:scale-95"
              >
                PROSSEGUIR PARA DOCUMENTAÇÃO
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3 italic">
              <Camera className="text-emerald-500" /> CAPTURA DE <span className="text-emerald-500">BIOMETRIA</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8 text-center">
              <label className="bg-black/40 border-2 border-dashed border-slate-800 p-6 rounded-3xl cursor-pointer hover:border-emerald-500/40 transition-all group">
                <Upload className="mx-auto text-slate-600 group-hover:text-emerald-500 mb-2" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Documento Frente</span>
                <input type="file" className="hidden" onChange={(e) => setFiles({...files, documentFront: e.target.files[0]})} />
              </label>

              <label className="bg-black/40 border-2 border-dashed border-slate-800 p-6 rounded-3xl cursor-pointer hover:border-emerald-500/40 transition-all group">
                <Upload className="mx-auto text-slate-600 group-hover:text-emerald-500 mb-2" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Documento Verso</span>
                <input type="file" className="hidden" onChange={(e) => setFiles({...files, documentBack: e.target.files[0]})} />
              </label>

              <label className="col-span-2 bg-black/40 border-2 border-dashed border-emerald-500/20 p-6 rounded-3xl cursor-pointer hover:border-emerald-500/40 transition-all group">
                <Camera className="mx-auto text-emerald-500 mb-2" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selfie de Verificação (Live-Check)</span>
                <input type="file" className="hidden" onChange={(e) => setFiles({...files, selfie: e.target.files[0]})} />
              </label>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 text-slate-500 font-bold text-xs uppercase hover:text-white transition-colors">Voltar</button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? "PROCESSANDO..." : <><ShieldCheck size={20}/> FINALIZAR AUDITORIA</>}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <div className="bg-emerald-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <CheckCircle2 className="text-emerald-500" size={48} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 italic uppercase">SUBMETIDO <span className="text-emerald-500">COM SUCESSO</span></h2>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed font-mono">
              O seu perfil de risco está a ser avaliado pelo motor de AML Hubkon.<br/>Receberá uma notificação no seu terminal em instantes.
            </p>
            <button onClick={() => window.location.href='/dashboard'} className="w-full bg-slate-800 text-white font-black py-5 rounded-2xl hover:bg-slate-700 transition-colors uppercase tracking-widest text-xs">Ir para Dashboard</button>
          </div>
        )}

      </div>
    </div>
  );
}
