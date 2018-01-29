
CREATE TABLE posts (
    id SERIAL NOT NULL,
    title character varying NOT NULL,
    post character varying NOT NULL,
    author character varying NOT NULL,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now(),
    deleted_at timestamp NOT NULL default now(),
    is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY posts ADD CONSTRAINT post_pkey PRIMARY KEY (id);
ALTER TABLE posts OWNER TO postgres;