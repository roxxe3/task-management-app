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
  const titleInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  // Focus the title input when modal opens
  useEffect(() => {
    if (isModalOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current.focus();
      }, 50);
    }
  }, [isModalOpen]);

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
      // Prevent scrolling of background content when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      // Restore scrolling when modal closes
      document.body.style.overflow = '';
    };
  }, [isModalOpen, setIsModalOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!newTask.title.trim()) {
      newErrors.title = "Title is required";
    } else if (newTask.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    
    if (!newTask.category_id) {
      newErrors.category = "Please select a category";
    }
    
    if (newTask.description && newTask.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
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
    
    // Clear category error when selection changes
    if (errors.category && categoryId) {
      setErrors(prev => ({ ...prev, category: undefined }));
    }
  };

  if (!isModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-[#171818] rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
        onKeyDown={handleKeyDown}
      >
        <h2 id="modal-title" className="text-xl font-semibold mb-4 text-white">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              value={newTask.title}
              onChange={(e) => {
                setNewTask({ ...newTask, title: e.target.value });
                // Clear title error when typing
                if (errors.title && e.target.value.trim()) {
                  setErrors(prev => ({ ...prev, title: undefined }));
                }
              }}
              className={`w-full px-3 py-2 border ${
                errors.title ? 'border-red-500' : 'border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#3d3d3d] text-white`}
              placeholder="Task title"
              disabled={isLoading}
              aria-required="true"
              aria-invalid={errors.title ? "true" : "false"}
              aria-describedby={errors.title ? "title-error" : undefined}
              maxLength={100}
            />
            {errors.title && (
              <p id="title-error" className="text-red-500 text-sm mt-1" role="alert">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="task-category" className="block text-sm font-medium text-gray-300 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="task-category"
                value={newTask.category_id || ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.category ? 'border-red-500' : 'border-gray-600'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-[#3d3d3d] text-white`}
                disabled={isLoading}
                aria-required="true"
                aria-invalid={errors.category ? "true" : "false"}
                aria-describedby={errors.category ? "category-error" : undefined}
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400" aria-hidden="true"></i>
              </div>
            </div>
            {errors.category && (
              <p id="category-error" className="text-red-500 text-sm mt-1" role="alert">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Priority
            </label>
            <div className="flex space-x-4" role="radiogroup" aria-label="Task priority">
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
                  } cursor-pointer`}
                  disabled={isLoading}
                  role="radio"
                  aria-checked={newTask.priority === priority}
                >
                  <i className={`fas fa-flag mr-2 ${newTask.priority === priority ? 'text-current' : 'text-gray-400'}`} aria-hidden="true"></i>
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="task-description"
              value={newTask.description}
              onChange={(e) => {
                setNewTask({ ...newTask, description: e.target.value });
                // Clear description error when typing
                if (errors.description) {
                  setErrors(prev => ({ ...prev, description: undefined }));
                }
              }}
              className={`w-full px-3 py-2 border ${
                errors.description ? 'border-red-500' : 'border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none bg-[#3d3d3d] text-white`}
              placeholder="Description (optional)"
              rows="2"
              disabled={isLoading}
              aria-describedby={errors.description ? "description-error" : undefined}
              maxLength={500}
            />
            {errors.description && (
              <p id="description-error" className="text-red-500 text-sm mt-1" role="alert">{errors.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {newTask.description ? `${newTask.description.length}/500 characters` : '0/500 characters'}
            </p>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#3d3d3d] transition-colors !rounded-button whitespace-nowrap cursor-pointer"
              disabled={isLoading}
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
              disabled={isLoading}
              aria-busy={isLoading ? "true" : "false"}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                <span className="flex items-center">
                  <i className="fas fa-plus mr-2"></i>
                  Add Task
                </span>
              )}
            </button>
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            <p>Press <kbd className="px-2 py-1 bg-[#3d3d3d] rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-[#3d3d3d] rounded">Enter</kbd> to submit</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
