import React from "react";

const TaskItem = ({ task, toggleTaskCompletion, priorityColors }) => {
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
              <span>{task.dueDate}</span>
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
          className="px-3 py-1 rounded-full text-xs bg-[#2d2d2d] text-[#ffffff]"
        >
          {task.category}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;