import { useState, useRef, useEffect } from "react";
// import { useDispatch } from "react-redux";
import SportIcon from "./SportIcon";
import "./SportIconSelector.css";


function SportIconSelector({ user, onSelectIcon }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(user?.sportIcon || "baseball");
  const dropdownRef = useRef(null);
  // const dispatch = useDispatch();

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
    setSelectedIcon(iconId);
    setShowDropdown(false);

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

  return (
    <div className="sport-icon-selector" ref={dropdownRef}>
      <button
        className="selected-icon-button"
        onClick={toggleDropdown}
        aria-label="Select a sport icon"
      >
        <SportIcon sport={selectedIcon} size="1.5em" />
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
                <SportIcon sport={option.id} size="1.5em" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



export default SportIconSelector;
