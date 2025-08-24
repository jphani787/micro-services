-- Initialize separate database for each microservice
-- This script runs when PostgreSQL container starts for the first time

-- Create database for each service
CREATE DATABASE microservices_auth;
CREATE DATABASE microservices_users;
CREATE DATABASE microservices_notes;
CREATE DATABASE microservices_tags;


-- Grant permissions to the microservices user
GRANT ALL PRIVILEGES ON DATABASE microservices_auth TO postgres;
GRANT ALL PRIVILEGES ON DATABASE microservices_users TO postgres;
GRANT ALL PRIVILEGES ON DATABASE microservices_notes TO postgres;
GRANT ALL PRIVILEGES ON DATABASE microservices_tags TO postgres;