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
        <div className="results-grid">
          {results.map(result => (
            <div key={result.id} className="result-card">
              <div className="result-header">
                <span className={`result-status ${result.status.toLowerCase().replace(/\s+/g, "-")}`}>
                  {result.status}
                </span>
                <span className="result-date">
                  {result.ScheduledGame && formatDate(result.ScheduledGame.gameDay)}
                </span>
              </div>

              <div className="result-teams">
                <div className={`team ${result.favorite === result.ScheduledGame?.homeTeam ? "home-team favorite" : "home-team"}`}>
                  {result.ScheduledGame?.homeTeam}
                  {result.status === "FINAL" && (
                    <span className="team-score">
                      {result.favorite === result.ScheduledGame?.homeTeam ? result.favoriteScore : result.underdogScore}
                    </span>
                  )}
                </div>

                <div className="vs">vs</div>

                <div className={`team ${result.favorite === result.ScheduledGame?.awayTeam ? "away-team favorite" : "away-team"}`}>
                  {result.ScheduledGame?.awayTeam}
                  {result.status === "FINAL" && (
                    <span className="team-score">
                      {result.favorite === result.ScheduledGame?.awayTeam ? result.favoriteScore : result.underdogScore}
                    </span>
                  )}
                </div>
              </div>

              {result.status === "FINAL" && (
                <div className="result-details">
                  <div className="detail-item">
                    <span className="detail-label">Total:</span>
                    <span className="detail-value">{result.totalScore} ({result.overUnder} {result.totalLine})</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Spread:</span>
                    <span className="detail-value">{result.favorite} {result.pointSpread}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Covers:</span>
                    <span className="detail-value">{result.coversSpread}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



export default ResultsDisplay;
