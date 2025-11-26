import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { ConversationModel } from '../models/Conversation';
import { MessageModel } from '../models/Message';
import { AuthRequest } from '../middlewares/authMiddleware';
import { findRelevantChunks } from '../services/vectorService';
import { generateChatCompletion } from '../services/openaiService';

export const listConversations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const conversations = await ConversationModel.find({ userId: req.user!.id })
    .sort({ updatedAt: -1 })
    .lean();
  res.json(conversations);
});

export const createConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const conversation = await ConversationModel.create({ userId: req.user!.id, title: req.body.title || 'New chat' });
  res.json(conversation);
});

export const listMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const messages = await MessageModel.find({ conversationId: req.params.id }).sort({ createdAt: 1 }).lean();
  res.json(messages);
});

export const postMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  const conversationId = req.params.id;

  const userMessage = await MessageModel.create({ conversationId, role: 'user', content });

  const contextChunks = await findRelevantChunks(req.user!.id, content, 6);
  const contextText = contextChunks.map((c, idx) => `Chunk ${idx + 1}: ${c.text}`).join('\n');

  const assistantContent = await generateChatCompletion([
    {
      role: 'system',
      content:
        'Use the provided context from the user\'s documents when relevant. If the answer is not in the documents, fall back to general knowledge.'
    },
    { role: 'assistant', content: `Context:\n${contextText || 'No context available.'}` },
    { role: 'user', content }
  ]);

  const assistantMessage = await MessageModel.create({ conversationId, role: 'assistant', content: assistantContent });

  res.json([userMessage, assistantMessage]);
});
