-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    current_weight DECIMAL(5,2) NOT NULL,
    height DECIMAL(5,2) NOT NULL,
    active INTEGER NOT NULL CHECK (active BETWEEN 1 AND 3),
    blood_pressure VARCHAR(10),
    weight_goal DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_user_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Insert some sample data
INSERT INTO users (email, password, firstname, lastname, current_weight, height, active, weight_goal)
VALUES 
('john.doe@example.com', 'hashed_password_here', 'John', 'Doe', 80.5, 180, 2, 75),
('jane.smith@example.com', 'hashed_password_here', 'Jane', 'Smith', 65, 165, 3, 60)
ON CONFLICT (email) DO NOTHING;

-- Create an index on the email column for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);