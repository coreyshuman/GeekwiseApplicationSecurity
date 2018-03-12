CREATE TABLE token_store (
    id SERIAL NOT NULL,
    user_id integer NOT NULL,
    security_stamp character(60) NOT NULL,
    refresh_token character(90) NOT NULL,
    created_at timestamp NOT NULL default now()
);