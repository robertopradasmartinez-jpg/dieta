export type DayType = 'Descanso' | 'Gym' | 'Boxeo' | 'Gym + Boxeo';

export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'M' | 'F';
  goal: string;
  weightHistory: { date: string; weight: number }[];
}

export interface Ingredient {
  name: string;
  baseAmount: number; // For 75.2kg
  unit: string;
  kcalPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
}

export interface Meal {
  name: string;
  image: string;
  ingredients: Ingredient[];
}

export interface DailyPlan {
  dayName: string;
  trainingType: DayType;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    snack: Meal;
    dinner: Meal | 'Libre';
  };
}

export interface WeeklyPlan {
  [key: string]: DayType;
}

export interface DayMacros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}
