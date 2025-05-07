"use client";

import { useState, createContext, useContext, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Plus, Filter, ChevronDown, ChevronUp, Github, Twitter, Instagram, Heart,
    X, CalendarDays, Check, Edit2, Trash2, Clock, 
    ChevronLeft, ChevronRight, AlertCircle, Calendar, ArrowUp, ArrowDown,
    Menu, Moon, Sun, Settings, User, Bell, Save, Flame, CheckCircle2, BarChart3 ,ArrowRight, 
    Shield, 
    FileText, 
    HelpCircle 
  } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

<div className="text-red-500">Hello Tailwind</div>


// Types
type Habit = {
  id: string;
  name: string;
  category: string;
  type: "boolean" | "quantity";
  goal: number;
  unit: string;
  currentStreak: number;
  bestStreak: number;
  progress: number;
  reminderEnabled: boolean;
  reminderTime: string;
  createdAt: string;
  isCompletedToday: boolean;
  history: Array<{
    date: string;
    completed: boolean;
    progress?: number;
  }>;
};

type CompletionHistory = Array<{
  date: string;
  rate: number;
}>;

// Theme Context
type ThemeContextType = {
  theme: string;
  toggleTheme: (newTheme?: string) => void;
};

const ThemeContextImpl = createContext<ThemeContextType>({
  theme: "system",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState("system");
  
  const toggleTheme = (newTheme?: string) => {
    if (newTheme) {
      setTheme(newTheme);
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <ThemeContextImpl.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContextImpl.Provider>
  );
}

const useTheme = () => useContext(ThemeContextImpl);

// Habit Context
type HabitContextType = {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updatedHabit: Habit) => void;
  deleteHabit: (id: string) => void;
  updateHabitProgress: (id: string, progress: number) => void;
  updateHabitCompletion: (id: string) => void;
  streakData: {
    longestStreak: number;
    currentStreak: number;
  };
  completionRate: number;
  completionHistory: CompletionHistory;
  setCompletionHistory: React.Dispatch<React.SetStateAction<CompletionHistory>>;
};

// Mock data
const initialHabits: Habit[] = [
  {
    id: "habit-1",
    name: "Drink Water",
    category: "health",
    type: "quantity",
    goal: 8,
    unit: "glasses",
    currentStreak: 5,
    bestStreak: 12,
    progress: 5,
    reminderEnabled: true,
    reminderTime: "09:00",
    createdAt: "2023-04-15T12:00:00Z",
    isCompletedToday: false,
    history: []
  },
  {
    id: "habit-2",
    name: "Exercise",
    category: "fitness",
    type: "boolean",
    goal: 1,
    unit: "",
    currentStreak: 3,
    bestStreak: 14,
    progress: 0,
    reminderEnabled: true,
    reminderTime: "07:00",
    createdAt: "2023-05-20T12:00:00Z",
    isCompletedToday: true,
    history: []
  },
  {
    id: "habit-3",
    name: "Read",
    category: "productivity",
    type: "quantity",
    goal: 30,
    unit: "minutes",
    currentStreak: 7,
    bestStreak: 21,
    progress: 15,
    reminderEnabled: false,
    reminderTime: "",
    createdAt: "2023-01-10T12:00:00Z",
    isCompletedToday: false,
    history: []
  },
  {
    id: "habit-4",
    name: "Meditate",
    category: "mindfulness",
    type: "boolean",
    goal: 1,
    unit: "",
    currentStreak: 10,
    bestStreak: 30,
    progress: 0,
    reminderEnabled: true,
    reminderTime: "21:00",
    createdAt: "2023-03-05T12:00:00Z",
    isCompletedToday: true,
    history: []
  },
  {
    id: "habit-5",
    name: "Track Sleep",
    category: "sleep",
    type: "quantity",
    goal: 8,
    unit: "hours",
    currentStreak: 14,
    bestStreak: 21,
    progress: 7,
    reminderEnabled: true,
    reminderTime: "22:00",
    createdAt: "2023-02-20T12:00:00Z",
    isCompletedToday: false,
    history: []
  }
];

// Generate mock completion history
const generateCompletionHistory = (): CompletionHistory => {
  const history: CompletionHistory = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    history.push({
      date: date.toISOString(),
      rate: 0.4 + Math.random() * 0.5 // Random value between 0.4 and 0.9
    });
  }
  
  return history;
};

// Create context
const HabitContext = createContext<HabitContextType | undefined>(undefined);

// Provider component
function HabitDataProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completionHistory, setCompletionHistory] = useState<CompletionHistory>(generateCompletionHistory());

  // Calculate streak data
  const calculateStreakData = () => {
    let longestStreak = 0;
    let currentStreak = 0;
    
    habits.forEach(habit => {
      if (habit.currentStreak > currentStreak) {
        currentStreak = habit.currentStreak;
      }
      if (habit.bestStreak > longestStreak) {
        longestStreak = habit.bestStreak;
      }
    });
    
    return { longestStreak, currentStreak };
  };

  // Calculate completion rate
  const calculateCompletionRate = () => {
    const completedHabits = habits.filter(habit => habit.isCompletedToday).length;
    return habits.length > 0 ? completedHabits / habits.length : 0;
  };

  // Add a new habit
  const addHabit = (habit: Habit) => {
    setHabits([...habits, habit]);
  };

  // Update an existing habit
  const updateHabit = (id: string, updatedHabit: Habit) => {
    setHabits(habits.map(habit => 
      habit.id === id ? updatedHabit : habit
    ));
  };

  // Delete a habit
  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  // Update progress of a quantity habit
  const updateHabitProgress = (id: string, progress: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const completed = progress >= habit.goal;
        return {
          ...habit,
          progress,
          isCompletedToday: completed,
          currentStreak: completed ? habit.currentStreak + 1 : 0,
          bestStreak: completed && habit.currentStreak + 1 > habit.bestStreak 
            ? habit.currentStreak + 1 
            : habit.bestStreak
        };
      }
      return habit;
    }));
  };

  // Toggle habit completion
  const updateHabitCompletion = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCompletionState = !habit.isCompletedToday;
        return {
          ...habit,
          isCompletedToday: newCompletionState,
          progress: habit.type === "boolean" ? (newCompletionState ? 1 : 0) : habit.progress,
          currentStreak: newCompletionState 
            ? habit.currentStreak + 1 
            : 0,
          bestStreak: newCompletionState && habit.currentStreak + 1 > habit.bestStreak 
            ? habit.currentStreak + 1 
            : habit.bestStreak
        };
      }
      return habit;
    }));
  };

  // Context value
  const value = {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    updateHabitProgress,
    updateHabitCompletion,
    streakData: calculateStreakData(),
    completionRate: calculateCompletionRate(),
    completionHistory,
    setCompletionHistory
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
}

const useHabitData = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabitData must be used within a HabitDataProvider");
  }
  return context;
};


// Navbar component

// type NavbarProps = {
//   onSettingsOpen: () => void;
//   onTabChange: (tab: "dashboard" | "habits" | "analytics" | "profile") => void;
//   activeTab: "dashboard" | "habits" | "analytics" | "profile";
// };

export function Navbar({ 
  onSettingsOpen, onTabChange, activeTab 
}: { 
  onSettingsOpen: () => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
}) {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Remove the local state for activeTab since we'll use the parent's state
  // const [activeTab, setActiveTab] = useState("dashboard");

  // This function will handle tab changes and notify the parent
  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    // Close mobile menu if it's open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-105">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                HabitHub
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
            {/* Nav Links */}
            <div className="flex space-x-1 mr-4">
              <button 
                onClick={() => handleTabChange("dashboard")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "dashboard"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
                } transition-colors`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleTabChange("habits")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "habits"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
                } transition-colors`}
              >
                Habits
              </button>
              <button 
                onClick={() => handleTabChange("analytics")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "analytics"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
                } transition-colors`}
              >
                Analytics
              </button>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={() => toggleTheme()}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-yellow-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-blue-500" />
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={onSettingsOpen}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Open settings"
            >
              <Settings size={20} />
            </button>
            
            {/* User Profile */}
            <div className="ml-2 relative flex items-center">
              <button 
                className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                onClick={() => handleTabChange("profile")}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-medium">
                  U
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden bg-white dark:bg-gray-800 shadow-lg rounded-b-lg mx-2 mb-2"
          >
            <div className="pt-2 pb-3 space-y-1 px-3">
              {/* Nav Links Mobile */}
              <button 
                onClick={() => handleTabChange("dashboard")}
                className={`block px-3 py-2 rounded-lg text-base font-medium w-full text-left ${
                  activeTab === "dashboard"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
                } transition-colors`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleTabChange("habits")}
                className={`block px-3 py-2 rounded-lg text-base font-medium w-full text-left ${
                  activeTab === "habits"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
                } transition-colors`}
              >
                Habits
              </button>
              <button 
                onClick={() => handleTabChange("analytics")}
                className={`block px-3 py-2 rounded-lg text-base font-medium w-full text-left ${
                  activeTab === "analytics"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
                } transition-colors`}
              >
                Analytics
              </button>
              
              {/* Theme Toggle Mobile */}
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {theme === "dark" ? (
                  <Sun size={20} className="mr-3 text-yellow-400" />
                ) : (
                  <Moon size={20} className="mr-3 text-blue-500" />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>

              {/* Settings Button Mobile */}
              <button
                onClick={() => {
                  onSettingsOpen();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Settings size={20} className="mr-3" />
                Settings
              </button>
              
              {/* User Profile Mobile */}
              <button
                onClick={() => handleTabChange("profile")}
                className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-medium mr-3">
                  U
                </div>
                <span>User Profile</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}



// SettingsModal component
function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("appearance");
  const [reminderTime, setReminderTime] = useState("20:00");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const tabs = [
    { id: "appearance", label: "Appearance", icon: <Moon size={16} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { id: "account", label: "Account", icon: <User size={16} /> }
  ];

  const handleSaveSettings = () => {
    // Save settings logic would go here
    onClose();
  };

  const handleResetData = () => {
    // Reset data logic would go here
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Settings
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-4 h-full">
                {/* Sidebar */}
                <div className="col-span-1 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-700 p-4">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        {tab.icon}
                        <span className="ml-3">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content */}
                <div className="col-span-3 p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {activeTab === "appearance" && (
                        <>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</h4>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => toggleTheme("light")}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                                  theme === "light"
                                    ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400"
                                    : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                }`}
                              >
                                Light
                              </button>
                              <button
                                onClick={() => toggleTheme("dark")}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                                  theme === "dark"
                                    ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400"
                                    : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                }`}
                              >
                                Dark
                              </button>
                              <button
                                onClick={() => toggleTheme("system")}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                                  theme === "system"
                                    ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400"
                                    : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                }`}
                              >
                                System
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dashboard Layout</h4>
                            <div className="flex space-x-3">
                              <button
                                className="px-4 py-2 rounded-lg border text-sm font-medium bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400"
                              >
                                Default
                              </button>
                              <button
                                className="px-4 py-2 rounded-lg border text-sm font-medium bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                              >
                                Compact
                              </button>
                              <button
                                className="px-4 py-2 rounded-lg border text-sm font-medium bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                              >
                                Grid
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "notifications" && (
                        <>
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Notifications</h4>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  value="" 
                                  className="sr-only peer" 
                                  defaultChecked
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Receive reminders about your habits
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Reminder Time</h4>
                            <div className="flex items-center mt-1">
                              <Clock size={16} className="text-gray-400 mr-2" />
                              <input
                                type="time"
                                value={reminderTime}
                                onChange={(e) => setReminderTime(e.target.value)}
                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              This will be the default time for new habit reminders
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Summary</h4>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  value="" 
                                  className="sr-only peer" 
                                  defaultChecked
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Receive a daily summary of your habits
                            </p>
                          </div>
                        </>
                      )}

                      {activeTab === "account" && (
                        <>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Privacy</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              Your habit data is stored locally in your browser and is not sent to any servers.
                            </p>
                          </div>

                          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 flex items-center">
                              <AlertCircle size={16} className="mr-1" /> Data Management
                            </h4>
                            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                              You can export your data or reset all data. Resetting data cannot be undone.
                            </p>
                            <div className="mt-3 flex space-x-3">
                              <button
                                className="text-sm px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded font-medium text-gray-700 dark:text-gray-300"
                              >
                                Export Data
                              </button>
                              <button
                                onClick={() => setShowResetConfirm(true)}
                                className="text-sm px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded font-medium text-red-700 dark:text-red-400"
                              >
                                Reset All Data
                              </button>
                            </div>
                          </div>

                          {showResetConfirm && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30 mt-4">
                              <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                                Are you sure?
                              </h4>
                              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                                This will delete all your habits and progress data. This action cannot be undone.
                              </p>
                              <div className="flex justify-end space-x-3">
                                <button
                                  onClick={() => setShowResetConfirm(false)}
                                  className="text-sm px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded font-medium text-gray-700 dark:text-gray-300"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleResetData}
                                  className="text-sm px-3 py-1.5 bg-red-600 border border-red-600 rounded font-medium text-white"
                                >
                                  Yes, Reset Data
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Save className="h-4 w-4 mr-1" /> Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// OverviewStats component
function OverviewStats({ streakData, completionRate }: { 
  streakData: {
    longestStreak: number;
    currentStreak: number;
  };
  completionRate: number;
}) {
  const stats = [
    {
      name: "Current Streak",
      value: `${streakData.currentStreak} days`,
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      description: "Keep it going!",
      color: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800/30",
      textColor: "text-orange-700 dark:text-orange-400"
    },
    {
      name: "Longest Streak",
      value: `${streakData.longestStreak} days`,
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      description: "Your personal best",
      color: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800/30",
      textColor: "text-blue-700 dark:text-blue-400"
    },
    {
      name: "Completion Rate",
      value: `${(completionRate * 100).toFixed(0)}%`,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      description: "Last 7 days",
      color: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800/30",
      textColor: "text-green-700 dark:text-green-400"
    },
    {
      name: "Active Habits",
      value: "8",
      icon: <BarChart3 className="h-5 w-5 text-purple-500" />,
      description: "On your dashboard",
      color: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800/30",
      textColor: "text-purple-700 dark:text-purple-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`${stat.color} ${stat.border} border rounded-xl p-4 flex flex-col`}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-500 dark:text-gray-400 text-sm">
              {stat.name}
            </div>
            <div className="rounded-full p-2 bg-white dark:bg-gray-800">
              {stat.icon}
            </div>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className={`text-xs ${stat.textColor}`}>
              {stat.description}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function HabitCharts() {
    const [activeChart, setActiveChart] = useState("completion");
    const { habits, completionHistory, streakData } = useHabitData();
    
    // Chart options
    const chartOptions = [
      { id: "completion", label: "Completion Rate" },
      { id: "streaks", label: "Habit Streaks" },
      { id: "categories", label: "Categories" },
      { id: "performance", label: "Weekly Performance" }
    ];
  
    // Prepare completion rate data
    const completionRateData = completionHistory.map((day) => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rate: day.rate * 100
    }));
  
    // Prepare streak data
    const streakData2 = habits.map((habit) => ({
      name: habit.name,
      streak: habit.currentStreak,
      bestStreak: habit.bestStreak
    }));
  
    // Prepare category distribution data
    const categoryData = habits.reduce((acc: any[], habit) => {
      const existingCategory = acc.find(item => item.name === habit.category);
      if (existingCategory) {
        existingCategory.value += 1;
      } else {
        acc.push({ name: habit.category, value: 1 });
      }
      return acc;
    }, []);
  
    // Prepare weekly performance data
    const weeklyPerformanceData = [
      { day: "Mon", completion: 85 },
      { day: "Tue", completion: 75 },
      { day: "Wed", completion: 90 },
      { day: "Thu", completion: 65 },
      { day: "Fri", completion: 80 },
      { day: "Sat", completion: 95 },
      { day: "Sun", completion: 70 }
    ];
  
    // Colors for pie chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {chartOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveChart(option.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeChart === option.id
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
  
        <motion.div
          key={activeChart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 h-80"
        >
          {activeChart === "completion" && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Daily Completion Rate
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={completionRateData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: "#6B7280" }} 
                    tickLine={{ stroke: "#6B7280" }} 
                    axisLine={{ stroke: "#9CA3AF" }} 
                  />
                  <YAxis 
                    tick={{ fill: "#6B7280" }} 
                    tickLine={{ stroke: "#6B7280" }} 
                    axisLine={{ stroke: "#9CA3AF" }} 
                    unit="%" 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1F2937", 
                      borderColor: "#374151",
                      color: "#F3F4F6"
                    }} 
                    itemStyle={{ color: "#F3F4F6" }} 
                    formatter={(value: any) => [`${value}%`, "Completion Rate"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={{ stroke: "#3B82F6", strokeWidth: 2, fill: "#3B82F6", r: 4 }}
                    activeDot={{ stroke: "#3B82F6", strokeWidth: 2, fill: "#3B82F6", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
  
          {activeChart === "streaks" && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Current vs Best Streaks
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart 
                  data={streakData2} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                  barGap={4}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#6B7280" }} 
                    tickLine={{ stroke: "#6B7280" }} 
                    axisLine={{ stroke: "#9CA3AF" }} 
                    tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                  />
                  <YAxis 
                    tick={{ fill: "#6B7280" }} 
                    tickLine={{ stroke: "#6B7280" }} 
                    axisLine={{ stroke: "#9CA3AF" }} 
                    unit=" days" 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1F2937", 
                      borderColor: "#374151",
                      color: "#F3F4F6"
                    }} 
                    itemStyle={{ color: "#F3F4F6" }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Bar dataKey="streak" name="Current Streak" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bestStreak" name="Best Streak" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
  
          {activeChart === "categories" && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Habits by Category
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} habits`, 'Count']}
                    contentStyle={{ 
                      backgroundColor: "#1F2937", 
                      borderColor: "#374151",
                      color: "#F3F4F6"
                    }}
                  />
                  <Legend formatter={(value) => <span style={{ color: '#6B7280' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
  
          {activeChart === "performance" && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Weekly Performance
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart 
                  data={weeklyPerformanceData} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: "#6B7280" }} 
                    tickLine={{ stroke: "#6B7280" }} 
                    axisLine={{ stroke: "#9CA3AF" }} 
                  />
                  <YAxis 
                    tick={{ fill: "#6B7280" }} 
                    tickLine={{ stroke: "#6B7280" }} 
                    axisLine={{ stroke: "#9CA3AF" }} 
                    unit="%" 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1F2937", 
                      borderColor: "#374151",
                      color: "#F3F4F6"
                    }} 
                    itemStyle={{ color: "#F3F4F6" }} 
                    formatter={(value: any) => [`${value}%`, "Completion Rate"]}
                  />
                  <Bar 
                    dataKey="completion" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    background={{ fill: '#EEF2FF', radius: '4px 4px 0 0' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </motion.div>
      </div>
    );
  }
  
  // HabitDetail component
  function HabitDetail({ habitId, isOpen, onClose }: { habitId: string | null; isOpen: boolean; onClose: () => void }) {
    const { habits, updateHabit, deleteHabit } = useHabitData();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("details");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
    // ✅ Initialize editForm safely (even if `habit` is null)
    const habit = habits.find(h => h.id === habitId);
    const [editForm, setEditForm] = useState({
      name: habit?.name || "",
      category: habit?.category || "",
      goal: habit?.goal?.toString() || "",
      unit: habit?.unit || "",
      reminderEnabled: habit?.reminderEnabled || false,
      reminderTime: habit?.reminderTime || ""
    });
  
    // ✅ Early return AFTER all Hooks
    if (!habit) return null;
  
    // Handle edit form change
    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      if (type === "checkbox") {
        setEditForm({
          ...editForm,
          [name]: (e.target as HTMLInputElement).checked
        });
      } else {
        setEditForm({
          ...editForm,
          [name]: value
        });
      }
    };
  
    // Handle save edit
    const handleSaveEdit = () => {
      updateHabit(habit.id, {
        ...habit,
        name: editForm.name,
        category: editForm.category,
        goal: parseInt(editForm.goal),
        unit: editForm.unit,
        reminderEnabled: editForm.reminderEnabled,
        reminderTime: editForm.reminderTime
      });
      setIsEditing(false);
    };
  
    // Handle delete
    const handleDelete = () => {
      deleteHabit(habit.id);
      onClose();
    };
  
    const categoryOptions = [
      { id: "health", label: "Health" },
      { id: "fitness", label: "Fitness" },
      { id: "productivity", label: "Productivity" },
      { id: "nutrition", label: "Nutrition" },
      { id: "mindfulness", label: "Mindfulness" },
      { id: "sleep", label: "Sleep" },
      { id: "other", label: "Other" }
    ];
  
    // Modal animation variants
    const overlayVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    };
  
    const modalVariants = {
      hidden: { opacity: 0, scale: 0.95, y: 20 },
      visible: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 20 }
    };
  
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
                onClick={onClose}
              />
  
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                {/* Header */}
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    {isEditing ? "Edit Habit" : habit.name}
                  </h3>
                  <button
                    onClick={onClose}
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
  
                {/* Tabs */}
                <div className="px-4 sm:px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-8">
                    {[
                      { id: "details", label: "Details", icon: <CalendarDays size={16} /> },
                      { id: "history", label: "History", icon: <LineChart width={16} /> }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 px-1 relative flex items-center space-x-2 ${
                          activeTab === tab.id
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        } transition-colors`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeDetailTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                            initial={false}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
  
                {/* Content */}
                <div className="px-4 py-5 sm:px-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === "details" && (
                        <>
                          {isEditing ? (
                            /* Edit Form */
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Habit Name *
                                </label>
                                <input
                                  type="text"
                                  id="name"
                                  name="name"
                                  value={editForm.name}
                                  onChange={handleEditFormChange}
                                  required
                                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                              </div>
  
                              <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Category
                                </label>
                                <select
                                  id="category"
                                  name="category"
                                  value={editForm.category}
                                  onChange={handleEditFormChange}
                                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                  {categoryOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
  
                              {habit.type === "quantity" && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Daily Goal
                                    </label>
                                    <input
                                      type="number"
                                      id="goal"
                                      name="goal"
                                      value={editForm.goal}
                                      onChange={handleEditFormChange}
                                      min="1"
                                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Unit
                                    </label>
                                    <input
                                      type="text"
                                      id="unit"
                                      name="unit"
                                      value={editForm.unit}
                                      onChange={handleEditFormChange}
                                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                              )}
  
                              <div>
                                <div className="flex items-center justify-between">
                                  <label htmlFor="reminderEnabled" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Set Daily Reminder
                                  </label>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer" 
                                      name="reminderEnabled"
                                      checked={editForm.reminderEnabled}
                                      onChange={(e) => handleEditFormChange(e)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                                
                                {editForm.reminderEnabled && (
                                  <div className="mt-2">
                                    <input
                                      type="time"
                                      id="reminderTime"
                                      name="reminderTime"
                                      value={editForm.reminderTime}
                                      onChange={handleEditFormChange}
                                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            /* Details View */
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h4>
                                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(habit.category)}`}>
                                      {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                                    </span>
                                  </p>
                                </div>
  
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</h4>
                                  <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                                    {habit.type}
                                  </p>
                                </div>
                              </div>
  
                              {habit.type === "quantity" && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily Goal</h4>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                      {habit.goal} {habit.unit}
                                    </p>
                                  </div>
  
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Today&apos;s Progress</h4>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                      {habit.progress} / {habit.goal} {habit.unit}
                                    </p>
                                  </div>
                                </div>
                              )}
  
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</h4>
                                  <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                                    {habit.currentStreak} days
                                    {habit.currentStreak >= 3 && (
                                      <span className="ml-1 text-orange-500 dark:text-orange-400">🔥</span>
                                    )}
                                  </p>
                                </div>
  
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Best Streak</h4>
                                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {habit.bestStreak} days
                                  </p>
                                </div>
                              </div>
  
                              {habit.reminderEnabled && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily Reminder</h4>
                                  <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                                    <Clock size={14} className="mr-1" /> {formatTime(habit.reminderTime)}
                                  </p>
                                </div>
                              )}
  
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created On</h4>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                  {new Date(habit.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
  
                      {activeTab === "history" && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Activity</h4>
                            <div className="flex space-x-1">
                              <button className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                <ChevronLeft size={16} />
                              </button>
                              <button className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
  
                          {/* Calendar view or activity list would go here */}
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                            <div className="mx-auto w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                              <Calendar className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Activity history visualization coming soon!
                            </p>
                          </div>
  
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statistics</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Completion Rate</div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">{Math.round(Math.random() * 100)}%</div>
                              </div>
                              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Total Completions</div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">{Math.round(Math.random() * 30)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
  
                {/* Actions */}
                <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700">
                  {showDeleteConfirm ? (
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-800 dark:text-gray-200">
                        <AlertCircle size={18} className="text-red-500 mr-2" />
                        <span>Are you sure you want to delete this habit?</span>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="rounded-md text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-2 text-sm font-medium flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                      
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={isEditing ? () => setIsEditing(false) : onClose}
                          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          {isEditing ? "Cancel" : "Close"}
                        </button>
                        
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                          >
                            <Check size={16} className="mr-1 inline-block" />
                            Save
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                          >
                            <Edit2 size={16} className="mr-1 inline-block" />
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    );
  }
  
  // Helper function to format time
  function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }
  
  // Helper function to get category badge color
  type CategoryBadgeColor = {
    [key: string]: string;
  };
  
  const getCategoryBadgeColor = (category: string): string => {
    const colors: CategoryBadgeColor = {
      health: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      fitness: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      productivity: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      nutrition: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      mindfulness: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
      sleep: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
    };
    return colors[category.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
  }; 


  interface NewHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  export  function NewHabitModal({ isOpen, onClose }: NewHabitModalProps) {
    const { addHabit } = useHabitData();
  
    const [habitName, setHabitName] = useState("");
    const [category, setCategory] = useState("health");
    const [habitType, setHabitType] = useState("boolean");
    const [goal, setGoal] = useState("1");
    const [unit, setUnit] = useState("glasses");
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState("09:00");
  
    const categoryOptions = [
      { id: "health", label: "Health" },
      { id: "fitness", label: "Fitness" },
      { id: "productivity", label: "Productivity" },
      { id: "nutrition", label: "Nutrition" },
      { id: "mindfulness", label: "Mindfulness" },
      { id: "sleep", label: "Sleep" },
      { id: "other", label: "Other" }
    ];
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newHabit = {
        id: `habit-${Date.now()}`,
        name: habitName,
        category,
        type: habitType as "boolean" | "quantity",
        goal: parseInt(goal),
        unit: habitType === "quantity" ? unit : "",
        currentStreak: 0,
        bestStreak: 0,
        progress: 0,
        reminderEnabled,
        reminderTime,
        createdAt: new Date().toISOString(),
        isCompletedToday: false,
        history: []
      };
  
      addHabit(newHabit);
      resetForm();
      onClose();
    };
  
    const resetForm = () => {
      setHabitName("");
      setCategory("health");
      setHabitType("boolean");
      setGoal("1");
      setUnit("glasses");
      setReminderEnabled(false);
      setReminderTime("09:00");
    };
  
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
                onClick={onClose}
              />
  
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Create New Habit
                  </h3>
                  <button
                    onClick={onClose}
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
  
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-4">
                    {/* Habit Name */}
                    <div>
                      <label htmlFor="habitName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Habit Name *
                      </label>
                      <input
                        type="text"
                        id="habitName"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="e.g., Drink water"
                      />
                    </div>
  
                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {categoryOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
  
                    {/* Habit Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Habit Type
                      </label>
                      <div className="mt-1 flex items-center space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="boolean"
                            checked={habitType === "boolean"}
                            onChange={() => setHabitType("boolean")}
                            className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">Yes/No</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="quantity"
                            checked={habitType === "quantity"}
                            onChange={() => setHabitType("quantity")}
                            className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">Quantity</span>
                        </label>
                      </div>
                    </div>
  
                    {/* Goal and Unit (for quantity habits) */}
                    {habitType === "quantity" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Daily Goal
                          </label>
                          <input
                            type="number"
                            id="goal"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            min="1"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Unit
                          </label>
                          <input
                            type="text"
                            id="unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="e.g., glasses, minutes"
                          />
                        </div>
                      </div>
                    )}
  
                    {/* Reminder */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="reminderEnabled" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Set Daily Reminder
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            value="" 
                            className="sr-only peer" 
                            checked={reminderEnabled}
                            onChange={() => setReminderEnabled(!reminderEnabled)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      {reminderEnabled && (
                        <div className="mt-2">
                          <input
                            type="time"
                            id="reminderTime"
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
  
                  {/* Actions */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      disabled={!habitName.trim()}
                    >
                      Create Habit
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    );
  }
  

  function HabitList({ filter }: { filter: string }) {
    const { habits, updateHabitProgress, updateHabitCompletion } = useHabitData();
    const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState("category");
    const [sortDirection, setSortDirection] = useState("asc");
  
    // Filter habits based on the selected filter
    const filteredHabits = habits.filter(habit => {
      if (filter === "all") return true;
      if (filter === "active") return true;
      if (filter === "completed") return habit.isCompletedToday;
      if (filter === "missed") return !habit.isCompletedToday;
      return true;
    });
  
    // Sort habits based on the selected sort field
    const sortedHabits = [...filteredHabits].sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "category") {
        return sortDirection === "asc" 
          ? a.category.localeCompare(b.category)  // Fixed typo: localeCompare
          : b.category.localeCompare(a.category); // Fixed typo: localeCompare
      } else if (sortBy === "streak") {
        return sortDirection === "asc" 
          ? a.currentStreak - b.currentStreak
          : b.currentStreak - a.currentStreak;
      }
      return 0;
    });
  
    // Handle sort change
    const handleSort = (field: string) => {
      if (sortBy === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortBy(field);
        setSortDirection("asc");
      }
    };
  
    // Handle progress change
    const handleProgressChange = (habitId: string, value: number) => {
      updateHabitProgress(habitId, value);
    };
  
    // Toggle habit completion
    const toggleHabitCompletion = (habitId: string) => {
      updateHabitCompletion(habitId);
    };
  
    // Render sort arrow
    const renderSortArrow = (field: string) => {
      if (sortBy !== field) return null;
      return sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };
  
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Your Habits
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredHabits.length} habits
          </div>
        </div>
  
        {/* Empty state */}
        {filteredHabits.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No habits found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {filter === "all" 
                ? "You haven't created any habits yet. Click the 'New Habit' button to get started."
                : "No habits match your current filter. Try changing the filter or create a new habit."}
            </p>
          </div>
        )}
  
        {/* Table header */}
        {filteredHabits.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="bg-gray-50 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-700 px-4 py-3 grid grid-cols-12 gap-4">
              <button
                onClick={() => handleSort("name")}
                className="col-span-4 sm:col-span-3 flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <span>Habit</span>
                {renderSortArrow("name")}
              </button>
              <button
                onClick={() => handleSort("category")}
                className="col-span-3 hidden sm:flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <span>Category</span>
                {renderSortArrow("category")}
              </button>
              <div className="col-span-5 sm:col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Today&apos;s Progress
              </div>
              <button
                onClick={() => handleSort("streak")}
                className="col-span-2 sm:col-span-2 flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <span>Streak</span>
                {renderSortArrow("streak")}
              </button>
              <div className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                Done
              </div>
            </div>
  
            {/* Habit rows */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {sortedHabits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`px-4 py-3 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${
                      habit.isCompletedToday 
                        ? "bg-green-50/50 dark:bg-green-900/10" 
                        : ""
                    }`}
                    onClick={() => setSelectedHabit(habit.id)}
                  >
                    <div className="col-span-4 sm:col-span-3">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${getCategoryColor(habit.category)}`}></div>
                        <span className="font-medium text-gray-900 dark:text-white truncate">{habit.name}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-3 hidden sm:block">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        {habit.category}
                      </span>
                    </div>
                    
                    <div className="col-span-5 sm:col-span-3">
                      {habit.type === "boolean" ? (
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {habit.isCompletedToday ? "Completed" : "Not completed"}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                       
<input
  type="range"
  min="0"
  max={habit.goal}
  value={habit.progress}
  onClick={(e) => e.stopPropagation()}
  onChange={(e) => {
    e.stopPropagation();
    handleProgressChange(habit.id, parseInt(e.target.value));
  }}
  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
  style={{
    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(habit.progress / habit.goal) * 100}%, #e5e7eb ${(habit.progress / habit.goal) * 100}%, #e5e7eb 100%)`
  }}
/>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {habit.progress}/{habit.goal} {habit.unit}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="col-span-2 sm:col-span-2">
                      <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">{habit.currentStreak}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">days</span>
                        
                        {habit.currentStreak >= 7 && (
                          <span className="ml-1 text-orange-500 dark:text-orange-400">🔥</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleHabitCompletion(habit.id);
                        }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          habit.isCompletedToday
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {habit.isCompletedToday ? (
                          <Check size={14} />
                        ) : (
                          <X size={14} />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
  
        {/* Habit Detail Modal */}
        <HabitDetail
          habitId={selectedHabit}
          isOpen={!!selectedHabit}
          onClose={() => setSelectedHabit(null)}
        />
      </div>
    );
  }
  
  // Helper function to get category color
  function getCategoryColor(category: string): string {
    switch (category.toLowerCase()) {
      case "health":
        return "bg-green-500 dark:bg-green-400";
      case "fitness":
        return "bg-blue-500 dark:bg-blue-400";
      case "productivity":
        return "bg-purple-500 dark:bg-purple-400";
      case "nutrition":
        return "bg-orange-500 dark:bg-orange-400";
      case "mindfulness":
        return "bg-teal-500 dark:bg-teal-400";
      case "sleep":
        return "bg-indigo-500 dark:bg-indigo-400";
      default:
        return "bg-gray-500 dark:bg-gray-400";
    }
  }

  function HabitDashboard() {
    const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);
    const [activeView, setActiveView] = useState("dashboard");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("all");
  
    const filterOptions = [
      { id: "all", label: "All Habits" },
      { id: "active", label: "Active" },
      { id: "completed", label: "Completed Today" },
      { id: "missed", label: "Missed" }
    ];
  
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Habit Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track, analyze, and improve your daily habits
            </p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterOpen(!filterOpen)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter size={16} />
                <span>{filterOptions.find(f => f.id === selectedFilter)?.label || "Filter"}</span>
                {filterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </motion.button>
              
              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-30"
                  >
                    <div className="py-1">
                      {filterOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSelectedFilter(option.id);
                            setFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            selectedFilter === option.id 
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNewHabitModalOpen(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={18} />
              <span>New Habit</span>
            </motion.button>
          </div>
        </div>
  
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "analytics", label: "Analytics" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`py-2 px-1 relative ${
                  activeView === tab.id
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                } transition-colors`}
              >
                {tab.label}
                {activeView === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                    initial={false}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
  
        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === "dashboard" ? (
              <HabitList filter={selectedFilter} />
            ) : (
              <HabitCharts />
            )}
          </motion.div>
        </AnimatePresence>
  
        {/* New Habit Modal - Assuming this is imported from elsewhere */}
        {isNewHabitModalOpen && (
          <NewHabitModal 
            isOpen={isNewHabitModalOpen} 
            onClose={() => setIsNewHabitModalOpen(false)} 
          />
        )}
      </div>
    );
  }

  function UserProfile() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const { theme } = useTheme();
  
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">User Profile</h2>
        
        {!isSignedIn ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
              Please sign in to view your profile
            </h3>
            <button
              onClick={() => setIsSignedIn(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                U
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">User Name</h3>
                <p className="text-gray-600 dark:text-gray-400">user@example.com</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Account Details</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member since: Jan 2023</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Theme: {theme === 'dark' ? 'Dark' : 'Light'}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Habit Stats</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total habits: 5</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current streak: 7 days</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsSignedIn(false)}
              className="px-4 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }


  function Footer() {
    const currentYear = new Date().getFullYear();
  
    // Quick links organized in two columns
    const quickLinks = [
      // { name: "Dashboard", href: "#" },
      { name: "Features", href: "#" },
      // { name: "Pricing", href: "#" },
      { name: "About", href: "#" },
      // { name: "Contact", href: "#" },
      { name: "Blog", href: "#" },
      { name: "FAQ", href: "#" },
      // { name: "Support", href: "#" }
    ];
  
    return (
      <footer className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 py-12 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Logo and Description */}
            <div className="space-y-4">
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">HabitHub</span>
              </motion.div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Track your habits, improve your life, and reach your goals with our comprehensive habit tracking and analytics platform.
              </p>
              <motion.div 
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  © {currentYear} HabitHub. All rights reserved.
                </p>
              </motion.div>
            </div>
  
            {/* Quick Links - Now in a grid layout */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {quickLinks.map((link) => (
                  <motion.a 
                    key={link.name}
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 text-sm flex items-center"
                    whileHover={{ x: 3, color: "#3b82f6" }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight size={14} className="mr-1 opacity-70" />
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </div>
  
            {/* Newsletter and Social Media */}
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900 dark:text-white">Stay Connected</h3>
              
              {/* Newsletter signup */}
              <div className="flex flex-col space-y-2">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Subscribe to our newsletter for tips and updates.
                </p>
                <div className="flex mt-2">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white w-full"
                  />
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md text-sm transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
              
              {/* Social media icons */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Follow Us</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: <Github size={18} />, label: "GitHub", color: "hover:bg-gray-800" },
                    { icon: <Twitter size={18} />, label: "Twitter", color: "hover:bg-blue-400" },
                    { icon: <Instagram size={18} />, label: "Instagram", color: "hover:bg-pink-500" },
                    // { icon: <Linkedin size={18} />, label: "LinkedIn", color: "hover:bg-blue-700" }
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href="#"
                      aria-label={social.label}
                      className={`w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-white ${social.color} transition-colors`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
  
          {/* Bottom links */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            <motion.a 
              href="#" 
              className="text-gray-600 dark:text-gray-400 text-sm hover:text-blue-500 dark:hover:text-blue-400 flex items-center"
              whileHover={{ x: 2 }}
            >
              <Shield size={14} className="mr-1" />
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="text-gray-600 dark:text-gray-400 text-sm hover:text-blue-500 dark:hover:text-blue-400 flex items-center"
              whileHover={{ x: 2 }}
            >
              <FileText size={14} className="mr-1" />
              Terms of Service
            </motion.a>
            <motion.a 
              href="#" 
              className="text-gray-600 dark:text-gray-400 text-sm hover:text-blue-500 dark:hover:text-blue-400 flex items-center"
              whileHover={{ x: 2 }}
            >
              <HelpCircle size={14} className="mr-1" />
              Help Center
            </motion.a>
          </div>
          
          <div className="mt-6 text-center">
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-xs flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Made with <Heart size={12} className="mx-1 text-red-500" /> for better habits
            </motion.p>
          </div>
        </div>
      </footer>
    );
  }
  
  export default function Home() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const { theme } = useTheme();
  
    useEffect(() => {
      const html = document.documentElement;
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }, [theme]);
  
    return (
      <ThemeProvider>
        <HabitDataProvider>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar
              onSettingsOpen={() => setIsSettingsOpen(true)}
              onTabChange={(tab) => setActiveTab(tab)}
              activeTab={activeTab}
            />
            <main className="flex-grow">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-8 max-w-7xl"
              >
                {activeTab === "dashboard" && <HabitDashboard />}
                {activeTab === "habits" && <HabitList filter="all" />}
                {activeTab === "analytics" && <HabitCharts />}
                {activeTab === "profile" && <UserProfile />}
              </motion.div>
            </main>
            <Footer />
                      
            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
            />
          </div>
        </HabitDataProvider>
      </ThemeProvider>
    );
  }


  // const StatsDisplay = () => {
  //   const habitContext = useContext(HabitContext);
  
  //   if (!habitContext) {
  //     return <div>Loading...</div>;
  //   }
  
  //   const { streakData, completionRate, setCompletionHistory } = habitContext;
  
  //   useEffect(() => {
  //     setCompletionHistory([
  //       { date: '2025-05-01', rate: 80 },
  //       { date: '2025-05-02', rate: 90 },
  //     ]);
  //   }, [setCompletionHistory]);
  
  //   return (
  //     <div className="p-4">
  //       <h2 className="text-xl font-semibold mb-2">Overview Stats</h2>
  //       <OverviewStats 
  //         streakData={streakData}
  //         completionRate={completionRate}
  //       />
  //     </div>
  //   );
  // };