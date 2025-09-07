-- Initialize the webmailapp database
-- This script runs when the PostgreSQL container starts for the first time

-- Create the main database (already created by POSTGRES_DB env var)
-- CREATE DATABASE webmailappdb;

-- Create the application user
CREATE USER webmailappuser WITH PASSWORD 'my_password';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE webmailappdb TO webmailappuser;

-- Connect to the webmailappdb database
\c webmailappdb;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO webmailappuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO webmailappuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO webmailappuser;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO webmailappuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO webmailappuser;