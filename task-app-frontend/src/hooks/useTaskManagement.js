import { useState, useEffect, useRef, useCallback } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { fetchAllCategories } from "../services/categoryService";

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const prevFiltersRef = useRef(filters);

  // Custom comparison function for objects
  const areFiltersEqual = (a, b) => {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    
    if (aKeys.length !== bKeys.length) return false;
    
    return aKeys.every(key => a[key] === b[key]);
  };

  const loadTasks = useCallback(async (currentFilters = {}) => {
    try {
      console.log("Loading tasks with filters:", currentFilters);
      setIsLoading(true);
      
      const fetchedTasks = await fetchTasks(currentFilters);
      console.log("Fetched tasks:", fetchedTasks);
      
      const sortedTasks = Array.isArray(fetchedTasks) 
        ? fetchedTasks.sort((a, b) => (a.position || 0) - (b.position || 0))
        : [];
        
      console.log("Sorted tasks:", sortedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
      // Initialize with empty array on error
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial tasks when filters change
  useEffect(() => {
    // Only reload if filters have actually changed
    if (!areFiltersEqual(prevFiltersRef.current, filters)) {
      console.log("Filters changed, reloading tasks:", filters);
      prevFiltersRef.current = { ...filters };
      loadTasks(filters);
    }
  }, [filters, loadTasks]);

  // Load tasks on initial render
  useEffect(() => {
    console.log("Initial tasks load");
    loadTasks({});
  }, [loadTasks]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("Loading categories");
        const categoriesData = await fetchAllCategories();
        console.log("Fetched categories:", categoriesData);
        
        const formattedCategories = [
          { id: "all", name: "All", icon: "fa-th-large", color: "#4a5568" },
          ...categoriesData,
        ];
        
        console.log("Formatted categories:", formattedCategories);
        setCategories(formattedCategories);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories. Please try again.");
        // Initialize with default All category on error
        setCategories([{ id: "all", name: "All", icon: "fa-th-large", color: "#4a5568" }]);
      }
    };
    
    loadCategories();
  }, []);

  const updateFilters = useCallback((newFilters) => {
    console.log("Updating filters:", newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const addTask = async (newTask) => {
    if (!newTask.title.trim()) return;
    
    try {
      setIsLoading(true);
      
      const maxPosition = tasks.reduce((max, task) => 
        Math.max(max, task.position || 0), 0);
      
      const taskData = {
        ...newTask,
        position: maxPosition + 1,
      };
      
      console.log("Creating task:", taskData);
      const createdTask = await createTask(taskData);
      console.log("Created task:", createdTask);
      
      setTasks(prevTasks => [...prevTasks, createdTask]);
      return createdTask;
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;
      
      console.log("Toggling task completion:", id);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      
      await updateTask(id, { completed: !taskToUpdate.completed });
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task. Please try again.");
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, completed: task.completed } : task
        )
      );
    }
  };

  const deleteTaskById = async (id) => {
    try {
      const taskToDelete = tasks.find(task => task.id === id);
      if (!taskToDelete) return;
      
      console.log("Deleting task:", id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      await deleteTask(id);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again.");
      setTasks(prevTasks => [...prevTasks]);
    }
  };

  const reorderTasks = (reorderedTasks) => {
    console.log("Reordering tasks:", reorderedTasks);
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