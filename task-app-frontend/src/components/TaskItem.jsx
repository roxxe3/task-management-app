import React, { useState, useRef, useEffect } from "react";
import { updateTask } from "../services/taskService";

// Priority button component
const PriorityButton = ({ priority, selectedPriority, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-lg capitalize !rounded-button whitespace-nowrap transition-all duration-200 ${
      selectedPriority === priority
        ? priority === 'high'
          ? 'bg-red-500 text-white'
          : priority === 'medium'
            ? 'bg-yellow-500 text-black'
            : 'bg-green-500 text-white'
        : "bg-[#3d3d3d] text-gray-300 hover:bg-[#4d4d4d]"
    }`}
  >
    <i className={`fas fa-flag mr-2 ${selectedPriority === priority ? 'text-current' : 'text-gray-400'}`}></i>
    {priority}
  </button>
);

// Task edit form component
const TaskEditForm = ({ editedTask, setEditedTask, onSubmit, onCancel, categories }) => (
  <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-6">
    <form onSubmit={onSubmit} className="space-y-4">
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
            value={editedTask.category_id || ""}
            onChange={(e) => setEditedTask({ ...editedTask, category_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-[#3d3d3d] text-white"
          >
            <option value="">Select a category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
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
            <PriorityButton
              key={priority}
              priority={priority}
              selectedPriority={editedTask.priority}
              onClick={() => setEditedTask({ ...editedTask, priority })}
            />
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
          onClick={onCancel}
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

const TaskItem = ({ task, toggleTaskCompletion, handleDeleteTask, onTaskUpdated, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isQuickEditing, setIsQuickEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    category_id: task.category_id
  });
  const quickEditInputRef = useRef(null);

  const taskCategory = categories?.find(c => c.id === task.category_id);

  useEffect(() => {
    if (isQuickEditing && quickEditInputRef.current) {
      quickEditInputRef.current.focus();
    }
  }, [isQuickEditing]);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
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

  const getCategoryStyle = () => ({
    backgroundColor: taskCategory?.color || "#2d2d2d",
    color: "#ffffff"
  });

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
      <TaskEditForm
        editedTask={editedTask}
        setEditedTask={setEditedTask}
        onSubmit={handleEditSubmit}
        onCancel={() => setIsEditing(false)}
        categories={categories}
      />
    );
  }

  return (
    <div className="bg-[#2d2d2d] rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center">
          {/* Checkbox and Title */}
          <div className="flex-1 flex items-start gap-3 min-w-0">
            <button
              onClick={() => toggleTaskCompletion(task.id)}
              className="flex-shrink-0 mt-1 sm:mt-0"
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'
              }`}>
                {task.completed && <i className="fas fa-check text-white text-xs"></i>}
              </div>
            </button>

            {isQuickEditing ? (
              <input
                ref={quickEditInputRef}
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                onBlur={handleQuickEditSubmit}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-[#3d3d3d] text-white px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0"
              />
            ) : (
              <div 
                onClick={() => setIsQuickEditing(true)}
                className="flex-1 cursor-pointer min-w-0"
              >
                <h3 className={`text-lg font-medium truncate ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Task Metadata - Different layouts for mobile and desktop */}
          <div className="hidden sm:flex items-center gap-4 ml-4">
            {/* Desktop layout */}
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              task.priority === 'high' ? 'bg-red-500 text-white' :
              task.priority === 'medium' ? 'bg-yellow-500 text-black' :
              'bg-green-500 text-white'
            }`}>
              <i className="fas fa-flag mr-2"></i>
              {task.priority}
            </span>
            {taskCategory && (
              <span
                className="px-4 py-1.5 rounded-lg text-sm font-medium"
                style={getCategoryStyle()}
              >
                <i className={`fas ${taskCategory.icon || 'fa-folder'} mr-2`}></i>
                {taskCategory.name}
              </span>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-[#3d3d3d] rounded-lg transition-colors"
              >
                <i className="fas fa-edit text-gray-400"></i>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 hover:bg-[#3d3d3d] rounded-lg transition-colors"
              >
                <i className="fas fa-trash text-gray-400"></i>
              </button>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="sm:hidden mt-3 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {taskCategory && (
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={getCategoryStyle()}
                >
                  <i className={`fas ${taskCategory.icon || 'fa-folder'} mr-2`}></i>
                  {taskCategory.name}
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                task.priority === 'high' ? 'bg-red-500 text-white' :
                task.priority === 'medium' ? 'bg-yellow-500 text-black' :
                'bg-green-500 text-white'
              }`}>
                <i className="fas fa-flag mr-2"></i>
                {task.priority}
              </span>
            </div>
            <div className="flex items-center gap-2 border-t pt-3">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-[#3d3d3d] rounded-lg transition-colors"
              >
                <i className="fas fa-edit text-gray-400"></i>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 hover:bg-[#3d3d3d] rounded-lg transition-colors"
              >
                <i className="fas fa-trash text-gray-400"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Created/Updated Date */}
        <div className="mt-3 text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <i className="far fa-calendar mr-1"></i>
              <span>Created: {formatDate(task.created_at)}</span>
            </div>
            {task.updated_at && task.updated_at !== task.created_at && (
              <div className="flex items-center">
                <i className="far fa-clock mr-1"></i>
                <span>Updated: {formatDate(task.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="border-t border-gray-700 p-4 bg-[#262626]">
          <p className="text-gray-300 mb-4">Are you sure you want to delete this task?</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-sm text-gray-300 hover:bg-[#3d3d3d] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDeleteTask(task.id);
                setShowDeleteConfirm(false);
              }}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;