import React, { useRef, useEffect, useState } from "react";

const AddTaskModal = ({
  isModalOpen,
  setIsModalOpen,
  newTask,
  setNewTask,
  handleAddTask,
  categories,
  priorityColors,
  isLoading,
}) => {
  const modalRef = useRef(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen, setIsModalOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!newTask.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!newTask.category_id) {
      newErrors.category = "Please select a category";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddTask();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setNewTask({
      ...newTask,
      category_id: categoryId || null
    });
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-[#2d2d2d] rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
      >
        <h2 className="text-xl font-semibold mb-4 text-white">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className={`w-full px-3 py-2 border ${
                errors.title ? 'border-red-500' : 'border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#3d3d3d] text-white`}
              placeholder="Task title"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={newTask.category_id || ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.category ? 'border-red-500' : 'border-gray-600'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-[#3d3d3d] text-white`}
                disabled={isLoading}
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
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
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
                  onClick={() => setNewTask({ ...newTask, priority })}
                  className={`px-4 py-2 rounded-lg capitalize !rounded-button whitespace-nowrap transition-all duration-200 ${
                    newTask.priority === priority
                      ? priority === 'high'
                        ? 'bg-red-500 text-white'
                        : priority === 'medium'
                          ? 'bg-yellow-500 text-black'
                          : 'bg-green-500 text-white'
                      : "bg-[#3d3d3d] text-gray-300 hover:bg-[#4d4d4d]"
                  }`}
                  disabled={isLoading}
                >
                  <i className={`fas fa-flag mr-2 ${newTask.priority === priority ? 'text-current' : 'text-gray-400'}`}></i>
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
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none bg-[#3d3d3d] text-white"
              placeholder="Description (optional)"
              rows="2"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#3d3d3d] transition-colors !rounded-button whitespace-nowrap"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg !rounded-button whitespace-nowrap"
              style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Adding...
                </span>
              ) : (
                'Add Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
