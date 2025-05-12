import { useState, useRef, useEffect } from "react";
import SportIcon from "./SportIcon";
import "./ProfileIconSelector.css"; // Reuse the same CSS


function ProfileIconSelector({ currentIcon, onSelectIcon }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(currentIcon || "usercircle");
  const dropdownRef = useRef(null);

  // available sport icons
  const sportIconOptions = [
    { id: "football", name: "Football" },
    { id: "football2", name: "Football Alt" },
    { id: "football3", name: "Football Pro" },
    { id: "baseball", name: "Baseball" },
    { id: "baseball2", name: "Baseball Alt" },
    { id: "baseball3", name: "Baseball Pro" },
    { id: "basketball", name: "Basketball" },
    { id: "basketball2", name: "Basketball Alt" },
    { id: "hockey", name: "Hockey" },
    { id: "hockey2", name: "Hockey Alt" },
    { id: "soccer", name: "Soccer" },
    { id: "tennis", name: "Tennis" },
    { id: "volleyball", name: "Volleyball" },
    { id: "golf", name: "Golf" },
    { id: "boxing", name: "Boxing" },
    { id: "cricket", name: "Cricket" },
    { id: "rugby", name: "Rugby" },
  ];

  // toggle dropdown visibility
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // handle icon selection
  const handleSelectIcon = (iconId, e) => {
    if (e) e.stopPropagation();
    setSelectedIcon(iconId);

    if (onSelectIcon) {
      onSelectIcon(iconId);
    }

    // Explicitly NOT closing the dropdown here
  };

  // Update when prop changes
  useEffect(() => {
    if (currentIcon) {
      setSelectedIcon(currentIcon);
    }
  }, [currentIcon]);

  // close dropdown when clicking outside
  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="sport-icon-selector" ref={dropdownRef}>
      <button
        className="selected-icon-button"
        onClick={toggleDropdown}
        aria-label="Select a sport icon"
        type="button" // Prevent form submission
      >
        <SportIcon sporticon={selectedIcon} size="1.5em" />
        <span className="icon-name">{sportIconOptions.find(option => option.id === selectedIcon)?.name}</span>
      </button>

      {/* render drop down menu */}
      {showDropdown && (
        <div className="icon-dropdown">
          <div className="icon-grid">
            {sportIconOptions.map((option) => (
              <div
                key={option.id}
                className={`icon-option ${selectedIcon === option.id ? "selected" : ""}`}
                onClick={(e) => handleSelectIcon(option.id, e)}
                title={option.name}
              >
                <SportIcon sporticon={option.id} size="1.5em" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



export default ProfileIconSelector;
