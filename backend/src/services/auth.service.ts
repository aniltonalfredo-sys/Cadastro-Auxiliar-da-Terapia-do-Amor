import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserResponse, AuthResponse, CurrentUserResponse } from '../types/auth';
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'terapia-do-amor-secret-2024';

class AuthService {
  async login(username: string, password: string): Promise<AuthResponse> {
    // Buscar usuário por nome ou email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: username },
          { name: { 
            contains: username } }
        ]
      }
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token
    const token = jwt.sign(
      { 
        userId: user.id,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retornar sem senha
    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      createdAt: user.createdAt
    };

    return {
      user: userResponse,
      token,
      message: 'Login realizado com sucesso!'
    };
  }

  async register(name: string, email: string, phone: string | undefined, password: string): Promise<Omit<AuthResponse, 'token'>> {
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { name: name }
        ]
      }
    });

    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
      }
    });

    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      createdAt: user.createdAt
    };

    return {
      user: userResponse,
      message: 'Usuário criado com sucesso!'
    };
  }

  async getCurrentUser(token: string): Promise<CurrentUserResponse> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return { user };
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

export default new AuthService();