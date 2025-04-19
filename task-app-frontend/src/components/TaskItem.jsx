import React from "react";

const TaskItem = ({ task, toggleTaskCompletion, priorityColors }) => {
  // Format date from API (expects ISO format or similar)
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return the original string if parsing fails
      }
      
      // Format the date
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      // Check if date is today or tomorrow
      if (date.toDateString() === today.toDateString()) {
        return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original if any error
    }
  };

  // Get category style based on category data
  const getCategoryStyle = () => {
    if (!task.category_id) {
      return {
        backgroundColor: "#2d2d2d",
        color: "#ffffff"
      };
    }
    return {
      backgroundColor: task.color || "#2d2d2d",
      color: "#ffffff"
    };
  };

  return (
    <div
      className={`bg-[#2d2d2d] rounded-xl shadow-sm p-4 transition-all duration-200 ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center">
        <button
          className="h-6 w-6 rounded-full border-2 border-indigo-500 flex items-center justify-center mr-4 cursor-pointer !rounded-button whitespace-nowrap"
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
          <h3
            className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}
          >
            {task.title}
          </h3>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <i className="far fa-clock mr-1"></i>
              <span>{formatDate(task.due_date)}</span>
            </div>
            <div className="flex items-center">
              <span
                className={`h-2.5 w-2.5 rounded-full ${priorityColors[task.priority]} mr-1`}
              ></span>
              <span className="capitalize">
                {task.priority} priority
              </span>
            </div>
          </div>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs"
          style={getCategoryStyle()}
        >
          {task.category_name || "Uncategorized"}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;