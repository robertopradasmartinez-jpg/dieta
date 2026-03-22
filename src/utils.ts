import { Ingredient, DayType, DayMacros, Meal, DailyPlan, UserProfile } from './types';
import { REFERENCE_WEIGHT, NUTRITION, IMAGES, MACRO_TARGETS } from './constants';

export const calculateAdjustmentFactor = (currentWeight: number): number => {
  return currentWeight / REFERENCE_WEIGHT;
};

export const getIngredientMacros = (ingredient: Ingredient, amount: number) => {
  const factor = amount / 100;
  return {
    kcal: ingredient.kcalPer100 * factor,
    protein: ingredient.proteinPer100 * factor,
    carbs: ingredient.carbsPer100 * factor,
    fat: ingredient.fatPer100 * factor,
  };
};

export const getMealMacros = (ingredients: { ingredient: Ingredient; amount: number }[]) => {
  return ingredients.reduce(
    (acc, item) => {
      const macros = getIngredientMacros(item.ingredient, item.amount);
      return {
        kcal: acc.kcal + macros.kcal,
        protein: acc.protein + macros.protein,
        carbs: acc.carbs + macros.carbs,
        fat: acc.fat + macros.fat,
      };
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

// Helper to create ingredient object from NUTRITION constant
export const createIng = (key: keyof typeof NUTRITION, name: string, baseAmount: number, unit: string = 'g'): Ingredient => {
  const nut = NUTRITION[key];
  return {
    name,
    baseAmount,
    unit,
    kcalPer100: nut.kcal,
    proteinPer100: nut.p,
    carbsPer100: nut.c,
    fatPer100: nut.f,
  };
};

export const getAdjustedAmount = (baseAmount: number, weight: number, isFixed: boolean = false) => {
  if (isFixed) return baseAmount;
  return Math.round(baseAmount * (weight / REFERENCE_WEIGHT));
};

export const formatNumber = (num: number) => Math.round(num * 10) / 10;

export const calculateBMR = (weight: number, height: number, age: number, gender: 'M' | 'F' = 'M') => {
  // Ecuación de Mifflin-St Jeor
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === 'M' ? bmr + 5 : bmr - 161;
};

export const calculateTargetMacros = (user: UserProfile, trainingType: DayType): DayMacros => {
  const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
  
  // Factor de actividad base (5-10k pasos diarios) -> ~1.3
  const baseTDEE = bmr * 1.3;

  // Gasto calórico extra por entrenamiento
  let trainingKcal = 0;
  switch (trainingType) {
    case 'Descanso': trainingKcal = 0; break;
    case 'Gym': trainingKcal = 300; break;
    case 'Boxeo': trainingKcal = 400; break;
    case 'Gym + Boxeo': trainingKcal = 700; break;
  }

  const tdee = baseTDEE + trainingKcal;
  const targetKcal = tdee - 300; // Déficit de 300 kcal para definición

  // Macros objetivo (para mantener músculo)
  const protein = user.weight * 2.2; // 2.2g por kg de peso
  const fat = user.weight * 0.9; // 0.9g por kg de peso
  
  // El resto de calorías van a carbohidratos
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;
  const carbsKcal = targetKcal - proteinKcal - fatKcal;
  const carbs = Math.max(0, carbsKcal / 4);

  return {
    kcal: targetKcal,
    protein,
    carbs,
    fat
  };
};

export const getAdjustedDayData = (plan: DailyPlan, user: UserProfile) => {
  const targetMacros = calculateTargetMacros(user, plan.trainingType);
  const targetKcal = targetMacros.kcal;
  // Si la cena es Libre, asumimos que representa unas 700 kcal del objetivo diario
  const effectiveTarget = plan.meals.dinner === 'Libre' ? targetKcal - 700 : targetKcal;

  let initialKcal = 0;
  const processMeal = (meal: any) => {
    if (meal === 'Libre') return meal;
    return {
      ...meal,
      ingredients: meal.ingredients.map((ing: any) => {
        // Usamos la cantidad base para calcular las calorías iniciales de la receta
        initialKcal += getIngredientMacros(ing, ing.baseAmount).kcal;
        return { ingredient: ing, amount: ing.baseAmount };
      })
    };
  };

  let breakfast = processMeal(plan.meals.breakfast);
  let lunch = processMeal(plan.meals.lunch);
  let snack = processMeal(plan.meals.snack);
  let dinner = processMeal(plan.meals.dinner);

  // Factor de corrección para clavar las calorías
  let correction = effectiveTarget / initialKcal;

  let finalKcal = 0;
  let finalProtein = 0;
  let finalCarbs = 0;
  let finalFat = 0;

  const applyCorrection = (meal: any) => {
    if (meal === 'Libre') return meal;
    const newIngredients = meal.ingredients.map((item: any) => {
      let finalAmount = item.amount;
      if (item.ingredient.name !== 'Masa de pizza') {
        finalAmount = Math.round(item.amount * correction);
      }
      const macros = getIngredientMacros(item.ingredient, finalAmount);
      finalKcal += macros.kcal;
      finalProtein += macros.protein;
      finalCarbs += macros.carbs;
      finalFat += macros.fat;
      return { ...item, amount: finalAmount };
    });
    return { ...meal, ingredients: newIngredients };
  };

  return {
    meals: {
      breakfast: applyCorrection(breakfast),
      lunch: applyCorrection(lunch),
      snack: applyCorrection(snack),
      dinner: applyCorrection(dinner)
    },
    totals: { kcal: finalKcal, protein: finalProtein, carbs: finalCarbs, fat: finalFat },
    targetKcal,
    targetMacros,
    effectiveTarget
  };
};
