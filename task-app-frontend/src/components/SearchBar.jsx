import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-8">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i className="fas fa-search" style={{ color: "#939494" }}></i>
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-[#2d2d2d] text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;