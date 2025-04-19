import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import TaskProgress from "./components/TaskProgress";
import CategoryFilter from "./components/CategoryFilter";
import TaskList from "./components/TaskList";
import AddTaskModal from "./components/AddTaskModal";

// Import Font Awesome CSS
const App = () => {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    category: "Personal",
    dueDate: "",
    dueTime: "",
    priority: "medium",
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete project proposal",
      category: "Work",
      completed: false,
      dueDate: "Today, 5:00 PM",
      priority: "high",
    },
    {
      id: 2,
      title: "Buy groceries for dinner",
      category: "Shopping",
      completed: false,
      dueDate: "Today, 7:00 PM",
      priority: "medium",
    },
    {
      id: 3,
      title: "Schedule dentist appointment",
      category: "Personal",
      completed: true,
      dueDate: "Tomorrow, 10:00 AM",
      priority: "low",
    },
    {
      id: 4,
      title: "Review quarterly reports",
      category: "Work",
      completed: false,
      dueDate: "Apr 21, 2:00 PM",
      priority: "high",
    },
    {
      id: 5,
      title: "Prepare presentation slides",
      category: "Work",
      completed: false,
      dueDate: "Apr 22, 9:00 AM",
      priority: "medium",
    },
    {
      id: 6,
      title: "Call mom for birthday wishes",
      category: "Personal",
      completed: false,
      dueDate: "Apr 23, 12:00 PM",
      priority: "high",
    },
    {
      id: 7,
      title: "Pay electricity bill",
      category: "Personal",
      completed: false,
      dueDate: "Apr 25, 11:59 PM",
      priority: "medium",
    },
  ]);

  const categories = [
    { id: "All", icon: "fa-border-all", color: "bg-[#2d2d2d] text-[#ffffff]" },
    { id: "Personal", icon: "fa-user", color: "bg-[#2d2d2d] text-[#ffffff]" },
    { id: "Work", icon: "fa-briefcase", color: "bg-[#2d2d2d] text-[#ffffff]" },
    {
      id: "Shopping",
      icon: "fa-shopping-cart",
      color: "bg-[#2d2d2d] text-[#ffffff]",
    },
    {
      id: "Health",
      icon: "fa-heartbeat",
      color: "bg-[#2d2d2d] text-[#ffffff]",
    },
    {
      id: "Finance",
      icon: "fa-money-bill-wave",
      color: "bg-[#2d2d2d] text-[#ffffff]",
    },
  ];

  const priorityColors = {
    high: "bg-[#caff17]",
    medium: "bg-[#939494]",
    low: "bg-[#4f5251]",
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const combinedDateTime = `${newTask.dueDate} ${newTask.dueTime}`;
    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      category: newTask.category,
      completed: false,
      dueDate: combinedDateTime,
      priority: newTask.priority,
      description: newTask.description,
    };
    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      category: "Personal",
      dueDate: "",
      dueTime: "",
      priority: "medium",
      description: "",
    });
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory =
      activeCategory === "All" || task.category === activeCategory;
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Header />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <TaskProgress tasks={tasks} />
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        <TaskList 
          filteredTasks={filteredTasks} 
          toggleTaskCompletion={toggleTaskCompletion} 
          priorityColors={priorityColors}
          searchQuery={searchQuery}
        />
        
        {/* Add Task Button */}
        <button
          id="addTaskButton"
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer !rounded-button whitespace-nowrap"
          style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
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
          categories={categories}
          priorityColors={priorityColors}
        />
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
