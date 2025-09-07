# WebMail App MVP

A modern webmail application built with React, NestJS, and Docker.

## Project Structure

- `backend/` - NestJS API server
- `frontend/` - React Vite TypeScript application
- `infra/` - Docker infrastructure and configuration
- `worker/` - Background job processing (optional)

## Getting Started

1. Copy `infra/.env.example` to `infra/.env` and configure your environment variables
2. Run `docker-compose up` from the `infra/` directory
3. Access the application at `http://localhost:3000`

## Services

- **PostgreSQL** - Database
- **Postfix** - Mail Transfer Agent
- **Dovecot** - IMAP Server
- **Backend** - NestJS API
- **Frontend** - React Application

