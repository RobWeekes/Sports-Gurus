import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="nav-content">
      <div className="nav-logo">
        <NavLink to="/">Sports Gurus</NavLink>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/" end>Home</NavLink>
        </li>
        <li>
          <NavLink to="/games">Games</NavLink>
        </li>
        <li>
          <NavLink to="/results">Results</NavLink>
        </li>
        {isLoaded && sessionUser && (
          <li>
            <NavLink to="/pickpages">My Picks</NavLink>
          </li>
        )}
      </ul>

      {isLoaded && (
        <div className="profile-container">
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}



export default Navigation;
