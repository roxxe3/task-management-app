// Task API service for handling all task-related requests
import { API_URL } from "../config";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Fetch all tasks
export const fetchTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication error: Please log in again");
      }
      throw new Error("Failed to fetch tasks");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication error: Please log in again");
      }
      throw new Error("Failed to create task");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update a task
export const updateTask = async (id, taskData) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication error: Please log in again");
      }
      throw new Error("Failed to update task");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication error: Please log in again");
      }
      throw new Error("Failed to delete task");
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Toggle task completion status
export const toggleTaskCompletion = async (id, completed) => {
  return updateTask(id, { completed });
};

// Fetch a single task by ID
export const fetchTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication error: Please log in again");
      }
      throw new Error("Failed to fetch task");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};