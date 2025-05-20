import { useState, useEffect } from "react";
import { csrfFetch } from "../../store/csrf";
import "./ResultsDisplay.css";


function ResultsDisplay() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ team: "", date: "", status: "", league: "" });
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);

  // fetch available leagues for the filter dropdown
  useEffect(() => {
    async function fetchLeagues() {
      try {
        const response = await csrfFetch("/api/results/leagues");
        if (response.ok) {
          const data = await response.json();
          setLeagues(data.leagues || []);
        }
      } catch (err) {
        console.error("Error fetching leagues:", err);
      }
    }

    fetchLeagues();
  }, []);

  // fetch available teams for the filter dropdown, filtered by league if selected
  useEffect(() => {
    async function fetchTeams() {
      try {
        let url = "/api/results/teams";
        if (filter.league) {
          url += `?league=${filter.league}`;
        }

        const response = await csrfFetch(url);
        if (response.ok) {
          const data = await response.json();
          setTeams(data.teams || []);

          // if the currently selected team is not in the new list of teams, reset it
          if (filter.team && !data.teams.includes(filter.team)) {
            setFilter(prev => ({ ...prev, team: "" }));
          }
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    }

    fetchTeams();
  }, [filter.league, filter.team]); // added filter.team as a dependency

  // fetch results based on filters - build the query parameters
  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);

        // build query string based on filters
        const queryParams = new URLSearchParams();

        if (filter.team) queryParams.append("team", filter.team);

        // format date properly for the backend
        if (filter.date) {
          // Make sure the date is in YYYY-MM-DD format
          const formattedDate = new Date(filter.date).toISOString().split('T')[0];
          queryParams.append("date", formattedDate);
        }

        if (filter.status) queryParams.append("status", filter.status);
        if (filter.league) queryParams.append("league", filter.league);

        // console.log("Fetching results with params:", queryParams.toString());
        const response = await csrfFetch(`/api/results?${queryParams.toString()}`);

        if (response.ok) {
          const data = await response.json();
          // console.log("Results received:", data.results.length);
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

  // helper function to check if a date is today
  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };


  return (
    <div className="results-display">
      <h1 className="section-title">Game Results</h1>

      <div className="filter-controls">
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
          <label htmlFor="league">League:</label>
          <select
            id="league"
            name="league"
            value={filter.league}
            onChange={handleFilterChange}
          >
            <option value="">All Leagues</option>
            {leagues.map(league => (
              <option key={league} value={league}>{league}</option>
            ))}
          </select>
        </div>

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

        <button
          className="clear-filters-btn"
          onClick={() => setFilter({ team: "", date: "", status: "", league: "" })}
        >
          Clear Filters
        </button>
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
                <div className="game-date">
                  {isToday(result.gameDay) ? "Today" : formatDate(result.gameDay)}
                </div>
                {result.ScheduledGame && (
                  <div className="league-tag">{result.ScheduledGame.league}</div>
                )}
              </div>

              <div className="score-display">
                <div className="score">
                  <span>{result.favoriteScore}</span>
                  <span>-</span>
                  <span>{result.underdogScore}</span>
                </div>
                <div className={`game-status ${result.status === "FINAL" ? "final-status" : ""}`}>
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
