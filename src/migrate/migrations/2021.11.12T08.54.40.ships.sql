CREATE TABLE ships
(
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    x integer,
    y integer,
    user_id uuid NOT NULL,

    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	    REFERENCES users(id)
          ON DELETE CASCADE
);