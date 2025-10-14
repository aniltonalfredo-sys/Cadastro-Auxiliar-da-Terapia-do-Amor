import { Request, Response } from "express";
import * as service from "../services/auxiliar.service";

export const criar = async (req: Request, res: Response) => {
  try {
    const { file } = req;
    const dados = { ...req.body, foto: file ? file.filename : null };

    const auxiliar = await service.criarAuxiliar(dados);
    return res.status(201).json(auxiliar);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const listar = async (_req: Request, res: Response) => {
  try {
    const lista = await service.listarAuxiliares();
    return res.status(200).json(lista);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const buscar = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const auxiliar = await service.buscarAuxiliar(id);
    return res.status(200).json(auxiliar);
  } catch (error: any) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

export const atualizar = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { file } = req;
    const dados = { ...req.body, foto: file ? file.filename : req.body.foto };
    const atualizado = await service.atualizarAuxiliar(id, dados);
    return res.status(200).json(atualizado);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const resultado = await service.eliminarAuxiliar(id);
    return res.status(200).json(resultado);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
