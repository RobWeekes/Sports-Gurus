import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  // if logged in? render Profile button, Log Out button
  const sessionLinks = sessionUser ? (
    <>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    </>
    // otherwise render Log In, Sign Up links
  ) : (
    <>
      <li>
        <NavLink to="/login">Log In</NavLink>
      </li>
      <li>
        <NavLink to="/signup">Sign Up</NavLink>
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
    </ul>
  );
}


export default Navigation;
