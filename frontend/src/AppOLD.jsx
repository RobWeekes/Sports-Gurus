// frontend/src/App.jsx

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import ProfileSettings from "./components/ProfileSettings/ProfileSettings";
import GamesDisplay from "./components/GamesDisplay/GamesDisplay";
import PickPagesDisplay from "./components/PickPages/PickPagesDisplay";
import ResultsDisplay from "./components/ResultsDisplay/ResultsDisplay";
import HomePage from "./components/HomePage/HomePage";
import Footer from "./components/Footer/Footer";
import * as sessionActions from "./store/session";


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("Layout useEffect running");

    // dispatch the action and set isLoaded to true afterward
    const restoreUserPromise = dispatch(sessionActions.restoreUser());
    console.log("restoreUserPromise:", restoreUserPromise);

    // set isLoaded = true after a short delay to ensure Redux state is updated - this is a workaround for the promise resolution issue
    setTimeout(() => {
      console.log("Setting isLoaded to true after timeout");
      setIsLoaded(true);
    }, 100);

  }, [dispatch]);

  // simpler useEffect:
  // useEffect(() => {
  //   dispatch(sessionActions.restoreUser())
  //     .then(() => setIsLoaded(true))
  //     .catch(() => setIsLoaded(true));
  // }, [dispatch]);






  // Redux thunks don"t automatically return the value from the inner async function. When calling dispatch(sessionActions.restoreUser()), the promise that gets returned might not be resolving properly:
  //   dispatch(sessionActions.restoreUser()).then(() => {
  //     console.log("User restored, setting isLoaded to true");
  //     setIsLoaded(true);
  //   })
  //   .catch(err => {
  //     console.error("Error restoring user in Layout:", err);
  //     setIsLoaded(true); // still set isLoaded = true, even with an error
  //   })  // troubleshooting - add finally to always set isLoaded to true
  //   .finally(() => {
  //     console.log("Issue with restoreUser promise chain, setting isLoaded to true in finally block");
  //     setIsLoaded(true);  // always set isLoaded to true
  //   })
  // }, [dispatch]);

  console.log("Layout rendering with isLoaded:", isLoaded);

  return (
    <div className="app-container">
      <div className="nav-container">
        {/* render Nav bar first with isLoaded context */}
        <Navigation isLoaded={isLoaded} />
      </div>

      <div className="main-content">
        <div className="content-area">
          {isLoaded && <Outlet />}
        </div>

        {/* after restoreUser loads state, render Outlet: children */}
        <div className="sidebar">
          {isLoaded && (
            <>
              <h2 className="section-title">Quick Links</h2>
              <ul className="sidebar-links">
                <li><a href="/games">Today&apos;s Games</a></li>
                <li><a href="/pickpages">My Pick Pages</a></li>
                <li><a href="/results">Latest Results</a></li>
              </ul>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/profile/settings",
        element: <ProfileSettings />
      },
      {
        path: "/games",
        element: <GamesDisplay />
      },
      {
        path: "/pickpages",
        element: <PickPagesDisplay />
      },
      {
        path: "/results",
        element: <ResultsDisplay />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}



export default App;
