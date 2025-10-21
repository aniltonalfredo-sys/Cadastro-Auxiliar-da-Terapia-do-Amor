export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  createdAt: Date;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  message: string;
}

export interface CurrentUserResponse {
  user: UserResponse;
}