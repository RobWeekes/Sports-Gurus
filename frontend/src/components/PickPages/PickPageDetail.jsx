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
          console.log("Fetched pick page data:", data);
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

  const handleBackToPages = () => {
    navigate("/pickpages");
  };

  const handleAddMorePicks = () => {
    navigate(`/games?pickPageId=${pageId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

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

  if (!sessionUser) {
    return (
      <div className="pick-page-detail">
        <h1>Pick Page Details</h1>
        <div className="login-prompt">
          <p>Please log in to view pick page details.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="pick-page-detail">
      <div className="page-header">
        <button className="back-button" onClick={handleBackToPages}>
          ← Back to Pick Pages
        </button>

        {!loading && !error && pickPage && (
          <button className="add-pick-button" onClick={handleAddMorePicks}>
            Add More Picks
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-indicator">Loading pick page...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : pickPage ? (
        <>
          <h1 className="page-title">{pickPage.pageName}</h1>
          <div className="page-info">
            <p className="created-date">Created: {formatDate(pickPage.createdAt)}</p>

            <div className="picks-summary">
              <div className="summary-item">
                <span className="summary-label">Total Picks:</span>
                <span className="summary-value">{pickPage.UserPicks?.length || 0}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Wins:</span>
                <span className="summary-value">
                  {pickPage.UserPicks?.filter(pick => pick.result === "WIN").length || 0}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Win Rate:</span>
                <span className="summary-value">
                  {pickPage.UserPicks?.length
                    ? Math.round((pickPage.UserPicks.filter(pick => pick.result === "WIN").length /
                      pickPage.UserPicks.length) * 100) + "%"
                    : "0%"}
                </span>
              </div>
            </div>
          </div>

          {pickPage.UserPicks?.length > 0 ? (
            <div className="picks-list">
              <h2 className="section-title">Your Picks</h2>
              <table className="picks-table">
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Date</th>
                    <th>League</th>
                    <th>Prediction Type</th>
                    <th>Prediction</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {pickPage.UserPicks.map(pick => (
                    <tr key={pick.id} className="pick-row">
                      <td>
                        {pick.ScheduledGame ?
                          `${pick.ScheduledGame.awayTeam} @ ${pick.ScheduledGame.homeTeam}` :
                          "Game details unavailable"}
                      </td>
                      <td>{pick.ScheduledGame ? formatDate(pick.ScheduledGame.gameDay) : "N/A"}</td>
                      <td>{pick.ScheduledGame ? pick.ScheduledGame.league : "N/A"}</td>
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
              <p>You haven&apos;t added any picks to this page yet.</p>
              <button onClick={handleAddMorePicks} className="add-pick-button">
                Add Your First Pick
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="not-found-message">Pick page not found.</div>
      )}
    </div>
  );
}



export default PickPageDetail;
