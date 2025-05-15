// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import * as sessionActions from "../../store/session";
import SportIcon from "../SportIcon/SportIcon";
import "./ProfileButton.css"


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
      <button onClick={toggleMenu} className="profile-button">
        <SportIcon sporticon={user.sportIcon || "usercircle"} size="1.5em" />
      </button>

      <ul className={ulClassName} ref={ulRef}>
        <li>{user.userName}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li>
          <NavLink to="/profile/settings">My Profile</NavLink>
        </li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>

    </>
  );
}



export default ProfileButton;
