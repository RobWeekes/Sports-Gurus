import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded: propsIsLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const [localIsLoaded, setLocalIsLoaded] = useState(false);

  // Use both the prop isLoaded and our local state
  const isLoaded = propsIsLoaded || localIsLoaded;

  // Set a timeout to force isLoaded to true after 1000ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        console.log("Forcing isLoaded to true after timeout");
        setLocalIsLoaded(true);
      }
    }, 1000);

    // Clean up the timeout if the component unmounts or isLoaded becomes true
    return () => clearTimeout(timer);
  }, [isLoaded]);

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
