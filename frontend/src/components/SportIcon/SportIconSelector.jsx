import { useState, useRef, useEffect } from "react";
import SportIcon from "./SportIcon";
import "./SportIconSelector.css";

function SportIconSelector({ user, onSelectIcon }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(user?.sportIcon || "usercircle");
  const dropdownRef = useRef(null);

  console.log("SportIconSelector rendered with user:", user);
  console.log("Initial selectedIcon:", selectedIcon);

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
  const handleSelectIcon = (iconId) => {
    console.log("Icon selected:", iconId);
    setSelectedIcon(iconId);

    // IMPORTANT: Don't close the dropdown when selecting an icon
    // Remove or comment out this line:
    // setShowDropdown(false);

    if (onSelectIcon) {
      onSelectIcon(iconId);
    }
  };

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

  // update the selected icon when user prop changes
  useEffect(() => {
    if (user && user.sportIcon) {
      console.log("User sportIcon changed to:", user.sportIcon);
      setSelectedIcon(user.sportIcon);
    }
  }, [user]);

  return (
    <div className="sport-icon-selector" ref={dropdownRef}>
      <button
        className="selected-icon-button"
        onClick={toggleDropdown}
        aria-label="Select a sport icon"
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
                onClick={() => handleSelectIcon(option.id)}
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



export default SportIconSelector;
