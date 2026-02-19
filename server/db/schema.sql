-- Core schema for local development (Postgres)
create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  email text unique not null,
  password_hash text not null,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  refresh_token text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  content text not null,
  media_url text,
  created_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

create table if not exists reactions (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  type text not null,
  created_at timestamptz default now(),
  unique (post_id, user_id, type)
);

create table if not exists friends (
  id uuid primary key default uuid_generate_v4(),
  requester_id uuid references users(id) on delete cascade,
  addressee_id uuid references users(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz default now(),
  unique (requester_id, addressee_id)
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null,
  sender_id uuid references users(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

create table if not exists listings (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references users(id) on delete cascade,
  title text not null,
  price numeric(10, 2) not null,
  location text,
  description text,
  media_url text,
  created_at timestamptz default now()
);
