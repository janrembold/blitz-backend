
-- systems

INSERT INTO systems (id, name, x, y, type, mob_type, level, asset_key) VALUES
(1, 'Molloch', 0, 0, 'elo', 'default', 1, 'sys1'),
(2, 'Natenzaal', 34, -23, 'elo', 'default', 1, 'sys1'),
(3, 'Spanghammar', -26, -50, 'elo', 'default', 1, 'sys1'),
(4, 'Saunanummi', -86, 14, 'carbon', 'default', 1, 'sys1'),
(5, 'Noord Bestorade', 16, 92, 'trit', 'default', 1, 'sys1'),
(6, 'Heerhugelbergen', 95, 17, 'carbon', 'default', 1, 'sys1'),
(7, 'Oostertricht', 50, -84, 'carbon', 'default', 1, 'sys1'),
(8, 'Lewispool', 117, -43, 'crypto', 'default', 1, 'sys1'),
(9, 'Uithuiselzaal', 72, -60, 'trit', 'default', 1, 'sys1'),
(10, 'Quackton', 75, 45, 'elo', 'default', 1, 'sys1'),
(11, 'Kungboda', 39, 40, 'carbon', 'default', 1, 'sys1');

-- Planets, Mines, Stations

INSERT INTO planets (id, system_id, name, type, asset_key, x, y) VALUES (1, 1, 'Earth', 'some-type', 'planet-earth', 0, 0);
INSERT INTO planets (id, system_id, name, type, asset_key, x, y) VALUES (2, 1, 'Saturn', 'some-type', 'planet-green', -450, 300);
INSERT INTO planets (id, system_id, name, type, asset_key, x, y) VALUES (3, 1, 'Foo', 'some-type', 'planet-blue', 150, -300);
INSERT INTO planets (id, system_id, name, type, asset_key, x, y) VALUES (4, 1, 'Bar', 'some-type', 'planet-violet', -850, 50);
INSERT INTO planets (id, system_id, name, type, asset_key, x, y) VALUES (5, 1, 'Baz', 'some-type', 'planet-light-grey', -50, -150);

INSERT INTO stations (system_id, name, type, asset_key, x, y) VALUES (1, 'Station #1', 'some-type', 'stations-satellite', 100, 100);

INSERT INTO mines (system_id, type, asset_key, capacity, min_capacity, max_capacity, x, y) VALUES 
(1, 'gold', 'mine-gold', 1500, 1000, 2000, 400, 400);
INSERT INTO mines (system_id, type, asset_key, capacity, min_capacity, max_capacity, x, y) VALUES 
(1, 'diamond', 'mine-diamond', 950, 800, 1000, -400, -400);


-- USERS and AUTHENTICATION

INSERT INTO users (id, name, planet_id) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b1', 'Foo', 1);
INSERT INTO users (id, name, planet_id) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', 'Bar', 1);

INSERT INTO authentications (user_id, email, password) 
    VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b1', 'foo@example.com', crypt('pass', gen_salt('bf', 8)));
INSERT INTO authentications (user_id, email, password) 
    VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', 'bar@example.com', crypt('pass', gen_salt('bf', 8)));


-- MOB SHIPS

INSERT INTO mob_ships (id, asset_key, type) VALUES (1, 'mob1', 'battle1');
INSERT INTO mob_ships (id, asset_key, type) VALUES (2, 'mob2', 'freight1');


-- USER SHIPS

INSERT INTO ships (id, user_id, name) VALUES (1, 'a81bc81b-dead-4e5d-abff-90865d1e13b1', 'Ship1.1');
INSERT INTO ships (id, user_id, name) VALUES (2, 'a81bc81b-dead-4e5d-abff-90865d1e13b1', 'Ship1.2');
INSERT INTO ships (id, user_id, name) VALUES (3, 'a81bc81b-dead-4e5d-abff-90865d1e13b1', 'Ship1.3');

INSERT INTO ships (id, user_id, name) VALUES (4, 'a81bc81b-dead-4e5d-abff-90865d1e13b2', 'Ship2.1');
INSERT INTO ships (id, user_id, name) VALUES (5, 'a81bc81b-dead-4e5d-abff-90865d1e13b2', 'Ship2.2');
INSERT INTO ships (id, user_id, name) VALUES (6, 'a81bc81b-dead-4e5d-abff-90865d1e13b2', 'Ship2.3');


-- USER SHIP POSITIONS

INSERT INTO ship_positions (ship_id, x, y) VALUES (1, 30, 30);
INSERT INTO ship_positions (ship_id, x, y) VALUES (2, 530, 530);
INSERT INTO ship_positions (ship_id, x, y) VALUES (4, 230, 400);

