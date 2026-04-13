"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// ✅ Ajustado para o nome real da sua pasta: "Hook"
import useAuth from "./Hook/useAuth"; 

export default function Home() {
  const router = useRouter();
  const { authenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (authenticated) {
        router.push("/dashboard"); // Redireciona para o painel se houver sessão
      } else {
        router.push("/login"); // Redireciona para o login se não estiver autenticado
      }
    }
  }, [authenticated, loading, router]);

  // Enquanto verifica o estado da sessão, exibe a tela de carregamento temática
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080c14]">
        <div className="text-emerald-500 font-mono animate-pulse tracking-[0.2em] text-xs uppercase">
          Verificando Credenciais Soberanas...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#080c14]">
      <div className="text-emerald-500 font-mono animate-pulse">
        INICIALIZANDO PROTOCOLO HUBKON...
      </div>
    </div>
  );
}
