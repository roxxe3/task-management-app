import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
        className="h-12 w-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
        style={{ backgroundColor: "#caff17" }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#ffffff";
          e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(202, 255, 23, 0.4), 0 2px 4px -1px rgba(202, 255, 23, 0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#caff17";
          e.currentTarget.style.boxShadow = "none";
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-user text-black"></i>
      </div>
      {isOpen && (
        <div
          id="profileDropdown"
          ref={profileDropdownRef}
          className="absolute right-0 mt-2 w-56 bg-[#2d2d2d] rounded-xl shadow-lg py-2 z-50"
        >
          <Link
            to="/profile"
            className="w-full px-4 py-3 text-left hover:bg-[#3d3d3d] flex items-center space-x-3 text-white"
            onClick={() => setIsOpen(false)}
          >
            <i className="fas fa-user-circle w-5"></i>
            <span>My Profile</span>
          </Link>
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