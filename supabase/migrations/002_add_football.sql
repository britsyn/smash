-- Add 'football' to the sport enum constraint on profiles and games

alter table public.profiles
  drop constraint if exists profiles_sport_check,
  add constraint profiles_sport_check
    check (sport in ('padel', 'tennis', 'football'));

alter table public.games
  drop constraint if exists games_sport_check,
  add constraint games_sport_check
    check (sport in ('padel', 'tennis', 'football'));
