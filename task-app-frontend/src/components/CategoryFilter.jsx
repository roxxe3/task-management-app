import React from "react";

const CategoryFilter = ({ categories, activeCategory, setActiveCategory, tasks }) => {
  const getCategoryTaskCount = (categoryId) => {
    if (categoryId === "All") {
      return tasks.length;
    }
    return tasks.filter(task => task.category_id === categoryId).length;
  };

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-4 pb-2">
        {categories.map((category) => {
          const taskCount = getCategoryTaskCount(category.id);
          return (
            <button
              key={category.id}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer !rounded-button transition-all duration-200 group relative ${
                activeCategory === category.id
                  ? "bg-[#caff17] text-black"
                  : "bg-[#2d2d2d] text-gray-400 hover:bg-[#3d3d3d]"
              }`}
              onClick={() => setActiveCategory(category.id)}
              title={`${category.name} (${taskCount} ${taskCount === 1 ? 'task' : 'tasks'})`}
            >
              <i className={`fas ${category.icon} ${activeCategory === category.id ? "text-black" : ""}`}></i>
              <span className="max-w-[150px] truncate">{category.name}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeCategory === category.id
                  ? "bg-black text-white"
                  : "bg-[#3d3d3d] text-gray-400"
              }`}>
                {taskCount}
              </span>
              {/* Tooltip for truncated text */}
              <span className="absolute left-1/2 -top-10 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-normal max-w-xs text-center">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;