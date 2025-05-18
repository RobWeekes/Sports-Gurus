import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  console.log("Navigation rendering with isLoaded:", isLoaded);
  console.log("sessionUser:", sessionUser);
  console.log("Redux state:", useSelector(state => state));


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
        {/* after user session has loaded, render additional elements */}
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



// phase5- nesting Log In / Sign Up modals into ProfileButton- as a modal
// Refactor Navigation to render the ProfileButton component even if there is no session user

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
