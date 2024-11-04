-- OAuth Clients table
create table oauth_clients (
  id uuid default uuid_generate_v4() primary key,
  client_id text not null unique,
  client_secret text not null,
  name text not null,
  redirect_uri text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Authorization Codes table
create table authorization_codes (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  client_id text not null references oauth_clients(client_id),
  user_id uuid references auth.users(id),
  redirect_uri text not null,
  code_challenge text,
  scope text,
  state text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);