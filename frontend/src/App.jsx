import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation/Navigation";
import HomePage from "./components/HomePage/HomePage";
import ProfileSettings from "./components/ProfileSettings/ProfileSettings";
import GamesDisplay from "./components/GamesDisplay/GamesDisplay";
import ResultsDisplay from "./components/ResultsDisplay/ResultsDisplay";
import PickPagesDisplay from "./components/PickPages/PickPagesDisplay";
import PickPageDetail from "./components/PickPages/PickPageDetail"
import Footer from "./components/Footer/Footer";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Clean implementation without console logs
    const loadUser = async () => {
      try {
        await dispatch(sessionActions.restoreUser());
      } catch (e) {
        // Silently handle error
      } finally {
        // Always set isLoaded to true
        setIsLoaded(true);
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navigation isLoaded={isLoaded} />
      <main className="container">
        {isLoaded && (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/settings" element={<ProfileSettings />} />
            <Route path="/games" element={<GamesDisplay />} />
            <Route path="/results" element={<ResultsDisplay />} />
            <Route path="/pickpages" element={<PickPagesDisplay />} />
            <Route path="/pickpages/:pageId" element={<PickPageDetail />} />
          </Routes>
        )}
      </main>
      <Footer />
    </BrowserRouter>
  );
}


export default App;
