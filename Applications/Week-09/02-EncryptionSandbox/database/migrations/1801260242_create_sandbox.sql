CREATE TABLE sandbox (
    id SERIAL NOT NULL,
    data1 character varying,
    data2 character varying,
    data3 character varying,
    data4 character varying,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now()
);

ALTER TABLE ONLY sandbox ADD CONSTRAINT sandbox_pkey PRIMARY KEY (id);
ALTER TABLE sandbox OWNER TO postgres;