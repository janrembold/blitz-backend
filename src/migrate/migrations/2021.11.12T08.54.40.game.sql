CREATE TABLE systems (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    asset_key TEXT NOT NULL,
    level INT NOT NULL,
    x INT,
    y INT
);

CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    system_id INT NOT NULL,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    asset_key TEXT NOT NULL,
    x INT,
    y INT,

    CONSTRAINT fk_destinations_systems
      FOREIGN KEY(system_id) 
	      REFERENCES systems(id)
          ON DELETE CASCADE
);

ALTER TABLE users 
  ADD destination_id INT NOT NULL,
  ADD CONSTRAINT fk_users_destinations
    FOREIGN KEY (destination_id) 
      REFERENCES destinations(id);

CREATE TABLE mob_ships
(
    id SERIAL PRIMARY KEY,
    asset_key TEXT NOT NULL
);

CREATE TABLE mob_ship_positions
(
    id BIGSERIAL PRIMARY KEY,
    mob_ship_id INT NOT NULL,
    routing_points JSONB NOT NULL,
    speed INT NOT NULL,
    blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

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
    x INT, 
    y INT, 
    target_ship_position_id INT,
    target_mob_ship_position_id INT,
    target_x INT,
    target_y INT,
    blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

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