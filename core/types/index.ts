export type Locale = 'en' | 'hi';

export interface BilingualText {
  en: string;
  hi: string;
}

export interface UserProfile {
  name: string;
  mobile: string;
  dob: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm optional
  image?: string; // base64 or url
  consent: boolean;
}

export interface NumberReading {
  number: number;
  planet: BilingualText;
  title: BilingualText;
  element: BilingualText;
  description: BilingualText;
  positiveAttributes: BilingualText[];
  negativeAttributes: BilingualText[];
  luckyColors: BilingualText[];
  luckyDays: BilingualText[];
  luckyNumbers: number[];
  unfavorableNumbers: number[];
  deity: BilingualText;
  gemstone: BilingualText;
}

export interface DestinyReading {
  number: number;
  title: BilingualText;
  lifeMission: BilingualText;
  coreStrengths: BilingualText[];
  careerAvenues: BilingualText[];
  relationshipStyle: BilingualText;
}

export interface CombinationReading {
  mulank: number;
  bhagyank: number;
  relationType: 'friendly' | 'enemy' | 'neutral';
  title: BilingualText;
  synergyAnalysis: BilingualText;
  careerGuidance: BilingualText;
  personalLife: BilingualText;
  luckyRemedies: BilingualText[];
}

export interface MissingNumberReading {
  number: number;
  deficiencyImpact: BilingualText;
  psychologicalEffect: BilingualText;
  remedies: Array<{
    type: 'Crystal/Gem' | 'Mantra' | 'Lifestyle' | 'Charity' | 'Yantra';
    typeHi: string;
    action: BilingualText;
  }>;
}

export interface RepeatingNumberReading {
  number: number;
  frequency: number;
  nature: BilingualText;
  overloadImpact: BilingualText;
  groundingRemedy: BilingualText;
}

export interface YogaReadingItem {
  id: string;
  name: BilingualText;
  category: BilingualText;
  numbers: [number, number, number];
  description: BilingualText;
  positiveManifestation: BilingualText;
  balancingRemedy: BilingualText;
}

export interface RemedyMasterItem {
  id: string;
  title: BilingualText;
  category: 'Gemstone' | 'Rudraksha' | 'Mantra' | 'Vastu' | 'Lifestyle' | 'Daan/Charity';
  categoryHi: string;
  governingNumber: number;
  planet: BilingualText;
  overview: BilingualText;
  method: BilingualText;
  bestDayTime: BilingualText;
}

export interface HelpTipItem {
  id: string;
  topic: BilingualText;
  content: BilingualText;
  importance: 'High' | 'Medium' | 'Essential';
}

export interface ReportSectionSelection {
  userDetail: boolean;
  destiny: boolean;
  combination: boolean;
  missing: boolean;
  repeating: boolean;
  yogas: boolean;
  nameNumerology: boolean;
  matchMaking: boolean;
  mobile: boolean;
  profession: boolean;
  pinPassword: boolean;
  yearly: boolean;
  vastu: boolean;
  time: boolean;
  numberMeanings: boolean;
  events: boolean;
  help: boolean;
  remedies: boolean;
}
