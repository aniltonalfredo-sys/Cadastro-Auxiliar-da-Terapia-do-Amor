import axios from "axios";
import type { Auxiliary } from "../components/AuxiliariesTable";
// import { api } from "@/api/api";


export const api = axios.create({
  baseURL: "http://localhost:8090/api/auxiliares", // ajusta se usares porta diferente
});



// export async function cadastrarAuxiliar(data: any) {
//   const formData = new FormData();

//   // campos principais
//   formData.append("nome", data.nome);
//   formData.append("igreja", data.igreja);
//   formData.append("regiao", data.regiao);
//   formData.append("estadoCivil", data.estadoCivil);
//   formData.append("telefone", data.telefone);
//   formData.append("obreiro", String(data.obreiro));
//   formData.append("batizado", String(data.batizado));
//   if (data.foto) formData.append("foto", data.foto);

//   // endereço residencial
//   formData.append("enderecoResidencial[provincia]", data.enderecoResidencial.provincia);
//   formData.append("enderecoResidencial[municipio]", data.enderecoResidencial.municipio);
//   formData.append("enderecoResidencial[bairro]", data.enderecoResidencial.bairro);
//   formData.append("enderecoResidencial[rua]", data.enderecoResidencial.rua);
//   formData.append("enderecoResidencial[numeroCasa]", data.enderecoResidencial.numeroCasa);
//   formData.append("enderecoResidencial[pontoReferencia]", data.enderecoResidencial.pontoReferencia);

//   // endereço igreja
//   formData.append("enderecoIgreja[provincia]", data.enderecoIgreja.provincia);
//   formData.append("enderecoIgreja[municipio]", data.enderecoIgreja.municipio);
//   formData.append("enderecoIgreja[bairro]", data.enderecoIgreja.bairro);
//   formData.append("enderecoIgreja[rua]", data.enderecoIgreja.rua);
//   formData.append("enderecoIgreja[numeroCasa]", data.enderecoIgreja.numeroCasa);
//   formData.append("enderecoIgreja[pontoReferencia]", data.enderecoIgreja.pontoReferencia);

//   // cônjuge (opcional)
//   if (data.conjuge) {
//     formData.append("conjuge[nome]", data.conjuge.nome);
//     formData.append("conjuge[telefone]", data.conjuge.telefone);
//     formData.append("conjuge[foto]", data.conjuge.foto);
//     formData.append("conjuge[obreiro]", String(data.conjuge.obreiro));
//     formData.append("conjuge[batizado]", String(data.conjuge.batizado));
//   }

//   const res = await api.post("/auxiliares", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

//   return res.data;
// }

export async function criarAuxiliar(data: Auxiliary) {
  const res = await api.post("/", data);
  return res.data;
}

export async function listarAuxiliares() {
  const res = await api.get("/");
  return res.data;
}