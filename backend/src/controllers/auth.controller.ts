import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { LoginRequest, RegisterRequest } from '../types/auth';

class AuthController {
  async login(req: Request<{}, {}, LoginRequest>, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Nome/email e senha são obrigatórios' });
      }

      const result = await authService.login(username, password);
      res.status(200).json(result);
      
    } catch (error: any) {
      console.error('Erro no login:', error.message);
      res.status(401).json({ error: error.message });
    }
  }

  async register(req: Request<{}, {}, RegisterRequest>, res: Response) {
    try {
      const { name, email, phone, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      const result = await authService.register(name, email, phone, password);
      res.status(201).json(result);
      
    } catch (error: any) {
      console.error('Erro ao registrar:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      const result = await authService.getCurrentUser(token);
      res.status(200).json(result);
      
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error.message);
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    res.status(200).json({ message: 'Logout realizado com sucesso' });
  }
}

export default new AuthController();