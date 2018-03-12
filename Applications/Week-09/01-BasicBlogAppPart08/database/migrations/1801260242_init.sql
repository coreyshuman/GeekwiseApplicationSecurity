
CREATE TABLE posts (
    id SERIAL NOT NULL,
    title character varying NOT NULL,
    post character varying NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now(),
    deleted_at timestamp default null,
    is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY "posts" ADD CONSTRAINT post_pkey PRIMARY KEY (id);
ALTER TABLE "posts" OWNER TO postgres;

CREATE TABLE users (
    id SERIAL NOT NULL,
    username character varying NOT NULL UNIQUE,
    email character varying NOT NULL UNIQUE,
    password character(60) NOT NULL,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now(),
    deleted_at timestamp default null,
    is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY "users" ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE "users" OWNER TO postgres;

ALTER TABLE "posts" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id");
