import React, { useState, useEffect } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import TaskProgress from "./TaskProgress";
import CategoryFilter from "./CategoryFilter";
import StatusFilter from "./StatusFilter";
import TaskList from "./TaskList";
import AddTaskModal from "./AddTaskModal";
import { useTaskManagement } from "../hooks/useTaskManagement";

const Dashboard = () => {
  const {
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
  } = useTaskManagement();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    category_id: null,
    priority: "medium",
    description: "",
  });

  console.log("Dashboard rendering with:", {
    tasksCount: tasks.length,
    categories,
    activeCategory,
    activeStatus,
    filters
  });

  // Update filters when search, category or status changes
  useEffect(() => {
    const newFilters = {};
    if (searchQuery) {
      newFilters.search = searchQuery;
    }
    
    if (activeCategory && activeCategory !== "All") {
      const category = categories.find(c => c.name === activeCategory);
      if (category) {
        newFilters.category_id = category.id;
      }
    } else {
      // Explicitly set category_id to null when "All" is selected
      newFilters.category_id = null;
    }
    
    if (activeStatus && activeStatus !== "all") {
      newFilters.status = activeStatus;
    } else {
      // Explicitly set status to null when "all" is selected
      newFilters.status = null;
    }
    
    console.log("Setting new filters:", newFilters);
    updateFilters(newFilters);
  }, [searchQuery, activeCategory, activeStatus, categories, updateFilters]);

  // Handle adding a new task
  const handleAddTask = async () => {
    try {
      await addTask(newTask);
      // Reset form
      setNewTask({
        title: "",
        category_id: null,
        priority: "medium",
        description: "",
      });
      setIsModalOpen(false);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Local filtering for tasks (frontend filtering)
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      // Filter by category
      const matchesCategory =
        activeCategory === "All" || 
        categories.find(c => c.id === task.category_id)?.name === activeCategory;
      
      // Filter by search query
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = 
        activeStatus === "all" || 
        (activeStatus === "completed" && task.completed) ||
        (activeStatus === "active" && !task.completed);
      
      return matchesCategory && matchesSearch && matchesStatus;
    });
  };

  const filteredTasks = getFilteredTasks();
  console.log("Filtered tasks:", filteredTasks.length, "out of", tasks.length);
  
  const handleStatusChange = (status) => {
    console.log("Status changed to:", status);
    setActiveStatus(status);
  };
  
  const handleCategoryChange = (category) => {
    console.log("Category changed to:", category);
    setActiveCategory(category);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Header />
        <div className="space-y-4 sm:space-y-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <TaskProgress tasks={filteredTasks} />
          
          {error && (
            <div className="bg-red-500 text-white p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              {error}
              <button 
                className="float-right" 
                onClick={clearError}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          <div className="flex flex-col space-y-4">
            
            <CategoryFilter 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              tasks={tasks}
            />
            <StatusFilter 
              activeStatus={activeStatus}
              onStatusChange={handleStatusChange}
            />
          </div>

          <div className="mt-4 sm:mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-[#caff17] hover:bg-[#b5e615] text-black px-4 py-2 rounded-lg mb-4 sm:mb-6 flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Add New Task
            </button>

            {isLoading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#caff17] mx-auto"></div>
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks || []}
                onToggleComplete={toggleTaskCompletion}
                onDeleteTask={deleteTaskById}
                onReorderTasks={reorderTasks}
                categories={categories.filter(c => c.id !== "all")}
                searchQuery={searchQuery}
                onAddTask={() => setIsModalOpen(true)}
              />
            )}
          </div>
        </div>

        {isModalOpen && (
          <AddTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            newTask={newTask}
            setNewTask={setNewTask}
            handleAddTask={handleAddTask}
            categories={categories.filter(c => c.id !== "all")}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;