import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation/Navigation';
import HomePage from './components/HomePage/HomePage';
import ProfileSettings from './components/ProfileSettings/ProfileSettings';
import GamesDisplay from './components/Games/GamesDisplay';
import ResultsDisplay from './components/Results/ResultsDisplay';
import PickPagesDisplay from './components/PickPages/PickPagesDisplay';
import Footer from './components/Footer/Footer';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true))
      .catch((error) => {
        console.error('Error restoring user session:', error);
        setIsLoaded(true);
      });
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
          </Routes>
        )}
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
