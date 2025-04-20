import React, { useState, useEffect } from "react";
import useProgressAnimation from "../hooks/useProgressAnimation";

const TaskProgress = ({ tasks }) => {
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    percentage: 0
  });
  
  const animatedPercentage = useProgressAnimation(stats.percentage);

  // Calculate stats
  useEffect(() => {
    const completedCount = tasks.filter(task => task.completed).length;
    const totalCount = tasks.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    setStats({
      completed: completedCount,
      total: totalCount,
      percentage: percentage
    });
  }, [tasks]);

  const getMotivationalMessage = (percentage) => {
    if (percentage === 0) return "Ready to start your day? Let's tackle these tasks!";
    if (percentage < 25) return "Great start! Keep up the momentum!";
    if (percentage < 50) return "You're making steady progress!";
    if (percentage < 75) return "More than halfway there, you're doing great!";
    if (percentage < 100) return "Almost there! Just a few more tasks to go!";
    return "Amazing! You've completed all tasks! 🎉";
  };

  return (
    <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto md:mx-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#4b5563"
              strokeWidth="3"
              className="opacity-25"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#caff17"
              strokeWidth="3"
              strokeDasharray={`${animatedPercentage}, 100`}
              strokeLinecap="round"
              className="transition-all duration-200 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {Math.round(animatedPercentage)}%
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-8 text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h3 className="text-xl md:text-2xl font-semibold">Progress</h3>
          </div>
          <p className="text-gray-400 mb-2">
            {stats.completed} of {stats.total} tasks completed
          </p>
          <p 
            className="text-sm md:text-base transition-all duration-300" 
            style={{ color: "#caff17" }}
          >
            {getMotivationalMessage(stats.percentage)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskProgress;