
CREATE TABLE capture (
    id SERIAL NOT NULL,
    client character varying NOT NULL,
    keystrokes character varying NOT NULL,
    created_at timestamp NOT NULL default now()
);

ALTER TABLE ONLY capture ADD CONSTRAINT capture_pkey PRIMARY KEY (id);
ALTER TABLE capture OWNER TO postgres;

