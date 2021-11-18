-- USERS and AUTHENTICATION

INSERT INTO users (id, name) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b1', 'Foo');
INSERT INTO users (id, name) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', 'Bar');

INSERT INTO authentications (user_id, email, password, role) 
    VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b1', 'foo@example.com', crypt('pass', gen_salt('bf', 8)), 'player');
INSERT INTO authentications (user_id, email, password, role) 
    VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', 'bar@example.com', crypt('pass', gen_salt('bf', 8)), 'player');


-- MOB SHIPS

INSERT INTO mob_ships (id, name) VALUES (1, 'MOB Ship 1');
INSERT INTO mob_ships (id, name) VALUES (2, 'MOB Ship 2');


-- MOB SHIP POSITIONS

INSERT INTO mob_ship_positions (id, mob_ship_id, routing_points) VALUES (1, 1, '{"route":[[10,10],[990,990],[10,500],[500,10]]}');
INSERT INTO mob_ship_positions (id, mob_ship_id, routing_points) VALUES (2, 1, '{"route":[[910,10],[690,790],[90,400],[50,10]]}');
INSERT INTO mob_ship_positions (id, mob_ship_id, routing_points) VALUES (3, 1, '{"route":[[510,10],[890,890],[10,600],[90,90]]}');


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
