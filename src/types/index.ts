import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  due_date?: string; // ISO string
  status?: string;
  category_id?: number;
}

export interface TaskQueryParams {
  page?: string;
  limit?: string;
  status?: string;
  category_id?: string;
  search?: string;
  sort?: string;
}

export interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}
