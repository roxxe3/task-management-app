// Configuration settings for the frontend application

// API base URL - points to our backend server
export const API_URL = 'http://localhost:5000/api';

// Default categories with icons
export const DEFAULT_CATEGORIES = [
  { id: "All", name: "All Tasks", icon: "fa-border-all" },
];

// Priority settings with colors
export const PRIORITY_COLORS = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

// Category icon mapping - only keeping the ones we actually use
export const CATEGORY_ICONS = {
  "Personal": "fa-user",
  "Work": "fa-briefcase",
  "Shopping": "fa-shopping-cart",
  "Health": "fa-heartbeat",
};