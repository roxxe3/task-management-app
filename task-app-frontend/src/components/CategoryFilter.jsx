import React from "react";

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-4 pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer !rounded-button transition-all duration-200 ${
              activeCategory === category.id
                ? "bg-[#caff17] text-black"
                : "bg-[#2d2d2d] text-gray-400 hover:bg-[#3d3d3d]"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <i className={`fas ${category.icon} ${activeCategory === category.id ? "text-black" : ""}`}></i>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;