// Task API service for handling all task-related requests
import { API_URL } from "../config";

// Get auth headers for API requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication required: Please log in to continue');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function to handle API responses
const handleResponse = async (response, errorContext) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Handle authentication errors
      localStorage.removeItem('authToken'); // Clear invalid token
      throw new Error('Your session has expired. Please log in again.');
    }
    
    if (response.status === 403) {
      throw new Error('You do not have permission to perform this action');
    }
    
    if (response.status === 404) {
      throw new Error(`${errorContext} not found`);
    }
    
    if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    
    // Try to get detailed error from response if available
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || `${errorContext}: An unexpected error occurred`);
    } catch (e) {
      // If parsing fails, use the context-aware message
      throw new Error(`${errorContext}: ${response.statusText || 'An unexpected error occurred'}`);
    }
  }
  return response.status === 204 ? null : response.json();
};

// Fetch all tasks with optional filters
export const fetchTasks = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_URL}/tasks${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return await handleResponse(response, "Failed to load tasks");
  } catch (error) {
    console.error("Task fetch error:", error);
    throw error.message?.includes('Authentication') 
      ? error 
      : new Error(`Error loading tasks: ${error.message}`);
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
    return await handleResponse(response, "Failed to create task");
  } catch (error) {
    console.error("Task creation error:", error);
    throw error.message?.includes('Authentication') 
      ? error 
      : new Error(`Error creating task: ${error.message}`);
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
    return await handleResponse(response, "Failed to update task");
  } catch (error) {
    console.error("Task update error:", error);
    throw error.message?.includes('Authentication') 
      ? error 
      : new Error(`Error updating task: ${error.message}`);
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse(response, "Failed to delete task");
    return true;
  } catch (error) {
    console.error("Task deletion error:", error);
    throw error.message?.includes('Authentication') 
      ? error 
      : new Error(`Error deleting task: ${error.message}`);
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
    return await handleResponse(response, "Failed to load task details");
  } catch (error) {
    console.error("Task fetch error:", error);
    throw error.message?.includes('Authentication') 
      ? error 
      : new Error(`Error loading task details: ${error.message}`);
  }
};

// Update task positions in bulk
export const updateTaskPositions = async (taskPositions) => {
  try {
    const updatePromises = taskPositions.map(({ id, position }) => 
      fetch(`${API_URL}/tasks/${id}/position`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newPosition: position }),
      }).then(response => handleResponse(response, "Failed to update task order"))
    );
    
    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error("Task reordering error:", error);
    throw error.message?.includes('Authentication') 
      ? error 
      : new Error(`Error updating task order: ${error.message}`);
  }
};