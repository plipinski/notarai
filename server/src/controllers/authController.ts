import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { comparePassword, hashPassword, signAccessToken, signRefreshToken } from '../services/authService';
import { env } from '../config/env';
import { AuthRequest } from '../middlewares/authMiddleware';

const setTokens = (res: Response, userId: string, role: 'admin' | 'user') => {
  const accessToken = signAccessToken(userId, role);
  const refreshToken = signRefreshToken(userId, role);
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    domain: env.COOKIE_DOMAIN || undefined,
    path: '/'
  };
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existing = await UserModel.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const passwordHash = await hashPassword(password);
  const user = await UserModel.create({ email, passwordHash });
  setTokens(res, user._id.toString(), user.role);
  res.json({ _id: user._id, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  setTokens(res, user._id.toString(), user.role);
  res.json({ _id: user._id, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'Missing refresh token' });
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; role: 'admin' | 'user' };
    setTokens(res, payload.id, payload.role);
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const user = await UserModel.findById(req.user.id).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ _id: user._id, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt });
});
