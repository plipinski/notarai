import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import mammoth from 'mammoth';
import { v4 as uuid } from 'uuid';
import { DocumentModel } from '../models/Document';
import { DocumentChunkModel } from '../models/DocumentChunk';
import { AuthRequest } from '../middlewares/authMiddleware';
import { createEmbedding } from '../services/openaiService';

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const chunkText = (text: string, chunkSize = 1200) => {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

export const uploadFiles = asyncHandler(async (req: AuthRequest, res: Response) => {
  const files = (req.files || []) as Express.Multer.File[];
  const docs = [];

  for (const file of files) {
    const filename = `${uuid()}-${file.originalname}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, file.buffer);

    const doc = await DocumentModel.create({
      userId: req.user!.id,
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      status: 'processing'
    });

    try {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      const chunks = chunkText(result.value);

      for (let i = 0; i < chunks.length; i++) {
        const embedding = await createEmbedding(chunks[i]);
        await DocumentChunkModel.create({
          documentId: doc._id,
          userId: req.user!.id,
          text: chunks[i],
          embedding,
          chunkIndex: i
        });
      }

      await DocumentModel.findByIdAndUpdate(doc._id, { status: 'ready' });
    } catch (err) {
      await DocumentModel.findByIdAndUpdate(doc._id, { status: 'error' });
    }

    docs.push(doc);
  }

  res.json(docs);
});

export const listFiles = asyncHandler(async (req: AuthRequest, res: Response) => {
  const docs = await DocumentModel.find({ userId: req.user!.id }).sort({ createdAt: -1 }).lean();
  res.json(docs);
});

export const deleteFile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const doc = await DocumentModel.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  if (doc.userId.toString() !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await DocumentChunkModel.deleteMany({ documentId: doc._id });
  await doc.deleteOne();
  res.json({ success: true });
});
