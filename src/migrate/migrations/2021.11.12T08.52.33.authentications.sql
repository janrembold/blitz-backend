CREATE TABLE authentications
(
    id SERIAL PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    user_id uuid NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_authentications_users
      FOREIGN KEY(user_id) 
	    REFERENCES users(id)
          ON DELETE CASCADE
);