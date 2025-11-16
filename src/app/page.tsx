"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  TrendingUp,
  Apple,
  Utensils,
  Coffee,
  Moon,
  ChevronLeft,
  ChevronRight,
  Target,
  Flame,
  Activity,
  Bell,
  Settings,
  Search,
  X,
} from "lucide-react";

// Types
interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  time: string;
  date: string;
}

interface DailyGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Recipe {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: string;
  difficulty: string;
  image: string;
}

// Sample recipes
const sampleRecipes: Recipe[] = [
  {
    id: "1",
    name: "Salada de Quinoa com Abacate",
    calories: 350,
    protein: 12,
    carbs: 45,
    fat: 15,
    prepTime: "15 min",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Frango Grelhado com Legumes",
    calories: 420,
    protein: 45,
    carbs: 30,
    fat: 12,
    prepTime: "25 min",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Smoothie Bowl de Frutas",
    calories: 280,
    protein: 8,
    carbs: 52,
    fat: 6,
    prepTime: "10 min",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Salmão com Batata Doce",
    calories: 480,
    protein: 38,
    carbs: 42,
    fat: 18,
    prepTime: "30 min",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Wrap de Atum Integral",
    calories: 320,
    protein: 28,
    carbs: 35,
    fat: 8,
    prepTime: "12 min",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Tigela de Açaí Proteico",
    calories: 380,
    protein: 15,
    carbs: 58,
    fat: 12,
    prepTime: "8 min",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
  },
];

export default function DietTrackerApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  });
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "recipes" | "progress">("today");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // New meal form state
  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    type: "breakfast" as Meal["type"],
  });

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load data from localStorage
  useEffect(() => {
    if (!mounted) return;
    
    const savedMeals = localStorage.getItem("dietTrackerMeals");
    const savedGoal = localStorage.getItem("dietTrackerGoal");
    const savedNotifications = localStorage.getItem("dietTrackerNotifications");

    if (savedMeals) setMeals(JSON.parse(savedMeals));
    if (savedGoal) setDailyGoal(JSON.parse(savedGoal));
    if (savedNotifications) setNotificationsEnabled(JSON.parse(savedNotifications));
  }, [mounted]);

  // Save meals to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("dietTrackerMeals", JSON.stringify(meals));
  }, [meals, mounted]);

  // Save goal to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("dietTrackerGoal", JSON.stringify(dailyGoal));
  }, [dailyGoal, mounted]);

  // Save notifications preference
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("dietTrackerNotifications", JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled, mounted]);

  // Notification system
  useEffect(() => {
    if (!mounted) return;
    
    if (notificationsEnabled && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }

      const notificationTimes = [
        { hour: 8, message: "Bom dia! Não esqueça de registrar seu café da manhã 🍳" },
        { hour: 12, message: "Hora do almoço! Registre sua refeição 🍽️" },
        { hour: 19, message: "Hora do jantar! Não esqueça de registrar 🌙" },
      ];

      const checkNotifications = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        notificationTimes.forEach((time) => {
          if (currentHour === time.hour && currentMinute === 0) {
            if (Notification.permission === "granted") {
              new Notification("Lembrete de Dieta", {
                body: time.message,
                icon: "/icon.svg",
              });
            }
          }
        });
      };

      const interval = setInterval(checkNotifications, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [notificationsEnabled, mounted]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getTodaysMeals = () => {
    const today = currentDate.toISOString().split("T")[0];
    return meals.filter((meal) => meal.date === today);
  };

  const calculateTotals = () => {
    const todaysMeals = getTodaysMeals();
    return todaysMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const addMeal = () => {
    if (!newMeal.name || !newMeal.calories) return;

    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      calories: Number(newMeal.calories),
      protein: Number(newMeal.protein) || 0,
      carbs: Number(newMeal.carbs) || 0,
      fat: Number(newMeal.fat) || 0,
      type: newMeal.type,
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: currentDate.toISOString().split("T")[0],
    };

    setMeals([...meals, meal]);
    setNewMeal({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      type: "breakfast",
    });
    setShowAddMeal(false);
  };

  const addRecipeAsMeal = (recipe: Recipe) => {
    const meal: Meal = {
      id: Date.now().toString(),
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      type: "lunch",
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: currentDate.toISOString().split("T")[0],
    };

    setMeals([...meals, meal]);
    setActiveTab("today");
  };

  const deleteMeal = (id: string) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const totals = calculateTotals();
  const caloriesPercentage = Math.min((totals.calories / dailyGoal.calories) * 100, 100);
  const proteinPercentage = Math.min((totals.protein / dailyGoal.protein) * 100, 100);
  const carbsPercentage = Math.min((totals.carbs / dailyGoal.carbs) * 100, 100);
  const fatPercentage = Math.min((totals.fat / dailyGoal.fat) * 100, 100);

  const getMealIcon = (type: Meal["type"]) => {
    switch (type) {
      case "breakfast":
        return <Coffee className="w-5 h-5" />;
      case "lunch":
        return <Utensils className="w-5 h-5" />;
      case "dinner":
        return <Moon className="w-5 h-5" />;
      case "snack":
        return <Apple className="w-5 h-5" />;
    }
  };

  const getMealTypeLabel = (type: Meal["type"]) => {
    const labels = {
      breakfast: "Café da Manhã",
      lunch: "Almoço",
      dinner: "Jantar",
      snack: "Lanche",
    };
    return labels[type];
  };

  // Get last 7 days data for progress chart
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayMeals = meals.filter((meal) => meal.date === dateStr);
      const dayTotal = dayMeals.reduce((acc, meal) => acc + meal.calories, 0);
      data.push({
        date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        calories: dayTotal,
      });
    }
    return data;
  };

  const progressData = getLast7DaysData();
  const maxCalories = Math.max(...progressData.map((d) => d.calories), dailyGoal.calories);

  // Prevent hydration mismatch by not rendering date until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">NutriTrack</h1>
                  <p className="text-xs sm:text-sm text-gray-500">Seu diário de saúde</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-24"></div>
            <div className="bg-white rounded-2xl shadow-lg p-6 h-48"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">NutriTrack</h1>
                <p className="text-xs sm:text-sm text-gray-500">Seu diário de saúde</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`p-2 rounded-lg transition-all ${
                  notificationsEnabled
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("today")}
              className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-all ${
                activeTab === "today"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setActiveTab("recipes")}
              className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-all ${
                activeTab === "recipes"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-all ${
                activeTab === "progress"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Progresso
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {/* TODAY TAB */}
        {activeTab === "today" && (
          <div className="space-y-6">
            {/* Date Selector */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => changeDate(-1)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="text-center">
                  <div className="flex items-center gap-2 justify-center text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Data Selecionada</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800 capitalize">
                    {formatDate(currentDate)}
                  </h2>
                </div>
                <button
                  onClick={() => changeDate(1)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calories Summary */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Calorias Hoje</h3>
                </div>
                <Target className="w-5 h-5 opacity-80" />
              </div>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <span className="text-4xl sm:text-5xl font-bold">{totals.calories}</span>
                  <span className="text-xl opacity-80 mb-1">/ {dailyGoal.calories}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-white rounded-full h-3 transition-all duration-500"
                    style={{ width: `${caloriesPercentage}%` }}
                  />
                </div>
                <p className="text-sm opacity-90">
                  {dailyGoal.calories - totals.calories > 0
                    ? `Restam ${dailyGoal.calories - totals.calories} calorias`
                    : "Meta atingida!"}
                </p>
              </div>
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Proteínas</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{totals.protein}g</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${proteinPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{dailyGoal.protein}g</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Carboidratos</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{totals.carbs}g</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-orange-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${carbsPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{dailyGoal.carbs}g</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Gorduras</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">{totals.fat}g</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${fatPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{dailyGoal.fat}g</p>
                </div>
              </div>
            </div>

            {/* Meals List */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Refeições de Hoje</h3>
                <button
                  onClick={() => setShowAddMeal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Adicionar</span>
                </button>
              </div>

              {getTodaysMeals().length === 0 ? (
                <div className="text-center py-12">
                  <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma refeição registrada hoje</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Clique em "Adicionar" para começar
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getTodaysMeals().map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl hover:shadow-md transition-all"
                    >
                      <div className="bg-white p-3 rounded-lg text-emerald-600">
                        {getMealIcon(meal.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800 truncate">{meal.name}</h4>
                          <span className="text-xs text-gray-500">{meal.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{getMealTypeLabel(meal.type)}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            {meal.calories} kcal
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            P: {meal.protein}g
                          </span>
                          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded">
                            C: {meal.carbs}g
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            G: {meal.fat}g
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteMeal(meal.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RECIPES TAB */}
        {activeTab === "recipes" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <Utensils className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800">Receitas Saudáveis</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-gradient-to-br from-white to-emerald-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-emerald-600">
                        {recipe.difficulty}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2">{recipe.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <span>⏱️ {recipe.prepTime}</span>
                        <span>•</span>
                        <span>🔥 {recipe.calories} kcal</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          P: {recipe.protein}g
                        </span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                          C: {recipe.carbs}g
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          G: {recipe.fat}g
                        </span>
                      </div>
                      <button
                        onClick={() => addRecipeAsMeal(recipe)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      >
                        Adicionar ao Diário
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS TAB */}
        {activeTab === "progress" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800">Progresso Semanal</h2>
              </div>

              {/* Chart */}
              <div className="mb-8">
                <div className="flex items-end justify-between gap-2 h-64">
                  {progressData.map((day, index) => {
                    const height = (day.calories / maxCalories) * 100;
                    const isGoalMet = day.calories >= dailyGoal.calories * 0.9;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full flex items-end justify-center h-full">
                          <div
                            className={`w-full rounded-t-lg transition-all duration-500 ${
                              isGoalMet
                                ? "bg-gradient-to-t from-emerald-500 to-teal-600"
                                : "bg-gradient-to-t from-gray-300 to-gray-400"
                            }`}
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                              {day.calories}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-4 mt-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-emerald-500 to-teal-600" />
                    <span className="text-gray-600">Meta atingida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-gray-300 to-gray-400" />
                    <span className="text-gray-600">Abaixo da meta</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Média Diária</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {Math.round(
                      progressData.reduce((acc, d) => acc + d.calories, 0) / progressData.length
                    )}
                  </p>
                  <p className="text-xs text-gray-500">calorias</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Dias na Meta</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {progressData.filter((d) => d.calories >= dailyGoal.calories * 0.9).length}
                  </p>
                  <p className="text-xs text-gray-500">de 7 dias</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Melhor Dia</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.max(...progressData.map((d) => d.calories))}
                  </p>
                  <p className="text-xs text-gray-500">calorias</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Total Semanal</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {progressData.reduce((acc, d) => acc + d.calories, 0)}
                  </p>
                  <p className="text-xs text-gray-500">calorias</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Adicionar Refeição</h3>
              <button
                onClick={() => setShowAddMeal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Refeição
                </label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  placeholder="Ex: Omelete com legumes"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Refeição
                </label>
                <select
                  value={newMeal.type}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, type: e.target.value as Meal["type"] })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="breakfast">Café da Manhã</option>
                  <option value="lunch">Almoço</option>
                  <option value="dinner">Jantar</option>
                  <option value="snack">Lanche</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calorias (kcal)
                  </label>
                  <input
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proteínas (g)
                  </label>
                  <input
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carboidratos (g)
                  </label>
                  <input
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gorduras (g)
                  </label>
                  <input
                    type="number"
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={addMeal}
                disabled={!newMeal.name || !newMeal.calories}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar Refeição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
