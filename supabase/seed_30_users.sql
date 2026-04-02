-- ============================================================
-- SMASH — 30 Random Test Users
-- Run in: Supabase Dashboard → SQL Editor
-- UUIDs pattern: d00...001 through d00...030
-- ============================================================

-- ============================================================
-- 1. AUTH USERS (email confirmed, unusable password hash)
-- ============================================================

insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) values
  ('d0000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','carlos@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Carlos Rivera","sport":"padel","skill_level":"advanced"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','sofia@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Sofia Martínez","sport":"padel","skill_level":"intermediate"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','luca@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Luca Rossi","sport":"tennis","skill_level":"beginner"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','amira@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Amira Hassan","sport":"padel","skill_level":"intermediate"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','tom@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Tom Bennett","sport":"tennis","skill_level":"advanced"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','yuki@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Yuki Tanaka","sport":"padel","skill_level":"beginner"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','marco@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Marco Silva","sport":"padel","skill_level":"advanced"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','elena@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Elena Popescu","sport":"tennis","skill_level":"intermediate"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','james@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"James Okafor","sport":"padel","skill_level":"intermediate"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated','nadia@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Nadia Kowalski","sport":"tennis","skill_level":"beginner"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000000','authenticated','authenticated','rafael@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Rafael Torres","sport":"padel","skill_level":"advanced"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000000','authenticated','authenticated','priya@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Priya Sharma","sport":"padel","skill_level":"intermediate"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000000','authenticated','authenticated','felix@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Felix Wagner","sport":"tennis","skill_level":"advanced"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000000','authenticated','authenticated','isabella@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Isabella Greco","sport":"padel","skill_level":"beginner"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000000','authenticated','authenticated','omar@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Omar Farouk","sport":"tennis","skill_level":"intermediate"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000000','authenticated','authenticated','laura@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Laura Svensson","sport":"padel","skill_level":"advanced"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000017','00000000-0000-0000-0000-000000000000','authenticated','authenticated','andrei@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Andrei Volkov","sport":"tennis","skill_level":"beginner"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000000','authenticated','authenticated','chloe@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Chloe Dupont","sport":"padel","skill_level":"intermediate"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000000','authenticated','authenticated','kai@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Kai Nakamura","sport":"padel","skill_level":"advanced"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000000','authenticated','authenticated','sara@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Sara Lindqvist","sport":"tennis","skill_level":"intermediate"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000000','authenticated','authenticated','diego@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Diego Herrera","sport":"padel","skill_level":"beginner"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000022','00000000-0000-0000-0000-000000000000','authenticated','authenticated','aisha@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Aisha Diallo","sport":"tennis","skill_level":"advanced"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000023','00000000-0000-0000-0000-000000000000','authenticated','authenticated','niklas@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Niklas Berg","sport":"padel","skill_level":"intermediate"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000024','00000000-0000-0000-0000-000000000000','authenticated','authenticated','valentina@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Valentina Cruz","sport":"padel","skill_level":"advanced"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000025','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ethan@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Ethan Clarke","sport":"tennis","skill_level":"beginner"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000026','00000000-0000-0000-0000-000000000000','authenticated','authenticated','mia@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Mia Johansson","sport":"padel","skill_level":"intermediate"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000027','00000000-0000-0000-0000-000000000000','authenticated','authenticated','hassan@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Hassan Al-Rashid","sport":"tennis","skill_level":"intermediate"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000028','00000000-0000-0000-0000-000000000000','authenticated','authenticated','anna@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Anna Kovalenko","sport":"padel","skill_level":"beginner"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000029','00000000-0000-0000-0000-000000000000','authenticated','authenticated','gabriel@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Gabriel Moreira","sport":"padel","skill_level":"advanced"}',now(),now()),
  ('d0000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000000','authenticated','authenticated','zoe@smash.test','$2a$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',now(),'{"provider":"email","providers":["email"]}','{"name":"Zoe Papadopoulos","sport":"tennis","skill_level":"advanced"}',now(),now())
on conflict (id) do nothing;


-- ============================================================
-- 2. PROFILES (with pravatar.cc photos)
-- img numbers 1-30, mix of genders
-- ============================================================

insert into public.profiles (id, name, avatar_url, sport, skill_level, location, bio) values
  ('d0000000-0000-0000-0000-000000000001','Carlos Rivera',   'https://i.pravatar.cc/300?img=11','padel',  'advanced',    'Madrid',     'Weekend warrior. Smash everything.'),
  ('d0000000-0000-0000-0000-000000000002','Sofia Martínez',  'https://i.pravatar.cc/300?img=47','padel',  'intermediate','Barcelona',  'Looking for doubles partners 🏓'),
  ('d0000000-0000-0000-0000-000000000003','Luca Rossi',      'https://i.pravatar.cc/300?img=14','tennis', 'beginner',    'Milan',      'Just started, keen to improve!'),
  ('d0000000-0000-0000-0000-000000000004','Amira Hassan',    'https://i.pravatar.cc/300?img=48','padel',  'intermediate','Dubai',      'Padel addict. Hit me up for a game.'),
  ('d0000000-0000-0000-0000-000000000005','Tom Bennett',     'https://i.pravatar.cc/300?img=15','tennis', 'advanced',    'London',     'Ex-club player. Competitive mindset.'),
  ('d0000000-0000-0000-0000-000000000006','Yuki Tanaka',     'https://i.pravatar.cc/300?img=49','padel',  'beginner',    'Tokyo',      'New to padel, loving every minute!'),
  ('d0000000-0000-0000-0000-000000000007','Marco Silva',     'https://i.pravatar.cc/300?img=16','padel',  'advanced',    'Lisbon',     'National league player. Always up for a challenge.'),
  ('d0000000-0000-0000-0000-000000000008','Elena Popescu',   'https://i.pravatar.cc/300?img=50','tennis', 'intermediate','Bucharest',  'Tennis 3x a week. Hit me up!'),
  ('d0000000-0000-0000-0000-000000000009','James Okafor',    'https://i.pravatar.cc/300?img=17','padel',  'intermediate','Lagos',      'Padel is life. Lagos squad.'),
  ('d0000000-0000-0000-0000-000000000010','Nadia Kowalski',  'https://i.pravatar.cc/300?img=51','tennis', 'beginner',    'Warsaw',     'Learning the basics, super motivated.'),
  ('d0000000-0000-0000-0000-000000000011','Rafael Torres',   'https://i.pravatar.cc/300?img=18','padel',  'advanced',    'Buenos Aires','Padel is in my blood 🩸'),
  ('d0000000-0000-0000-0000-000000000012','Priya Sharma',    'https://i.pravatar.cc/300?img=52','padel',  'intermediate','Mumbai',     'Competitive but friendly. Come play!'),
  ('d0000000-0000-0000-0000-000000000013','Felix Wagner',    'https://i.pravatar.cc/300?img=19','tennis', 'advanced',    'Berlin',     'Regional champion 2023. Let''s rally.'),
  ('d0000000-0000-0000-0000-000000000014','Isabella Greco',  'https://i.pravatar.cc/300?img=53','padel',  'beginner',    'Rome',       'Padel with friends on weekends 🌞'),
  ('d0000000-0000-0000-0000-000000000015','Omar Farouk',     'https://i.pravatar.cc/300?img=20','tennis', 'intermediate','Cairo',      'Big serve, working on my backhand.'),
  ('d0000000-0000-0000-0000-000000000016','Laura Svensson',  'https://i.pravatar.cc/300?img=54','padel',  'advanced',    'Stockholm',  'Top 50 player in Sweden. Serious games only.'),
  ('d0000000-0000-0000-0000-000000000017','Andrei Volkov',   'https://i.pravatar.cc/300?img=21','tennis', 'beginner',    'Moscow',     'Just moved to tennis from squash.'),
  ('d0000000-0000-0000-0000-000000000018','Chloe Dupont',    'https://i.pravatar.cc/300?img=55','padel',  'intermediate','Paris',      'Morning padel sessions 🥐'),
  ('d0000000-0000-0000-0000-000000000019','Kai Nakamura',    'https://i.pravatar.cc/300?img=22','padel',  'advanced',    'Osaka',      'Fast hands, faster serves.'),
  ('d0000000-0000-0000-0000-000000000020','Sara Lindqvist',  'https://i.pravatar.cc/300?img=56','tennis', 'intermediate','Gothenburg',  'Playing since 14. Love a good match.'),
  ('d0000000-0000-0000-0000-000000000021','Diego Herrera',   'https://i.pravatar.cc/300?img=23','padel',  'beginner',    'Bogotá',     'Still learning but always giving 100%.'),
  ('d0000000-0000-0000-0000-000000000022','Aisha Diallo',    'https://i.pravatar.cc/300?img=57','tennis', 'advanced',    'Dakar',      'African youth champion. Let''s go.'),
  ('d0000000-0000-0000-0000-000000000023','Niklas Berg',     'https://i.pravatar.cc/300?img=24','padel',  'intermediate','Helsinki',   'Padel after work every Friday.'),
  ('d0000000-0000-0000-0000-000000000024','Valentina Cruz',  'https://i.pravatar.cc/300?img=58','padel',  'advanced',    'Santiago',   'Pro circuit player. Always pushing limits.'),
  ('d0000000-0000-0000-0000-000000000025','Ethan Clarke',    'https://i.pravatar.cc/300?img=25','tennis', 'beginner',    'Sydney',     'Beach tennis convert, now trying proper courts.'),
  ('d0000000-0000-0000-0000-000000000026','Mia Johansson',   'https://i.pravatar.cc/300?img=59','padel',  'intermediate','Copenhagen', 'Fun and competitive. Coffee after matches ☕'),
  ('d0000000-0000-0000-0000-000000000027','Hassan Al-Rashid','https://i.pravatar.cc/300?img=26','tennis', 'intermediate','Riyadh',     'Court reserved every Tuesday, need a partner!'),
  ('d0000000-0000-0000-0000-000000000028','Anna Kovalenko',  'https://i.pravatar.cc/300?img=60','padel',  'beginner',    'Kyiv',       'Just discovered padel, totally hooked.'),
  ('d0000000-0000-0000-0000-000000000029','Gabriel Moreira', 'https://i.pravatar.cc/300?img=27','padel',  'advanced',    'São Paulo',  'Padel instructor by day, player by night.'),
  ('d0000000-0000-0000-0000-000000000030','Zoe Papadopoulos','https://i.pravatar.cc/300?img=61','tennis', 'advanced',    'Athens',     'Serve and volley all day. Come challenge me.')
on conflict (id) do nothing;
