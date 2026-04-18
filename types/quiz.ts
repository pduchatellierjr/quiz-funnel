// Primary fear options
export type PrimaryFear =
  | 'memories-fading'
  | 'wrong-videographer'
  | 'generic-style'
  | 'missed-moments'
  | 'budget-pressure';

// Planning stage options
export type PlanningStage =
  | 'just-engaged'
  | 'underway'
  | 'close-to-booking';

// Archetype options
export type Archetype =
  | 'storybook'
  | 'real-moment-seekers'
  | 'confident-planners'
  | 'budget-smart'
  | 'custom';

// Package options
export type Package =
  | 'documentary'
  | 'keepsake'
  | 'heirloom';

// Quiz response data
export interface QuizResponse {
  id?: string;
  email: string;
  name: string;
  weddingDate?: string;
  primaryFear: PrimaryFear;
  planningStage: PlanningStage;
  stylePreference: number; // 0-100
  archetype?: Archetype;
  recommendedPackage?: Package;
  createdAt?: string;
  completedAt?: string;
}

// Personalization data for results page
export interface ResultsData extends QuizResponse {
  archetype: Archetype;
  recommendedPackage: Package;
}
