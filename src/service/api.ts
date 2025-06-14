import axios from "axios";

// A URL base do seu backend Spring Boot.
// O Spring Boot, por padrão, roda na porta 8080.
const baseURL = "http://localhost:8080";

const api = axios.create({
  baseURL: baseURL,
});

// --- INTERCEPTOR PARA ADICIONAR O TOKEN ---
// Falaremos mais sobre isso no Passo 4!
api.interceptors.request.use(async (config) => {
  // Busca o token do localStorage
  const token = localStorage.getItem("authToken");
  if (token) {
    // Se o token existir, adiciona o cabeçalho de autorização em TODAS as requisições
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
