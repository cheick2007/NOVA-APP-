-- 1. Nettoyage Complet (Attention : supprime toutes les données)
DROP TRIGGER IF EXISTS on_auth_user_created on auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.comments;
DROP TABLE IF EXISTS public.likes;
DROP TABLE IF EXISTS public.videos;
DROP TABLE IF EXISTS public.profiles;

-- 2. Table Profiles (Liée à auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  updated_at timestamp with time zone
);

-- 3. Table Videos
create table public.videos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  video_url text not null,
  description text,
  song_name text,
  likes_count bigint default 0,
  comments_count bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tables Interactions (Likes & Comments)
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  video_id uuid references public.videos(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, video_id)
);

create table public.comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  video_id uuid references public.videos(id) on delete cascade not null,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.videos enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;

-- Policies Profiles
create policy "Public profiles are viewable by everyone." 
  on profiles for select using (true);

create policy "Users can insert their own profile." 
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile." 
  on profiles for update using (auth.uid() = id);

-- Policies Videos
create policy "Videos are viewable by everyone." 
  on videos for select using (true);

create policy "Authenticated users can insert videos." 
  on videos for insert with check (auth.role() = 'authenticated');

create policy "Users can update own videos." 
  on videos for update using (auth.uid() = user_id);

create policy "Users can delete own videos." 
  on videos for delete using (auth.uid() = user_id);

-- Policies Likes/Comments
create policy "Likes are viewable by everyone." 
  on likes for select using (true);

create policy "Authenticated users can insert likes." 
  on likes for insert with check (auth.role() = 'authenticated');

create policy "Comments are viewable by everyone." 
  on comments for select using (true);

create policy "Authenticated users can insert comments." 
  on comments for insert with check (auth.role() = 'authenticated');


-- 6. Trigger pour création automatique du profil
-- Cette fonction s'exécute automatiquement quand un utilisateur s'inscrit dans Supabase Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
