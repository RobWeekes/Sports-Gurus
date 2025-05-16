import { NavLink } from "react-router-dom";
  // and restore const sessionUser useSelector \/
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./Navigation.css";


// making temporary edits for troublshooting
function Navigation({ isLoaded }) {

  // ******************************
  // Comment this out after testing
  // // Force a mock user for testing ProfileButton:
  // const mockUser = {
  //   id: 1,
  //   userName: 'Demo-lition',
  //   email: 'demo@user.io',
  //   firstName: 'Demo',
  //   lastName: 'User',
  //   sportIcon: 'usercircle'
  // };

  // // Use the mock user instead of the selector
  // const sessionUser = mockUser;
  // Comment this out after testing
  // ******************************

  // and restore const sessionUser useSelector \/
  const sessionUser = useSelector(state => state.session.user);
  console.log("Navigation rendering with isLoaded:", isLoaded);
  console.log("sessionUser:", sessionUser);

  // if logged in ? render Profile button, Log Out button...
  const sessionLinks = sessionUser ? (
    <li>
      {/* remove <div>Test</div> when fixed: */}
      {/* <div>Test User Logged In</div> */}
      <ProfileButton user={sessionUser} />
    </li>
    // otherwise render Log In, Sign Up links/modal components
  ) : (
    <>
      <li>
        {/* remove <div>Test</div> when fixed: */}
        {/* <div>Test User Not Logged In</div> */}
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
      </li>
      <li>
        {/* <NavLink to="/signup">Sign Up</NavLink> */}
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    </>
  );

  return (
    <ul>
      <li>
        {/* always render "Home" link */}
        <NavLink to="/">Home</NavLink>
      </li>
      {/* after user session has loaded, render additional elements */}
      {isLoaded && sessionLinks}
      {/* Troubleshooting: render sessionLinks regardless of isLoaded */}
      {/* {sessionLinks} */}
    </ul>
  );
}


export default Navigation;
