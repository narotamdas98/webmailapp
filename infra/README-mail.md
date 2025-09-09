# WebMail App - Mail Integration Guide

This guide explains how to use the integrated Postfix + Dovecot mail system with the WebMail App.

## Architecture

- **Postfix**: SMTP server for sending emails (port 2525 on host)
- **Dovecot**: IMAP server for fetching emails (port 1143 on host)
- **PostgreSQL**: Database for user authentication and mail metadata
- **NestJS Backend**: API server with mail services

## Quick Start

### 1. Start All Services

```bash
# Copy environment file
cp infra/env.example infra/.env

# Start all services
docker compose -f infra/docker-compose.yml up --build -d
```

### 2. Create Database Migration

```bash
# Generate and run Prisma migration for dovecot_password field
cd backend
npx prisma migrate dev --name add_dovecot_password
```

### 3. Signup a User

```bash
# Signup via API (creates both bcrypt and SHA512-CRYPT hashes)
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice User",
    "email": "alice@webmailapp.com",
    "password": "password123"
  }'
```

### 4. Create Maildir for User

```bash
# Create maildir structure for the user
docker compose -f infra/docker-compose.yml exec postfix /scripts/create_maildir.sh webmailapp.com alice
```

### 5. Test Email Sending

```bash
# Login to get JWT token
TOKEN=$(curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@webmailapp.com", "password": "password123"}' | jq -r '.access_token')

# Send email via SMTP
curl -X POST http://localhost:3001/mail/send-smtp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "toEmail": "bob@webmailapp.com",
    "subject": "Test Email",
    "body": "This is a test email sent via SMTP"
  }'
```

### 6. Test Email Fetching

```bash
# Fetch inbox from IMAP (using plain password for MVP)
curl "http://localhost:3001/mail/fetch-inbox?mailPassword=password123" \
  -H "Authorization: Bearer $TOKEN"
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create user with bcrypt + SHA512-CRYPT hashes
- `POST /auth/login` - Login and get JWT token

### Mail Operations
- `POST /mail/send` - Send email (database only)
- `POST /mail/send-smtp` - Send email via SMTP
- `GET /mail/inbox` - Get inbox from database
- `GET /mail/sent` - Get sent emails from database
- `GET /mail/fetch-inbox` - Fetch inbox from IMAP server
- `GET /mail/fetch-message?uid=<uid>` - Fetch specific message content

## Configuration

### Environment Variables

Key environment variables in `infra/.env`:

```env
# Database
POSTGRES_USER=webmailappuser
POSTGRES_PASSWORD=changeme
POSTGRES_DB=webmailappdb

# Mail Database
MAIL_DB_HOST=postgres
MAIL_DB_USER=webmailappuser
MAIL_DB_PASSWORD=changeme
MAIL_DB_NAME=webmailappdb
MAIL_DOMAIN=webmailapp.com
VMAIL_UID=5000
VMAIL_GID=5000

# Backend Mail
SMTP_HOST=postfix
SMTP_PORT=25
IMAP_HOST=dovecot
IMAP_PORT=143
```

### Port Mappings

- **Postfix SMTP**: `localhost:2525` (container port 25)
- **Dovecot IMAP**: `localhost:1143` (container port 143)
- **Backend API**: `localhost:3001`
- **Frontend**: `localhost:3000`
- **PostgreSQL**: `localhost:5432`

## Mail Directory Structure

Maildirs are created at `/var/mail/vhosts/<domain>/<user>/Maildir/` with subdirectories:
- `cur/` - Current messages
- `new/` - New messages
- `tmp/` - Temporary messages

## Security Notes

- For MVP, the system accepts plain passwords for IMAP authentication
- In production, implement proper password handling and TLS encryption
- SHA512-CRYPT hashes are used for Dovecot authentication
- bcrypt hashes are used for application authentication

## Troubleshooting

### Check Service Status
```bash
docker compose -f infra/docker-compose.yml ps
```

### View Logs
```bash
# All services
docker compose -f infra/docker-compose.yml logs

# Specific service
docker compose -f infra/docker-compose.yml logs postfix
docker compose -f infra/docker-compose.yml logs dovecot
docker compose -f infra/docker-compose.yml logs backend
```

### Test SMTP Connection
```bash
# Test SMTP from host
telnet localhost 2525
```

### Test IMAP Connection
```bash
# Test IMAP from host
telnet localhost 1143
```

## Development Notes

- The system uses Docker Compose for orchestration
- All services are connected via the `webmailapp_net` network
- Mail data is persisted in the `maildata` Docker volume
- Database migrations should be run after schema changes
