import React from "react";
import PriorityButton from "./PriorityButton";

/**
 * Task edit form component for creating or editing tasks
 * @param {Object} editedTask - The task data being edited
 * @param {Function} setEditedTask - Function to update the task data
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} onCancel - Cancel button handler
 * @param {Array} categories - Available categories for the task
 */
const TaskEditForm = ({ editedTask, setEditedTask, onSubmit, onCancel, categories = [] }) => (
  <div className="bg-[#171818] rounded-xl shadow-sm p-6">
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
          value={editedTask.description || ""}
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
          className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#3d3d3d] transition-colors !rounded-button whitespace-nowrap cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg !rounded-button whitespace-nowrap transition-all duration-200 cursor-pointer"
          style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(202, 255, 23, 0.4), 0 2px 4px -1px rgba(202, 255, 23, 0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#caff17";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
);

export default TaskEditForm;