

CREATE TABLE cars (
    id SERIAL NOT NULL,
    blog_post character varying NOT NULL,
    name character varying NOT NULL,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now(),
    is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY cars ADD CONSTRAINT car_pkey PRIMARY KEY (id);
ALTER TABLE cars OWNER TO postgres;