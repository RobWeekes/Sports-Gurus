// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
// import { MdSportsFootball, MdOutlineSportsFootball, MdOutlineSportsBasketball, MdOutlineSportsBaseball, MdSportsBaseball, MdSportsHockey, MdSportsSoccer } from "react-icons/md";
// import { FaFootballBall, FaBasketballBall, FaBaseballBall, FaHockeyPuck, FaGolfBall } from "react-icons/fa";
// import { GiBoxingGlove, GiCricketBat } from "react-icons/gi";
import * as sessionActions from "../../store/session";
import SportIcon from "../SportIcon/SportIcon";
import SportIconSelector from "../SportIcon/SportIconSelector";
import "./ProfileButton.css"


function ProfileButton({ user }) {
  const dispatch = useDispatch();

  // ** beginning of SportIconSelector additions \/ **
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  // handle sport icon selection
  const handleIconSelect = (iconId) => {
    // update the user"s profile
    dispatch(sessionActions.updateUserProfile({ sportIcon: iconId }));
    console.log("Selected icon:", iconId);
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  // ** end of SportIconSelector additions ^^ **

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <button onClick={toggleMenu}>
        {user.sportIcon ? (
            <SportIcon sport={user.sportIcon} size="2em" />
        ) : (
          <FaUserCircle />
        )}
      </button>
      {/* <button>
        <div style={{ color: "orange", fontSize: "100px" }}>
          <MdOutlineSportsFootball />
          <MdSportsFootball />
          <MdOutlineSportsBasketball />
          <MdOutlineSportsBaseball />
          <MdSportsBaseball />
          <MdSportsHockey />
          <MdSportsSoccer />

          <FaFootballBall />
          <FaBasketballBall />
          <FaBaseballBall />
          <FaHockeyPuck />
          <FaGolfBall />

          <GiBoxingGlove />
          <GiCricketBat />

        </div>
      </button> */}
      {/* <ul className="profile-dropdown"> */}
      {/* SportIconSelector addition \/ */}
      <ul className={ulClassName} ref={ulRef}>
        <li>{user.userName}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        {/* SportIconSelector addition \/ */}
        <li className="sport-icon-section">
          <h5>Choose Your Icon</h5>
          <SportIconSelector
            user={user}
            onSelectIcon={handleIconSelect}
          />
        </li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}


export default ProfileButton;
