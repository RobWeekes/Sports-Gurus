import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";
import OpenModalButton from "../OpenModalButton";
import PredictionModal from "../PredictionModal/PredictionModal";
import "./GamesDisplay.css";


function GamesDisplay() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ league: "", date: "" });
  const sessionUser = useSelector(state => state.session.user);
  const location = useLocation();
  const navigate = useNavigate();

  // get pageId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const pageId = queryParams.get("pageId");
  const [pickPage, setPickPage] = useState(null);

  // fetch the pick page if pageId is provided
  useEffect(() => {
    if (!sessionUser || !pageId) return;

    async function fetchPickPage() {
      try {
        const response = await csrfFetch(`/api/pickpages/${pageId}`);
        if (response.ok) {
          const data = await response.json();
          setPickPage(data.pickPage);
        } else {
          setError("Invalid pick page. Please select a valid pick page.");
        }
      } catch (err) {
        console.error("Error fetching pick page:", err);
        setError("Failed to load pick page information.");
      }
    }

    fetchPickPage();
  }, [sessionUser, pageId]);

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);

        // build query string based on filters
        const queryParams = new URLSearchParams();
        if (filter.league) queryParams.append("league", filter.league);
        if (filter.date) queryParams.append("date", filter.date);

        const response = await csrfFetch(`/api/games?${queryParams.toString()}`);

        if (response.ok) {
          const data = await response.json();
          setGames(data.games || []);
          setError(null);
        } else {
          throw new Error("Failed to fetch games");
        }
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load games. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, [filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  return (
    <div className="games-display">
      <h1 className="section-title">Games Schedule</h1>

      {pageId && pickPage && (
        <div className="pick-page-info">
          <p>Adding picks to: <strong>{pickPage.pageName}</strong></p>
          <button
            className="back-to-page-button"
            onClick={() => navigate(`/pickpages/${pageId}`)}
          >
            Back to Pick Page
          </button>
        </div>
      )}

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="league">League:</label>
          <select
            id="league"
            name="league"
            value={filter.league}
            onChange={handleFilterChange}
          >
            <option value="">All Leagues</option>
            <option value="NBA">NBA</option>
            <option value="NFL">NFL</option>
            <option value="MLB">MLB</option>
            <option value="NHL">NHL</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={filter.date}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">Loading games...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : games.length === 0 ? (
        <div className="no-games-message">
          No games found for the selected filters.
        </div>
      ) : (
        <div className="games-grid">
          {games.map(game => (
            <div key={game.id} className="game-card">
              <div className="game-header">
                <span className="game-league">{game.league}</span>
                <span className="game-date">{formatDate(game.gameDay)}</span>
              </div>

              <div className="game-teams">
                <div className="team away-team">{game.awayTeam}</div>
                <div className="vs">@</div>
                <div className="team home-team">{game.homeTeam}</div>
              </div>

              {sessionUser && (
                <div className="game-actions">
                  <OpenModalButton
                    buttonText="Make Prediction"
                    modalComponent={<PredictionModal game={game} pageId={pageId} />}
                    className="make-pick-button"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}@
    </div>
  );
}



export default GamesDisplay;
