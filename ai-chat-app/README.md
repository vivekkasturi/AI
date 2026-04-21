## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# AI Chat App with RAG and Streaming

This project is a production-style AI chatbot built using:

- Next.js
- LangChain
- Groq LLM
- OpenAI Embeddings
- Retrieval Augmented Generation (RAG)
- MemoryVectorStore
- Streaming responses

## Features

- Streaming AI responses
- Session-based chat memory
- Context-aware answers using RAG
- Vector embeddings for document retrieval

## Architecture

User → NextJS API → Vector Store → LLM → Streaming Response → UI

## Future Improvements

- Supabase pgvector integration
- PDF upload support
- Production deployment
