import axios from "axios";

const api = axios.create({
  // ✅ Padrão HUBKON Master Engine
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 15000, // 🛡️ Timeout de 15s para evitar requisições penduradas
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🛡️ INTERCEPTOR DE REQUISIÇÃO
 * Injeta credenciais de segurança em cada chamada.
 */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("@Hubkon:token");
    const apiKey = localStorage.getItem("@Hubkon:apiKey");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * 🚨 INTERCEPTOR DE RESPOSTA
 * Gestão de Erros de Sessão e Falhas de Conectividade.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Tratamento de Erros de Autorização (Token Inválido/Expirado)
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Evita loop infinito se já estivermos na tela de login
      if (!window.location.pathname.includes("/login")) {
        console.warn("🛡️ Sessão Soberana Expirada. Reiniciando Terminal...");
        localStorage.removeItem("@Hubkon:token");
        localStorage.removeItem("@Hubkon:user");
        window.location.href = "/login";
      }
    }

    // 2. Tratamento de Erros de Conectividade (Backend Offline)
    if (!error.response) {
      console.error("🔥 Master Engine Offline ou Erro de Rede.");
    }

    return Promise.reject(error);
  }
);

export default api;
