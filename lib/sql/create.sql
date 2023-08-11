-- Adminer 4.8.1 PostgreSQL 15.2 (Debian 15.2-1.pgdg110+1) dump

DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS test_id_seq;
CREATE SEQUENCE test_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 32767 START 11 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('test_id_seq') NOT NULL,
    "email" character varying NOT NULL,
    "password" character varying NOT NULL,
    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "users" ("id", "email", "password") VALUES
(10,	'dennismoes@me.com',	'password'),
(11,	'ilse.polderman@gmail.com',	'password');

-- 2023-08-11 12:30:20.277324+00