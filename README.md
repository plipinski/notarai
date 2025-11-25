# Notarai

Full-stack TypeScript scaffold that wires a React + Vite client, Express API, MongoDB models with vector search, JWT auth with refresh tokens, OpenAI chat/embeddings, and Tailwind styling.

## Tech stack
- **Client:** React, TypeScript, Vite, TailwindCSS, React Router, React Query, Axios
- **Server:** Express, TypeScript, Mongoose, JWT (http-only cookies), Multer uploads, Mammoth DOCX parsing, OpenAI SDK, Zod env validation
- **Database:** MongoDB Atlas with Vector Search (DocumentChunk collection has `embedding` vector index named `embedding_index`)
- **Package manager:** npm workspaces (`client/`, `server/`)

## Getting started
1. Install dependencies
   ```bash
   npm install
   ```
2. Create environment files
   - `server/.env`
     ```env
     PORT=4000
     MONGODB_URI=mongodb+srv://...
     JWT_ACCESS_SECRET=replace-me
     JWT_REFRESH_SECRET=replace-me-too
     OPENAI_API_KEY=sk-...
     OPENAI_CHAT_MODEL=gpt-4o-mini
     OPENAI_EMBEDDING_MODEL=text-embedding-3-large
     CLIENT_ORIGIN=http://localhost:5173
     COOKIE_DOMAIN=localhost
     ```
   - (Optional) `client/.env` for custom Vite vars
3. Run in development (client + server)
   ```bash
   npm run dev
   ```
4. Build
   ```bash
   npm run build
   ```

## Project layout
```
client/        React app (Vite)
server/        Express API
```

### Client highlights
- Routes: `/login`, `/register`, `/chat`, `/files`, `/profile`, `/admin/users`
- ProtectedRoute wrapper guards auth + admin-only routes
- Chat UI with conversation list, message list, composer
- Files UI for multi-upload (.docx), status table, delete
- Admin users table to change roles and delete users

### Server highlights
- Auth endpoints: register/login/refresh/logout/me with JWT cookies (15m access, 7d refresh)
- User admin endpoints (list/get/update/delete)
- Conversation + message endpoints with OpenAI completion and vector context lookup
- File upload pipeline: DOCX extraction → chunking → OpenAI embeddings → MongoDB vector chunks
- Env validation via Zod; security headers via Helmet; CORS configured for client origin

## MongoDB Atlas vector index
Create an index on `DocumentChunk` collection named `embedding_index` similar to:
```json
{
  "fields": [
    { "type": "vector", "path": "embedding", "numDimensions": 3072, "similarity": "cosine" },
    { "type": "filter", "path": "userId" },
    { "type": "filter", "path": "documentId" }
  ]
}
```
Adjust `numDimensions` to match your embedding model.

## Notes
- Auth tokens are http-only cookies; client Axios is configured with `withCredentials`.
- Uploaded files are stored under `uploads/` on disk for simplicity; metadata + embeddings are kept in MongoDB.
- Controllers are intentionally concise so you can expand validation, error handling, and streaming as needed.
