import React from "react";

/**
 * PriorityButton component for task priority selection
 * @param {string} priority - The priority level (high, medium, low)
 * @param {string} selectedPriority - Currently selected priority
 * @param {function} onClick - Click handler for the button
 */
const PriorityButton = ({ priority, selectedPriority, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-lg capitalize !rounded-button whitespace-nowrap transition-all duration-200 cursor-pointer ${
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

export default PriorityButton; 