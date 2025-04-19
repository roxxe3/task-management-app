import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

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
          <div className="w-20"></div>
        </header>

        {/* Profile Section */}
        <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col items-center">
            {/* Profile Image */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[#3d3d3d] flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user text-4xl text-gray-400"></i>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[#caff17] text-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90"
              >
                <i className="fas fa-camera"></i>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">{user?.email}</h2>
              <p className="text-gray-400">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
            </div>

            {/* Account Settings */}
            <div className="w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-left">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#3d3d3d] rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-400">Receive updates about your tasks</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#caff17]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#2d2d2d] rounded-xl shadow-sm p-8">
          <h3 className="text-lg font-semibold mb-4 text-red-500">Danger Zone</h3>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => {
              // TODO: Implement account deletion
              alert('Account deletion not implemented yet');
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;