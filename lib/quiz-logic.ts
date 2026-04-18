import type { PrimaryFear, PlanningStage, Archetype, Package } from '@/types/quiz';

// Calculate archetype based on quiz answers
export function calculateArchetype(
  primaryFear: PrimaryFear,
  stylePreference: number
): Archetype {
  if (primaryFear === 'memories-fading' || primaryFear === 'generic-style') {
    if (stylePreference >= 70) return 'storybook';
  }

  if (primaryFear === 'missed-moments' || primaryFear === 'generic-style') {
    if (stylePreference <= 30) return 'real-moment-seekers';
  }

  if (primaryFear === 'wrong-videographer') {
    return 'confident-planners';
  }

  if (primaryFear === 'budget-pressure') {
    return 'budget-smart';
  }

  return 'custom';
}

// Assign package based on style preference and planning stage
export function assignPackage(
  stylePreference: number,
  planningStage: PlanningStage
): Package {
  // High cinematic + close to booking = Heirloom
  if (stylePreference >= 70 && planningStage === 'close-to-booking') {
    return 'heirloom';
  }

  // High cinematic preference = Heirloom
  if (stylePreference >= 70) {
    return 'heirloom';
  }

  // Low cinematic (high authentic) = Documentary
  if (stylePreference <= 30) {
    return 'documentary';
  }

  // Default to Keepsake (middle ground)
  return 'keepsake';
}

// Determine which adaptive follow-up question(s) to ask
export function getAdaptiveQuestions(primaryFear: PrimaryFear, planningStage: PlanningStage): string[] {
  const questions: string[] = [];

  // Always include primary fear follow-up
  questions.push(primaryFear);

  // Include planning stage follow-up for early planners
  if (planningStage === 'just-engaged') {
    questions.push('just-engaged');
  } else if (planningStage === 'close-to-booking') {
    questions.push('close-to-booking');
  }

  return questions;
}
