export interface UserProfile {
  username: string;
  role: string; // 'student' | 'teacher'
  nickname: string;
  gender: 'female' | 'male';
  avatarId: string;
  stars: number;
  progress: number;
  quizCount: number;
}

export interface DictionaryItem {
  key: string;
  word: string;
  category: 'kata' | 'kalimat';
  clip: string;
  description: string;
  learned: boolean;
  icon: string;
}

export interface QuizRound {
  word: string;
  expectedKey: string;
}

export interface AvatarConfig {
  name: string;
  color: string;
  accent: string;
  emoji: string;
  starsNeeded?: number;
  svg: string;
}

export interface Student {
  id: string;
  name: string;
  stars: number;
  accuracy: string;
  status: string;
  difficultGesture: string;
  disabilityType: string;
  studentCode: string;
}

export interface Classroom {
  id: string;
  name: string;
  code: string;
  count: number;
  students: Student[];
}

