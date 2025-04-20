import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import EmailVerification from "./components/EmailVerification";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import TaskProgress from "./components/TaskProgress";
import CategoryFilter from "./components/CategoryFilter";
import TaskList from "./components/TaskList";
import AddTaskModal from "./components/AddTaskModal";
import Profile from "./components/Profile";
// Import our API services
import { fetchTasks, createTask, updateTask, deleteTask } from "./services/taskService";
import { fetchAllCategories } from "./services/categoryService";
// Import config constants
import { DEFAULT_CATEGORIES, PRIORITY_COLORS, CATEGORY_ICONS } from "./config";

// Dashboard component that contains the main task functionality
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    category_id: null,
    priority: "medium",
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get initial tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await fetchTasks();
        // Sort tasks by position
        const sortedTasks = fetchedTasks.sort((a, b) => (a.position || 0) - (b.position || 0));
        setTasks(sortedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
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
    
    loadCategories();
  }, []);

  // Handle adding a new task
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Get the highest position value
      const maxPosition = tasks.reduce((max, task) => 
        Math.max(max, task.position || 0), 0);
      
      const taskData = {
        title: newTask.title,
        category_id: newTask.category_id,
        priority: newTask.priority,
        description: newTask.description || "",
        position: maxPosition + 1, // Set position to be after the last task
      };
      
      console.log("Creating task:", taskData);
      const createdTask = await createTask(taskData);
      
      // Add the created task to the tasks state
      setTasks(prevTasks => [...prevTasks, createdTask]);
      
      // Reset form
      setNewTask({
        title: "",
        category_id: null,
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
      activeCategory === "All" || 
      categories.find(c => c.id === task.category_id)?.name === activeCategory;
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
            categories={categories.filter(cat => cat.name !== "All")}
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
          categories={categories.filter(cat => cat.name !== "All")}
          priorityColors={PRIORITY_COLORS}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, needsEmailVerification } = useAuth();
  
  if (needsEmailVerification) {
    return <Navigate to="/verify-email" replace />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  // Get auth context values
  const { isAuthenticated, needsEmailVerification } = useAuth();
  
  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route 
          path="/login" 
          element={
            needsEmailVerification ? 
              <Navigate to="/verify-email" replace /> :
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Login />
          } 
        />
        
        {/* Email verification route */}
        <Route 
          path="/verify-email" 
          element={
            needsEmailVerification ? 
              <EmailVerification /> : 
              <Navigate to="/" replace />
          } 
        />
        
        {/* Profile route - protected */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Email confirmation route with token */}
        <Route 
          path="/confirm-email/:token" 
          element={<EmailConfirmation />} 
        />
        
        {/* Main dashboard route */}
        <Route 
          path="/" 
          element={
            needsEmailVerification ? 
              <Navigate to="/verify-email" replace /> :
              isAuthenticated ? 
                <Dashboard /> : 
                <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
};

// Email confirmation component to handle verification links
const EmailConfirmation = () => {
  const { confirmEmailVerification, isLoading, error } = useAuth();
  const [verified, setVerified] = useState(false);
  const params = useParams();
  
  useEffect(() => {
    const verifyEmail = async () => {
      if (params.token) {
        const success = await confirmEmailVerification(params.token);
        setVerified(success);
      }
    };
    
    verifyEmail();
  }, [params.token]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="bg-[#2d2d2d] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-4 text-gray-300 animate-spin">
            <i className="fas fa-circle-notch text-6xl"></i>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">
            Verifying your email...
          </h3>
        </div>
      </div>
    );
  }
  
  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="bg-[#2d2d2d] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-green-500 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
          <p className="text-gray-400 mb-6">Your email has been successfully verified.</p>
          <Link 
            to="/" 
            className="px-6 py-3 rounded-lg font-medium inline-block"
            style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1a1a1a" }}>
      <div className="bg-[#2d2d2d] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
        <p className="text-gray-400 mb-6">
          {error || "We couldn't verify your email. The verification link may have expired."}
        </p>
        <Link 
          to="/login" 
          className="px-6 py-3 rounded-lg font-medium inline-block"
          style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

// Wrap the App component with AuthProvider
const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;
