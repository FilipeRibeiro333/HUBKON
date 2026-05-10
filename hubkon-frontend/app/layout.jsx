"use client";
import { useState, useEffect } from "react"; // 👈 Adicionado
import './globals.css';
import Sidebar from './components/Sidebar';
import useAuth from './Hook/useAuth';
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const { authenticated, loading } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false); // 👈 Controle de hidratação

  // Garante que o código só execute a lógica de UI no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = pathname === "/login" || pathname === "/";
  
  // Só avaliamos showSidebar se estiver montado, caso contrário o servidor envia 'false'
  const showSidebar = mounted && !isAuthPage && authenticated && !loading;

  return (
    <html lang="pt" suppressHydrationWarning> 
      <body 
        className="bg-[#080c14] text-slate-300 font-sans flex overflow-x-hidden"
        suppressHydrationWarning // 👈 Ignora atributos injetados por extensões (ColorZilla, etc)
      >
        {/* Renderiza a Sidebar apenas se passar na validação e estiver no cliente */}
        {showSidebar && <Sidebar />}

        <main className={`flex-1 min-h-screen transition-all duration-300 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
          {children}
        </main>
      </body>
    </html>
  );
}

