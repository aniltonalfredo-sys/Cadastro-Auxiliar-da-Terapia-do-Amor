import axios from "axios";
import type { Auxiliary } from "../components/AuxiliariesTable";

export const api = axios.create({
  baseURL: "http://localhost:8090/api", // ← Remove "auxiliares" daqui
});

export async function criarAuxiliar(data: Auxiliary) {
  const res = await api.post("/auxiliares", data); // ← POST para /auxiliares
  return res.data;
}

export async function listarAuxiliares() {
  const res = await api.get("/auxiliares"); // ← GET para /auxiliares
  return res.data;
}

export async function actualizarAuxiliar(id: string, data: Auxiliary) {
  const res = await api.patch(`/auxiliares/${id}`, data); // ← PATCH para /auxiliares/:id
  return res.data;
}