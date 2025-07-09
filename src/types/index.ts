import { Request } from "express";

export interface AuthenticatedRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
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
  completed?: boolean;
}

export interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}
