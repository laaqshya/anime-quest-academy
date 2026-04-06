export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  xpReward: number;
  coinReward: number;
}

export interface DescriptiveQuestion {
  id: string;
  question: string;
  xpReward: number;
  coinReward: number;
}

export interface Level {
  id: string;
  name: string;
  number: number;
  unlocked: boolean;
  completed: boolean;
  stars: number;
  mcqQuestions: MCQQuestion[];
  descriptiveQuestions: DescriptiveQuestion[];
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  levels: Level[];
  icon: string;
}

export interface PlayerStats {
  coins: number;
  gems: number;
  xp: number;
  maxXp: number;
  level: number;
  streak: number;
  badges: string[];
}

export const initialPlayerStats: PlayerStats = {
  coins: 150,
  gems: 12,
  xp: 340,
  maxXp: 500,
  level: 3,
  streak: 5,
  badges: ["First Steps", "Quick Thinker"],
};

export const sampleChapters: Chapter[] = [
  {
    id: "ch1",
    name: "The Awakening",
    description: "Begin your journey with the fundamentals",
    icon: "⚔️",
    levels: [
      {
        id: "ch1-l1", name: "First Light", number: 1, unlocked: true, completed: true, stars: 3,
        mcqQuestions: [
          { id: "q1", question: "What is the capital of Japan?", options: ["Tokyo", "Osaka", "Kyoto", "Nagoya"], correctIndex: 0, xpReward: 20, coinReward: 5 },
          { id: "q2", question: "Which element has the symbol 'O'?", options: ["Gold", "Oxygen", "Osmium", "Oganesson"], correctIndex: 1, xpReward: 20, coinReward: 5 },
          { id: "q3", question: "What is 7 × 8?", options: ["54", "56", "58", "64"], correctIndex: 1, xpReward: 20, coinReward: 5 },
        ],
        descriptiveQuestions: [
          { id: "d1", question: "Describe the water cycle in your own words.", xpReward: 30, coinReward: 10 },
        ],
      },
      {
        id: "ch1-l2", name: "Rising Dawn", number: 2, unlocked: true, completed: true, stars: 2,
        mcqQuestions: [
          { id: "q4", question: "Who wrote 'Romeo and Juliet'?", options: ["Dickens", "Shakespeare", "Austen", "Tolkien"], correctIndex: 1, xpReward: 25, coinReward: 6 },
          { id: "q5", question: "What planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], correctIndex: 2, xpReward: 25, coinReward: 6 },
        ],
        descriptiveQuestions: [],
      },
      {
        id: "ch1-l3", name: "Trial by Fire", number: 3, unlocked: true, completed: false, stars: 0,
        mcqQuestions: [
          { id: "q6", question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctIndex: 3, xpReward: 30, coinReward: 8 },
          { id: "q7", question: "Which gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], correctIndex: 2, xpReward: 30, coinReward: 8 },
          { id: "q8", question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"], correctIndex: 0, xpReward: 30, coinReward: 8 },
          { id: "q9", question: "How many continents are there?", options: ["5", "6", "7", "8"], correctIndex: 2, xpReward: 30, coinReward: 8 },
        ],
        descriptiveQuestions: [
          { id: "d2", question: "Explain why the sky appears blue during the day.", xpReward: 40, coinReward: 15 },
        ],
      },
      {
        id: "ch1-l4", name: "Shadow Valley", number: 4, unlocked: false, completed: false, stars: 0,
        mcqQuestions: [
          { id: "q10", question: "What is H₂O commonly known as?", options: ["Salt", "Water", "Acid", "Sugar"], correctIndex: 1, xpReward: 35, coinReward: 10 },
        ],
        descriptiveQuestions: [],
      },
      {
        id: "ch1-l5", name: "Final Stand", number: 5, unlocked: false, completed: false, stars: 0,
        mcqQuestions: [
          { id: "q11", question: "Who painted the Mona Lisa?", options: ["Picasso", "Da Vinci", "Van Gogh", "Monet"], correctIndex: 1, xpReward: 40, coinReward: 12 },
        ],
        descriptiveQuestions: [],
      },
    ],
  },
  {
    id: "ch2",
    name: "The Dark Forest",
    description: "Venture deeper into advanced topics",
    icon: "🌲",
    levels: [
      {
        id: "ch2-l1", name: "Into the Woods", number: 1, unlocked: false, completed: false, stars: 0,
        mcqQuestions: [
          { id: "q12", question: "What is the derivative of x²?", options: ["x", "2x", "x²", "2"], correctIndex: 1, xpReward: 35, coinReward: 10 },
        ],
        descriptiveQuestions: [],
      },
      { id: "ch2-l2", name: "Hidden Path", number: 2, unlocked: false, completed: false, stars: 0, mcqQuestions: [], descriptiveQuestions: [] },
      { id: "ch2-l3", name: "Ancient Tree", number: 3, unlocked: false, completed: false, stars: 0, mcqQuestions: [], descriptiveQuestions: [] },
      { id: "ch2-l4", name: "Dark Hollow", number: 4, unlocked: false, completed: false, stars: 0, mcqQuestions: [], descriptiveQuestions: [] },
      { id: "ch2-l5", name: "Forest Heart", number: 5, unlocked: false, completed: false, stars: 0, mcqQuestions: [], descriptiveQuestions: [] },
    ],
  },
];
