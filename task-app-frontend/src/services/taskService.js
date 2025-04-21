// Task API service for handling all task-related requests
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

// Helper function to handle API responses
const handleResponse = async (response, errorMessage) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Store auth error for special handling upstream
      throw new Error('Authentication error: Please log in again');
    }
    
    // Try to get detailed error from response if available
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || errorMessage);
    } catch (e) {
      // If parsing fails, use the generic message
      throw new Error(errorMessage);
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
    return handleResponse(response, "Failed to fetch tasks");
  } catch (error) {
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
    return handleResponse(response, "Failed to create task");
  } catch (error) {
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
    return handleResponse(response, "Failed to update task");
  } catch (error) {
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
    await handleResponse(response, "Failed to delete task");
    return true;
  } catch (error) {
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
    return handleResponse(response, "Failed to fetch task");
  } catch (error) {
    throw error;
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
      }).then(response => handleResponse(response, "Failed to update task position"))
    );
    
    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    throw error;
  }
};