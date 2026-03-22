import { DailyPlan, DayType } from './types';
import { IMAGES } from './constants';
import { createIng } from './utils';

export const getBaseDailyPlan = (dayName: string, trainingType: DayType): DailyPlan => {
  // Breakfast logic
  const breakfastCerealAmount = {
    'Descanso': 40,
    'Gym': 60,
    'Boxeo': 70,
    'Gym + Boxeo': 90
  }[trainingType];

  const breakfastNutsAmount = trainingType === 'Gym + Boxeo' ? 25 : 20;

  const breakfast: any = {
    name: "Leche con cereales, plátano y nueces",
    image: IMAGES.breakfast,
    ingredients: [
      createIng('leche_desnatada', 'Leche desnatada', 250, 'ml'),
      createIng('copos_maiz', 'Copos de maíz', breakfastCerealAmount, 'g'),
      createIng('platano', 'Plátano', 120, 'g'),
      createIng('nueces', 'Nueces', breakfastNutsAmount, 'g'),
    ]
  };

  // Snack logic
  const snackAnacardos = {
    'Descanso': 20,
    'Gym': 25,
    'Boxeo': 25,
    'Gym + Boxeo': 30
  }[trainingType];

  const snack: any = {
    name: "Smoothie proteico",
    image: IMAGES.smoothie,
    ingredients: [
      createIng('leche_desnatada', 'Leche desnatada', 200, 'ml'),
      createIng('queso_batido', 'Queso batido 0%', 125, 'g'),
      createIng('platano', 'Plátano', 120, 'g'),
      createIng('anacardos', 'Anacardos', snackAnacardos, 'g'),
      createIng('proteina_polvo', 'Proteína en polvo', 30, 'g'),
    ]
  };

  // Lunch & Dinner depend on the day of the week
  let lunch: any;
  let dinner: any;

  const carbFactor = {
    'Descanso': 0.7,
    'Gym': 1.0,
    'Boxeo': 1.1,
    'Gym + Boxeo': 1.3
  }[trainingType];

  switch (dayName) {
    case 'Lunes':
      lunch = {
        name: "Farfalle con calabaza y mozzarella",
        image: IMAGES.pasta_calabaza,
        ingredients: [
          createIng('farfalle', 'Farfalle', 100 * carbFactor),
          createIng('calabaza', 'Calabaza', 150),
          createIng('mozzarella_fresca', 'Mozzarella fresca', 100),
          createIng('lechuga', 'Lechuga', 100),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      dinner = {
        name: "Pollo con patata y cebolla",
        image: IMAGES.pollo_patata,
        ingredients: [
          createIng('pechuga_pollo', 'Pechuga de pollo', 150),
          createIng('cebolla', 'Cebolla', 100),
          createIng('patata', 'Patata', 200 * carbFactor),
          createIng('pimenton', 'Pimentón', 5),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      break;
    case 'Martes':
      lunch = {
        name: "Arroz con pollo y anacardos",
        image: IMAGES.arroz_pollo,
        ingredients: [
          createIng('arroz_blanco', 'Arroz blanco', 90 * carbFactor),
          createIng('pechuga_pollo', 'Pechuga de pollo', 150),
          createIng('calabacin', 'Calabacín', 100),
          createIng('cebolla', 'Cebolla', 50),
          createIng('anacardos', 'Anacardos', 20),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      dinner = {
        name: "Bocadillo de tortilla de patata",
        image: IMAGES.bocadillo_tortilla,
        ingredients: [
          createIng('pan', 'Pan', 80 * carbFactor),
          createIng('huevo', 'Huevo', 100),
          createIng('patata', 'Patata', 150 * carbFactor),
          createIng('tomate_rallado', 'Tomate rallado', 50),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      break;
    case 'Miércoles':
      lunch = {
        name: "Macarrones con atún y tomate",
        image: IMAGES.macarrones_atun,
        ingredients: [
          createIng('macarrones', 'Macarrones', 100 * carbFactor),
          createIng('atun_natural', 'Atún al natural', 120),
          createIng('salsa_tomate', 'Salsa de tomate', 100),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      dinner = {
        name: "Sopa de fideos y pollo",
        image: IMAGES.sopa_fideos,
        ingredients: [
          createIng('fideos', 'Fideos', 60 * carbFactor),
          createIng('pechuga_pollo', 'Pechuga de pollo', 100),
          createIng('caldo', 'Caldo', 300, 'ml'),
          createIng('pan', 'Pan', 40 * carbFactor),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      break;
    case 'Jueves':
      lunch = {
        name: "Quinoa con pollo y boniato",
        image: IMAGES.quinoa_pollo,
        ingredients: [
          createIng('quinoa', 'Quinoa', 90 * carbFactor),
          createIng('pechuga_pollo', 'Pechuga de pollo', 150),
          createIng('boniato', 'Boniato', 150 * carbFactor),
          createIng('tomates_cherry', 'Tomates cherry', 100),
          createIng('aguacate', 'Aguacate', 50),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      dinner = {
        name: "Tortilla con pan de centeno",
        image: IMAGES.tortilla_centeno,
        ingredients: [
          createIng('huevo', 'Huevo', 100),
          createIng('pan_centeno', 'Pan de centeno', 60 * carbFactor),
          createIng('tomate', 'Tomate', 100),
          createIng('cebolla', 'Cebolla', 50),
          createIng('queso_untar', 'Queso de untar', 30),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      break;
    case 'Viernes':
      lunch = {
        name: "Ensalada de alubias y atún",
        image: IMAGES.ensalada_alubias,
        ingredients: [
          createIng('alubias_cocidas', 'Alubias cocidas', 200 * carbFactor),
          createIng('atun_natural', 'Atún al natural', 120),
          createIng('tomate', 'Tomate', 150),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      dinner = {
        name: "Crema de calabacín y pollo",
        image: IMAGES.crema_calabacin,
        ingredients: [
          createIng('calabacin', 'Calabacín', 200),
          createIng('cebolla', 'Cebolla', 50),
          createIng('patata', 'Patata', 100 * carbFactor),
          createIng('queso_batido', 'Queso batido 0%', 50),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('pechuga_pollo', 'Pechuga de pollo', 150),
          createIng('platano', 'Plátano', 120),
        ]
      };
      break;
    case 'Sábado':
      lunch = {
        name: "Arroz a la cubana con pollo",
        image: IMAGES.arroz_cubana,
        ingredients: [
          createIng('arroz_blanco', 'Arroz blanco', 90 * carbFactor),
          createIng('huevo', 'Huevo', 60),
          createIng('pechuga_pollo', 'Pechuga de pollo', 100),
          createIng('tomate_triturado', 'Tomate triturado', 100),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      dinner = {
        name: "Pizza casera",
        image: IMAGES.pizza,
        ingredients: [
          createIng('masa_pizza', 'Masa de pizza', 250), // Fixed 250g
          createIng('tomate_triturado', 'Tomate triturado', 100),
          createIng('mozzarella_rallada', 'Mozzarella rallada', 80),
          createIng('tomates_cherry', 'Tomates cherry', 50),
          createIng('albahaca', 'Albahaca', 5),
          createIng('aceite_oliva', 'Aceite de oliva', 5, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      break;
    case 'Domingo':
      lunch = {
        name: "Espaguetis con cherry",
        image: IMAGES.espaguetis_integrales,
        ingredients: [
          createIng('espaguetis_integrales', 'Espaguetis integrales', 100 * carbFactor),
          createIng('tomates_cherry', 'Tomates cherry', 150),
          createIng('tomate_triturado', 'Tomate triturado', 100),
          createIng('levadura_nutricional', 'Levadura nutricional', 15),
          createIng('aceite_oliva', 'Aceite de oliva', 10, 'ml'),
          createIng('platano', 'Plátano', 120),
        ]
      };
      dinner = 'Libre';
      break;
    default:
      lunch = { name: "Comida", image: "", ingredients: [] };
      dinner = { name: "Cena", image: "", ingredients: [] };
  }

  return {
    dayName,
    trainingType,
    meals: { breakfast, lunch, snack, dinner }
  };
};
