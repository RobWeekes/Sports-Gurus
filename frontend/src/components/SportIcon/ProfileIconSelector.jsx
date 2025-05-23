import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SportIcon from "./SportIcon";
import * as sessionActions from "../../store/session";
import "./ProfileIconSelector.css"; // Reuse the same CSS


function ProfileIconSelector({ currentIcon, onSelectIcon }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(currentIcon || "usercircle");
  const dropdownRef = useRef(null);

  // available sport icons
  const sportIconOptions = [
    { id: "football", name: "Football" },
    { id: "football2", name: "Football2" },
    { id: "football3", name: "Football3" },
    { id: "football4", name: "Football4" },
    { id: "baseball", name: "Baseball" },
    { id: "baseball2", name: "Baseball2" },
    { id: "baseball3", name: "Baseball3" },
    { id: "baseball4", name: "Baseball4" },
    { id: "basketball", name: "Basketball" },
    { id: "basketball2", name: "Basketball2" },
    { id: "basketball3", name: "Basketball3" },
    { id: "basketball4", name: "Basketball4" },
    { id: "soccer", name: "Soccer" },
    { id: "soccer2", name: "Soccer2" },
    { id: "soccer3", name: "Soccer3" },
    { id: "soccer4", name: "Soccer4" },
    { id: "hockey", name: "Hockey" },
    { id: "hockey2", name: "Hockey2" },
    { id: "hockey3", name: "Hockey3" },
    { id: "hockey4", name: "Hockey4" },
    { id: "boxing", name: "Boxing" },
    { id: "boxing2", name: "Boxing2" },
    { id: "boxing3", name: "Boxing3" },
    { id: "boxing4", name: "Boxing4" },
    { id: "mma", name: "MMA" },
    { id: "mma2", name: "MMA2" },
    { id: "karate", name: "Karate" },
    { id: "martialarts", name: "MartialArts" },
    { id: "golf", name: "Golf" },
    { id: "golf2", name: "Golf2" },
    { id: "golf3", name: "Golf3" },
    { id: "golf4", name: "Golf4" },
    { id: "tennis", name: "Tennis" },
    { id: "tennis2", name: "Tennis2" },
    { id: "tennis3", name: "Tennis3" },
    { id: "tennis4", name: "Tennis4" },
    { id: "stockcar", name: "Stockcar" },
    { id: "stockcar2", name: "Stockcar2" },
    { id: "f1car", name: "F1car" },
    { id: "racingflag", name: "Racingflag" },
    { id: "rugby", name: "Rugby" },
    { id: "rugby2", name: "Rugby2" },
    { id: "cricket", name: "Cricket" },
    { id: "cricket2", name: "Cricket2" },
    { id: "motorsports", name: "Motorsports" },
    { id: "motorsports2", name: "Motorsports2" },
    { id: "track", name: "Track" },
    { id: "olympics", name: "Olympics" },
    { id: "volleyball", name: "Volleyball" },
    { id: "volleyball2", name: "Volleyball2" },
    { id: "volleyball3", name: "Volleyball3" },
    { id: "wrestling", name: "Wrestling" },
    { id: "usercircle", name: "UserCircle" },
  ];

  // toggle dropdown visibility
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // handle icon selection
  const handleSelectIcon = (iconId, e) => {
    if (e) e.stopPropagation();

    // update local state immediately for UI feedback
    setSelectedIcon(iconId);

    // notify parent of temporary UI updates
    if (onSelectIcon) {
      onSelectIcon(iconId, true); // *pass true to indicate this is a temporary update
    }
  };

  // update when prop changes
  useEffect(() => {
    if (currentIcon) {
      setSelectedIcon(currentIcon);
    }
  }, [currentIcon]);

  // close dropdown when clicking outside
  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = async (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // console.log("Click outside detected");
        setShowDropdown(false);
        // // debug the condition values
        // console.log("selectedIcon:", selectedIcon);
        // console.log("currentIcon:", currentIcon);
        // console.log("Are they different?", selectedIcon !== currentIcon);
        // console.log("sessionUser exists?", !!sessionUser);
        // console.log("sessionUser.id exists?", sessionUser && !!sessionUser.id);
        // console.log("Auto-saving icon on dropdown close:", selectedIcon);
        // *batch sending API calls, only dispatch if the icon has changed and we have a user ID

        dispatch(sessionActions.updateProfile(sessionUser.id, {
          sportIcon: selectedIcon
        })).then(result => {
          console.error("ProfileIconSelector -> handleClickOutside -> Profile update completed:", result);
          // notify parent with final icon update
          if (onSelectIcon) {
            onSelectIcon(selectedIcon, false); // *pass false to indicate this is the final update
          }
        });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };  // useEffect dependency array
  }, [showDropdown, dispatch, selectedIcon, currentIcon, sessionUser, onSelectIcon]);

  return (
    <div className="sport-icon-selector" ref={dropdownRef}>
      <button
        className="selected-icon-button"
        onClick={toggleDropdown}
        aria-label="Select a sport icon"
        type="button" // prevent form submission
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
