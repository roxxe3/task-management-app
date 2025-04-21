import { useState, useEffect, useRef, useCallback } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { fetchAllCategories } from "../services/categoryService";

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const prevFiltersRef = useRef({});

  // Custom comparison function for objects
  const areFiltersEqual = (a, b) => {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    
    if (aKeys.length !== bKeys.length) return false;
    
    return aKeys.every(key => a[key] === b[key]);
  };

  const loadTasks = useCallback(async (currentFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedTasks = await fetchTasks(currentFilters);
      
      const sortedTasks = Array.isArray(fetchedTasks) 
        ? fetchedTasks.sort((a, b) => (a.position || 0) - (b.position || 0))
        : [];
        
      setTasks(sortedTasks);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      // Initialize with empty array on error
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial tasks on component mount
  useEffect(() => {
    loadTasks({});
  }, [loadTasks]);

  // Load initial tasks when filters change
  useEffect(() => {
    // Only reload if filters have actually changed
    if (!areFiltersEqual(prevFiltersRef.current, filters)) {
      prevFiltersRef.current = { ...filters };
      loadTasks(filters);
    }
  }, [filters, loadTasks]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setError(null);
        const categoriesData = await fetchAllCategories();
        
        const formattedCategories = [
          { id: "all", name: "All", icon: "fa-th-large", color: "#4a5568" },
          ...categoriesData,
        ];
        
        setCategories(formattedCategories);
      } catch (err) {
        setError("Failed to load categories. Please try again.");
        // Initialize with default All category on error
        setCategories([{ id: "all", name: "All", icon: "fa-th-large", color: "#4a5568" }]);
      }
    };
    
    loadCategories();
  }, []);

  const updateFilters = useCallback((newFilters) => {
    // Create a clean copy of current filters
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      
      // Update with new filters or remove keys if they're empty/"all"/null
      Object.keys(newFilters).forEach(key => {
        const value = newFilters[key];
        
        // Remove keys with empty values, "all" status, null, or "All" category
        if (!value || 
            (key === 'status' && value === 'all') || 
            (key === 'category_id' && (!value || value === 'all'))) {
          delete updatedFilters[key];
        } else {
          updatedFilters[key] = value;
        }
      });
      
      return updatedFilters;
    });
  }, []);

  const addTask = async (newTask) => {
    if (!newTask.title.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const maxPosition = tasks.reduce((max, task) => 
        Math.max(max, task.position || 0), 0);
      
      const taskData = {
        ...newTask,
        position: maxPosition + 1,
      };
      
      const createdTask = await createTask(taskData);
      
      setTasks(prevTasks => [...prevTasks, createdTask]);
      return createdTask;
    } catch (err) {
      setError("Failed to add task. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = async (id) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;
    
    // Optimistic UI update
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    
    try {
      await updateTask(id, { completed: !taskToUpdate.completed });
    } catch (err) {
      // Revert on error
      setError("Failed to update task. Please try again.");
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, completed: task.completed } : task
        )
      );
    }
  };

  const deleteTaskById = async (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) return;
    
    // Optimistic UI update
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    try {
      await deleteTask(id);
    } catch (err) {
      // Revert on error
      setError("Failed to delete task. Please try again.");
      // Restore the tasks array to include the "deleted" task
      setTasks(prevTasks => {
        // Check if the task is already in the array (to avoid duplicates)
        if (!prevTasks.some(task => task.id === id)) {
          return [...prevTasks, taskToDelete];
        }
        return prevTasks;
      });
    }
  };

  const reorderTasks = (reorderedTasks) => {
    setTasks(reorderedTasks);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    tasks,
    categories,
    isLoading,
    error,
    filters,
    updateFilters,
    addTask,
    toggleTaskCompletion,
    deleteTaskById,
    reorderTasks,
    clearError
  };
}; 