CREATE TABLE sandbox (
    id SERIAL NOT NULL,
    content character varying,
    attribute character varying,
    css character varying,
    javascript character varying,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now()
);

ALTER TABLE ONLY sandbox ADD CONSTRAINT sandbox_pkey PRIMARY KEY (id);
ALTER TABLE sandbox OWNER TO postgres;