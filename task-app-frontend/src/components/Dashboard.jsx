import React, { useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import TaskProgress from "./TaskProgress";
import CategoryFilter from "./CategoryFilter";
import TaskList from "./TaskList";
import AddTaskModal from "./AddTaskModal";
import { useTaskManagement } from "../hooks/useTaskManagement";

const Dashboard = () => {
  const {
    tasks,
    categories,
    isLoading,
    error,
    addTask,
    toggleTaskCompletion,
    deleteTaskById,
    reorderTasks,
    clearError
  } = useTaskManagement();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [newTask, setNewTask] = useState({
    title: "",
    category_id: null,
    priority: "medium",
    description: "",
  });

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
              onClick={clearError}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="mt-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-6"
          >
            Add New Task
          </button>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={toggleTaskCompletion}
              onDeleteTask={deleteTaskById}
              onReorderTasks={reorderTasks}
            />
          )}
        </div>

        {isModalOpen && (
          <AddTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddTask}
            task={newTask}
            setTask={setNewTask}
            categories={categories.filter(c => c.id !== "all")}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard; 