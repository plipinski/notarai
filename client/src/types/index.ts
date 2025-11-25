export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface DocumentFile {
  _id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  status: 'processing' | 'ready' | 'error';
}
