import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Settings, 
  Calendar, 
  Utensils, 
  TrendingUp, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Save,
  Dumbbell,
  Zap,
  Moon,
  Info,
  Edit3,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, WeeklyPlan, DayType, DailyPlan, DayMacros } from './types';
import { MACRO_TARGETS, REFERENCE_WEIGHT } from './constants';
import { getBaseDailyPlan } from './mealPlanData';
import { getMealMacros, formatNumber, getAdjustedDayData, calculateBMR, calculateTargetMacros } from './utils';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function App() {
  const [view, setView] = useState<'diet' | 'planner' | 'profile' | 'progress'>(() => {
    const savedView = localStorage.getItem('nutrifit_view');
    return (savedView as 'diet' | 'planner' | 'profile' | 'progress') || 'diet';
  });

  const [selectedDay, setSelectedDay] = useState(() => {
    const savedDay = localStorage.getItem('nutrifit_selectedDay');
    return savedDay ? parseInt(savedDay, 10) : 0;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutrifit_user');
    return saved ? JSON.parse(saved) : {
      weight: 75.2,
      height: 173,
      age: 22,
      gender: 'M',
      goal: 'Pérdida de grasa',
      weightHistory: [{ date: new Date().toISOString(), weight: 75.2 }]
    };
  });

  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(() => {
    const saved = localStorage.getItem('nutrifit_plan');
    return saved ? JSON.parse(saved) : {
      'Lunes': 'Gym',
      'Martes': 'Boxeo',
      'Miércoles': 'Gym',
      'Jueves': 'Boxeo',
      'Viernes': 'Gym + Boxeo',
      'Sábado': 'Gym',
      'Domingo': 'Descanso'
    };
  });

  useEffect(() => {
    localStorage.setItem('nutrifit_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nutrifit_plan', JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  useEffect(() => {
    localStorage.setItem('nutrifit_selectedDay', selectedDay.toString());
  }, [selectedDay]);

  useEffect(() => {
    localStorage.setItem('nutrifit_view', view);
  }, [view]);

  const currentDayPlan = useMemo(() => {
    const dayName = DAYS[selectedDay];
    const trainingType = weeklyPlan[dayName];
    return getBaseDailyPlan(dayName, trainingType);
  }, [selectedDay, weeklyPlan]);

  const adjustedDayData = useMemo(() => getAdjustedDayData(currentDayPlan, user), [currentDayPlan, user]);

  const renderMealCard = (meal: any, title: string) => {
    if (meal === 'Libre') {
      return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
            <Utensils className="text-emerald-500" size={32} />
          </div>
          <h3 className="text-2xl font-semibold text-slate-800">Comida Libre</h3>
          <p className="text-slate-500 max-w-xs">Disfruta de una comida fuera de la dieta. ¡Te lo has ganado!</p>
        </div>
      );
    }

    const macros = getMealMacros(meal.ingredients);

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500"
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={meal.image} 
            alt={meal.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 uppercase tracking-wider shadow-sm">
              {title}
            </span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 leading-tight">{meal.name}</h3>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ingredientes</h4>
            <ul className="grid grid-cols-1 gap-1">
              {meal.ingredients.map((item: any, idx: number) => (
                <li key={idx} className="flex justify-between text-sm text-slate-600">
                  <span>{item.ingredient.name}</span>
                  <span className="font-mono font-medium">{item.amount}{item.ingredient.unit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-50 grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Kcal</p>
              <p className="text-sm font-bold text-slate-800">{Math.round(macros.kcal)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Prot</p>
              <p className="text-sm font-bold text-emerald-600">{Math.round(macros.protein)}g</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Carb</p>
              <p className="text-sm font-bold text-blue-600">{Math.round(macros.carbs)}g</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Grasa</p>
              <p className="text-sm font-bold text-amber-600">{Math.round(macros.fat)}g</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderDietView = () => (
    <div className="space-y-8 pb-24">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{DAYS[selectedDay]}</h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className="flex items-center text-sm font-medium text-slate-500">
              {weeklyPlan[DAYS[selectedDay]] === 'Descanso' && <Moon size={14} className="mr-1" />}
              {weeklyPlan[DAYS[selectedDay]] === 'Gym' && <Dumbbell size={14} className="mr-1" />}
              {weeklyPlan[DAYS[selectedDay]] === 'Boxeo' && <Zap size={14} className="mr-1" />}
              {weeklyPlan[DAYS[selectedDay]] === 'Gym + Boxeo' && <Zap size={14} className="mr-1" />}
              {weeklyPlan[DAYS[selectedDay]]}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(parseInt(e.target.value, 10))}
            className="px-3 py-2 rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            aria-label="Seleccionar día"
          >
            {DAYS.map((day, index) => (
              <option key={day} value={index}>{day}</option>
            ))}
          </select>

          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedDay(prev => (prev > 0 ? prev - 1 : 6))}
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setSelectedDay(prev => (prev < 6 ? prev + 1 : 0))}
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Daily Totals Bar */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Calorías Totales</p>
            <h3 className="text-4xl font-bold">{Math.round(adjustedDayData.totals.kcal)} <span className="text-lg font-normal text-slate-400">kcal</span></h3>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Objetivo</p>
            <p className="text-lg font-semibold">{Math.round(adjustedDayData.targetKcal)} kcal</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase">Proteína</p>
            <p className="text-lg font-bold text-emerald-400">{Math.round(adjustedDayData.totals.protein)}g</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase">Carbos</p>
            <p className="text-lg font-bold text-blue-400">{Math.round(adjustedDayData.totals.carbs)}g</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase">Grasas</p>
            <p className="text-lg font-bold text-amber-400">{Math.round(adjustedDayData.totals.fat)}g</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderMealCard(adjustedDayData.meals.breakfast, "Desayuno")}
        {renderMealCard(adjustedDayData.meals.lunch, "Comida")}
        {renderMealCard(adjustedDayData.meals.snack, "Merienda")}
        {renderMealCard(adjustedDayData.meals.dinner, "Cena")}
      </div>
    </div>
  );

  const weeklyStats = useMemo(() => {
    const stats = {
      totalKcal: 0,
      gymDays: 0,
      boxingDays: 0,
      restDays: 0,
    };

    DAYS.forEach(day => {
      const type = weeklyPlan[day];
      const plan = getBaseDailyPlan(day, type);
      const dayData = getAdjustedDayData(plan, user);
      stats.totalKcal += dayData.totals.kcal;
      if (type === 'Gym') stats.gymDays++;
      else if (type === 'Boxeo') stats.boxingDays++;
      else if (type === 'Gym + Boxeo') {
        stats.gymDays++;
        stats.boxingDays++;
      } else stats.restDays++;
    });

    return {
      ...stats,
      avgKcal: stats.totalKcal / 7
    };
  }, [weeklyPlan, user.weight]);

  const saveTemplate = (name: string) => {
    const templates = JSON.parse(localStorage.getItem('nutrifit_templates') || '{}');
    templates[name] = weeklyPlan;
    localStorage.setItem('nutrifit_templates', JSON.stringify(templates));
    alert(`Plantilla "${name}" guardada.`);
  };

  const loadTemplate = (name: string) => {
    const templates = JSON.parse(localStorage.getItem('nutrifit_templates') || '{}');
    if (templates[name]) {
      setWeeklyPlan(templates[name]);
    }
  };

  const renderPlannerView = () => (
    <div className="space-y-8 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Planificación</h2>
          <p className="text-slate-500">Actividad física semanal.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              const name = prompt('Nombre de la plantilla:');
              if (name) saveTemplate(name);
            }}
            className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600 hover:text-slate-900"
            title="Guardar Plantilla"
          >
            <Save size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Media Kcal</p>
          <p className="text-xl font-bold text-slate-800">{Math.round(weeklyStats.avgKcal)}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Días Gym</p>
          <p className="text-xl font-bold text-emerald-600">{weeklyStats.gymDays}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Días Boxeo</p>
          <p className="text-xl font-bold text-blue-600">{weeklyStats.boxingDays}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Descanso</p>
          <p className="text-xl font-bold text-amber-600">{weeklyStats.restDays}</p>
        </div>
      </div>

      <div className="space-y-4">
        {DAYS.map((day) => (
          <div key={day} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{day}</h3>
              <p className="text-sm text-slate-500">Entrenamiento del día</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['Descanso', 'Gym', 'Boxeo', 'Gym + Boxeo'] as DayType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setWeeklyPlan(prev => ({ ...prev, [day]: type }))}
                  className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    weeklyPlan[day] === type 
                      ? 'bg-slate-900 text-white shadow-lg scale-105' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileView = () => {
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    const baseTDEE = bmr * 1.3;

    return (
      <div className="space-y-8 pb-24">
        <header>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Mi Perfil</h2>
          <p className="text-slate-500">Configura tus datos para adaptar la dieta.</p>
        </header>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Peso Actual (kg)</label>
              <input 
                type="number" 
                value={user.weight}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setUser(prev => ({ 
                    ...prev, 
                    weight: val,
                    weightHistory: [...prev.weightHistory, { date: new Date().toISOString(), weight: val }]
                  }));
                }}
                className="w-full text-4xl font-bold text-slate-900 bg-slate-50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Altura (cm)</label>
              <input 
                type="number" 
                value={user.height}
                onChange={(e) => setUser(prev => ({ ...prev, height: parseFloat(e.target.value) }))}
                className="w-full text-4xl font-bold text-slate-900 bg-slate-50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Edad</label>
              <input 
                type="number" 
                value={user.age}
                onChange={(e) => setUser(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                className="w-full text-4xl font-bold text-slate-900 bg-slate-50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Género</label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setUser(prev => ({ ...prev, gender: 'M' }))}
                  className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${user.gender === 'M' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  Hombre
                </button>
                <button 
                  onClick={() => setUser(prev => ({ ...prev, gender: 'F' }))}
                  className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${user.gender === 'F' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  Mujer
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-50 rounded-3xl flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
              <Info size={24} />
            </div>
            <div>
              <h4 className="font-bold text-blue-900">Metabolismo y Gasto Calórico</h4>
              <p className="text-sm text-blue-700 mt-1 space-y-2">
                <span className="block">Tu metabolismo basal (BMR) es de <strong>{Math.round(bmr)} kcal</strong>.</span>
                <span className="block">Tu gasto diario base (TDEE) con 5-10k pasos es de <strong>{Math.round(baseTDEE)} kcal</strong>.</span>
                <span className="block">La app suma las calorías de tu entrenamiento diario y resta <strong>300 kcal</strong> para asegurar que estás en déficit (definición).</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProgressView = () => {
    const lastWeights = user.weightHistory.slice(-5);
    const weightChange = lastWeights.length > 1 
      ? lastWeights[lastWeights.length - 1].weight - lastWeights[0].weight
      : 0;

    return (
      <div className="space-y-8 pb-24">
        <header>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Progreso</h2>
          <p className="text-slate-500">Evolución de tu peso y recomendaciones.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Peso Actual</p>
            <h3 className="text-4xl font-bold text-slate-900 mt-2">{user.weight} <span className="text-lg font-normal text-slate-400">kg</span></h3>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Variación</p>
            <h3 className={`text-4xl font-bold mt-2 ${weightChange <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {weightChange > 0 ? '+' : ''}{formatNumber(weightChange)} <span className="text-lg font-normal opacity-50">kg</span>
            </h3>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">IMC</p>
            <h3 className="text-4xl font-bold text-slate-900 mt-2">
              {formatNumber(user.weight / ((user.height / 100) ** 2))}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Historial de Peso</h3>
          <div className="space-y-4">
            {user.weightHistory.slice().reverse().map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                <span className="text-slate-500">{new Date(entry.date).toLocaleDateString()}</span>
                <span className="font-bold text-slate-800">{entry.weight} kg</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="text-emerald-600" />
            <h3 className="text-xl font-bold text-emerald-900">Recomendación Inteligente</h3>
          </div>
          <p className="text-emerald-800">
            {weightChange < -1 
              ? "Estás bajando de peso rápidamente. Considera aumentar ligeramente los carbohidratos en los días de Gym + Boxeo para proteger tu masa muscular."
              : weightChange > 0
              ? "El peso ha subido ligeramente. Asegúrate de cumplir con los días de descanso y revisa si las cantidades de aceite son las indicadas."
              : "Tu ritmo de pérdida es óptimo para mantener músculo. Mantén la planificación actual."}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <Utensils className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">NUTRIFIT PRO</h1>
          </div>
          <div className="hidden md:flex items-center space-x-1 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
            <button onClick={() => setView('diet')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'diet' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Dieta</button>
            <button onClick={() => setView('planner')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'planner' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Plan</button>
            <button onClick={() => setView('progress')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'progress' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Progreso</button>
            <button onClick={() => setView('profile')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'profile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Perfil</button>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={view + selectedDay}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'diet' && renderDietView()}
              {view === 'planner' && renderPlannerView()}
              {view === 'profile' && renderProfileView()}
              {view === 'progress' && renderProgressView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-2 flex justify-around items-center z-50">
        <button 
          onClick={() => setView('diet')}
          className={`p-4 rounded-2xl transition-all ${view === 'diet' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
        >
          <Utensils size={24} />
        </button>
        <button 
          onClick={() => setView('planner')}
          className={`p-4 rounded-2xl transition-all ${view === 'planner' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
        >
          <Calendar size={24} />
        </button>
        <button 
          onClick={() => setView('progress')}
          className={`p-4 rounded-2xl transition-all ${view === 'progress' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
        >
          <TrendingUp size={24} />
        </button>
        <button 
          onClick={() => setView('profile')}
          className={`p-4 rounded-2xl transition-all ${view === 'profile' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
        >
          <User size={24} />
        </button>
      </nav>
    </div>
  );
}
