CREATE TABLE users
(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    timezone text, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);