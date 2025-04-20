import React, { useRef } from "react";

const CategoryFilter = ({ categories, activeCategory, setActiveCategory, tasks }) => {
  const scrollContainerRef = useRef(null);

  const getCategoryTaskCount = (categoryName) => {
    if (categoryName === "All") {
      return tasks.length;
    }
    const category = categories.find(c => c.name === categoryName);
    return tasks.filter(task => task.category_id === category?.id).length;
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-8 relative md:px-16">
      {/* Left Arrow - Hidden on mobile */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-gray-400 hover:text-white w-8 h-8 rounded-full shadow-lg transition-all duration-200 items-center justify-center hover:scale-110"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      {/* Categories Container */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide md:overflow-x-hidden scroll-smooth"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
        }}
      >
        <div className="flex space-x-4 py-4 px-4">
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
                onClick={() => setActiveCategory(category.name)}
                title={`${category.name} (${taskCount} ${taskCount === 1 ? 'task' : 'tasks'})`}
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

      {/* Right Arrow - Hidden on mobile */}
      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-gray-400 hover:text-white w-8 h-8 rounded-full shadow-lg transition-all duration-200 items-center justify-center hover:scale-110"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default CategoryFilter;

/* Add this to your index.css file */
/*
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
*/