-- ============================================================
-- SMASH V1 — Initial Schema
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";


-- ============================================================
-- TABLES
-- ============================================================

-- profiles
-- One row per auth user. Created on sign-up via trigger below.
create table public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  name           text        not null,
  avatar_url     text,
  sport          text        not null check (sport in ('padel', 'tennis')),
  skill_level    text        not null check (skill_level in ('beginner', 'intermediate', 'advanced')),
  location       text,
  bio            text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- swipes (called "likes" in the brief — stores both likes and passes)
create table public.swipes (
  id             uuid primary key default uuid_generate_v4(),
  swiper_id      uuid        not null references public.profiles(id) on delete cascade,
  target_id      uuid        not null references public.profiles(id) on delete cascade,
  direction      text        not null check (direction in ('like', 'pass')),
  created_at     timestamptz not null default now(),
  unique (swiper_id, target_id)
);

-- matches
-- Created when two users both swipe 'like' on each other.
create table public.matches (
  id             uuid primary key default uuid_generate_v4(),
  user_a         uuid        not null references public.profiles(id) on delete cascade,
  user_b         uuid        not null references public.profiles(id) on delete cascade,
  created_at     timestamptz not null default now(),
  unique (user_a, user_b)
);

-- messages
create table public.messages (
  id             uuid primary key default uuid_generate_v4(),
  match_id       uuid        not null references public.matches(id) on delete cascade,
  sender_id      uuid        not null references public.profiles(id) on delete cascade,
  content        text        not null check (char_length(content) between 1 and 500),
  created_at     timestamptz not null default now()
);

-- games
create table public.games (
  id             uuid primary key default uuid_generate_v4(),
  host_id        uuid        not null references public.profiles(id) on delete cascade,
  match_id       uuid        not null references public.matches(id) on delete cascade,
  sport          text        not null check (sport in ('padel', 'tennis')),
  location       text        not null,
  scheduled_at   timestamptz not null,
  status         text        not null default 'pending' check (status in ('pending', 'confirmed')),
  created_at     timestamptz not null default now()
);

-- game_players
create table public.game_players (
  id             uuid primary key default uuid_generate_v4(),
  game_id        uuid        not null references public.games(id) on delete cascade,
  user_id        uuid        not null references public.profiles(id) on delete cascade,
  unique (game_id, user_id)
);


-- ============================================================
-- INDEXES
-- ============================================================

-- profiles
create index idx_profiles_sport        on public.profiles (sport);

-- swipes
create index idx_swipes_swiper         on public.swipes (swiper_id);
create index idx_swipes_target         on public.swipes (target_id);
create index idx_swipes_swiper_target  on public.swipes (swiper_id, target_id);

-- matches
create index idx_matches_user_a        on public.matches (user_a);
create index idx_matches_user_b        on public.matches (user_b);
create index idx_matches_created_at    on public.matches (created_at desc);

-- messages
create index idx_messages_match_id     on public.messages (match_id);
create index idx_messages_created_at   on public.messages (match_id, created_at asc);

-- games
create index idx_games_host_id         on public.games (host_id);
create index idx_games_scheduled_at    on public.games (scheduled_at asc);
create index idx_games_status          on public.games (status);

-- game_players
create index idx_game_players_game_id  on public.game_players (game_id);
create index idx_game_players_user_id  on public.game_players (user_id);


-- ============================================================
-- HELPER: is_match_member(match_id)
-- Returns true if the calling user is user_a or user_b in a match.
-- Used by RLS policies on messages and games.
-- ============================================================
create or replace function public.is_match_member(p_match_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.matches
    where id = p_match_id
      and (user_a = auth.uid() or user_b = auth.uid())
  );
$$;

-- is_game_member(game_id)
create or replace function public.is_game_member(p_game_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.game_players
    where game_id = p_game_id
      and user_id = auth.uid()
  );
$$;


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles     enable row level security;
alter table public.swipes        enable row level security;
alter table public.matches       enable row level security;
alter table public.messages      enable row level security;
alter table public.games         enable row level security;
alter table public.game_players  enable row level security;


-- ---------- profiles ----------

-- Any authenticated user can read profiles (needed for discover + chat headers)
create policy "profiles: authenticated read"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles: insert own"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles: update own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());


-- ---------- swipes ----------

create policy "swipes: read own"
  on public.swipes for select
  to authenticated
  using (swiper_id = auth.uid());

create policy "swipes: insert own"
  on public.swipes for insert
  to authenticated
  with check (swiper_id = auth.uid());


-- ---------- matches ----------

create policy "matches: read own"
  on public.matches for select
  to authenticated
  using (user_a = auth.uid() or user_b = auth.uid());

-- Inserted by the app after detecting a mutual like
create policy "matches: insert own"
  on public.matches for insert
  to authenticated
  with check (user_a = auth.uid() or user_b = auth.uid());


-- ---------- messages ----------

create policy "messages: read in own matches"
  on public.messages for select
  to authenticated
  using (public.is_match_member(match_id));

create policy "messages: insert in own matches"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and public.is_match_member(match_id)
  );


-- ---------- games ----------

create policy "games: read own"
  on public.games for select
  to authenticated
  using (public.is_game_member(id));

create policy "games: insert as host"
  on public.games for insert
  to authenticated
  with check (host_id = auth.uid());

create policy "games: update as host"
  on public.games for update
  to authenticated
  using (host_id = auth.uid())
  with check (host_id = auth.uid());


-- ---------- game_players ----------

create policy "game_players: read own games"
  on public.game_players for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.is_game_member(game_id)
  );

-- Host inserts players when creating a game
create policy "game_players: insert as game host"
  on public.game_players for insert
  to authenticated
  with check (
    exists (
      select 1 from public.games
      where id = game_id
        and host_id = auth.uid()
    )
  );


-- ============================================================
-- TRIGGER: auto-create profile row on auth.users insert
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, name, sport, skill_level)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'sport', 'padel'),
    coalesce(new.raw_user_meta_data->>'skill_level', 'beginner')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- TRIGGER: keep profiles.updated_at fresh
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
