"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, Wallet, 
  Users, Cpu, LogOut, Building2, Settings 
} from "lucide-react";
// ✅ Mantido o Hook com H maiúsculo conforme sua estrutura
import useAuth from "../Hook/useAuth"; 

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Mapeamento atualizado com a nova rota de Pagamentos
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Contratos", href: "/contracts", icon: FileText },
    { name: "Carteira", href: "/wallet", icon: Wallet },
    { name: "Usuários", href: "/users", icon: Users },
    { name: "Blockchain", href: "/explorer", icon: Cpu },
    // 🚀 NOVA ROTA ADICIONADA:
    { name: "Pagamentos", href: "/settings/payments", icon: Settings },
  ];

  // Função segura para ler o localStorage apenas no navegador
  const getApiKey = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("@Hubkon:apiKey")?.slice(0, 15) || "API_KEY_MISSING";
    }
    return "CARREGANDO...";
  };

  return (
    <aside className="w-64 h-screen bg-[#080c14] border-r border-slate-800 flex flex-col p-6 fixed left-0 top-0 z-50">
      {/* LOGO AREA */}
      <div className="mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-black" />
          </div>
          <h1 className="text-white font-black text-xl italic tracking-tighter uppercase">HUBKON</h1>
        </div>
        <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase tracking-widest">B2B Terminal v0.3.3</p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          // Verifica se a rota está ativa (incluindo sub-rotas)
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${
                isActive 
                  ? "bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                  : "text-slate-500 hover:text-white hover:bg-slate-900"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / USER INFO */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="mb-4 px-2">
          <p className="text-[10px] font-black text-slate-400 uppercase truncate">
            {user?.name || "Empresa Admin"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-[8px] font-mono text-slate-600 truncate">
              ID: {getApiKey()}...
            </p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold text-[11px] uppercase"
        >
          <LogOut size={18} /> Encerrar Sessão
        </button>
      </div>
    </aside>
  );
}
