import type { PrimaryFear, Archetype, Package } from '@/types/quiz';

// Universal quiz questions
export const UNIVERSAL_QUESTIONS = [
  {
    id: 'primary-fear',
    question: "What's your biggest concern about your wedding film?",
    type: 'multiple-choice' as const,
    options: [
      { id: 'memories-fading', label: 'Memories fading over time' },
      { id: 'wrong-videographer', label: 'Choosing the wrong videographer' },
      { id: 'generic-style', label: 'Generic, formulaic style' },
      { id: 'missed-moments', label: 'Missing important emotional moments' },
      { id: 'budget-pressure', label: 'Budget vs. quality tradeoff' },
    ],
  },
  {
    id: 'planning-stage',
    question: 'Where are you in your wedding planning?',
    type: 'radio' as const,
    options: [
      { id: 'just-engaged', label: 'Just got engaged' },
      { id: 'underway', label: 'Planning underway (3-12 months out)' },
      { id: 'close-to-booking', label: 'Very close to booking (within 3 months)' },
    ],
  },
  {
    id: 'style-preference',
    question: 'What matters more to you?',
    type: 'slider' as const,
    min: 0,
    max: 100,
    leftLabel: 'Raw, authentic emotion',
    rightLabel: 'Cinematic, beautifully produced',
  },
];

// Adaptive follow-up questions by branch
export const ADAPTIVE_QUESTIONS = {
  'memories-fading': {
    id: 'memories-moments',
    question: 'What moments matter most to you on your wedding day?',
    type: 'open-text' as const,
    placeholder: 'e.g., getting ready, first look, vows, first dance...',
  },
  'wrong-videographer': {
    id: 'vision-clarity',
    question: 'How clear is your vision for your wedding film?',
    type: 'radio' as const,
    options: [
      { id: 'very-clear', label: 'Very clear, I know what I want' },
      { id: 'somewhat-clear', label: 'Somewhat clear, still exploring' },
      { id: 'not-sure', label: 'Not sure yet, would love guidance' },
    ],
  },
  'generic-style': {
    id: 'style-preference-detail',
    question: 'What filmmaking style appeals to you most?',
    type: 'radio' as const,
    options: [
      { id: 'documentary', label: 'Documentary and real moments' },
      { id: 'cinematic', label: 'Cinematic and beautifully produced' },
      { id: 'hybrid', label: 'Mix of both' },
    ],
  },
  'missed-moments': {
    id: 'emotional-fears',
    question: 'What emotions do you most want to see captured?',
    type: 'open-text' as const,
    placeholder: 'e.g., tears, laughter, first kiss, reactions...',
  },
  'budget-pressure': {
    id: 'budget-flexibility',
    question: 'How flexible is your budget?',
    type: 'radio' as const,
    options: [
      { id: 'tight', label: 'Tight budget, need good value' },
      { id: 'flexible', label: 'Some flexibility' },
      { id: 'not-priority', label: 'Quality over cost' },
    ],
  },
  'just-engaged': {
    id: 'wedding-vision',
    question: 'What does your love story mean to you?',
    type: 'open-text' as const,
    placeholder: 'How did you meet? What makes your relationship special?',
  },
  'close-to-booking': {
    id: 'booking-readiness',
    question: 'What would make you confident to move forward?',
    type: 'radio' as const,
    options: [
      { id: 'portfolio', label: 'See portfolio and past work' },
      { id: 'consultation', label: 'Talk through my vision' },
      { id: 'pricing', label: 'Understand pricing and packages' },
    ],
  },
};

// Archetype definitions
export const ARCHETYPES: Record<Archetype, {
  name: string;
  headline: string;
  description: string;
  primaryFears: PrimaryFear[];
  emotionalMirror: string;
}> = {
  storybook: {
    name: 'The Storybook Couple',
    headline: "You're dreamers who want your love story captured in the most beautiful, timeless way possible",
    description: 'Couples who value cinematic storytelling and want their emotions preserved',
    primaryFears: ['memories-fading', 'generic-style'],
    emotionalMirror: "You're afraid that the emotions, laughter, and tender moments of your wedding day will fade with time",
  },
  'real-moment-seekers': {
    name: 'The Real Moment Seekers',
    headline: "You want genuine emotion captured, not staged moments",
    description: 'Couples who prioritize authenticity and fear important moments will be missed',
    primaryFears: ['missed-moments', 'generic-style'],
    emotionalMirror: "You're worried that the real, unfiltered feeling of your day will be missed or lost",
  },
  'confident-planners': {
    name: 'The Confident Planners',
    headline: "You're ready to invest in your vision",
    description: 'Couples close to booking who know what they want and need reassurance',
    primaryFears: ['wrong-videographer'],
    emotionalMirror: "You want to make sure you're choosing the right videographer for your vision",
  },
  'budget-smart': {
    name: 'The Budget-Smart Couple',
    headline: "You want quality without breaking the bank",
    description: 'Couples balancing cost and quality in their decision',
    primaryFears: ['budget-pressure'],
    emotionalMirror: "You want a beautiful film that fits your budget without compromise",
  },
  custom: {
    name: 'Your Custom Profile',
    headline: "Your wedding is uniquely yours",
    description: 'A personalized approach to your vision',
    primaryFears: [],
    emotionalMirror: "We understand your wedding and what matters most to you",
  },
};

// Package definitions
export const PACKAGES: Record<Package, {
  name: string;
  price: number;
  tagline: string;
  description: string;
  deliverables: string[];
  positioningMessage: string;
}> = {
  documentary: {
    name: 'Documentary Collection',
    price: 2550,
    tagline: 'Perfect for intimate weddings',
    description: 'A focused, beautiful capture of your most important moments',
    deliverables: [
      'Up to 6 hours of documentation',
      'One filmmaker',
      'Full ceremony and speeches video',
      'Short story film',
      'Raw footage film',
    ],
    positioningMessage: 'One filmmaker focuses solely on authentic moments — the quiet tears, the real laughs',
  },
  keepsake: {
    name: 'Keepsake Collection',
    price: 4750,
    tagline: 'Our most popular package',
    description: 'A cinematic retelling of your day — the full arc of your story',
    deliverables: [
      'Up to 8 hours of documentation',
      'Two filmmakers',
      'Short story film',
      'Complimentary story session',
      'Full ceremony and speeches video',
      'Raw footage film',
    ],
    positioningMessage: 'A cinematic retelling of your day with two filmmakers and a complimentary story session',
  },
  heirloom: {
    name: 'Heirloom Collection',
    price: 5750,
    tagline: 'The full cinematic experience',
    description: 'Everything, preserved forever. A full cinematic documentary weddings experience',
    deliverables: [
      'Up to 10 hours of documentation',
      'Two filmmakers',
      'Short story film',
      'Complimentary story session',
      'Full ceremony and speeches video',
      'Raw footage film',
      'Extended coverage',
    ],
    positioningMessage: 'Everything preserved forever — extended coverage with two filmmakers and complimentary story sessions',
  },
};
