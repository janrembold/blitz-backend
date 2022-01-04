
-- systems

INSERT INTO systems (id, name, x, y, type, level, asset_key) VALUES
(1, 'Ambar', 0, 0, 'elo', 1, 'sys1'),
(2, 'Natenzaal', 34, -23, 'elo', 1, 'sys1'),
(3, 'Spanghammar', -26, -50, 'elo', 1, 'sys1'),
(4, 'Saunanummi', -86, 14, 'carbon', 1, 'sys1'),
(5, 'Noord Bestorade', 16, 92, 'trit', 1, 'sys1'),
(6, 'Heerhugelbergen', 95, 17, 'carbon', 1, 'sys1'),
(7, 'Oostertricht', 50, -84, 'carbon', 1, 'sys1'),
(8, 'Lewispool', 117, -43, 'crypto', 1, 'sys1'),
(9, 'Uithuiselzaal', 72, -60, 'trit', 1, 'sys1'),
(10, 'Quackton', 75, 45, 'elo', 1, 'sys1'),
(11, 'Kungboda', 39, 40, 'carbon', 1, 'sys1');


-- destinations

INSERT INTO destinations (id, system_id, name, type, asset_key, x, y) VALUES
(1, 1, 'Area 51', 'planet', 'earth', 0, 0);


-- USERS and AUTHENTICATION

INSERT INTO users (id, name, destination_id) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b1', 'Foo', 1);
INSERT INTO users (id, name, destination_id) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', 'Bar', 1);

INSERT INTO authentications (user_id, email, password) 
    VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b1', 'foo@example.com', crypt('pass', gen_salt('bf', 8)));
INSERT INTO authentications (user_id, email, password) 
    VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', 'bar@example.com', crypt('pass', gen_salt('bf', 8)));


-- MOB SHIPS

INSERT INTO mob_ships (id, asset_key) VALUES (1, 'mob1');
INSERT INTO mob_ships (id, asset_key) VALUES (2, 'mob2');


-- MOB SHIP POSITIONS

-- INSERT INTO mob_ship_positions (id, mob_ship_id, routing_points) VALUES (1, 1, '{"route":[[10,10],[990,990],[10,500],[500,10]]}');
-- INSERT INTO mob_ship_positions (id, mob_ship_id, routing_points) VALUES (2, 1, '{"route":[[910,10],[690,790],[90,400],[50,10]]}');
-- INSERT INTO mob_ship_positions (id, mob_ship_id, routing_points) VALUES (3, 1, '{"route":[[510,10],[890,890],[10,600],[90,90]]}');


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
