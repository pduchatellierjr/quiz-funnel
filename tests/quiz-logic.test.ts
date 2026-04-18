import { calculateArchetype, assignPackage, getAdaptiveQuestions } from '@/lib/quiz-logic';

describe('calculateArchetype', () => {
  test('returns storybook for memories-fading + high cinematic preference', () => {
    expect(calculateArchetype('memories-fading', 75)).toBe('storybook');
  });

  test('returns real-moment-seekers for missed-moments + low cinematic preference', () => {
    expect(calculateArchetype('missed-moments', 25)).toBe('real-moment-seekers');
  });

  test('returns confident-planners for wrong-videographer', () => {
    expect(calculateArchetype('wrong-videographer', 50)).toBe('confident-planners');
  });

  test('returns budget-smart for budget-pressure', () => {
    expect(calculateArchetype('budget-pressure', 50)).toBe('budget-smart');
  });

  test('returns custom for unmatched combination', () => {
    expect(calculateArchetype('generic-style', 50)).toBe('custom');
  });
});

describe('assignPackage', () => {
  test('returns heirloom for high cinematic + close to booking', () => {
    expect(assignPackage(75, 'close-to-booking')).toBe('heirloom');
  });

  test('returns heirloom for high cinematic preference', () => {
    expect(assignPackage(75, 'underway')).toBe('heirloom');
  });

  test('returns documentary for low cinematic (high authentic)', () => {
    expect(assignPackage(25, 'underway')).toBe('documentary');
  });

  test('returns keepsake for balanced preference', () => {
    expect(assignPackage(50, 'underway')).toBe('keepsake');
  });

  test('returns keepsake as default for moderate values', () => {
    expect(assignPackage(50, 'just-engaged')).toBe('keepsake');
  });
});

describe('getAdaptiveQuestions', () => {
  test('includes primary fear question and planning stage follow-up for just-engaged', () => {
    expect(getAdaptiveQuestions('memories-fading', 'just-engaged')).toContain('memories-fading');
    expect(getAdaptiveQuestions('memories-fading', 'just-engaged')).toContain('just-engaged');
  });

  test('includes primary fear and close-to-booking follow-up for close to booking', () => {
    expect(getAdaptiveQuestions('wrong-videographer', 'close-to-booking')).toContain('wrong-videographer');
    expect(getAdaptiveQuestions('wrong-videographer', 'close-to-booking')).toContain('close-to-booking');
  });

  test('returns only primary fear for underway stage', () => {
    const questions = getAdaptiveQuestions('budget-pressure', 'underway');
    expect(questions).toContain('budget-pressure');
    expect(questions.length).toBe(1);
  });
});
