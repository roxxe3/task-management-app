import React, { useState } from "react";
import ProfileMenu from "./ProfileMenu";

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
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold" style={{ color: "#ffffff" }}>
          Tasks
        </h1>
        <p className="mt-1" style={{ color: "#9ca3af" }}>
          {formattedDate}
        </p>
      </div>
      <ProfileMenu 
        isOpen={isProfileMenuOpen} 
        setIsOpen={setIsProfileMenuOpen} 
      />
    </header>
  );
};

export default Header;