import { useState, useEffect } from "react";
// ✅ Ajustado: Sobe dois níveis para sair de 'app/Hook' e chegar na raiz 'services'
import api from "../../services/api";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 PERSISTÊNCIA: Recupera o usuário ao carregar a página
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("@Hubkon:user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Erro ao processar dados do utilizador");
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      if (typeof window !== "undefined") {
        // Guarda dados com prefixo para evitar conflitos
        localStorage.setItem("@Hubkon:token", token);
        localStorage.setItem("@Hubkon:user", JSON.stringify(user));
        
        // 🔑 ESSENCIAL: Garante que a API Key da empresa seja salva
        const apiKey = user.apiKey || res.data.apiKey;
        if (apiKey) {
          localStorage.setItem("@Hubkon:apiKey", apiKey);
        }
      }

      setUser(user);
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Falha na autenticação");
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear(); // Limpa todas as chaves @Hubkon
      setUser(null);
      window.location.href = "/login";
    }
  };

  return { 
    user, 
    login, 
    logout, 
    loading, 
    authenticated: !!user 
  };
}
