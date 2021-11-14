CREATE OR REPLACE FUNCTION get_authenticated_user_id(email text, pass text)
RETURNS uuid AS $$
  SELECT a.user_id
    FROM authentications a
    WHERE a.email = email AND a.password = crypt(pass, a.password)
    LIMIT 1;
$$ LANGUAGE sql STABLE LEAKPROOF;