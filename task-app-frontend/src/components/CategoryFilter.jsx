import React from "react";

const CategoryFilter = ({ categories, activeCategory, onCategoryChange, tasks = [] }) => {
  const getCategoryTaskCount = (categoryName) => {
    if (categoryName === "All") {
      return tasks.length;
    }
    const category = categories.find(c => c.name === categoryName);
    return tasks.filter(task => task.category_id === category?.id).length;
  };

  const handleCategoryChange = (categoryName) => {
    onCategoryChange(categoryName || "All");
  };

  return (
    <div className="mb-1 sm:mb-2">
      <h3 className="text-lg font-medium text-white mb-2 sm:mb-3 px-2 sm:px-4">Categories</h3>
      
      <div className="px-2 sm:px-4">
        <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
          {categories.map((category) => {
            const taskCount = getCategoryTaskCount(category.name);
            const isActive = activeCategory === category.name;
            return (
              <button
                key={category.id}
                className={`flex items-center text-sm sm:text-base space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg whitespace-nowrap cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                  isActive
                    ? "shadow-lg"
                    : "bg-[#2d2d2d] text-gray-400 hover:bg-[#3d3d3d] hover:text-white"
                }`}
                style={{
                  backgroundColor: isActive ? "#caff17" : "",
                  color: isActive ? "#0d0d0d" : ""
                }}
                onMouseOver={(e) => {
                  if (isActive) {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(202, 255, 23, 0.4), 0 2px 4px -1px rgba(202, 255, 23, 0.2)";
                  }
                }}
                onMouseOut={(e) => {
                  if (isActive) {
                    e.currentTarget.style.backgroundColor = "#caff17";
                    e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(202, 255, 23, 0.1), 0 4px 6px -2px rgba(202, 255, 23, 0.05)";
                  }
                }}
                onClick={() => handleCategoryChange(category.name)}
                title={`${category.name} (${taskCount} ${taskCount === 1 ? 'task' : 'tasks'})`}
                data-category={category.name}
                aria-pressed={isActive}
              >
                <i className={`fas ${category.icon} ${
                  isActive ? 'text-black' : 'text-gray-400'
                }`}></i>
                <span>{category.name}</span>
                <span className={`ml-1 sm:ml-2 text-xs sm:text-sm px-1.5 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-black/10' 
                    : 'bg-[#3d3d3d]'
                }`}>
                  {taskCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;