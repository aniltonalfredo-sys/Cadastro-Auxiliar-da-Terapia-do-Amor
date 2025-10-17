import axios from "axios";
import type { Auxiliary } from "../components/AuxiliariesTable";

interface LoginData {
  username: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
  };
  token: string;
  message: string;
}



export const api = axios.create({
  baseURL: "http://localhost:8090/api", // ← Remove "auxiliares" daqui
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function login(data: LoginData): Promise<AuthResponse>{
  const res = await api.post(`/auth/login`, data)

  if(res.data.token){
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user))
  }
  return res.data;
}
// Utilitários para autenticação
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

export function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

export function getCurrentUserData() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}



export async function criarAuxiliar(data: Auxiliary) {
  const res = await api.post("/auxiliares", data); 
  return res.data;
}

export async function listarAuxiliares() {
  const res = await api.get("/auxiliares"); 
  return res.data;
}

export async function actualizarAuxiliar(id: string, data: Auxiliary) {
  const res = await api.patch(`/auxiliares/${id}`, data);
  return res.data;
}

