


SET check_function_bodies = false;-- Auto generated  --
-- ddl-end --

SET search_path TO pg_catalog,public;-- Auto generated --
-- ddl-end --

-- object: public.users | type: TABLE --
-- DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
	id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ,
	email varchar(255) NOT NULL,
	password_hash varchar(255) NOT NULL,
	full_name varchar(255),
	phone_number varchar(20),
	email_verified bool NOT NULL DEFAULT FALSE,
	email_verified_at timestamptz,
	last_login_at timestamptz,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT id PRIMARY KEY (id),
	CONSTRAINT disallow_repeated_emails UNIQUE (email)
);
-- THE FOLLOWINGS ARE CONSIDERED AS COMMENTS AND DO NOT AFFECT THE DATABASE STRUCTURE--
-- ddl-end --
COMMENT ON COLUMN public.users.password_hash IS E'computed by backend';
-- ddl-end --
COMMENT ON COLUMN public.users.full_name IS E'USER PROVIDED (optional)';
-- ddl-end --
COMMENT ON COLUMN public.users.phone_number IS E'USER PROVIDED (optional) , I may or may not enforce the user to \nprovide his phone number in the frontend';
-- ddl-end --
COMMENT ON COLUMN public.users.email_verified IS E'Related to Signup';
-- ddl-end --
COMMENT ON COLUMN public.users.email_verified_at IS E'BACKEND COMPUTED (on verification)';
-- ddl-end --
COMMENT ON COLUMN public.users.last_login_at IS E'BACKEND COMPUTED (on login)';
-- ddl-end --
ALTER TABLE public.users OWNER TO postgres;
-- ddl-end --

-- object: public."updated_at_Function" | type: FUNCTION --
-- DROP FUNCTION IF EXISTS public."updated_at_Function"() CASCADE;
CREATE OR REPLACE FUNCTION public."updated_at_Function" ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE 
	CALLED ON NULL INPUT
	SECURITY INVOKER
	PARALLEL UNSAFE
	COST 1
	AS 
$function$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;

$function$;
-- ddl-end --
ALTER FUNCTION public."updated_at_Function"() OWNER TO postgres;
-- ddl-end --

-- object: trigger_update_timestamp | type: TRIGGER --
-- DROP TRIGGER IF EXISTS trigger_update_timestamp ON public.users CASCADE;
CREATE OR REPLACE TRIGGER trigger_update_timestamp
	BEFORE UPDATE
	ON public.users
	FOR EACH ROW
	EXECUTE PROCEDURE public."updated_at_Function"();
-- ddl-end --

-- object: public.modify_updated_at | type: FUNCTION --
-- DROP FUNCTION IF EXISTS public.modify_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.modify_updated_at ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE 
	CALLED ON NULL INPUT
	SECURITY INVOKER
	PARALLEL UNSAFE
	COST 1
	AS 
$function$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$function$;
-- ddl-end --
ALTER FUNCTION public.modify_updated_at() OWNER TO postgres;
-- ddl-end --

-- object: public.password_reset_tokens | type: TABLE --
-- DROP TABLE IF EXISTS public.password_reset_tokens CASCADE;
CREATE TABLE public.password_reset_tokens (
	id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ,
	token_hash varchar(255) NOT NULL,
	expires_at timestamptz NOT NULL,
	used_at timestamptz,
	created_at timestamptz NOT NULL DEFAULT now(),
	id_users bigint NOT NULL,
	CONSTRAINT password_reset_tokens_pk PRIMARY KEY (id)
);
--THE FOLLOWING ARE CONSIDERED AS COMMENTS AND DO NOT AFFECT THE DATABASE STRUCTURE--
-- ddl-end --
COMMENT ON COLUMN public.password_reset_tokens.id IS E'identification colmun , it''s sequential , like the following :\ntoken 1 → id 1\ntoken 2 → id 2\ntoken 3 → id 3\netc......';
-- ddl-end --
COMMENT ON COLUMN public.password_reset_tokens.token_hash IS E'We store the hash of the token for security purposes, but we send the plain text token to the user , not the hashed token.\nEvery token must be hashed , thus → NOT NULL';
-- ddl-end --
COMMENT ON COLUMN public.password_reset_tokens.expires_at IS E'BACKEND COMPUTED';
-- ddl-end --
COMMENT ON COLUMN public.password_reset_tokens.used_at IS E'BACKEND COMPUTED';
-- ddl-end --
ALTER TABLE public.password_reset_tokens OWNER TO postgres;
-- ddl-end --

-- object: users_fk | type: CONSTRAINT --
-- ALTER TABLE public.password_reset_tokens DROP CONSTRAINT IF EXISTS users_fk CASCADE;
ALTER TABLE public.password_reset_tokens ADD CONSTRAINT users_fk FOREIGN KEY (id_users)
REFERENCES public.users (id) MATCH FULL
-- COMMENT : UPDATE CASCADE EXAMPLE :  If you change a user's id from 1 to 99, the user_id in the token table automatically changes to 99 to keep the link alive.-
ON DELETE CASCADE ON UPDATE CASCADE; -- when a user is deleted, all their password reset tokens are also deleted (CASCADE) --
-- ddl-end --

-- object: public.email_verification_tokens | type: TABLE --
-- DROP TABLE IF EXISTS public.email_verification_tokens CASCADE;
CREATE TABLE public.email_verification_tokens (
	id bigint NOT NULL,
	token_hash varchar(255) NOT NULL,
	expires_at timestamptz NOT NULL,
	verified_at timestamptz,
	created_at timestamptz NOT NULL DEFAULT now(),
	id_users bigint NOT NULL,
	CONSTRAINT email_verification_tokens_pk PRIMARY KEY (id)
);
-- THE FOLLOWINGS ARE CONSIDERED AS COMMENTS AND DO NOT AFFECT THE DATABASE STRUCTURE--
-- ddl-end --
COMMENT ON TABLE public.email_verification_tokens IS E'This Table Related to the Signup process';
-- ddl-end --
COMMENT ON COLUMN public.email_verification_tokens.id IS E'Identification collumn , it''s values are sequnatial ,it''s auto generated';
-- ddl-end --
COMMENT ON COLUMN public.email_verification_tokens.token_hash IS E'BACKEND COMPUTED,hashed for security purposes.\nMust have hash →  NOT NULL\nhash token only when token is generated → no Default value';
-- ddl-end --
COMMENT ON COLUMN public.email_verification_tokens.expires_at IS E'BACKEND COMPUTED\ntimestamptz → time zone syncronized\nbackend must calcuate expiration date → postgres set no Default value\nThere must be expiration date → NOT NULL IS ENFORCED';
-- ddl-end --
COMMENT ON COLUMN public.email_verification_tokens.verified_at IS E'BACKEND COMPUTED\nTIMESTAMPTZ→ TIME ZONE SYNCRONZIED\nNOT SET UNTIL USER IS VERIFIED → POSTGRES SET NOT DEFAULT VALUE, CAN BE NULL (NULLABLE)';
-- ddl-end --
COMMENT ON COLUMN public.email_verification_tokens.created_at IS E'timestamptz                      → TIME ZONE IS SYNCRONIZED\nAUTO-GENERATED            → USING NOW() FUNCTION AS DEFAULT VALUE\ncreation time of email verification token must be tracked → NOT NULL';
-- ddl-end --
ALTER TABLE public.email_verification_tokens OWNER TO postgres;
-- ddl-end --

-- object: users_fk | type: CONSTRAINT --
-- ALTER TABLE public.email_verification_tokens DROP CONSTRAINT IF EXISTS users_fk CASCADE;
ALTER TABLE public.email_verification_tokens ADD CONSTRAINT users_fk FOREIGN KEY (id_users)
REFERENCES public.users (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE; -- when a user is deleted, all their email verification tokens are also deleted (CASCADE) --

-- ddl-end --


