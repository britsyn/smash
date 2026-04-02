export type Sport = 'padel' | 'tennis' | 'football';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
  sport: Sport;
  skill_level: SkillLevel;
  location?: string;
  bio?: string;
}

export interface Game {
  id: string;
  host_id: string;
  sport: Sport;
  location: string;
  scheduled_at: string;
  players_needed: number;
  players: UserProfile[];
}

export interface Team {
  id: string;
  name: string;
  sport: Sport;
  members: UserProfile[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}
