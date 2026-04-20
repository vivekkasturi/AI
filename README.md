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

## Branching Strategy

This repository should use a simple Git flow:

- `main` is the stable branch and should contain only reviewed, ready-to-release work.
- `develop` is the integration branch for completed feature work before release.
- Every new feature should start from `develop` in a new `feature/<name>` branch.
- Feature branches should open pull requests into `develop`, not directly into `main`.
- When `develop` is stable, merge `develop` into `main`.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the day-to-day workflow.
