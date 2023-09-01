-- Adminer 4.8.1 PostgreSQL 15.2 (Debian 15.2-1.pgdg110+1) dump

DROP TABLE IF EXISTS "post_media";
DROP SEQUENCE IF EXISTS post_media_id_seq;
CREATE SEQUENCE post_media_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."post_media" (
    "id" integer DEFAULT nextval('post_media_id_seq') NOT NULL,
    "url" character varying NOT NULL,
    "post_id" integer NOT NULL,
    CONSTRAINT "post_media_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "posts";
DROP SEQUENCE IF EXISTS post_post_id_seq;
CREATE SEQUENCE post_post_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."posts" (
    "post_id" integer DEFAULT nextval('post_post_id_seq') NOT NULL,
    "user_id" integer NOT NULL,
    "content" character varying NOT NULL,
    "media_url" character varying,
    "timestamp" timestamp NOT NULL,
    "is_public" smallint DEFAULT '0' NOT NULL,
    CONSTRAINT "post_pkey" PRIMARY KEY ("post_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "profile";
DROP SEQUENCE IF EXISTS profile_profile_id_seq;
CREATE SEQUENCE profile_profile_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."profile" (
    "profile_id" integer DEFAULT nextval('profile_profile_id_seq') NOT NULL,
    "user_id" integer NOT NULL,
    "username" character varying NOT NULL,
    "bio" text,
    "profile_image" character varying,
    CONSTRAINT "profile_pkey" PRIMARY KEY ("profile_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS test_id_seq;
CREATE SEQUENCE test_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 32767 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('test_id_seq') NOT NULL,
    "email" character varying NOT NULL,
    "password" character varying NOT NULL,
    "role" character varying DEFAULT 'user',
    CONSTRAINT "email_unique" UNIQUE ("email"),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."post_media" ADD CONSTRAINT "post_media_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(post_id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."posts" ADD CONSTRAINT "post_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

-- 2023-09-01 16:54:14.841062+00
