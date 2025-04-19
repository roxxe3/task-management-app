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

  return isModalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="bg-[#2d2d2d] rounded-xl p-6 w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Task</h2>
          <button
            type="button"
            id="closeModalButton"
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-400 transition-colors"
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="taskTitleInput"
              type="text"
              value={newTask.title}
              onChange={(e) => {
                setNewTask({ ...newTask, title: e.target.value });
                if (errors.title) {
                  setErrors({ ...errors, title: null });
                }
              }}
              className={`w-full px-3 py-2 border ${
                errors.title ? 'border-red-500' : 'border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#3d3d3d] text-white`}
              placeholder="Enter task title"
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
                id="taskCategorySelect"
                value={newTask.category_id}
                onChange={(e) => {
                  setNewTask({ ...newTask, category_id: e.target.value });
                  if (errors.category) {
                    setErrors({ ...errors, category: null });
                  }
                }}
                className={`w-full px-3 py-2 border ${
                  errors.category ? 'border-red-500' : 'border-gray-600'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-[#3d3d3d] text-white`}
                disabled={isLoading}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name || category.id}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400"></i>
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
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
                  id={`priority${priority}Button`}
                  onClick={() => setNewTask({ ...newTask, priority })}
                  className={`px-4 py-2 rounded-lg capitalize !rounded-button whitespace-nowrap ${
                    newTask.priority === priority
                      ? `${priorityColors[priority]} text-white`
                      : "bg-gray-100 text-gray-700"
                  }`}
                  disabled={isLoading}
                >
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
              id="taskDescriptionTextarea"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none bg-[#3d3d3d] text-white"
              placeholder="Enter task description"
              disabled={isLoading}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            id="cancelButton"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#3d3d3d] transition-colors !rounded-button whitespace-nowrap"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            id="addTaskSubmitButton"
            className="px-4 py-2 rounded-lg !rounded-button whitespace-nowrap"
            style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch fa-spin mr-2"></i>
                Adding...
              </>
            ) : (
              <>
                Add Task
                <span className="ml-2 text-xs opacity-75">(Ctrl + Enter)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  ) : null;
};

export default AddTaskModal;
