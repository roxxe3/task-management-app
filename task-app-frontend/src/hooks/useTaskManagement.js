import { useState, useEffect } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { fetchAllCategories } from "../services/categoryService";

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial tasks
  useEffect(() => {
    loadTasks();
  }, []);

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await fetchTasks();
      const sortedTasks = fetchedTasks.sort((a, b) => (a.position || 0) - (b.position || 0));
      setTasks(sortedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await fetchAllCategories();
      const formattedCategories = [
        { id: "all", name: "All", icon: "fa-th-large", color: "#4a5568" },
        ...categoriesData,
      ];
      setCategories(formattedCategories);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Failed to load categories. Please try again.");
    }
  };

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
      
      const createdTask = await createTask(taskData);
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
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      await deleteTask(id);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again.");
      setTasks(prevTasks => [...prevTasks]);
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
    addTask,
    toggleTaskCompletion,
    deleteTaskById,
    reorderTasks,
    clearError
  };
}; 