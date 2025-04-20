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

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
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

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication error: Please log in again");
      }
      throw new Error("Failed to create category");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication error: Please log in again");
      }
      throw new Error("Failed to update category");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication error: Please log in again");
      }
      throw new Error("Failed to delete category");
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Fetch a single category by ID
export const fetchCategory = async (id) => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication error: Please log in again");
      }
      throw new Error("Failed to fetch category");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};