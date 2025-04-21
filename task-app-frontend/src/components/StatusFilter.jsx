import React from 'react';

const StatusFilter = ({ activeStatus, onStatusChange }) => {
  const statuses = [
    { id: "all", name: "All", icon: "fa-tasks" },
    { id: "active", name: "Active", icon: "fa-clock" },
    { id: "completed", name: "Completed", icon: "fa-check-circle" }
  ];

  const handleStatusChange = (statusId) => {
    console.log("Status filter changing to:", statusId);
    
    // Force status to be "all" if it's null or undefined
    const newStatus = statusId || "all";
    
    onStatusChange(newStatus);
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium text-white mb-2">Status Filter</h3>
      <div className="flex flex-wrap gap-2 px-2">
        {statuses.map((status) => (
          <button
            key={status.id}
            onClick={() => handleStatusChange(status.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
              ${activeStatus === status.id 
                ? 'bg-[#caff17] text-black shadow-lg shadow-[#caff17]/20' 
                : 'bg-[#2d2d2d] text-white hover:bg-[#3d3d3d]'
              }`}
            aria-pressed={activeStatus === status.id}
            data-status={status.id}
          >
            <i className={`fas ${status.icon}`}></i>
            {status.name} 
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter; 