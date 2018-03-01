CREATE TABLE roles (
    id SERIAL NOT NULL,
    role character varying(20) NOT NULL,
    description character varying,
    created_at timestamp NOT NULL default now(),
    deleted_at timestamp default NULL,
    PRIMARY KEY(id)
);

CREATE TABLE permissions (
    id SERIAL NOT NULL,
    permission character varying(50) NOT NULL,
    description character varying,
    created_at timestamp NOT NULL default now(),
    deleted_at timestamp default NULL,
    PRIMARY KEY(id)
);

CREATE TABLE user_roles (
    user_id integer NOT NULL REFERENCES "users"("id"),
    roles_id integer NOT NULL REFERENCES "roles"("id"),
    PRIMARY KEY(user_id, roles_id)
);

CREATE TABLE roles_permissions (
    roles_id integer NOT NULL REFERENCES "roles"("id"),
    permissions_id integer NOT NULL REFERENCES "permissions"("id"),
    PRIMARY key(roles_id, permissions_id)
);

