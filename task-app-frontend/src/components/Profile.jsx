import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import * as echarts from "echarts";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    timezone: "America/New_York",
    language: "English",
    lastLogin: "April 18, 2025, 10:23 AM",
    notifications: {
      email: true,
      push: true,
      taskReminders: true,
      weeklyReport: false,
    },
  });

  const fileInputRef = useRef(null);
  const completionChartRef = useRef(null);
  const tasksByPriorityChartRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleToggleChange = (setting) => {
    setUserData({
      ...userData,
      notifications: {
        ...userData.notifications,
        [setting]: !userData.notifications[setting],
      },
    });
  };

  useEffect(() => {
    if (completionChartRef.current) {
      const chart = echarts.init(completionChartRef.current);
      const option = {
        animation: false,
        tooltip: {
          trigger: "item",
        },
        color: ["#caff17", "#2d2d2d"],
        series: [
          {
            name: "Task Completion",
            type: "pie",
            radius: ["60%", "80%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 78, name: "Completed" },
              { value: 22, name: "Remaining" },
            ],
          },
        ],
      };
      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (tasksByPriorityChartRef.current) {
      const chart = echarts.init(tasksByPriorityChartRef.current);
      const option = {
        animation: false,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["High", "Medium", "Low"],
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: "#4b5563",
              },
            },
            axisLabel: {
              color: "#9ca3af",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#4b5563",
              },
            },
            axisLabel: {
              color: "#9ca3af",
            },
            splitLine: {
              lineStyle: {
                color: "#374151",
              },
            },
          },
        ],
        series: [
          {
            name: "Tasks",
            type: "bar",
            barWidth: "60%",
            data: [
              {
                value: 5,
                itemStyle: { color: "#caff17" },
              },
              {
                value: 8,
                itemStyle: { color: "#939494" },
              },
              {
                value: 3,
                itemStyle: { color: "#4f5251" },
              },
            ],
          },
        ],
      };
      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, []);

  const recentActivities = [
    {
      id: 1,
      title: "Completed project proposal",
      date: "April 19, 2025",
      category: "Work",
      priority: "high",
    },
    {
      id: 2,
      title: "Scheduled dentist appointment",
      date: "April 18, 2025",
      category: "Personal",
      priority: "medium",
    },
    {
      id: 3,
      title: "Paid electricity bill",
      date: "April 17, 2025",
      category: "Finance",
      priority: "high",
    },
    {
      id: 4,
      title: "Bought groceries for dinner",
      date: "April 16, 2025",
      category: "Shopping",
      priority: "low",
    },
    {
      id: 5,
      title: "Reviewed quarterly reports",
      date: "April 15, 2025",
      category: "Work",
      priority: "medium",
    },
  ];

  const priorityColors = {
    high: "bg-[#caff17]",
    medium: "bg-[#939494]",
    low: "bg-[#4f5251]",
  };

  const categoryIcons = {
    Work: "fa-briefcase",
    Personal: "fa-user",
    Finance: "fa-money-bill-wave",
    Shopping: "fa-shopping-cart",
    Health: "fa-heartbeat",
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="flex items-center mb-8">
          <Link
            to="/"
            className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Tasks</span>
          </Link>
          <h1 className="text-3xl font-bold ml-auto mr-auto">My Profile</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </header>

        {/* Profile Header Section */}
        <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-8 mb-8 text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-[#3d3d3d] mx-auto">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <i className="fas fa-user text-5xl"></i>
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-[#caff17] text-black w-10 h-10 rounded-full flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap"
            >
              <i className="fas fa-camera"></i>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
          </div>
          <h2 className="text-2xl font-bold mt-4">{userData.name}</h2>
          <p className="text-gray-400 mt-1">{userData.email}</p>
          <p className="text-sm text-gray-500 mt-2">
            Last login: {userData.lastLogin}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Account Statistics */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#2d2d2d] rounded-xl p-6">
                <h3 className="text-lg font-medium mb-2">
                  Task Completion Rate
                </h3>
                <div className="flex items-center">
                  <div ref={completionChartRef} className="w-24 h-24"></div>
                  <div className="ml-4">
                    <div
                      className="text-3xl font-bold"
                      style={{ color: "#caff17" }}
                    >
                      78%
                    </div>
                    <p className="text-gray-400 text-sm">
                      Overall completion rate
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-xl font-semibold">42</div>
                    <p className="text-gray-400 text-sm">Tasks completed</p>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">12</div>
                    <p className="text-gray-400 text-sm">Tasks in progress</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#2d2d2d] rounded-xl p-6">
                <h3 className="text-lg font-medium mb-2">Tasks by Priority</h3>
                <div
                  ref={tasksByPriorityChartRef}
                  style={{ height: "200px" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-1">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="bg-[#2d2d2d] rounded-xl p-4 h-[calc(100%-2rem)]">
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border-b border-gray-700 pb-3 last:border-0"
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-[#3d3d3d] flex items-center justify-center mr-3">
                        <i
                          className={`fas ${categoryIcons[activity.category]} text-sm`}
                        ></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <div className="flex items-center mt-1 text-sm text-gray-400">
                          <span>{activity.date}</span>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <span
                              className={`h-2 w-2 rounded-full ${priorityColors[activity.priority]} mr-1`}
                            ></span>
                            <span className="capitalize">
                              {activity.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caff17] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caff17] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Time Zone
              </label>
              <div className="relative">
                <select
                  name="timezone"
                  value={userData.timezone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caff17] text-white appearance-none"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">
                    Greenwich Mean Time (GMT)
                  </option>
                  <option value="Europe/Paris">
                    Central European Time (CET)
                  </option>
                  <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Language
              </label>
              <div className="relative">
                <select
                  name="language"
                  value={userData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caff17] text-white appearance-none"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Notification Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-400">
                  Receive task updates via email
                </p>
              </div>
              <button
                onClick={() => handleToggleChange("email")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${userData.notifications.email ? "bg-[#caff17]" : "bg-gray-600"} cursor-pointer !rounded-button whitespace-nowrap`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${userData.notifications.email ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-400">
                  Receive alerts on your device
                </p>
              </div>
              <button
                onClick={() => handleToggleChange("push")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${userData.notifications.push ? "bg-[#caff17]" : "bg-gray-600"} cursor-pointer !rounded-button whitespace-nowrap`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${userData.notifications.push ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Task Reminders</h3>
                <p className="text-sm text-gray-400">
                  Get reminded about upcoming tasks
                </p>
              </div>
              <button
                onClick={() => handleToggleChange("taskReminders")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${userData.notifications.taskReminders ? "bg-[#caff17]" : "bg-gray-600"} cursor-pointer !rounded-button whitespace-nowrap`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${userData.notifications.taskReminders ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Weekly Report</h3>
                <p className="text-sm text-gray-400">
                  Receive weekly summary of your tasks
                </p>
              </div>
              <button
                onClick={() => handleToggleChange("weeklyReport")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${userData.notifications.weeklyReport ? "bg-[#caff17]" : "bg-gray-600"} cursor-pointer !rounded-button whitespace-nowrap`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${userData.notifications.weeklyReport ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <Link
            to="/"
            className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#3d3d3d] transition-colors cursor-pointer !rounded-button whitespace-nowrap"
          >
            Cancel
          </Link>
          <button
            className="px-6 py-3 rounded-lg cursor-pointer !rounded-button whitespace-nowrap"
            style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;