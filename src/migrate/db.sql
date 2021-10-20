-- Install extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;


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
      'user_login',
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
      'user_login', 
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


-- Create roles
DROP ROLE IF EXISTS user_admin;
CREATE ROLE user_admin;
GRANT user_admin to postgres;

DROP ROLE IF EXISTS user_login;
CREATE ROLE user_login;
GRANT user_login to postgres, user_admin;

DROP ROLE IF EXISTS user_guest;
CREATE ROLE user_guest;
GRANT user_guest to postgres, user_login;



-- Grant usage
GRANT USAGE ON SCHEMA public to user_login;
GRANT USAGE ON SCHEMA private_schema to user_admin;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_admin;

GRANT ALL ON TABLE public.users TO user_login;
GRANT EXECUTE ON FUNCTION public.authenticate(text, text) to user_guest;
GRANT EXECUTE ON FUNCTION public.refresh_token() to user_login;



-- Create policies
CREATE POLICY select_users ON public.users FOR SELECT TO user_login USING (id = public.current_user_id());
CREATE POLICY select_authentications ON private_schema.authentications FOR SELECT TO user_admin USING (user_id = public.current_user_id());
CREATE POLICY select_all_users on public.users FOR ALL TO user_admin USING (true);



-- Insert data
INSERT INTO public.users (id, name) VALUES (1, 'Admin');
INSERT INTO public.users (id, name) VALUES (2, 'Foo');
INSERT INTO public.users (id, name) VALUES (3, 'Bar');

INSERT INTO private_schema.authentications (id, user_id, email, password) VALUES (1, 1, 'admin@example.com', crypt('pass', gen_salt('bf', 8)));
INSERT INTO private_schema.authentications (id, user_id, email, password) VALUES (3, 3, 'bar@example.com', crypt('pass', gen_salt('bf', 8)));
INSERT INTO private_schema.authentications (id, user_id, email, password) VALUES (2, 2, 'foo@example.com', crypt('pass', gen_salt('bf', 8)));
