import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { csrfFetch } from "../../store/csrf";
import "./PickPageDetail.css";


function PickPageDetail() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);

  const [pickPage, setPickPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionUser) {
      setLoading(false);
      return;
    }

    async function fetchPickPage() {
      try {
        setLoading(true);
        const response = await csrfFetch(`/api/pickpages/${pageId}`);

        if (response.ok) {
          const data = await response.json();
          setPickPage(data.pickPage);
          setError(null);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch pick page");
        }
      } catch (err) {
        console.error("Error fetching pick page:", err);
        setError("Failed to load pick page. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPickPage();
  }, [pageId, sessionUser]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!sessionUser) {
    return (
      <div className="pick-page-detail">
        <h1 className="section-title">Pick Page Details</h1>
        <div className="login-prompt">
          <p>Please log in to view pick pages.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pick-page-detail">
        <div className="loading-indicator">Loading pick page...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pick-page-detail">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!pickPage) {
    return (
      <div className="pick-page-detail">
        <div className="not-found-message">Pick page not found.</div>
      </div>
    );
  }

  return (
    <div className="pick-page-detail">
      <div className="page-header">
        <h1 className="page-title">{pickPage.pageName}</h1>
        <p className="page-date">
          Created: {formatDate(pickPage.createdAt)}
        </p>
      </div>

      <div className="picks-summary">
        <div className="summary-item">
          <span className="summary-label">Total Picks</span>
          <span className="summary-value">{pickPage.UserPicks?.length || 0}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Wins</span>
          <span className="summary-value">
            {pickPage.UserPicks?.filter(pick => pick.result === "WIN").length || 0}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Win Rate</span>
          <span className="summary-value">
            {pickPage.UserPicks?.length
              ? Math.round((pickPage.UserPicks.filter(pick => pick.result === "WIN").length /
                pickPage.UserPicks.length) * 100) + "%"
              : "0%"}
          </span>
        </div>
      </div>

      {pickPage.UserPicks?.length > 0 ? (
        <div className="picks-list">
          <h2 className="section-title">Your Picks</h2>
            <button
              className="back-button"
              onClick={() => navigate("/pickpages")}
            >
              Back to My Pages
            </button>
          <table className="picks-table">
            <thead>
              <tr>
                <th>Game</th>
                <th>Type</th>
                <th>Prediction</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {pickPage.UserPicks.map(pick => (
                <tr key={pick.id} className={`pick-row ${pick.result.toLowerCase()}`}>
                  <td>{pick.ScheduledGame ?
                    `${pick.ScheduledGame.awayTeam} @ ${pick.ScheduledGame.homeTeam}` :
                    `Game #${pick.game_id}`}
                  </td>
                  <td>{pick.predictionType}</td>
                  <td>{pick.prediction}</td>
                  <td className={`result ${pick.result.toLowerCase()}`}>{pick.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-picks-message">
          <p>You haven&apos;t made any picks for this page yet.</p>
          <button
            className="add-pick-button"
            onClick={() => navigate("/games")}
          >
            Add Your First Pick
          </button>
        </div>
      )}
    </div>
  );
}


export default PickPageDetail;
