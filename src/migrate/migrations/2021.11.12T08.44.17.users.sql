CREATE TABLE users
(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    timezone TEXT, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);