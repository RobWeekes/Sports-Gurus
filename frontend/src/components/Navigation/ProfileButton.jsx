// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import SportIcon from "../SportIcon/SportIcon";
import "./ProfileButton.css"
// testing OpenModalButton: Greeting
// import Greeting from "../Greeting/Greeting";


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  // const sessionUser = useSelector(state => state.session.user);
  // console.log("ProfileButton rendering with user:", sessionUser);
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
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    // add the event listener & return cleanup only if showMenu is true
    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  // *added another closeMenu function and passed it to the onButtonClick prop of the OpenModalButton components, to close the dropdown when the buttons are clicked
  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    // *test functionality - dropdown should close when buttons are clicked
    closeMenu();
  };

  // the user info will be "hidden" or not
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");


  return (
    <>
      <button onClick={toggleMenu} className="profile-button" aria-label="User menu">
        <SportIcon sporticon={user ? user.sportIcon || "usercircle" : "usercircle"} size="1.5em" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div className="user-info">
              <div className="user-name">{user.userName}</div>
              <div className="user-full-name">{user.firstName} {user.lastName}</div>
              <div className="user-email">{user.email}</div>
            </div>

            <div className="menu-items">
              <li>
                <NavLink to="/profile/settings" onClick={closeMenu}>My Profile</NavLink>
              </li>
              <li>
                <NavLink to="/pickpages" onClick={closeMenu}>My Picks</NavLink>
              </li>
              <li>
                <button onClick={logout} className="logout-button">Sign Out</button>
              </li>
            </div>
          </>
        ) : (
          <>
            <li>
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li>
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
          </>
        )}
      </ul>
    </>
  );
}



export default ProfileButton;




// // ** COMMENT THIS OUT \/ **
// // if logged in ? render Profile button, Log Out button...
// const sessionLinks = sessionUser ? (
//   <li>
//     {/* remove <div>Test</div> when fixed: */}
//     {/* <div>Test User Logged In</div> */}
//     <ProfileButton user={sessionUser} />
//   </li>
//   // otherwise render Log In, Sign Up links/modal components
// ) : (
//   <>
//     <li>
//       {/* remove <div>Test</div> when fixed: */}
//       {/* <div>Test User Not Logged In</div> */}
//       <OpenModalButton
//         buttonText="Log In"
//         modalComponent={<LoginFormModal />}
//       />
//     </li>
//     <li>
//       {/* <NavLink to="/signup">Sign Up</NavLink> */}
//       <OpenModalButton
//         buttonText="Sign Up"
//         modalComponent={<SignupFormModal />}
//       />
//     </li>
//   </>
// );
// // ** COMMENT THIS OUT ^^ **


// return (
//   <>
//     <button onClick={toggleMenu} className="profile-button" aria-label="User menu">
//       <SportIcon sporticon={user.sportIcon || "usercircle"} size="1.5em" />
//     </button>

//     {/* render session links - after loading? */}
//     {sessionLinks}

//     {/* TESTING GREETING MODAL */}
//     {/* <Greeting /> */}

//     {/* <ul className={ulClassName} ref={ulRef}>
//       <div className="user-info">
//         <div className="user-name">{user.userName}</div>
//         <div className="user-full-name">{user.firstName} {user.lastName}</div>
//         <div className="user-email">{user.email}</div>
//       </div>

//       <div className="menu-items">
//         <li>
//           <NavLink to="/profile/settings">My Profile</NavLink>
//         </li>
//         <li>
//           <NavLink to="/my-teams">My Teams</NavLink>
//         </li>
//         <li>
//           <NavLink to="/my-predictions">My Predictions</NavLink>
//         </li>
//         <li>
//           <button onClick={logout} className="logout-button">Sign Out</button>
//         </li>
//       </div>
//     </ul> */}

//   </>
// );




// export default ProfileButton;
