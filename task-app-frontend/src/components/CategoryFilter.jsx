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
    console.log("Category filter changing to:", categoryName);
    onCategoryChange(categoryName || "All");
  };

  return (
    <div className="mb-8 relative">
      <h3 className="text-lg font-medium text-white mb-2 ml-4">Categories</h3>
      
      {/* Categories Container - No more scrollable and no gradient mask */}
      <div className="px-4">
        <div className="flex flex-wrap gap-3 py-4">
          {categories.map((category) => {
            const taskCount = getCategoryTaskCount(category.name);
            return (
              <button
                key={category.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                  activeCategory === category.name
                    ? "bg-[#caff17] text-black shadow-lg shadow-[#caff17]/20"
                    : "bg-[#2d2d2d] text-gray-400 hover:bg-[#3d3d3d] hover:text-white"
                }`}
                onClick={() => handleCategoryChange(category.name)}
                title={`${category.name} (${taskCount} ${taskCount === 1 ? 'task' : 'tasks'})`}
                data-category={category.name}
                aria-pressed={activeCategory === category.name}
              >
                <i className={`fas ${category.icon} ${
                  activeCategory === category.name ? 'text-black' : 'text-gray-400'
                }`}></i>
                <span>{category.name}</span>
                <span className={`ml-2 text-sm px-2 py-0.5 rounded-full ${
                  activeCategory === category.name 
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