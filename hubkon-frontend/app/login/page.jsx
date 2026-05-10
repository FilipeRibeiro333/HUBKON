"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

/**
 * @file Login.jsx
 * @description Sovereign Auth Terminal - v1.0.7
 * Sincronizado com HUBKON Master Engine V.1020
 */
export default function Login() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: "",
    taxId: "",
    businessAddress: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setShowPassword(false);
    setFormData({
      businessName: "",
      taxId: "",
      businessAddress: "",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Endpoints sincronizados com authRoutes.js
      const endpoint = isRegister ? "/auth/register" : "/auth/login";

      /**
       * 🚀 MAPEAMENTO V.1020
       * Transforma o formulário no payload exato que o Controller espera.
       */
      const payload = isRegister ? {
        companyName: formData.businessName,
        taxId: formData.taxId,
        address: formData.businessAddress,
        name: formData.adminName,      
        email: formData.adminEmail,    
        password: formData.adminPassword,
        plan: "enterprise",
      } : {
        email: formData.adminEmail,
        password: formData.adminPassword,
      };

      const { data } = await api.post(endpoint, payload);

      if (data.success) {
        // ✅ 1. Gestão de Segurança (Tokens)
        const token = data.token || data.data?.token;
        if (token) {
          localStorage.setItem("@Hubkon:token", token);
        }

        // ✅ 2. Persistência de Contexto (Trata login e registro)
        const userData = data.user || data.data;
        localStorage.setItem("@Hubkon:user", JSON.stringify(userData));

        // ✅ 3. API Key de Organização
        const apiKey = userData?.apiKey || data.apiKey;
        if (apiKey) {
          localStorage.setItem("@Hubkon:apiKey", apiKey);
        }

        // 🎯 Redirecionamento Automático
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("🔥 HUBKON_AUTH_FAULT:", err.response?.data);

      // Captura a mensagem do errorHandler global do backend
      const errorMsg = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Falha na comunicação com o Master Engine.";
      
      alert(`HUBKON B2B - Falha: ${errorMsg}`);
    } finally {
      // Garante que o botão volte ao estado normal em caso de erro
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
        
        <div className="text-center mb-10">
          <h1 className="text-white text-3xl font-black tracking-tighter uppercase italic">
            Hubkon <span className="text-emerald-500">B2B</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-mono mt-2 uppercase tracking-widest">
            Sovereign Operating System v1.0.7
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <input
                name="businessName"
                placeholder="Nome da Organização"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full p-4 bg-black border border-slate-800 text-white rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm"
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="taxId"
                  placeholder="NIF / Tax ID"
                  value={formData.taxId}
                  onChange={handleChange}
                  className="w-full p-4 bg-black border border-slate-800 text-white rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm"
                  required
                />
                <input
                  name="adminName"
                  placeholder="Gestor Responsável"
                  value={formData.adminName}
                  onChange={handleChange}
                  className="w-full p-4 bg-black border border-slate-800 text-white rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm"
                  required
                />
              </div>

              <input
                name="businessAddress"
                placeholder="Sede Institucional"
                value={formData.businessAddress}
                onChange={handleChange}
                className="w-full p-4 bg-black border border-slate-800 text-white rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm"
                required
              />
              
              <div className="h-px bg-slate-800/50 my-6"></div>
            </div>
          )}

          <input
            name="adminEmail"
            type="email"
            placeholder="E-mail Corporativo"
            value={formData.adminEmail}
            onChange={handleChange}
            className="w-full p-4 bg-black border border-slate-800 text-white rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm"
            required
          />

          <div className="relative">
            <input
              name="adminPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Senha de Acesso"
              value={formData.adminPassword}
              onChange={handleChange}
              className="w-full p-4 bg-black border border-slate-800 text-white rounded-2xl outline-none focus:border-emerald-500 transition-all pr-16 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors text-[10px] font-black uppercase"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl mt-6 transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                Sincronizando...
              </>
            ) : isRegister ? (
              "Inicializar Infraestrutura"
            ) : (
              "Aceder ao Terminal"
            )}
          </button>
        </form>

        <button
          onClick={toggleMode}
          className="w-full mt-8 text-xs text-slate-500 hover:text-white transition-colors font-mono uppercase tracking-tighter"
        >
          {isRegister
            ? "Já possui infraestrutura? Autenticar"
            : "Nova Organização? Solicitar Acesso"}
        </button>
      </div>
    </div>
  );
}

/**
 * 🌀 ÍCONE DE LOADING (REFRESH)
 */
function RefreshCw({ className, size }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}
