import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-4 sm:mb-6">
      <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
        <i className="fas fa-search text-gray-400 text-sm sm:text-base"></i>
      </div>
      <input
        type="text"
        className="block w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 border-none rounded-xl bg-[#2d2d2d] text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#caff17] text-sm sm:text-base transition-all duration-200"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          onClick={() => setSearchQuery("")}
          title="Clear search"
        >
          <i className="fas fa-times text-sm sm:text-base"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBar;