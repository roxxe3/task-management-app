import React, { useState, useRef, useEffect } from "react";
import { updateTask } from "../services/taskService";
import PriorityButton from "./task/PriorityButton";
import TaskEditForm from "./task/TaskEditForm";

const TaskItem = ({ task, toggleTaskCompletion = () => {}, handleDeleteTask = () => {}, onTaskUpdated, categories = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isQuickEditing, setIsQuickEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    category_id: task?.category_id || null
  });
  const quickEditInputRef = useRef(null);

  // Make sure task exists and has required properties
  if (!task || !task.id) {
    console.error("Task missing or invalid", task);
    return null;
  }

  const taskCategory = categories?.find(c => c?.id === task?.category_id);

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
      // Reset to original title
      setEditedTask(prev => ({ ...prev, title: task.title }));
    }
  };

  // Showing the edit form
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
    <div
      className={`bg-[#2d2d2d] rounded-xl p-4 mb-3 relative transition-all duration-300 task-item ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      {/* Task Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <button
            onClick={() => toggleTaskCompletion(task.id)}
            className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 transition-colors hover:border-green-400 ${
              task.completed
                ? "bg-green-500 border-green-500"
                : "border-gray-500"
            }`}
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed && (
              <i className="fas fa-check text-xs text-white flex justify-center items-center h-full"></i>
            )}
          </button>

          {isQuickEditing ? (
            <input
              type="text"
              ref={quickEditInputRef}
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              onBlur={handleQuickEditSubmit}
              onKeyDown={handleKeyDown}
              className="text-white bg-[#3d3d3d] p-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <h3
              className={`font-medium text-lg leading-tight mr-2 ${
                task.completed ? "line-through text-gray-400" : "text-white"
              }`}
              onClick={() => setIsQuickEditing(true)}
            >
              {task.title}
            </h3>
          )}
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Edit task"
          >
            <i className="fas fa-edit"></i>
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            aria-label="Delete task"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      {/* Task Details */}
      <div className="pl-8 space-y-2">
        {task.description && (
          <p className="text-gray-300 text-sm">{task.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {taskCategory && (
            <span
              className="inline-flex items-center text-xs px-2 py-1 rounded-full"
              style={getCategoryStyle()}
            >
              <i className={`fas ${taskCategory.icon} mr-1`}></i>
              {taskCategory.name}
            </span>
          )}
          
          <span
            className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
              task.priority === "high"
                ? "bg-red-500 text-white"
                : task.priority === "medium"
                ? "bg-yellow-500 text-black"
                : "bg-green-500 text-white"
            }`}
          >
            <i className="fas fa-flag mr-1"></i>
            {task.priority}
          </span>
          
          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
            <i className="far fa-clock mr-1"></i>
            {formatDate(task.created_at)}
          </span>
        </div>
      </div>
      
      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-[#1e1e1e] bg-opacity-95 z-10 flex flex-col items-center justify-center rounded-xl p-4">
          <p className="text-white mb-4 text-center">
            Are you sure you want to delete this task?
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-[#3d3d3d] text-white rounded-lg hover:bg-[#4d4d4d] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDeleteTask(task.id);
                setShowDeleteConfirm(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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