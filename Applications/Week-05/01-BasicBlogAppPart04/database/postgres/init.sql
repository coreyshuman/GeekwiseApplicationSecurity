
CREATE TABLE migrations (
    id SERIAL NOT NULL,
    migration_name character varying NOT NULL,
    migration_date timestamp NOT NULL default now()
);

ALTER TABLE ONLY migrations ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);
ALTER TABLE migrations OWNER TO postgres;