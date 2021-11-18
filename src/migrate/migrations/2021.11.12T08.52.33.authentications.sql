CREATE TABLE authentications
(
    id SERIAL PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    user_id uuid NOT NULL,

    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	    REFERENCES users(id)
          ON DELETE CASCADE
);