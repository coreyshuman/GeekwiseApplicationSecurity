CREATE TABLE test (
    id SERIAL NOT NULL,
    content character varying,
    attribute character varying,
    css character varying,
    javascript character varying,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now()
);

ALTER TABLE ONLY test ADD CONSTRAINT sandboxz_pkey PRIMARY KEY (id);
ALTER TABLE test OWNER TO postgres;