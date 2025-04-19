import React, { useRef, useEffect } from "react";

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, setIsModalOpen]);

  return isModalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-[#2d2d2d] rounded-xl p-6 w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Task</h2>
          <button
            id="closeModalButton"
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              id="taskTitleInput"
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#3d3d3d] text-white"
              placeholder="Enter task title"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <div className="relative">
              <select
                id="taskCategorySelect"
                value={newTask.category_id}
                onChange={(e) =>
                  setNewTask({ ...newTask, category_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-[#3d3d3d] text-white"
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
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Due Date
              </label>
              <input
                id="taskDueDateInput"
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#3d3d3d] text-white"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Due Time
              </label>
              <input
                id="taskDueTimeInput"
                type="time"
                value={newTask.dueTime}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#3d3d3d] text-white"
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Priority
            </label>
            <div className="flex space-x-4">
              {["high", "medium", "low"].map((priority) => (
                <button
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
              placeholder="Enter task description"
              disabled={isLoading}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            id="cancelButton"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#3d3d3d] !rounded-button whitespace-nowrap"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            id="addTaskSubmitButton"
            onClick={handleAddTask}
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
              'Add Task'
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddTaskModal;
