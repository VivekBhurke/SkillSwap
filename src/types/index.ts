export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  credits: number;
  rating: number;
  reviewCount: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  description: string;
  creditsPerHour: number;
}

export interface UserSkill extends Skill {
  userId: string;
  availability: string[];
}

export interface Session {
  id: string;
  teacherId: string;
  studentId: string;
  skillId: string;
  date: string;
  duration: number;
  credits: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  location?: string;
  isOnline: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'purchased' | 'gifted';
  amount: number;
  description: string;
  date: string;
  sessionId?: string;
}

export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  date: string;
}