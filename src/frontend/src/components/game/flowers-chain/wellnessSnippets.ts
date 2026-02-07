export interface WellnessSnippet {
  id: number;
  text: string;
}

export const wellnessSnippets: WellnessSnippet[] = [
  {
    id: 1,
    text: 'Like flowers in a garden, each moment of peace you cultivate helps you grow stronger and more resilient.',
  },
  {
    id: 2,
    text: 'Take a deep breath. Notice the present moment. You are exactly where you need to be.',
  },
  {
    id: 3,
    text: 'Cherry blossoms bloom for only a short time, reminding us to appreciate the beauty in each fleeting moment.',
  },
  {
    id: 4,
    text: 'Just as flowers turn toward the sun, turn your thoughts toward what brings you joy and peace.',
  },
  {
    id: 5,
    text: 'Every flower must grow through dirt before it blooms. Your challenges are part of your growth.',
  },
  {
    id: 6,
    text: 'Lavender has been used for centuries to promote calm and relaxation. Let this moment be your lavender field.',
  },
  {
    id: 7,
    text: 'In Japanese culture, flower viewing (hanami) is a practice of mindfulness and appreciation. What beauty can you notice today?',
  },
  {
    id: 8,
    text: 'Roses grow thorns to protect their beauty. It\'s okay to set boundaries to protect your peace.',
  },
  {
    id: 9,
    text: 'Sunflowers always face the light. What positive thoughts can you turn toward right now?',
  },
  {
    id: 10,
    text: 'A lotus flower blooms in muddy water, teaching us that beauty and growth can emerge from difficult circumstances.',
  },
  {
    id: 11,
    text: 'Take five slow breaths. With each exhale, release tension. With each inhale, welcome calm.',
  },
  {
    id: 12,
    text: 'Wildflowers don\'t worry about where they grow—they just bloom. Trust your journey.',
  },
];

export function getRandomSnippet(): WellnessSnippet {
  return wellnessSnippets[Math.floor(Math.random() * wellnessSnippets.length)];
}

export function getSnippetById(id: number): WellnessSnippet | undefined {
  return wellnessSnippets.find((snippet) => snippet.id === id);
}
