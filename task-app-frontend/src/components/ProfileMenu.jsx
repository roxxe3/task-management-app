import React, { useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ProfileMenu = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideProfile = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutsideProfile);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProfile);
    };
  }, [isOpen, setIsOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative">
      <div
        id="profileButton"
        className="h-12 w-12 rounded-full flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: "#caff17" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-user text-white"></i>
      </div>
      {isOpen && (
        <div
          id="profileDropdown"
          ref={profileDropdownRef}
          className="absolute right-0 mt-2 w-56 bg-[#2d2d2d] rounded-xl shadow-lg py-2 z-50"
        >
          <button
            id="profileOption"
            className="w-full px-4 py-3 text-left hover:bg-[#3d3d3d] flex items-center space-x-3 text-white"
          >
            <i className="fas fa-user-circle w-5"></i>
            <span>My Profile</span>
          </button>
          <button
            id="settingsOption"
            className="w-full px-4 py-3 text-left hover:bg-[#3d3d3d] flex items-center space-x-3 text-white"
          >
            <i className="fas fa-cog w-5"></i>
            <span>Account Settings</span>
          </button>
          <button
            id="themeOption"
            className="w-full px-4 py-3 text-left hover:bg-[#3d3d3d] flex items-center space-x-3 text-white"
          >
            <i className="fas fa-palette w-5"></i>
            <span>Theme Preferences</span>
          </button>
          <button
            id="notificationsOption"
            className="w-full px-4 py-3 text-left hover:bg-[#3d3d3d] flex items-center space-x-3 text-white"
          >
            <i className="fas fa-bell w-5"></i>
            <span>Notifications</span>
          </button>
          <div className="border-t border-gray-600 my-1"></div>
          <button
            id="logoutOption"
            className="w-full px-4 py-3 text-left hover:bg-[#3d3d3d] flex items-center space-x-3 text-white"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt w-5"></i>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;