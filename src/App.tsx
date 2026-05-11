import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Coffee, Moon, Soup, Utensils } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type MacroSet = {
  protein: number;
  carbs: number;
  fat: number;
  kcal: number;
};

type Food = MacroSet & {
  name: string;
  amount: string;
};

type Meal = MacroSet & {
  title: string;
  note: string;
  accent: string;
  items: Food[];
};

type DayPlan = {
  day: string;
  meals: Meal[];
};

const weekPlan: DayPlan[] = [
  {
    day: 'Lunes',
    meals: [
      {
        title: 'Desayuno',
        note: 'Base alta en proteína',
        accent: 'from-sky-500 to-cyan-400',
        protein: 9.92,
        carbs: 26.38,
        fat: 27.06,
        kcal: 300,
        items: [
          { name: 'Queso Cottage', amount: '100 g', protein: 4.51, carbs: 2.68, fat: 12.49, kcal: 103 },
          { name: 'Clara de Huevo', amount: '2 grandes', protein: 0.11, carbs: 0.48, fat: 7.19, kcal: 34 },
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
          { name: 'Huevo', amount: '1 grande', protein: 4.97, carbs: 0.38, fat: 6.29, kcal: 74 },
        ],
      },
      {
        title: 'Almuerzo',
        note: 'Pasta con tomate',
        accent: 'from-emerald-500 to-lime-400',
        protein: 2.03,
        carbs: 102.56,
        fat: 16.07,
        kcal: 491,
        items: [
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
          { name: 'Hacendado Tomate Triturado', amount: '100 g', protein: 0, carbs: 3.8, fat: 1.1, kcal: 23 },
          { name: 'Tomates Cherry', amount: '100 g', protein: 0.2, carbs: 3.92, fat: 0.88, kcal: 18 },
          { name: 'Hacendado Macarrones', amount: '100 g', protein: 1.5, carbs: 72, fat: 13, kcal: 361 },
        ],
      },
      {
        title: 'Cena',
        note: 'Tostada dulce y café',
        accent: 'from-amber-500 to-orange-400',
        protein: 7.78,
        carbs: 28.84,
        fat: 13.45,
        kcal: 247,
        items: [
          { name: 'Café', amount: '1 taza (240 ml)', protein: 0.05, carbs: 0.09, fat: 0.28, kcal: 2 },
          { name: 'Hacendado Leche Desnatada sin Lactosa', amount: '150 ml', protein: 0.45, carbs: 7.05, fat: 4.65, kcal: 51 },
          { name: 'Hacendado Panecillo 100% Integral', amount: '47 g', protein: 0.7, carbs: 20.02, fat: 4.32, kcal: 110 },
          { name: 'Hacendado Mantequilla de Cacahuete 100%', amount: '14 g', protein: 6.58, carbs: 1.68, fat: 4.2, kcal: 84 },
        ],
      },
      {
        title: 'Pasa Bocas / Otros',
        note: 'Sin extra',
        accent: 'from-slate-500 to-slate-400',
        protein: 0,
        carbs: 0,
        fat: 0,
        kcal: 0,
        items: [],
      },
    ],
  },
  {
    day: 'Martes',
    meals: [
      {
        title: 'Desayuno',
        note: 'Base alta en proteína',
        accent: 'from-sky-500 to-cyan-400',
        protein: 9.92,
        carbs: 26.38,
        fat: 27.06,
        kcal: 300,
        items: [
          { name: 'Queso Cottage', amount: '100 g', protein: 4.51, carbs: 2.68, fat: 12.49, kcal: 103 },
          { name: 'Clara de Huevo', amount: '2 grandes', protein: 0.11, carbs: 0.48, fat: 7.19, kcal: 34 },
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
          { name: 'Huevo', amount: '1 grande', protein: 4.97, carbs: 0.38, fat: 6.29, kcal: 74 },
        ],
      },
      {
        title: 'Almuerzo',
        note: 'Arroz con pollo',
        accent: 'from-emerald-500 to-lime-400',
        protein: 21.32,
        carbs: 57.74,
        fat: 71.5,
        kcal: 731,
        items: [
          { name: 'Huevo', amount: '1 grande', protein: 4.97, carbs: 0.38, fat: 6.29, kcal: 74 },
          { name: 'La Fallera Arroz Redondo', amount: '70 g', protein: 0.91, carbs: 53.9, fat: 5.11, kcal: 246 },
          { name: 'Hacendado Tomate Triturado', amount: '91 g', protein: 3.46, carbs: 1, fat: 21, kcal: 21 },
          { name: 'Pechuga de Pollo', amount: '200 g', protein: 15.44, carbs: 59.1, fat: 0, kcal: 390 },
        ],
      },
      {
        title: 'Cena',
        note: 'Tostada dulce y café',
        accent: 'from-amber-500 to-orange-400',
        protein: 7.78,
        carbs: 28.84,
        fat: 13.45,
        kcal: 247,
        items: [
          { name: 'Hacendado Mantequilla de Cacahuete 100%', amount: '14 g', protein: 6.58, carbs: 1.68, fat: 4.2, kcal: 84 },
          { name: 'Hacendado Panecillo 100% Integral', amount: '47 g', protein: 0.7, carbs: 20.02, fat: 4.32, kcal: 110 },
          { name: 'Hacendado Leche Desnatada sin Lactosa', amount: '150 ml', protein: 0.45, carbs: 7.05, fat: 4.65, kcal: 51 },
          { name: 'Café', amount: '1 taza (240 ml)', protein: 0.05, carbs: 0.09, fat: 0.28, kcal: 2 },
        ],
      },
      {
        title: 'Pasa Bocas / Otros',
        note: 'Pizza rápida',
        accent: 'from-violet-500 to-fuchsia-400',
        protein: 11.69,
        carbs: 80.1,
        fat: 24.65,
        kcal: 525,
        items: [
          { name: 'Tomates Cherry', amount: '100 g', protein: 0.2, carbs: 3.92, fat: 0.88, kcal: 18 },
          { name: 'Hacendado Tomate Triturado', amount: '100 g', protein: 0, carbs: 3.8, fat: 1.1, kcal: 23 },
          { name: 'Mercadona Mozzarella Light', amount: '60 g', protein: 5.4, carbs: 0.6, fat: 10.2, kcal: 92 },
          { name: 'Hacendado Masa Fresca Pizza', amount: '145 g', protein: 6.09, carbs: 71.78, fat: 12.47, kcal: 392 },
        ],
      },
    ],
  },
  {
    day: 'Miércoles',
    meals: [
      {
        title: 'Desayuno',
        note: 'Base alta en proteína',
        accent: 'from-sky-500 to-cyan-400',
        protein: 9.92,
        carbs: 26.38,
        fat: 27.06,
        kcal: 300,
        items: [
          { name: 'Queso Cottage', amount: '100 g', protein: 4.51, carbs: 2.68, fat: 12.49, kcal: 103 },
          { name: 'Clara de Huevo', amount: '2 grandes', protein: 0.11, carbs: 0.48, fat: 7.19, kcal: 34 },
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
          { name: 'Huevo', amount: '1 grande', protein: 4.97, carbs: 0.38, fat: 6.29, kcal: 74 },
        ],
      },
      {
        title: 'Almuerzo',
        note: 'Ensalada de alubias y atún',
        accent: 'from-emerald-500 to-lime-400',
        protein: 7.77,
        carbs: 67.14,
        fat: 45.77,
        kcal: 545,
        items: [
          { name: 'Hacendado Alubia Pinta Cocida', amount: '300 g', protein: 1.2, carbs: 39.3, fat: 18.6, kcal: 279 },
          { name: 'Tomates', amount: '100 g', protein: 0.2, carbs: 3.92, fat: 0.88, kcal: 18 },
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
          { name: 'Hacendado Atún Claro al Natural', amount: '120 g', protein: 1.44, carbs: 1.08, fat: 25.2, kcal: 118 },
          { name: 'Aceite de Oliva', amount: '5 ml', protein: 4.6, carbs: 0, fat: 0, kcal: 41 },
        ],
      },
      {
        title: 'Cena',
        note: 'Tostada dulce y café',
        accent: 'from-amber-500 to-orange-400',
        protein: 7.78,
        carbs: 28.84,
        fat: 13.45,
        kcal: 247,
        items: [
          { name: 'Café', amount: '1 taza (240 ml)', protein: 0.05, carbs: 0.09, fat: 0.28, kcal: 2 },
          { name: 'Hacendado Leche Desnatada sin Lactosa', amount: '150 ml', protein: 0.45, carbs: 7.05, fat: 4.65, kcal: 51 },
          { name: 'Hacendado Panecillo 100% Integral', amount: '47 g', protein: 0.7, carbs: 20.02, fat: 4.32, kcal: 110 },
          { name: 'Hacendado Mantequilla de Cacahuete 100%', amount: '14 g', protein: 6.58, carbs: 1.68, fat: 4.2, kcal: 84 },
        ],
      },
      {
        title: 'Pasa Bocas / Otros',
        note: 'Wrap de pollo',
        accent: 'from-violet-500 to-fuchsia-400',
        protein: 32.58,
        carbs: 32.5,
        fat: 70.57,
        kcal: 721,
        items: [
          { name: 'Hacendado Mozzarella Fresca', amount: '125 g', protein: 17.5, carbs: 2.5, fat: 21.25, kcal: 252 },
          { name: 'Hacendado Maxi Tortillas de Trigo', amount: '1 tortilla, 62 g', protein: 3.5, carbs: 30, fat: 5, kcal: 176 },
          { name: 'Pechuga de Pollo', amount: '150 g', protein: 11.58, carbs: 0, fat: 44.32, kcal: 293 },
        ],
      },
    ],
  },
  {
    day: 'Jueves',
    meals: [
      {
        title: 'Desayuno',
        note: 'Base alta en proteína',
        accent: 'from-sky-500 to-cyan-400',
        protein: 9.92,
        carbs: 26.38,
        fat: 27.06,
        kcal: 300,
        items: [
          { name: 'Queso Cottage', amount: '100 g', protein: 4.51, carbs: 2.68, fat: 12.49, kcal: 103 },
          { name: 'Clara de Huevo', amount: '2 grandes', protein: 0.11, carbs: 0.48, fat: 7.19, kcal: 34 },
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
          { name: 'Huevo', amount: '1 grande', protein: 4.97, carbs: 0.38, fat: 6.29, kcal: 74 },
        ],
      },
      {
        title: 'Almuerzo',
        note: 'Bowl de quinoa y pollo',
        accent: 'from-emerald-500 to-lime-400',
        protein: 26.05,
        carbs: 106.75,
        fat: 73.53,
        kcal: 959,
        items: [
          { name: 'Quinoa', amount: '80 g', protein: 4.64, carbs: 55.12, fat: 10.48, kcal: 299 },
          { name: 'Boniato', amount: '200 g', protein: 1.2, carbs: 48.38, fat: 3.22, kcal: 214 },
          { name: 'Tomates Cherry', amount: '83 g', protein: 0.17, carbs: 3.25, fat: 0.73, kcal: 15 },
          { name: 'Pechuga de Pollo', amount: '200 g', protein: 15.44, carbs: 0, fat: 59.1, kcal: 390 },
          { name: 'Aceite de Oliva', amount: '5 ml', protein: 4.6, carbs: 0, fat: 0, kcal: 41 },
        ],
      },
      {
        title: 'Cena',
        note: 'Tostada dulce y café',
        accent: 'from-amber-500 to-orange-400',
        protein: 7.78,
        carbs: 28.84,
        fat: 13.45,
        kcal: 247,
        items: [
          { name: 'Hacendado Mantequilla de Cacahuete 100%', amount: '14 g', protein: 6.58, carbs: 1.68, fat: 4.2, kcal: 84 },
          { name: 'Hacendado Panecillo 100% Integral', amount: '47 g', protein: 0.7, carbs: 20.02, fat: 4.32, kcal: 110 },
          { name: 'Hacendado Leche Desnatada sin Lactosa', amount: '150 ml', protein: 0.45, carbs: 7.05, fat: 4.65, kcal: 51 },
          { name: 'Café', amount: '1 taza (240 ml)', protein: 0.05, carbs: 0.09, fat: 0.28, kcal: 2 },
        ],
      },
      {
        title: 'Pasa Bocas / Otros',
        note: 'Tosta ligera',
        accent: 'from-violet-500 to-fuchsia-400',
        protein: 8.97,
        carbs: 40.91,
        fat: 14.16,
        kcal: 299,
        items: [
          { name: 'Hacendado Queso de Untar Light', amount: '25 g', protein: 2.08, carbs: 1.2, fat: 2.25, kcal: 32 },
          { name: 'Cebollas', amount: '100 g', protein: 0.08, carbs: 10.11, fat: 0.92, kcal: 42 },
          { name: 'Pan Blanco', amount: '50 g', protein: 1.64, carbs: 25.3, fat: 3.82, kcal: 133 },
          { name: 'Tomates', amount: '100 g', protein: 0.2, carbs: 3.92, fat: 0.88, kcal: 18 },
          { name: 'Huevo', amount: '1 grande', protein: 4.97, carbs: 0.38, fat: 6.29, kcal: 74 },
        ],
      },
    ],
  },
  {
    day: 'Viernes',
    meals: [
      {
        title: 'Desayuno',
        note: 'Base alta en proteína',
        accent: 'from-sky-500 to-cyan-400',
        protein: 9.92,
        carbs: 26.38,
        fat: 27.06,
        kcal: 300,
        items: [
          { name: 'Queso Cottage', amount: '100 g', protein: 4.51, carbs: 2.68, fat: 12.49, kcal: 103 },
          { name: 'Clara de Huevo', amount: '2 grandes', protein: 0.11, carbs: 0.48, fat: 7.19, kcal: 34 },
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
          { name: 'Huevo', amount: '1 grande', protein: 4.97, carbs: 0.38, fat: 6.29, kcal: 74 },
        ],
      },
      {
        title: 'Almuerzo',
        note: 'Macarrones con atún',
        accent: 'from-emerald-500 to-lime-400',
        protein: 7.54,
        carbs: 76.54,
        fat: 39.2,
        kcal: 541,
        items: [
          { name: 'Aceite de Oliva', amount: '5 ml', protein: 4.6, carbs: 0, fat: 0, kcal: 41 },
          { name: 'Hacendado Tomate Triturado', amount: '91 g', protein: 0, carbs: 3.46, fat: 1, kcal: 21 },
          { name: 'Hacendado Atún Claro al Natural', amount: '120 g', protein: 1.44, carbs: 1.08, fat: 25.2, kcal: 118 },
          { name: 'Hacendado Macarrones', amount: '100 g', protein: 1.5, carbs: 72, fat: 13, kcal: 361 },
        ],
      },
      {
        title: 'Cena',
        note: 'Tostada dulce y café',
        accent: 'from-amber-500 to-orange-400',
        protein: 7.78,
        carbs: 28.84,
        fat: 13.45,
        kcal: 247,
        items: [
          { name: 'Hacendado Leche Desnatada sin Lactosa', amount: '150 ml', protein: 0.45, carbs: 7.05, fat: 4.65, kcal: 51 },
          { name: 'Café', amount: '1 taza (240 ml)', protein: 0.05, carbs: 0.09, fat: 0.28, kcal: 2 },
          { name: 'Hacendado Panecillo 100% Integral', amount: '47 g', protein: 0.7, carbs: 20.02, fat: 4.32, kcal: 110 },
          { name: 'Hacendado Mantequilla de Cacahuete 100%', amount: '14 g', protein: 6.58, carbs: 1.68, fat: 4.2, kcal: 84 },
        ],
      },
      {
        title: 'Pasa Bocas / Otros',
        note: 'Pollo con mozzarella',
        accent: 'from-violet-500 to-fuchsia-400',
        protein: 37.37,
        carbs: 7.12,
        fat: 80.07,
        kcal: 696,
        items: [
          { name: 'Pechuga de Pollo', amount: '190 g', protein: 14.67, carbs: 0, fat: 56.14, kcal: 371 },
          { name: 'Aceite de Oliva', amount: '5 ml', protein: 4.6, carbs: 0, fat: 0, kcal: 41 },
          { name: 'Hacendado Mozzarella Fresca', amount: '125 g', protein: 17.5, carbs: 2.5, fat: 21.25, kcal: 252 },
          { name: 'Tomates', amount: '100 g', protein: 0.2, carbs: 3.92, fat: 0.88, kcal: 18 },
          { name: 'Hacendado Canónigos Lavados', amount: '100 g', protein: 0.4, carbs: 0.7, fat: 1.8, kcal: 14 },
        ],
      },
    ],
  },
  {
    day: 'Sábado',
    meals: [
      {
        title: 'Desayuno',
        note: 'Base alta en proteína',
        accent: 'from-sky-500 to-cyan-400',
        protein: 9.92,
        carbs: 26.38,
        fat: 27.06,
        kcal: 300,
        items: [
          { name: 'Queso Cottage', amount: '100 g', protein: 4.51, carbs: 2.68, fat: 12.49, kcal: 103 },
          { name: 'Clara de Huevo', amount: '2 grandes', protein: 0.11, carbs: 0.48, fat: 7.19, kcal: 34 },
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
          { name: 'Huevo', amount: '1 grande', protein: 4.97, carbs: 0.38, fat: 6.29, kcal: 74 },
        ],
      },
      {
        title: 'Almuerzo',
        note: 'Arroz con pollo y verdura',
        accent: 'from-emerald-500 to-lime-400',
        protein: 21.21,
        carbs: 67.36,
        fat: 66.34,
        kcal: 735,
        items: [
          { name: 'Aceite de Oliva', amount: '5 ml', protein: 4.6, carbs: 0, fat: 0, kcal: 41 },
          { name: 'Cebollas', amount: '100 g', protein: 0.08, carbs: 10.11, fat: 0.92, kcal: 42 },
          { name: 'Calabacín', amount: '100 g', protein: 0.18, carbs: 3.35, fat: 1.21, kcal: 16 },
          { name: 'Pechuga de Pollo', amount: '200 g', protein: 15.44, carbs: 0, fat: 59.1, kcal: 390 },
          { name: 'La Fallera Arroz Redondo', amount: '70 g', protein: 0.91, carbs: 53.9, fat: 5.11, kcal: 246 },
        ],
      },
      {
        title: 'Cena',
        note: 'Atún con tostada',
        accent: 'from-amber-500 to-orange-400',
        protein: 1.56,
        carbs: 27.58,
        fat: 23.05,
        kcal: 223,
        items: [
          { name: 'Mercadona Atún Natural', amount: '60 g', protein: 0.36, carbs: 0.42, fat: 13.8, kcal: 60 },
          { name: 'Café', amount: '1 taza (240 ml)', protein: 0.05, carbs: 0.09, fat: 0.28, kcal: 2 },
          { name: 'Hacendado Leche Desnatada sin Lactosa', amount: '150 ml', protein: 0.45, carbs: 7.05, fat: 4.65, kcal: 51 },
          { name: 'Hacendado Panecillo 100% Integral', amount: '47 g', protein: 0.7, carbs: 20.02, fat: 4.32, kcal: 110 },
        ],
      },
      {
        title: 'Pasa Bocas / Otros',
        note: 'Bocadillo con huevo',
        accent: 'from-violet-500 to-fuchsia-400',
        protein: 17.41,
        carbs: 82.55,
        fat: 21.6,
        kcal: 569,
        items: [
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
          { name: 'Aceite de Oliva', amount: '5 ml', protein: 4.6, carbs: 0, fat: 0, kcal: 41 },
          { name: 'Pan Blanco', amount: '73 g', protein: 2.4, carbs: 36.95, fat: 5.58, kcal: 194 },
          { name: 'Huevo', amount: '2 grandes', protein: 9.94, carbs: 0.77, fat: 12.58, kcal: 147 },
          { name: 'Patata Cruda', amount: '140 g', protein: 0.14, carbs: 21.99, fat: 2.35, kcal: 98 },
        ],
      },
    ],
  },
  {
    day: 'Domingo',
    meals: [
      {
        title: 'Desayuno',
        note: 'Base alta en proteína',
        accent: 'from-sky-500 to-cyan-400',
        protein: 9.92,
        carbs: 26.38,
        fat: 27.06,
        kcal: 300,
        items: [
          { name: 'Huevo', amount: '1 grande', protein: 4.97, carbs: 0.38, fat: 6.29, kcal: 74 },
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
          { name: 'Clara de Huevo', amount: '2 grandes', protein: 0.11, carbs: 0.48, fat: 7.19, kcal: 34 },
          { name: 'Queso Cottage', amount: '100 g', protein: 4.51, carbs: 2.68, fat: 12.49, kcal: 103 },
        ],
      },
      {
        title: 'Almuerzo',
        note: 'Macarrones con mozzarella',
        accent: 'from-emerald-500 to-lime-400',
        protein: 18.72,
        carbs: 101.13,
        fat: 29.79,
        kcal: 681,
        items: [
          { name: 'Calabaza', amount: '130 g', protein: 0.13, carbs: 8.45, fat: 1.3, kcal: 34 },
          { name: 'Hacendado Mozzarella Fresca', amount: '87 g', protein: 12.18, carbs: 1.74, fat: 14.79, kcal: 176 },
          { name: 'Lechuga', amount: '87 g', protein: 0.12, carbs: 2.58, fat: 0.78, kcal: 12 },
          { name: 'Hacendado Macarrones', amount: '91 g', protein: 1.36, carbs: 65.52, fat: 11.83, kcal: 329 },
          { name: 'Aceite de Oliva', amount: '5 ml', protein: 4.6, carbs: 0, fat: 0, kcal: 41 },
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
        ],
      },
      {
        title: 'Cena',
        note: 'Tostada dulce y café',
        accent: 'from-amber-500 to-orange-400',
        protein: 7.78,
        carbs: 28.84,
        fat: 13.45,
        kcal: 247,
        items: [
          { name: 'Hacendado Panecillo 100% Integral', amount: '47 g', protein: 0.7, carbs: 20.02, fat: 4.32, kcal: 110 },
          { name: 'Hacendado Mantequilla de Cacahuete 100%', amount: '14 g', protein: 6.58, carbs: 1.68, fat: 4.2, kcal: 84 },
          { name: 'Café', amount: '1 taza (240 ml)', protein: 0.05, carbs: 0.09, fat: 0.28, kcal: 2 },
          { name: 'Hacendado Leche Desnatada sin Lactosa', amount: '150 ml', protein: 0.45, carbs: 7.05, fat: 4.65, kcal: 51 },
        ],
      },
      {
        title: 'Pasa Bocas / Otros',
        note: 'Pollo con patata',
        accent: 'from-violet-500 to-fuchsia-400',
        protein: 19.71,
        carbs: 38.9,
        fat: 58.87,
        kcal: 571,
        items: [
          { name: 'Aceite de Oliva', amount: '5 ml', protein: 4.6, carbs: 0, fat: 0, kcal: 41 },
          { name: 'Cebollas', amount: '50 g', protein: 0.04, carbs: 5.06, fat: 0.46, kcal: 21 },
          { name: 'Patata Cruda', amount: '70 g', protein: 0.07, carbs: 11, fat: 1.18, kcal: 49 },
          { name: 'Pechuga de Pollo', amount: '190 g', protein: 14.67, carbs: 0, fat: 56.14, kcal: 371 },
          { name: 'Plátano', amount: '100 g', protein: 0.33, carbs: 22.84, fat: 1.09, kcal: 89 },
        ],
      },
    ],
  },
];

const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const recipesByDay = [...weekPlan].reverse().map((plan, index) => ({
  ...plan,
  day: dayNames[index],
}));

const formatNumber = (value: number) =>
  new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(value);

const getMealIcon = (title: string) => {
  if (title === 'Desayuno') return Coffee;
  if (title === 'Cena') return Moon;
  if (title === 'Almuerzo') return Soup;
  return Utensils;
};

export default function App() {
  const [selectedDay, setSelectedDay] = useState(() => {
    const savedDay = localStorage.getItem('recipes_selectedDay');
    return savedDay ? Number(savedDay) : 0;
  });

  useEffect(() => {
    localStorage.setItem('recipes_selectedDay', String(selectedDay));
  }, [selectedDay]);

  const currentDay = recipesByDay[selectedDay];
  const totals = useMemo(
    () =>
      currentDay.meals.reduce(
        (acc, meal) => ({
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fat: acc.fat + meal.fat,
          kcal: acc.kcal + meal.kcal,
        }),
        { protein: 0, carbs: 0, fat: 0, kcal: 0 },
      ),
    [currentDay],
  );

  const goToPreviousDay = () => setSelectedDay((day) => (day === 0 ? recipesByDay.length - 1 : day - 1));
  const goToNextDay = () => setSelectedDay((day) => (day === recipesByDay.length - 1 ? 0 : day + 1));

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f2ea] text-slate-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.18),_transparent_30%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/70 backdrop-blur md:mb-8 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg shadow-slate-300">
                <Utensils size={28} />
              </div>
              <div>
                <p className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-emerald-700">
                  <CalendarDays size={15} /> Recetario semanal
                </p>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Recetas Nutrifit</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Menú visual de lunes a domingo con las comidas y cantidades de tus capturas. Sin ajustes de peso, altura ni entrenamientos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 rounded-3xl bg-slate-950 p-3 text-white sm:min-w-80">
              <MacroTile label="Kcal" value={Math.round(totals.kcal).toString()} />
              <MacroTile label="Prot" value={`${formatNumber(totals.protein)}g`} />
              <MacroTile label="Carb" value={`${formatNumber(totals.carbs)}g`} />
              <MacroTile label="Grasa" value={`${formatNumber(totals.fat)}g`} />
            </div>
          </div>
        </header>

        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {recipesByDay.map((plan, index) => (
              <button
                key={plan.day}
                onClick={() => setSelectedDay(index)}
                className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-black transition-all ${
                  selectedDay === index
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-300'
                    : 'bg-white/80 text-slate-500 shadow-sm hover:bg-white hover:text-slate-950'
                }`}
              >
                {plan.day}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 md:justify-end">
            <button
              onClick={goToPreviousDay}
              className="rounded-2xl bg-white/85 p-3 text-slate-800 shadow-sm transition hover:bg-white"
              aria-label="Día anterior"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="min-w-36 rounded-2xl bg-white/85 px-5 py-3 text-center shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Día</p>
              <p className="text-xl font-black text-slate-950">{currentDay.day}</p>
            </div>
            <button
              onClick={goToNextDay}
              className="rounded-2xl bg-white/85 p-3 text-slate-800 shadow-sm transition hover:bg-white"
              aria-label="Día siguiente"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </section>

        <main className="pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDay.day}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 gap-5 lg:grid-cols-2"
            >
              {currentDay.meals.map((meal) => (
                <div key={meal.title}>
                  <MealCard meal={meal} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function MacroTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-3 text-center">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/45">{label}</p>
      <p className="mt-1 text-sm font-black text-white sm:text-base">{value}</p>
    </div>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  const Icon = getMealIcon(meal.title);

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-xl shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/70">
      <div className={`relative min-h-40 bg-gradient-to-br ${meal.accent} p-6 text-white`}>
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_24%),radial-gradient(circle_at_80%_0%,white_0,transparent_18%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
              <Icon size={28} />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-white/70">{meal.note}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight">{meal.title}</h2>
          </div>
          <div className="rounded-3xl bg-white/95 px-4 py-3 text-right text-slate-950 shadow-lg">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</p>
            <p className="text-2xl font-black">{meal.kcal}</p>
            <p className="-mt-1 text-xs font-bold text-slate-500">kcal</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-5 grid grid-cols-3 gap-2">
          <SmallMacro label="Proteína" value={`${formatNumber(meal.protein)}g`} className="bg-emerald-50 text-emerald-700" />
          <SmallMacro label="Carbos" value={`${formatNumber(meal.carbs)}g`} className="bg-sky-50 text-sky-700" />
          <SmallMacro label="Grasas" value={`${formatNumber(meal.fat)}g`} className="bg-orange-50 text-orange-700" />
        </div>

        {meal.items.length > 0 ? (
          <div className="space-y-3">
            {meal.items.map((item) => (
              <div key={`${item.name}-${item.amount}`} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-black leading-tight text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{item.amount}</p>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2 text-right shadow-sm">
                    <p className="text-sm font-black text-slate-950">{item.kcal}</p>
                    <p className="text-[10px] font-black uppercase text-slate-400">kcal</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">P {formatNumber(item.protein)}g</span>
                  <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-700">C {formatNumber(item.carbs)}g</span>
                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-orange-700">G {formatNumber(item.fat)}g</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-black text-slate-700">Sin alimentos añadidos</p>
            <p className="mt-1 text-sm text-slate-500">Este bloque queda vacío según la captura.</p>
          </div>
        )}
      </div>
    </article>
  );
}

function SmallMacro({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div className={`rounded-2xl px-3 py-3 text-center ${className}`}>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
      <p className="mt-1 text-sm font-black sm:text-base">{value}</p>
    </div>
  );
}
