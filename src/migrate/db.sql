-- https://medium.com/swlh/postgres-role-inheritance-and-policies-for-beginners-4ae13f973bb1

-- Install extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION postgis;
CREATE EXTENSION pgrouting;

https://api.openstreetmap.org/api/0.6/map?bbox=7.79153,48.15994,7.7988,48.16444

-- Create schemas
DROP SCHEMA IF EXISTS private_schema CASCADE;
CREATE SCHEMA private_schema;


-- Create types
CREATE TYPE public.jwt_token as (
  role text,
  exp integer,
  tmin integer,
  user_id integer
);


-- Create roles
CREATE ROLE base_role NOINHERIT;
CREATE ROLE administrator INHERIT;
CREATE ROLE player INHERIT;
CREATE ROLE guest INHERIT;

GRANT base_role TO administrator, player, guest;

-- CREATE ROLE user_login;
-- CREATE ROLE user_guest;
-- GRANT administrator to postgres;
-- GRANT user_login to postgres, user_admin;
-- GRANT user_guest to postgres, user_login;



-- Grant usage
GRANT USAGE ON SCHEMA public to base_role;
GRANT USAGE ON SCHEMA private_schema to administrator;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA private_schema, public TO administrator;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO player;



-- Create tables
CREATE TABLE public.users
(
    id integer PRIMARY KEY,
    name text NOT NULL
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE TABLE private_schema.authentications
(
    id integer PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    role text NOT NULL,
    user_id integer NOT NULL,

    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	    REFERENCES public.users(id)
          ON DELETE CASCADE
);
ALTER TABLE private_schema.authentications ENABLE ROW LEVEL SECURITY;



-- Create functions
CREATE FUNCTION public.authenticate(
  email text,
  password text
) RETURNS public.jwt_token as $$
DECLARE
  account private_schema.authentications;
BEGIN
  SELECT a.* INTO account
    FROM private_schema.authentications as a
    WHERE a.email = authenticate.email;

  if account.password = crypt(password, account.password) then
    return (
      account.role,
      extract(epoch FROM now() + interval '15 days'),
      extract(epoch FROM interval '15 days'),
      account.user_id
    )::public.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;

CREATE FUNCTION public.refresh_token() RETURNS public.jwt_token AS $$
DECLARE
  account private_schema.authentications;
begin
  SELECT a.* into account
    FROM private_schema.authentications as a
    WHERE a.user_id = current_setting('jwt.claims.user_id')::integer;

  if FOUND then
    return (
      account.role, 
      extract(epoch FROM now() + interval '15 days'),
      extract(epoch FROM interval '15 days'),
      account.user_id
    )::public.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;

CREATE FUNCTION public.current_user_id() RETURNS integer as $$
  SELECT nullif(current_setting('jwt.claims.user_id', true), '')::integer;
$$ language sql stable;

GRANT EXECUTE ON FUNCTION public.authenticate(text, text) to guest;
GRANT EXECUTE ON FUNCTION public.refresh_token() to player;



-- Create policies
CREATE POLICY select_users ON public.users FOR SELECT TO player USING (id = public.current_user_id());
CREATE POLICY select_authentications ON private_schema.authentications FOR SELECT TO administrator USING (user_id = public.current_user_id());
CREATE POLICY select_all_users on public.users FOR ALL TO administrator USING (true);



-- Insert data
INSERT INTO public.users (id, name) VALUES (1, 'Admin');
INSERT INTO private_schema.authentications ( id, user_id, email, password, role) 
VALUES (10, 1, 'admin@example.com', crypt('pass', gen_salt('bf', 8)), 'administrator');

INSERT INTO public.users (id, name) VALUES (2, 'Foo');
INSERT INTO private_schema.authentications ( id, user_id, email, password, role) 
VALUES (20, 2, 'foo@example.com', crypt('pass', gen_salt('bf', 8)), 'player');

INSERT INTO public.users (id, name) VALUES (3, 'Bar');
INSERT INTO private_schema.authentications ( id, user_id, email, password, role) 
VALUES (30, 3, 'bar@example.com', crypt('pass', gen_salt('bf', 8)), 'player');


CREATE TABLE public.ships
(
    id integer PRIMARY KEY,
    name text NOT NULL,
    x integer,
    y integer,
    user_id integer NOT NULL,

    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	    REFERENCES public.users(id)
          ON DELETE CASCADE
);
ALTER TABLE public.ships ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.ships TO player;
CREATE POLICY select_ships ON public.ships FOR SELECT TO player USING (true);


INSERT INTO public.ships (id, user_id, name, x, y) VALUES (1, 2, 'Ship1.1', 10, 10);
INSERT INTO public.ships (id, user_id, name, x, y) VALUES (2, 2, 'Ship1.2', 30, 10);
INSERT INTO public.ships (id, user_id, name, x, y) VALUES (3, 2, 'Ship1.3', 10, 30);

INSERT INTO public.ships (id, user_id, name, x, y) VALUES (4, 3, 'Ship2.1', 50, 50);
INSERT INTO public.ships (id, user_id, name, x, y) VALUES (5, 3, 'Ship2.2', 80, 5);
INSERT INTO public.ships (id, user_id, name, x, y) VALUES (6, 3, 'Ship2.3', null, null);





INSERT INTO edge_table (
    category_id, reverse_category_id,
    cost, reverse_cost,
    x1, y1,
    x2, y2,
    dir) VALUES
(1, 1, 2, 2,  1, 1,  1, 3, 'B'),
(1, 1, 3, 3,  1, 3,  2, 6, 'B'),
(1, 1, 6, 6,  2, 6,  5, 2, 'B'),
(1, 1, 3, 3,  1, 1,  4, 1, 'B'),
(1, 1, 1, 1,  4, 1,  5, 2, 'B'),
(1, 1, 1, 1,  1, 1,  2, 2, 'B'),
(1, 1, 1, 1,  2, 2,  4, 2, 'B'),
(1, 1, 1, 1,  4, 2,  5, 2, 'B');

UPDATE edge_table SET the_geom = st_makeline(st_point(x1,y1),st_point(x2,y2));  

SELECT pgr_createTopology('edge_table',0.001);
