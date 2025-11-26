import OpenAI from 'openai';
import { env } from '../config/env';

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const createEmbedding = async (text: string) => {
  const response = await client.embeddings.create({
    model: env.OPENAI_EMBEDDING_MODEL,
    input: text
  });
  return response.data[0].embedding;
};

export const generateChatCompletion = async (
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
) => {
  const response = await client.chat.completions.create({
    model: env.OPENAI_CHAT_MODEL,
    messages
  });
  return response.choices[0].message?.content ?? '';
};
