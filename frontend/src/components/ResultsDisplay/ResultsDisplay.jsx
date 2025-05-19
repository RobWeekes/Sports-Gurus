import { useState, useEffect } from "react";
import { csrfFetch } from "../../store/csrf";
import "./ResultsDisplay.css";

function ResultsDisplay() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ team: "", date: "", status: "" });
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch available teams for the filter dropdown
    async function fetchTeams() {
      try {
        const response = await csrfFetch("/api/results/teams");
        if (response.ok) {
          const data = await response.json();
          setTeams(data.teams || []);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    }

    fetchTeams();
  }, []);

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);

        // Build query string based on filters
        const queryParams = new URLSearchParams();
        if (filter.team) queryParams.append("team", filter.team);
        if (filter.date) queryParams.append("date", filter.date);
        if (filter.status) queryParams.append("status", filter.status);

        const response = await csrfFetch(`/api/results?${queryParams.toString()}`);

        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
          setError(null);
        } else {
          throw new Error("Failed to fetch results");
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to load results. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
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
      day: "numeric"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="results-display">
      <h1 className="section-title">Game Results</h1>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="team">Team:</label>
          <select
            id="team"
            name="team"
            value={filter.team}
            onChange={handleFilterChange}
          >
            <option value="">All Teams</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
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

        <div className="filter-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="FINAL">Final</option>
            <option value="GAME STARTED">In Progress</option>
            <option value="TBD">Upcoming</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">Loading results...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : results.length === 0 ? (
        <div className="no-results-message">
          No results found for the selected filters.
        </div>
      ) : (
        <div className="results-container">
          {results.map(result => (
            <div key={result.id} className="result-card">
              <div className="team-info home-team">
                <div className="team-name">{result.homeTeam}</div>
                <div className="game-date">{formatDate(result.gameDay)}</div>
              </div>

              <div className="score-display">
                <div className="score">
                  <span>{result.favoriteScore}</span>
                  <span>-</span>
                  <span>{result.underdogScore}</span>
                </div>
                <div className={`game-status ${result.status === 'FINAL' ? 'final-status' : ''}`}>
                  {result.status}
                </div>
              </div>

              <div className="team-info away-team">
                <div className="team-name">{result.awayTeam}</div>
                <div className="spread">{result.pointSpread > 0 ? `+${result.pointSpread}` : result.pointSpread}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default ResultsDisplay;
