CREATE TABLE mob_ships
(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE mob_ship_positions
(
    id BIGSERIAL PRIMARY KEY,
    mob_ship_id INT NOT NULL,
    routing_points JSONB NOT NULL,
    blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_mob_ship_positions_mob_ships
      FOREIGN KEY(mob_ship_id) 
	      REFERENCES mob_ships(id)
          ON DELETE CASCADE
);

CREATE TABLE ships
(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id UUID NOT NULL,

    CONSTRAINT fk_ships_users
      FOREIGN KEY(user_id) 
	      REFERENCES users(id)
          ON DELETE CASCADE
);

CREATE TABLE ship_positions
(
    id SERIAL PRIMARY KEY,
    ship_id INT NOT NULL,
    x INTEGER, 
    y INTEGER, 
    target_ship_position_id INTEGER,
    target_mob_ship_position_id INTEGER,
    target_x INTEGER,
    target_y INTEGER,
    blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ship_positions_ships
      FOREIGN KEY(ship_id) 
	      REFERENCES ships(id)
          ON DELETE CASCADE,

    CONSTRAINT fk_ship_positions_target_ship_positions
      FOREIGN KEY(target_ship_position_id) 
	      REFERENCES ship_positions(id),

    CONSTRAINT fk_ship_positions_target_mob_ship_positions
      FOREIGN KEY(target_mob_ship_position_id) 
	      REFERENCES mob_ship_positions(id)     
);