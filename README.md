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
