-- ============================================================
-- SMASH V1 — Seed Data
-- Repeatable: uses hardcoded UUIDs + ON CONFLICT DO NOTHING
-- Run in Supabase SQL Editor
-- ============================================================

-- Hardcoded UUIDs
-- user_1 : a0000000-0000-0000-0000-000000000001  (padel / intermediate)
-- user_2 : a0000000-0000-0000-0000-000000000002  (padel / advanced)
-- user_3 : a0000000-0000-0000-0000-000000000003  (tennis / beginner)
-- match  : b0000000-0000-0000-0000-000000000001
-- msg 1-5: c0000000-0000-0000-0000-00000000000{1-5}


-- ============================================================
-- 1. AUTH USERS
-- Supabase requires a row in auth.users before profiles (FK).
-- These are fake users — passwords are unusable bcrypt hashes.
-- ============================================================

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'alex@smash.test',
    '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Alex Rivera","sport":"padel","skill_level":"intermediate"}',
    now(),
    now()
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'sam@smash.test',
    '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Sam Torres","sport":"padel","skill_level":"advanced"}',
    now(),
    now()
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'jordan@smash.test',
    '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Jordan Kim","sport":"tennis","skill_level":"beginner"}',
    now(),
    now()
  )
on conflict (id) do nothing;


-- ============================================================
-- 2. PROFILES
-- ============================================================

insert into public.profiles (id, name, sport, skill_level, location, bio)
values
  (
    'a0000000-0000-0000-0000-000000000001',
    'Alex Rivera',
    'padel',
    'intermediate',
    'Barcelona',
    'Playing padel for 3 years. Love a good rally!'
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'Sam Torres',
    'padel',
    'advanced',
    'Barcelona',
    'Compete locally. Looking for practice partners.'
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'Jordan Kim',
    'tennis',
    'beginner',
    'Madrid',
    'Just started playing, keen to improve!'
  )
on conflict (id) do nothing;


-- ============================================================
-- 3. SWIPES — mutual like between user_1 and user_2
-- ============================================================

insert into public.swipes (id, swiper_id, target_id, direction)
values
  (
    'd0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',  -- alex likes sam
    'a0000000-0000-0000-0000-000000000002',
    'like'
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',  -- sam likes alex back
    'a0000000-0000-0000-0000-000000000001',
    'like'
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',  -- alex passes jordan
    'a0000000-0000-0000-0000-000000000003',
    'pass'
  )
on conflict (swiper_id, target_id) do nothing;


-- ============================================================
-- 4. MATCH — result of the mutual like
-- ============================================================

insert into public.matches (id, user_a, user_b)
values (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002'
)
on conflict (user_a, user_b) do nothing;


-- ============================================================
-- 5. MESSAGES — 5 messages in the match
-- ============================================================

insert into public.messages (id, match_id, sender_id, content, created_at)
values
  (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Hey! Up for a game this weekend?',
    now() - interval '2 hours'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'Absolutely! Saturday morning works for me.',
    now() - interval '1 hour 50 minutes'
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Perfect. Shall we say 10am at Club Padel BCN?',
    now() - interval '1 hour 40 minutes'
  ),
  (
    'c0000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'Works for me. Do you have a partner or should we find two more?',
    now() - interval '30 minutes'
  ),
  (
    'c0000000-0000-0000-0000-000000000005',
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'I can bring someone. See you there! 🎾',
    now() - interval '10 minutes'
  )
on conflict (id) do nothing;


-- ============================================================
-- VERIFY
-- Quick row count to confirm everything landed.
-- ============================================================

select 'auth.users'   as "table", count(*) as rows from auth.users   where id::text like 'a0000000%'
union all
select 'profiles',    count(*) from public.profiles    where id::text like 'a0000000%'
union all
select 'swipes',      count(*) from public.swipes      where id::text like 'd0000000%'
union all
select 'matches',     count(*) from public.matches     where id::text like 'b0000000%'
union all
select 'messages',    count(*) from public.messages    where id::text like 'c0000000%';
