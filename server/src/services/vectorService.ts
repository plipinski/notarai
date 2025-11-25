import { DocumentChunkModel } from '../models/DocumentChunk';
import { createEmbedding } from './openaiService';

export const findRelevantChunks = async (userId: string, text: string, limit = 5) => {
  const embedding = await createEmbedding(text);

  const results = await DocumentChunkModel.aggregate([
    {
      $vectorSearch: {
        index: 'embedding_index',
        path: 'embedding',
        queryVector: embedding,
        numCandidates: 50,
        limit,
        filter: { userId }
      }
    }
  ]);

  return results.map((r) => ({ text: r.text, documentId: r.documentId }));
};
