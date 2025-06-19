export type Sex = 'male' | 'female' | 'other';

export type TennisLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: Sex;
  tennis_level: TennisLevel;
  profile_image?: string;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: Sex;
  tennis_level: TennisLevel;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  sex?: Sex;
  tennis_level?: TennisLevel;
  profile_image?: File | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  court_location: string;
  latitude: number;
  longitude: number;
  max_participants: number | null;
  is_cancelled: boolean;
  organizer_id: number;
  registrations?: EventRegistration[];
  available_spots?: number | null;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  user_id: number;
  registration_date: string;
  is_withdrawn: boolean;
  event: Event;
  user: {
    id: number;
    username: string;
    profile_image?: string;
    first_name?: string;
    last_name?: string;
    tennis_level?: TennisLevel;
  };
} 