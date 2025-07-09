import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JwtPayload } from "../types";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
