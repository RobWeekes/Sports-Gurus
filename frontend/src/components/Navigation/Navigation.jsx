import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./Navigation.css";


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  console.log("Navigation rendering with isLoaded:", isLoaded);
  console.log("sessionUser:", sessionUser);
  console.log("Redux state:", useSelector(state => state));

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
