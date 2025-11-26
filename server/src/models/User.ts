import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
  },
  { timestamps: true }
);

export const UserModel = model('User', userSchema);
export type UserDocument = typeof userSchema extends infer T ? (T extends { obj: infer O } ? O : never) : never;
