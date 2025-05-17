// frontend/src/App.jsx

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
// import SignupFormPage from "./components/SignupFormModal/SignupFormModal";
import Navigation from "./components/Navigation/Navigation";
import ProfileSettings from "./components/ProfileSettings/ProfileSettings";
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

    // Redux thunks don't automatically return the value from the inner async function. When calling dispatch(sessionActions.restoreUser()), the promise that gets returned might not be resolving properly:
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
    <>
      {/* render Nav bar first with isLoaded context */}
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );  // after restoreUser loads state, render Outlet: children
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>
      },
      // changing LoginFormPage to LoginFormModal
      // {
      //   path: "/login",
      //   element: <LoginFormPage />
      // },
      // changing SignupFormPage to SignupFormModal
      // {
      //   path: "/signup",
      //   element: <SignupFormPage />
      // },
      {
        path: "/profile/settings",
        element: <ProfileSettings />
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}



export default App;
