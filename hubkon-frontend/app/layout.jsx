"use client";
import './globals.css';
import Sidebar from './components/Sidebar';
import useAuth from './Hook/useAuth';
import { usePathname } from "next/navigation"; // 👈 Importante para detetar a página

export default function RootLayout({ children }) {
  const { authenticated, loading } = useAuth();
  const pathname = usePathname();

  // 🛡️ LISTA NEGRA: Páginas que NUNCA devem mostrar a Sidebar
  // Adicione aqui "/register" se tiver uma página de registo
  const isAuthPage = pathname === "/login" || pathname === "/";

  // A Sidebar só aparece se: NÃO for página de login E o utilizador estiver logado
  const showSidebar = !isAuthPage && authenticated && !loading;

  return (
    <html lang="pt">
      <body className="bg-[#080c14] text-slate-300 font-sans flex overflow-x-hidden">
        
        {/* Renderiza a Sidebar apenas se passar na validação acima */}
        {showSidebar && <Sidebar />}

        {/* 
            Ajusta a margem dinâmica: 
            Se mostrar a sidebar, empurra 64 (256px). 
            Se for login, a margem é 0 e o conteúdo centraliza.
        */}
        <main className={`flex-1 min-h-screen transition-all duration-300 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
          {children}
        </main>
      </body>
    </html>
  );
}
