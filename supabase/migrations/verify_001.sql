-- ============================================================
-- SMASH V1 — Schema Verification
-- Run in Supabase SQL Editor. Every row should show ✅ PASS.
-- ============================================================

with checks as (

  -- ──────────────────────────────────────────────────────────
  -- 1. TABLES EXIST WITH EXPECTED COLUMNS
  -- ──────────────────────────────────────────────────────────

  -- profiles
  select '1.01' as id, 'TABLE: profiles exists' as label
  where exists (select 1 from information_schema.tables where table_schema='public' and table_name='profiles')
  union all
  select '1.02', 'COLUMN: profiles.id'          where exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='id')
  union all
  select '1.03', 'COLUMN: profiles.name'         where exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='name')
  union all
  select '1.04', 'COLUMN: profiles.sport'        where exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='sport')
  union all
  select '1.05', 'COLUMN: profiles.skill_level'  where exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='skill_level')
  union all
  select '1.06', 'COLUMN: profiles.avatar_url'   where exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='avatar_url')
  union all
  select '1.07', 'COLUMN: profiles.location'     where exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='location')
  union all
  select '1.08', 'COLUMN: profiles.bio'          where exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='bio')
  union all
  select '1.09', 'COLUMN: profiles.created_at'   where exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='created_at')
  union all
  select '1.10', 'COLUMN: profiles.updated_at'   where exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='updated_at')

  -- swipes
  union all
  select '1.11', 'TABLE: swipes exists'          where exists (select 1 from information_schema.tables where table_schema='public' and table_name='swipes')
  union all
  select '1.12', 'COLUMN: swipes.swiper_id'      where exists (select 1 from information_schema.columns where table_schema='public' and table_name='swipes' and column_name='swiper_id')
  union all
  select '1.13', 'COLUMN: swipes.target_id'      where exists (select 1 from information_schema.columns where table_schema='public' and table_name='swipes' and column_name='target_id')
  union all
  select '1.14', 'COLUMN: swipes.direction'      where exists (select 1 from information_schema.columns where table_schema='public' and table_name='swipes' and column_name='direction')

  -- matches
  union all
  select '1.15', 'TABLE: matches exists'         where exists (select 1 from information_schema.tables where table_schema='public' and table_name='matches')
  union all
  select '1.16', 'COLUMN: matches.user_a'        where exists (select 1 from information_schema.columns where table_schema='public' and table_name='matches' and column_name='user_a')
  union all
  select '1.17', 'COLUMN: matches.user_b'        where exists (select 1 from information_schema.columns where table_schema='public' and table_name='matches' and column_name='user_b')

  -- messages
  union all
  select '1.18', 'TABLE: messages exists'        where exists (select 1 from information_schema.tables where table_schema='public' and table_name='messages')
  union all
  select '1.19', 'COLUMN: messages.match_id'     where exists (select 1 from information_schema.columns where table_schema='public' and table_name='messages' and column_name='match_id')
  union all
  select '1.20', 'COLUMN: messages.sender_id'    where exists (select 1 from information_schema.columns where table_schema='public' and table_name='messages' and column_name='sender_id')
  union all
  select '1.21', 'COLUMN: messages.content'      where exists (select 1 from information_schema.columns where table_schema='public' and table_name='messages' and column_name='content')

  -- games
  union all
  select '1.22', 'TABLE: games exists'           where exists (select 1 from information_schema.tables where table_schema='public' and table_name='games')
  union all
  select '1.23', 'COLUMN: games.host_id'         where exists (select 1 from information_schema.columns where table_schema='public' and table_name='games' and column_name='host_id')
  union all
  select '1.24', 'COLUMN: games.match_id'        where exists (select 1 from information_schema.columns where table_schema='public' and table_name='games' and column_name='match_id')
  union all
  select '1.25', 'COLUMN: games.sport'           where exists (select 1 from information_schema.columns where table_schema='public' and table_name='games' and column_name='sport')
  union all
  select '1.26', 'COLUMN: games.location'        where exists (select 1 from information_schema.columns where table_schema='public' and table_name='games' and column_name='location')
  union all
  select '1.27', 'COLUMN: games.scheduled_at'    where exists (select 1 from information_schema.columns where table_schema='public' and table_name='games' and column_name='scheduled_at')
  union all
  select '1.28', 'COLUMN: games.status'          where exists (select 1 from information_schema.columns where table_schema='public' and table_name='games' and column_name='status')

  -- game_players
  union all
  select '1.29', 'TABLE: game_players exists'    where exists (select 1 from information_schema.tables where table_schema='public' and table_name='game_players')
  union all
  select '1.30', 'COLUMN: game_players.game_id'  where exists (select 1 from information_schema.columns where table_schema='public' and table_name='game_players' and column_name='game_id')
  union all
  select '1.31', 'COLUMN: game_players.user_id'  where exists (select 1 from information_schema.columns where table_schema='public' and table_name='game_players' and column_name='user_id')

  -- ──────────────────────────────────────────────────────────
  -- 2. RLS ENABLED
  -- ──────────────────────────────────────────────────────────

  union all
  select '2.01', 'RLS: profiles'      where (select relrowsecurity from pg_class where relname='profiles'     and relnamespace='public'::regnamespace)
  union all
  select '2.02', 'RLS: swipes'        where (select relrowsecurity from pg_class where relname='swipes'       and relnamespace='public'::regnamespace)
  union all
  select '2.03', 'RLS: matches'       where (select relrowsecurity from pg_class where relname='matches'      and relnamespace='public'::regnamespace)
  union all
  select '2.04', 'RLS: messages'      where (select relrowsecurity from pg_class where relname='messages'     and relnamespace='public'::regnamespace)
  union all
  select '2.05', 'RLS: games'         where (select relrowsecurity from pg_class where relname='games'        and relnamespace='public'::regnamespace)
  union all
  select '2.06', 'RLS: game_players'  where (select relrowsecurity from pg_class where relname='game_players' and relnamespace='public'::regnamespace)

  -- ──────────────────────────────────────────────────────────
  -- 3. FOREIGN KEYS
  -- ──────────────────────────────────────────────────────────

  union all
  select '3.01', 'FK: profiles.id → auth.users'           where exists (select 1 from information_schema.referential_constraints rc join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name where kcu.table_schema='public' and kcu.table_name='profiles'     and kcu.column_name='id')
  union all
  select '3.02', 'FK: swipes.swiper_id → profiles'        where exists (select 1 from information_schema.referential_constraints rc join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name where kcu.table_schema='public' and kcu.table_name='swipes'       and kcu.column_name='swiper_id')
  union all
  select '3.03', 'FK: swipes.target_id → profiles'        where exists (select 1 from information_schema.referential_constraints rc join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name where kcu.table_schema='public' and kcu.table_name='swipes'       and kcu.column_name='target_id')
  union all
  select '3.04', 'FK: matches.user_a → profiles'          where exists (select 1 from information_schema.referential_constraints rc join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name where kcu.table_schema='public' and kcu.table_name='matches'      and kcu.column_name='user_a')
  union all
  select '3.05', 'FK: matches.user_b → profiles'          where exists (select 1 from information_schema.referential_constraints rc join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name where kcu.table_schema='public' and kcu.table_name='matches'      and kcu.column_name='user_b')
  union all
  select '3.06', 'FK: messages.match_id → matches'        where exists (select 1 from information_schema.referential_constraints rc join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name where kcu.table_schema='public' and kcu.table_name='messages'     and kcu.column_name='match_id')
  union all
  select '3.07', 'FK: messages.sender_id → profiles'      where exists (select 1 from information_schema.referential_constraints rc join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name where kcu.table_schema='public' and kcu.table_name='messages'     and kcu.column_name='sender_id')
  union all
  select '3.08', 'FK: games.host_id → profiles'           where exists (select 1 from information_schema.referential_constraints rc join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name where kcu.table_schema='public' and kcu.table_name='games'        and kcu.column_name='host_id')
  union all
  select '3.09', 'FK: games.match_id → matches'           where exists (select 1 from information_schema.referential_constraints rc join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name where kcu.table_schema='public' and kcu.table_name='games'        and kcu.column_name='match_id')
  union all
  select '3.10', 'FK: game_players.game_id → games'       where exists (select 1 from information_schema.referential_constraints rc join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name where kcu.table_schema='public' and kcu.table_name='game_players' and kcu.column_name='game_id')
  union all
  select '3.11', 'FK: game_players.user_id → profiles'    where exists (select 1 from information_schema.referential_constraints rc join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name where kcu.table_schema='public' and kcu.table_name='game_players' and kcu.column_name='user_id')

  -- ──────────────────────────────────────────────────────────
  -- 4. INDEXES
  -- ──────────────────────────────────────────────────────────

  union all
  select '4.01', 'INDEX: idx_profiles_sport'        where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_profiles_sport')
  union all
  select '4.02', 'INDEX: idx_swipes_swiper'         where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_swipes_swiper')
  union all
  select '4.03', 'INDEX: idx_swipes_target'         where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_swipes_target')
  union all
  select '4.04', 'INDEX: idx_swipes_swiper_target'  where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_swipes_swiper_target')
  union all
  select '4.05', 'INDEX: idx_matches_user_a'        where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_matches_user_a')
  union all
  select '4.06', 'INDEX: idx_matches_user_b'        where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_matches_user_b')
  union all
  select '4.07', 'INDEX: idx_matches_created_at'    where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_matches_created_at')
  union all
  select '4.08', 'INDEX: idx_messages_match_id'     where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_messages_match_id')
  union all
  select '4.09', 'INDEX: idx_messages_created_at'   where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_messages_created_at')
  union all
  select '4.10', 'INDEX: idx_games_host_id'         where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_games_host_id')
  union all
  select '4.11', 'INDEX: idx_games_scheduled_at'    where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_games_scheduled_at')
  union all
  select '4.12', 'INDEX: idx_games_status'          where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_games_status')
  union all
  select '4.13', 'INDEX: idx_game_players_game_id'  where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_game_players_game_id')
  union all
  select '4.14', 'INDEX: idx_game_players_user_id'  where exists (select 1 from pg_indexes where schemaname='public' and indexname='idx_game_players_user_id')

),

-- All expected check IDs
expected (id, label) as (
  values
  ('1.01','TABLE: profiles exists'),('1.02','COLUMN: profiles.id'),('1.03','COLUMN: profiles.name'),
  ('1.04','COLUMN: profiles.sport'),('1.05','COLUMN: profiles.skill_level'),('1.06','COLUMN: profiles.avatar_url'),
  ('1.07','COLUMN: profiles.location'),('1.08','COLUMN: profiles.bio'),('1.09','COLUMN: profiles.created_at'),
  ('1.10','COLUMN: profiles.updated_at'),('1.11','TABLE: swipes exists'),('1.12','COLUMN: swipes.swiper_id'),
  ('1.13','COLUMN: swipes.target_id'),('1.14','COLUMN: swipes.direction'),('1.15','TABLE: matches exists'),
  ('1.16','COLUMN: matches.user_a'),('1.17','COLUMN: matches.user_b'),('1.18','TABLE: messages exists'),
  ('1.19','COLUMN: messages.match_id'),('1.20','COLUMN: messages.sender_id'),('1.21','COLUMN: messages.content'),
  ('1.22','TABLE: games exists'),('1.23','COLUMN: games.host_id'),('1.24','COLUMN: games.match_id'),
  ('1.25','COLUMN: games.sport'),('1.26','COLUMN: games.location'),('1.27','COLUMN: games.scheduled_at'),
  ('1.28','COLUMN: games.status'),('1.29','TABLE: game_players exists'),('1.30','COLUMN: game_players.game_id'),
  ('1.31','COLUMN: game_players.user_id'),
  ('2.01','RLS: profiles'),('2.02','RLS: swipes'),('2.03','RLS: matches'),
  ('2.04','RLS: messages'),('2.05','RLS: games'),('2.06','RLS: game_players'),
  ('3.01','FK: profiles.id → auth.users'),('3.02','FK: swipes.swiper_id → profiles'),
  ('3.03','FK: swipes.target_id → profiles'),('3.04','FK: matches.user_a → profiles'),
  ('3.05','FK: matches.user_b → profiles'),('3.06','FK: messages.match_id → matches'),
  ('3.07','FK: messages.sender_id → profiles'),('3.08','FK: games.host_id → profiles'),
  ('3.09','FK: games.match_id → matches'),('3.10','FK: game_players.game_id → games'),
  ('3.11','FK: game_players.user_id → profiles'),
  ('4.01','INDEX: idx_profiles_sport'),('4.02','INDEX: idx_swipes_swiper'),
  ('4.03','INDEX: idx_swipes_target'),('4.04','INDEX: idx_swipes_swiper_target'),
  ('4.05','INDEX: idx_matches_user_a'),('4.06','INDEX: idx_matches_user_b'),
  ('4.07','INDEX: idx_matches_created_at'),('4.08','INDEX: idx_messages_match_id'),
  ('4.09','INDEX: idx_messages_created_at'),('4.10','INDEX: idx_games_host_id'),
  ('4.11','INDEX: idx_games_scheduled_at'),('4.12','INDEX: idx_games_status'),
  ('4.13','INDEX: idx_game_players_game_id'),('4.14','INDEX: idx_game_players_user_id')
)

select
  e.id                                              as "#",
  case when c.id is not null then '✅ PASS' else '❌ FAIL' end as result,
  e.label                                           as description
from expected e
left join checks c on c.id = e.id
order by e.id;
