"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

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
      const endpoint = isRegister ? "/auth/register" : "/auth/login";

      /**
       * 🚀 SINCRONIZAÇÃO COM authController.js
       * O Backend desestrutura: { companyName, companyEmail, name, email, password }
       */
      const payload = isRegister
        ? {
            companyName: formData.businessName,
            companyEmail: formData.adminEmail, // 🎯 Essencial para o Company Model
            name: formData.adminName || formData.businessName,
            email: formData.adminEmail, // 🎯 Essencial para o User Model
            password: formData.adminPassword,
            taxId: formData.taxId,
            address: formData.businessAddress,
          }
        : {
            email: formData.adminEmail,
            password: formData.adminPassword,
          };

      const { data } = await api.post(endpoint, payload);

      if (data.token) {
        localStorage.setItem("@Hubkon:token", data.token);
      }
      
      localStorage.setItem("@Hubkon:user", JSON.stringify(data.user || data.owner));
      
      // ✅ SUCESSO: Redireciona para o Dashboard
      router.push("/dashboard");

    } catch (err) {
      console.error("Auth Error:", err.response?.data);
      alert(err.response?.data?.message || "Erro ao processar autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-white text-center text-2xl font-bold mb-8 text-emerald-500">HUBKON B2B</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <input 
                name="businessName" 
                placeholder="Business Name" 
                value={formData.businessName} 
                onChange={handleChange} 
                className="w-full p-3 bg-black border border-slate-800 text-white rounded-xl outline-none focus:border-emerald-500" 
                required 
              />
              <input 
                name="taxId" 
                placeholder="Tax ID / NIF" 
                value={formData.taxId} 
                onChange={handleChange} 
                className="w-full p-3 bg-black border border-slate-800 text-white rounded-xl outline-none focus:border-emerald-500" 
                required 
              />
              <input 
                name="businessAddress" 
                placeholder="Address" 
                value={formData.businessAddress} 
                onChange={handleChange} 
                className="w-full p-3 bg-black border border-slate-800 text-white rounded-xl outline-none focus:border-emerald-500" 
                required 
              />
              <div className="h-px bg-slate-800 my-2"></div>
            </>
          )}

          <input 
            name="adminEmail" 
            type="email" 
            placeholder="Email Address" 
            value={formData.adminEmail} 
            onChange={handleChange} 
            className="w-full p-3 bg-black border border-slate-800 text-white rounded-xl outline-none focus:border-emerald-500" 
            required 
          />

          <div className="relative">
            <input
              name="adminPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.adminPassword}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-slate-800 text-white rounded-xl outline-none focus:border-emerald-500 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors text-xs font-bold uppercase"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full p-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl mt-4 transition-all shadow-lg shadow-emerald-900/20"
          >
            {loading ? "PROCESSING..." : isRegister ? "Initialize Business" : "Access Dashboard"}
          </button>
        </form>

        <button onClick={toggleMode} className="w-full mt-6 text-sm text-slate-400 hover:text-white transition-colors">
          {isRegister ? "Already have a business? Login" : "New here? Register your company"}
        </button>
      </div>
    </div>
  );
}
