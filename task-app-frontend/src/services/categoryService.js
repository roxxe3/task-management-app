// Category API service for handling all category-related requests
import { API_URL } from "../config";

// Get auth headers for API requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Fetch all unique categories from tasks
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks/categories/unique`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication error: Please log in again");
      }
      throw new Error("Failed to fetch categories");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Fetch all categories from the categories endpoint and format for frontend
export const fetchAllCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    // Return the data as is, maintaining the original structure
    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      icon: cat.icon
    }));
  } catch (error) {
    console.error('Error fetching all categories:', error);
    throw error;
  }
};

// Helper function to update all tasks with a specific category
export const updateCategoryInTasks = async (oldCategoryName, newCategoryData) => {
  try {
    // First fetch all tasks with the old category name
    const filters = { category: oldCategoryName };
    const queryParams = new URLSearchParams(filters).toString();
    const tasksResponse = await fetch(`${API_URL}/tasks?${queryParams}`, {
      headers: getAuthHeaders()
    });
    
    if (!tasksResponse.ok) {
      throw new Error("Failed to fetch tasks for category update");
    }
    
    const tasks = await tasksResponse.json();
    
    // Update each task with the new category data
    const updatePromises = tasks.map(task => {
      return fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          category_id: newCategoryData.id
        })
      });
    });
    
    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error("Error updating category in tasks:", error);
    throw error;
  }
};

// Helper function to delete category from tasks
export const removeCategoryFromTasks = async (categoryId) => {
  try {
    // First fetch all tasks with the category
    const tasksResponse = await fetch(`${API_URL}/tasks?category_id=${categoryId}`, {
      headers: getAuthHeaders()
    });
    
    if (!tasksResponse.ok) {
      throw new Error("Failed to fetch tasks for category removal");
    }
    
    const tasks = await tasksResponse.json();
    
    // Set category_id to null for all tasks with this category
    const updatePromises = tasks.map(task => {
      return fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          category_id: null
        })
      });
    });
    
    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error("Error removing category from tasks:", error);
    throw error;
  }
};