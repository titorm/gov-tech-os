-- Migration: create users, municipios and users_to_municipios
-- Generated template: review before applying

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  first_name varchar(100),
  last_name varchar(100),
  avatar text,
  role varchar(50) NOT NULL DEFAULT 'user',
  is_active boolean NOT NULL DEFAULT true,
  is_email_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS municipios (
  id varchar(36) PRIMARY KEY,
  name varchar(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS users_to_municipios (
  user_id uuid NOT NULL,
  municipio_id varchar(36) NOT NULL,
  PRIMARY KEY (user_id, municipio_id)
);
