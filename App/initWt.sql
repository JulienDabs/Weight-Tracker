-- SQL script updated to match the current Prisma model

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create weights table
CREATE TABLE IF NOT EXISTS weights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    weight FLOAT NOT NULL,
    user_id UUID NOT NULL)