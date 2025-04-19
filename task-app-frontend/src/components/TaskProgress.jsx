import React from "react";

const TaskProgress = ({ tasks }) => {
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const completionPercentage = Math.round(
    (completedTasksCount / tasks.length) * 100
  ) || 0;

  return (
    <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#4b5563"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#caff17"
              strokeWidth="3"
              strokeDasharray={`${completionPercentage}, 100`}
              strokeLinecap="round"
            />
            <text
              x="18"
              y="20.5"
              textAnchor="middle"
              fontSize="8"
              fill="#ffffff"
              fontWeight="bold"
            >
              {completionPercentage}%
            </text>
          </svg>
        </div>
        <div className="ml-6">
          <h3 className="text-lg font-semibold">Daily Progress</h3>
          <p className="text-gray-500">
            {completedTasksCount} of {tasks.length} tasks completed
          </p>
          <p className="text-sm mt-1" style={{ color: "#caff17" }}>
            {completionPercentage < 50
              ? "Keep going, you're making progress!"
              : completionPercentage < 100
                ? "Almost there, you're doing great!"
                : "Amazing! All tasks completed!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskProgress;