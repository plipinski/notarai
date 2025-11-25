import { Schema, model, Types } from 'mongoose';

const documentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    status: { type: String, enum: ['processing', 'ready', 'error'], default: 'processing' }
  },
  { timestamps: true }
);

export const DocumentModel = model('Document', documentSchema);
