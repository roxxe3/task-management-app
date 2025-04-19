import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ filteredTasks, toggleTaskCompletion, priorityColors, searchQuery }) => {
  return (
    <div className="space-y-4">
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            toggleTaskCompletion={toggleTaskCompletion}
            priorityColors={priorityColors}
          />
        ))
      ) : (
        <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <i className="fas fa-tasks text-6xl"></i>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "No tasks match your search criteria."
              : "You don't have any tasks in this category yet."}
          </p>
          <button
            className="text-white px-4 py-2 rounded-lg transition-colors cursor-pointer !rounded-button whitespace-nowrap"
            style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;