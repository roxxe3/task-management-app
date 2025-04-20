import React from "react";

const CategoryFilter = ({ categories, activeCategory, setActiveCategory, tasks }) => {
  const getCategoryTaskCount = (categoryName) => {
    if (categoryName === "All") {
      return tasks.length;
    }
    const category = categories.find(c => c.name === categoryName);
    return tasks.filter(task => task.category_id === category?.id).length;
  };

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-4 pb-2">
        {categories.map((category) => {
          const taskCount = getCategoryTaskCount(category.name);
          return (
            <button
              key={category.id}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer !rounded-button transition-all duration-200 group relative ${
                activeCategory === category.name
                  ? "bg-[#caff17] text-black"
                  : "bg-[#2d2d2d] text-gray-400 hover:bg-[#3d3d3d]"
              }`}
              onClick={() => setActiveCategory(category.name)}
              title={`${category.name} (${taskCount} ${taskCount === 1 ? 'task' : 'tasks'})`}
            >
              <i className={`fas ${category.icon} ${
                activeCategory === category.name ? 'text-black' : 'text-gray-400'
              }`}></i>
              <span>{category.name}</span>
              <span className="ml-2 text-sm">({taskCount})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;