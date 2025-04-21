import React from 'react';

const StatusFilter = ({ activeStatus, onStatusChange }) => {
  const statuses = [
    { id: "all", name: "All", icon: "fa-tasks" },
    { id: "active", name: "Active", icon: "fa-clock" },
    { id: "completed", name: "Completed", icon: "fa-check-circle" }
  ];

  const handleStatusChange = (statusId) => {
    // Force status to be "all" if it's null or undefined
    const newStatus = statusId || "all";
    
    onStatusChange(newStatus);
  };

  return (
    <div className="mb-1 sm:mb-2">
      <h3 className="text-lg font-medium text-white mb-2 sm:mb-3 px-2 sm:px-4">Status Filter</h3>
      <div className="px-2 sm:px-4">
        <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
          {statuses.map((status) => {
            const isActive = activeStatus === status.id;
            return (
              <button
                key={status.id}
                onClick={() => handleStatusChange(status.id)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 cursor-pointer
                  ${isActive 
                    ? 'shadow-lg' 
                    : 'bg-[#2d2d2d] text-white hover:bg-[#3d3d3d]'
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
                aria-pressed={isActive}
                data-status={status.id}
              >
                <i className={`fas ${status.icon}`}></i>
                {status.name} 
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusFilter; 