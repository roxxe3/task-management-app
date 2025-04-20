import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import TaskProgress from "./components/TaskProgress";
import CategoryFilter from "./components/CategoryFilter";
import TaskList from "./components/TaskList";
import AddTaskModal from "./components/AddTaskModal";
import Profile from "./components/Profile";
// Import our API services
import { fetchTasks, createTask, updateTask, deleteTask } from "./services/taskService";
import { fetchCategories } from "./services/categoryService";
// Import config constants
import { DEFAULT_CATEGORIES, PRIORITY_COLORS, CATEGORY_ICONS } from "./config";

// Dashboard component that contains the main task functionality
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    category_id: "",
    priority: "medium",
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch categories first
        const categoriesData = await fetchCategories();
        console.log("Fetched categories:", categoriesData);
        
        // Format categories with proper icons
        const formattedCategories = [
          DEFAULT_CATEGORIES[0],
          ...categoriesData.map(category => ({
            id: category.id,
            name: category.name,
            icon: CATEGORY_ICONS[category.name] || "fa-folder", 
            color: category.color || "#2d2d2d"
          }))
        ];
        setCategories(formattedCategories);
        
        // Then fetch tasks
        const filters = activeCategory !== "All" ? { category: activeCategory } : {};
        const tasksData = await fetchTasks(filters);
        console.log("Fetched tasks:", tasksData);
        
        // Enhance tasks with category data
        const enhancedTasks = tasksData.map(task => {
          const taskCategory = formattedCategories.find(c => c.id === task.category_id);
          return {
            ...task,
            color: taskCategory?.color,
            category_name: taskCategory?.name || task.category_name
          };
        });
        
        setTasks(enhancedTasks);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [activeCategory]);

  // Handle adding a new task
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      setIsLoading(true);
      
      const taskData = {
        title: newTask.title,
        category_id: newTask.category_id || null,
        priority: newTask.priority,
        description: newTask.description || "",
        completed: false
      };
      
      console.log("Creating task:", taskData);
      const createdTask = await createTask(taskData);
      
      // Enhance the created task with category data before adding to state
      const taskCategory = categories.find(c => c.id === createdTask.category_id);
      const enhancedTask = {
        ...createdTask,
        color: taskCategory?.color,
        category_name: taskCategory?.name
      };
      
      setTasks(prevTasks => [...prevTasks, enhancedTask]);
      
      // Reset form
      setNewTask({
        title: "",
        category_id: "",
        priority: "medium",
        description: "",
      });
      
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle toggling task completion
  const toggleTaskCompletion = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;
      
      // Optimistically update UI
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      
      // Then update backend
      await updateTask(id, { completed: !taskToUpdate.completed });
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task. Please try again.");
      // Revert the UI change on error
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, completed: task.completed } : task
        )
      );
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (id) => {
    try {
      const taskToDelete = tasks.find(task => task.id === id);
      if (!taskToDelete) return;
      
      // Optimistically update UI
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      
      // Then delete from backend
      await deleteTask(id);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again.");
      // Revert the UI change on error
      setTasks(prevTasks => [...prevTasks]);
    }
  };

  // Handle reordering tasks
  const handleReorderTasks = (reorderedTasks) => {
    setTasks(reorderedTasks);
  };

  // Filter tasks based on category and search query
  const filteredTasks = tasks.filter((task) => {
    const matchesCategory =
      activeCategory === "All" || task.category_id === activeCategory;
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Header />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <TaskProgress tasks={tasks} />
        
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {error}
            <button 
              className="float-right" 
              onClick={() => setError(null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
          tasks={tasks}
        />
        
        {isLoading ? (
          <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300 animate-spin">
              <i className="fas fa-circle-notch text-6xl"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              Loading your tasks...
            </h3>
          </div>
        ) : (
          <TaskList 
            filteredTasks={filteredTasks} 
            toggleTaskCompletion={toggleTaskCompletion}
            handleDeleteTask={handleDeleteTask}
            priorityColors={PRIORITY_COLORS}
            searchQuery={searchQuery}
            onAddTask={() => setIsModalOpen(true)}
            onReorderTasks={handleReorderTasks}
            categories={categories.filter(cat => cat.id !== "All")}
          />
        )}
        
        {/* Add Task Button */}
        <button
          id="addTaskButton"
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer !rounded-button whitespace-nowrap"
          style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
          disabled={isLoading}
        >
          <i className="fas fa-plus text-xl"></i>
        </button>
        
        {/* Add Task Modal */}
        <AddTaskModal 
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          newTask={newTask}
          setNewTask={setNewTask}
          handleAddTask={handleAddTask}
          categories={categories.filter(cat => cat.id !== "All")}
          priorityColors={PRIORITY_COLORS}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

// Wrap the App component with AuthProvider
const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;
