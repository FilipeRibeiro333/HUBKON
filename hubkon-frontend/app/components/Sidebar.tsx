"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, Wallet, Users, Cpu, 
  LogOut, Building2, Settings, ShieldCheck, Webhook, Lock 
} from "lucide-react";
import useAuth from "../Hook/useAuth";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Definição de hierarquia para o Paywall
  const planLevels = { "basic": 1, "pro": 2, "enterprise": 3 };
  const userLevel = planLevels[user?.plan?.toLowerCase()] || 1;
  const isSuperAdmin = user?.role === "superadmin";

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, minLevel: 1 },
    { name: "Contratos", href: "/contracts", icon: FileText, minLevel: 1 },
    { name: "Carteira", href: "/wallet", icon: Wallet, minLevel: 1 },
    { name: "Usuários", href: "/users", icon: Users, minLevel: 1 },
    { name: "KYC", href: "/kyc", icon: ShieldCheck, minLevel: 1 },
    // RECURSOS PAGOS
    { name: "Hook", href: "/Hook", icon: Webhook, minLevel: 2 }, // Exige PRO
    { name: "Blockchain", href: "/explorer", icon: Cpu, minLevel: 3 }, // Exige ENTERPRISE
    { name: "Pagamentos", href: "/settings/payments", icon: Settings, minLevel: 1 },
  ];

  const getApiKey = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("@Hubkon:apiKey")?.slice(0, 15) || "API_KEY_MISSING";
    }
    return "CARREGANDO...";
  };

  return (
    <aside className="w-64 h-screen bg-[#080c14] border-r border-slate-800 flex flex-col p-6 fixed left-0 top-0 z-50 font-mono">
      <div className="mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-black" />
          </div>
          <h1 className="text-white font-black text-xl italic tracking-tighter uppercase">HUBKON</h1>
        </div>
        <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest">B2B Terminal v0.3.3</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          // Trava Lógica: Se não for SuperAdmin e o nível do plano for menor que o exigido
          const isLocked = !isSuperAdmin && userLevel < item.minLevel;

          return (
            <Link 
              key={item.name} 
              href={isLocked ? "/settings/payments" : item.href} 
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${
                isActive 
                  ? "bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                  : isLocked 
                    ? "text-slate-700 cursor-not-allowed opacity-50" 
                    : "text-slate-500 hover:text-white hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                {item.name}
              </div>
              
              {isLocked && <Lock size={12} className="text-amber-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="mb-4 px-2">
          <div className="flex justify-between items-center mb-1">
             <p className="text-[10px] font-black text-slate-400 uppercase truncate">
               {user?.name || "Empresa Admin"}
             </p>
             <span className="text-[7px] bg-purple-900/40 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded font-black uppercase">
               {user?.plan || "Basic"}
             </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full animate-pulse ${getApiKey() === "API_KEY_MISSING" ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
            <p className="text-[8px] font-mono text-slate-600 truncate">ID: {getApiKey()}...</p>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold text-[11px] uppercase" >
          <LogOut size={18} /> Encerrar Sessão
        </button>
      </div>
    </aside>
  );
}
