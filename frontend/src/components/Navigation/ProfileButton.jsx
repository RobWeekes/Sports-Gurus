// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import * as sessionActions from "../../store/session";
import SportIcon from "../SportIcon/SportIcon";
import "./ProfileButton.css"
// testing OpenModalButton: Greeting
// import Greeting from "../Greeting/Greeting";


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  console.log("ProfileButton rendering with user:", sessionUser);
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    // keep click from bubbling up to document and triggering closeMenu
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    // only want the document-wide click listener if the dropdown is open
    if (!showMenu) return;

    // change showMenu to false only if the target of the click event does NOT contain the HTML element of the dropdown menu
    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    // add the event listener & return cleanup only if showMenu is true
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  // the ul elements (user info) will be "hidden" or not
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");


  return (
    <>
      <button onClick={toggleMenu} className="profile-button" aria-label="User menu">
        <SportIcon sporticon={user.sportIcon || "usercircle"} size="1.5em" />
      </button>

      {/* TESTING GREETING MODAL */}
      {/* <Greeting /> */}

      <ul className={ulClassName} ref={ulRef}>
        <div className="user-info">
          <div className="user-name">{user.userName}</div>
          <div className="user-full-name">{user.firstName} {user.lastName}</div>
          <div className="user-email">{user.email}</div>
        </div>

        <div className="menu-items">
          <li>
            <NavLink to="/profile/settings">My Profile</NavLink>
          </li>
          <li>
            <NavLink to="/my-teams">My Teams</NavLink>
          </li>
          <li>
            <NavLink to="/my-predictions">My Predictions</NavLink>
          </li>
          <li>
            <button onClick={logout} className="logout-button">Sign Out</button>
          </li>
        </div>
      </ul>

    </>
  );
}



export default ProfileButton;
