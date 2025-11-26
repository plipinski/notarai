import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { UserModel } from '../models/User';

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await UserModel.find().sort({ createdAt: -1 }).lean();
  res.json(users);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.id).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;
  const user = await UserModel.findByIdAndUpdate(req.params.id, { role }, { new: true }).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await UserModel.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
