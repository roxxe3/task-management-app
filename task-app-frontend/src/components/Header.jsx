import React, { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import TLogo from "../assets/T-logo.png";

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="flex justify-between items-center mb-8 p-4 bg-[#1f1f1f] rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div className="transition-transform duration-300 hover:scale-105">
          <img src={TLogo} alt="Task Manager Logo" className="h-12 w-12" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide" style={{ color: "#9ca3af" }}>
            {formattedDate}
          </p>
        </div>
      </div>
      <ProfileMenu 
        isOpen={isProfileMenuOpen} 
        setIsOpen={setIsProfileMenuOpen} 
      />
    </header>
  );
};

export default Header;