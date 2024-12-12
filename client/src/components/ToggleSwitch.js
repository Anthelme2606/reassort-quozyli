import React, { useState } from "react";
import "../assets/css/toggle-switch.css";

const ToggleSwitch = () => {
  const [isAutomatic, setIsAutomatic] = useState(true);

  const handleToggle = () => {
    setIsAutomatic((prevState) => !prevState);
  };

  return (
    <div className="toggle-container d-flex">
    
      <label className="switch mx-2">
        <input
          type="checkbox"
          checked={isAutomatic}
          onChange={handleToggle}
        />
        <span className="slider"></span>
      </label>
      <p id="modeLabel">
        {isAutomatic ? "Mode Automatique" : "Mode Manuel"}
      </p>
      {/* <p className="status">
        Statut actuel :{" "}
        <span
          id="currentStatus"
          className={isAutomatic ? "automatic" : "manual"}
        >
          {isAutomatic ? "Automatique" : "Manuel"}
        </span>
      </p> */}
    </div>
  );
};

export default ToggleSwitch;
