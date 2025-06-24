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
  const token = localStorage.getItem("token");
  if (token) {
    // Se o token existir, adiciona o cabeçalho de autorização em TODAS as requisições
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos para aprovações
export interface ApprovalItem {
  id: string;
  title: string;
  type: string;
  creatorName: string;
  departmentOrArea: string;
  submittedAt: string;
  currentStatus: string;
}

// Métodos para aprovações
export const approvalService = {
  // Buscar aprovações pendentes
  getPendingApprovals: async (): Promise<ApprovalItem[]> => {
    const response = await api.get("/approvals/pending");
    return response.data;
  },

  // Aprovar um item
  approveItem: async (id: string, type: string): Promise<void> => {
    await api.put(`/approvals/${id}/approve?type=${type}`);
  },

  // Rejeitar um item
  rejectItem: async (id: string, type: string): Promise<void> => {
    await api.put(`/approvals/${id}/reject?type=${type}`);
  },
};

export default api;
