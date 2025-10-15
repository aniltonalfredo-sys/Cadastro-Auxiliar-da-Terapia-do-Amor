import axios from "axios";
import type { Auxiliary } from "../components/AuxiliariesTable";


export const api = axios.create({
  baseURL: "http://localhost:8090/api/auxiliares", // ajusta se usares porta diferente
});

export async function criarAuxiliar(data: Auxiliary) {
  const res = await api.post("/", data);
  return res.data;
}

export async function listarAuxiliares() {
  const res = await api.get("/");
  return res.data;
}

export async function actualizarAuxiliar(id: string, data: Auxiliary) {
  const res = await api.patch(`/${id}`, data);
  return res.data;
}