// frontend/src/App.jsx

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage/SignupFormPage";
import Navigation from "./components/Navigation/Navigation";
import ProfileSettings from "./components/ProfileSettings/ProfileSettings";
import * as sessionActions from "./store/session";


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

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
      {
        path: "/signup",
        element: <SignupFormPage />
      },
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
