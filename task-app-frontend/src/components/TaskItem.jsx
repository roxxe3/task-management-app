import React, { useState, useRef, useEffect } from "react";
import { updateTask } from "../services/taskService";

const TaskItem = ({ task, toggleTaskCompletion, handleDeleteTask, priorityColors, onTaskUpdated, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isQuickEditing, setIsQuickEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    category_name: task.category_name,
    category_color: task.category_color,
    category_icon: task.category_icon
  });
  const quickEditInputRef = useRef(null);

  useEffect(() => {
    if (isQuickEditing && quickEditInputRef.current) {
      quickEditInputRef.current.focus();
    }
  }, [isQuickEditing]);

  // Format date from API (expects ISO format or similar)
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Get category style based on category data
  const getCategoryStyle = () => {
    if (!task.category_name || !task.category_color) {
      return {
        backgroundColor: "#2d2d2d",
        color: "#ffffff"
      };
    }
    return {
      backgroundColor: task.category_color || "#2d2d2d",
      color: "#ffffff"
    };
  };

  const handleCategoryChange = (categoryName) => {
    if (!categoryName) {
      setEditedTask({
        ...editedTask,
        category_name: null,
        category_color: null,
        category_icon: null
      });
      return;
    }

    // Find the selected category from the categories list
    const selectedCategory = categories.find(c => c.category_name === categoryName);
    if (selectedCategory) {
      setEditedTask({
        ...editedTask,
        category_name: selectedCategory.category_name,
        category_color: selectedCategory.category_color,
        category_icon: selectedCategory.category_icon
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = await updateTask(task.id, editedTask);
      setIsEditing(false);
      if (onTaskUpdated) {
        onTaskUpdated(updatedTask);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleQuickEditSubmit = async () => {
    if (editedTask.title.trim() === "") return;
    try {
      const updatedTask = await updateTask(task.id, { title: editedTask.title });
      setIsQuickEditing(false);
      if (onTaskUpdated) {
        onTaskUpdated(updatedTask);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleQuickEditSubmit();
    } else if (e.key === 'Escape') {
      setIsQuickEditing(false);
      setEditedTask(prev => ({ ...prev, title: task.title }));
    }
  };

  if (isEditing) {
    return (
      <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-6">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#3d3d3d] text-white"
              placeholder="Task title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={editedTask.category_name || ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-[#3d3d3d] text-white"
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.category_name} value={category.category_name}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Priority
            </label>
            <div className="flex space-x-4">
              {["high", "medium", "low"].map((priority) => (
                <button
                  type="button"
                  key={priority}
                  onClick={() => setEditedTask({ ...editedTask, priority })}
                  className={`px-4 py-2 rounded-lg capitalize !rounded-button whitespace-nowrap transition-all duration-200 ${
                    editedTask.priority === priority
                      ? priority === 'high'
                        ? 'bg-red-500 text-white'
                        : priority === 'medium'
                          ? 'bg-yellow-500 text-black'
                          : 'bg-green-500 text-white'
                      : "bg-[#3d3d3d] text-gray-300 hover:bg-[#4d4d4d]"
                  }`}
                >
                  <i className={`fas fa-flag mr-2 ${editedTask.priority === priority ? 'text-current' : 'text-gray-400'}`}></i>
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none bg-[#3d3d3d] text-white"
              placeholder="Description (optional)"
              rows="2"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#3d3d3d] transition-colors !rounded-button whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg !rounded-button whitespace-nowrap"
              style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`bg-[#2d2d2d] rounded-xl shadow-sm p-4 transition-all duration-200 hover:bg-[#333333] ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center">
        <button
          className="h-6 w-6 rounded-full border-2 border-indigo-500 flex items-center justify-center mr-4 cursor-pointer hover:bg-indigo-500/10 transition-colors !rounded-button whitespace-nowrap"
          onClick={() => toggleTaskCompletion(task.id)}
        >
          {task.completed && (
            <i
              className="fas fa-check text-xs"
              style={{ color: "#caff17" }}
            ></i>
          )}
        </button>
        <div className="flex-1">
          {isQuickEditing ? (
            <input
              ref={quickEditInputRef}
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              onBlur={handleQuickEditSubmit}
              onKeyDown={handleKeyDown}
              className="w-full bg-[#3d3d3d] text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[#caff17]"
            />
          ) : (
            <h3
              className={`font-medium cursor-pointer hover:text-[#caff17] ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
              onClick={() => !task.completed && setIsQuickEditing(true)}
            >
              {task.title}
            </h3>
          )}
          {task.description && (
            <p className="text-sm text-gray-400 mt-1">{task.description}</p>
          )}
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <i className="far fa-calendar mr-1"></i>
              <span>Created: {formatDate(task.created_at)}</span>
            </div>
            <div className="flex items-center">
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-medium mr-2 ${
                  task.priority === 'high' 
                    ? 'bg-red-500 text-white' 
                    : task.priority === 'medium'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-green-500 text-white'
                }`}
              >
                <i className="fas fa-flag mr-1"></i>
                {task.priority}
              </span>
            </div>
          </div>
        </div>
        <div
          className={`px-4 py-1.5 rounded-lg text-sm font-medium mr-3 transition-all duration-200 ${
            task.completed ? 'opacity-60' : ''
          }`}
          style={getCategoryStyle()}
        >
          <i className={`fas ${task.category_icon || 'fa-folder'} mr-2`}></i>
          {task.category_name || "Uncategorized"}
        </div>
        <div className="flex gap-2">
          <button
            className="text-gray-500 hover:text-blue-500 transition-colors p-2 rounded hover:bg-[#3d3d3d]"
            onClick={() => setIsEditing(true)}
            title="Edit task"
          >
            <i className="fas fa-edit"></i>
          </button>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1">
              <button
                className="text-red-500 hover:text-red-600 transition-colors p-2 rounded hover:bg-[#3d3d3d]"
                onClick={() => handleDeleteTask(task.id)}
                title="Confirm delete"
              >
                <i className="fas fa-check"></i>
              </button>
              <button
                className="text-gray-500 hover:text-gray-400 transition-colors p-2 rounded hover:bg-[#3d3d3d]"
                onClick={() => setShowDeleteConfirm(false)}
                title="Cancel delete"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ) : (
            <button
              className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded hover:bg-[#3d3d3d]"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete task"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;