import { Schema, model, Types } from 'mongoose';

const conversationSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New chat' }
  },
  { timestamps: true }
);

export const ConversationModel = model('Conversation', conversationSchema);
