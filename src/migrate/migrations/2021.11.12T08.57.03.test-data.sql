INSERT INTO users (id, name) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b1', 'Foo');
INSERT INTO users (id, name) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', 'Bar');

INSERT INTO authentications (user_id, email, password, role) 
    VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b1', 'foo@example.com', crypt('pass', gen_salt('bf', 8)), 'player');
INSERT INTO authentications (user_id, email, password, role) 
    VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', 'bar@example.com', crypt('pass', gen_salt('bf', 8)), 'player');

INSERT INTO ships (user_id, name, x, y) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b1', 'Ship1.1', 10, 10);
INSERT INTO ships (user_id, name, x, y) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b1', 'Ship1.2', 130, 40);
INSERT INTO ships (user_id, name, x, y) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b1', 'Ship1.3', 10, 30);

INSERT INTO ships (user_id, name, x, y) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', 'Ship2.1', 10, 120);
INSERT INTO ships (user_id, name, x, y) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', 'Ship2.2', 80, 30);
INSERT INTO ships (user_id, name, x, y) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', 'Ship2.3', null, null);
