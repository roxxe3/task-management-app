import React, { useState, useEffect, useMemo } from "react";
import useProgressAnimation from "../hooks/useProgressAnimation";

const TaskProgress = ({ tasks = [] }) => {
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    percentage: 0
  });
  
  // Calculate task statistics in a memoized function
  const calculatedStats = useMemo(() => {
    const completedCount = tasks.filter(task => task.completed).length;
    const totalCount = tasks.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    return {
      completed: completedCount,
      total: totalCount,
      percentage: percentage
    };
  }, [tasks]);
  
  // Use the calculated stats to update state only when they change
  useEffect(() => {
    setStats(calculatedStats);
  }, [calculatedStats]);
  
  const animatedPercentage = useProgressAnimation(stats.percentage);

  const getMotivationalMessage = (percentage) => {
    if (percentage === 0) return "Ready to start your day? Let's tackle these tasks!";
    if (percentage < 25) return "Great start! Keep up the momentum!";
    if (percentage < 50) return "You're making steady progress!";
    if (percentage < 75) return "More than halfway there, you're doing great!";
    if (percentage < 100) return "Almost there! Just a few more tasks to go!";
    return "Amazing! You've completed all tasks! 🎉";
  };

  const getProgressColor = (percentage) => {
    if (percentage < 25) return "#ff6b6b";
    if (percentage < 50) return "#ffd93d";
    if (percentage < 75) return "#6bcb77";
    return "#caff17";
  };

  const getGlowStyle = (color) => ({
    filter: `
      drop-shadow(0 0 2px ${color})
      drop-shadow(0 0 4px ${color})
    `
  });

  // Memoize the color calculations
  const progressColor = useMemo(() => getProgressColor(stats.percentage), [stats.percentage]);
  const glowStyle = useMemo(() => getGlowStyle(progressColor), [progressColor]);
  const motivationalMessage = useMemo(() => getMotivationalMessage(stats.percentage), [stats.percentage]);

  return (
    <div className="bg-[#2d2d2d] rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex-shrink-0">
          <div className="w-full h-full relative">
            <svg 
              className="w-full h-full absolute top-0 left-0 transform -rotate-90" 
              viewBox="0 0 36 36"
            >
              <circle
                cx="18"
                cy="18"
                r="15.91549431"
                fill="none"
                stroke="#4b5563"
                strokeWidth="3"
                strokeDasharray="100, 100"
                className="opacity-25"
              />
            </svg>
            
            <svg 
              className="w-full h-full absolute top-0 left-0 transform -rotate-90" 
              viewBox="0 0 36 36"
              style={glowStyle}
            >
              <circle
                cx="18"
                cy="18"
                r="15.91549431"
                fill="none"
                stroke={progressColor}
                strokeWidth="3"
                strokeDasharray={`${animatedPercentage}, 100`}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span 
                className="text-white text-2xl font-bold block"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                {Math.round(animatedPercentage)}%
              </span>
              <span className="text-xs text-gray-400 mt-1">Complete</span>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-0 sm:ml-8 lg:ml-10 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-2xl font-bold text-white mb-2 sm:mb-0">Task Progress</h3>
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <span className="text-gray-400 text-sm">
                {stats.completed}/{stats.total} Tasks
              </span>
            </div>
          </div>
          <p 
            className="text-base transition-all duration-500" 
            style={{ 
              color: progressColor,
              textShadow: `0 0 10px ${progressColor}40`
            }}
          >
            {motivationalMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskProgress);