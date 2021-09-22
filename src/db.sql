-- See example here: https://thihara.github.io/GraphQL-With-Postgraphile/

-- Install extensions
CREATE EXTENSION pgcrypto;

-- Create roles
CREATE ROLE NO_ACCESS_ROLE;


-- Create types
CREATE TYPE public.jwt_token as (
  expire integer,
  user_id integer,
  email text
);


-- Create tables
CREATE TABLE public.authentication
(
    id integer PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password text NOT NULL
)

CREATE TABLE public.user
(
    id integer PRIMARY KEY,
    authentication_id integer NOT NULL,
    name text NOT NULL,
    
    CONSTRAINT fk_authentication
      FOREIGN KEY(authentication_id) 
	    REFERENCES authentication(id)
)

-- Create functions
create function public.authenticate(
  email text,
  password text
) returns public.jwt_token as $$
declare
  account public.authentication;
begin
  select a.* into account
    from public.authentication as a
    where a.email = authenticate.email;

  if account.password = crypt(password, account.password) then
    return (
      extract(epoch from now() + interval '7 days'),
      account.id,
      account.email
    )::public.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;


-- Insert data
