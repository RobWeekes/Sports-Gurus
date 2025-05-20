import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { csrfFetch } from "../../store/csrf";
import "./PredictionModal.css";


function PredictionModal({ game, pageId }) {
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);

  const [predictionType, setPredictionType] = useState("spread");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pickPages, setPickPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(pageId || "");
  const [showNewPageInput, setShowNewPageInput] = useState(false);
  const [newPageName, setNewPageName] = useState("");

  // fetch user's pick pages
  useEffect(() => {
    if (!sessionUser) return;

    async function fetchPickPages() {
      try {
        const response = await csrfFetch(`/api/pickpages/user/${sessionUser.id}`);
        if (response.ok) {
          const data = await response.json();
          setPickPages(data.pickPages || []);
          if (!pageId && data.pickPages?.length > 0) {
            setSelectedPageId(data.pickPages[0].id.toString());
          }
        }
      } catch (err) {
        console.error("Error fetching pick pages:", err);
        setError("Failed to load your pick pages");
      }
    }

    fetchPickPages();
  }, [sessionUser, pageId]);

  const handleCreateNewPage = async () => {
    if (!newPageName.trim()) {
      setError("Please enter a name for your new pick page");
      return;
    }

    try {
      setLoading(true);
      const response = await csrfFetch("/api/pickpages", {
        method: "POST",
        body: JSON.stringify({
          pageName: newPageName
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPickPages([...pickPages, data.pickPage]);
        setSelectedPageId(data.pickPage.id.toString());
        setShowNewPageInput(false);
        setNewPageName("");
        setError("");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create new pick page");
      }
    } catch (err) {
      console.error("Error creating pick page:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prediction) {
      setError("Please select a prediction");
      return;
    }

    if (!selectedPageId) {
      setError("Please select a pick page");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await csrfFetch("/api/picks", {
        method: "POST",
        body: JSON.stringify({
          page_id: selectedPageId,
          game_id: game.id,
          predictionType,
          prediction
        })
      });

      if (response.ok) {
        setSuccess("Prediction saved successfully!");
        setTimeout(() => {
          closeModal();
          // If we came from a pick page, navigate back to it
          if (pageId) {
            navigate(`/pickpages/${pageId}`);
          }
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save prediction");
      }
    } catch (err) {
      console.error("Error saving prediction:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="prediction-modal">
      <h2>Make a Prediction</h2>

      <div className="game-info">
        <div className="game-teams">
          <span className="away-team">{game.awayTeam}</span>
          <span className="vs">vs</span>
          <span className="home-team">{game.homeTeam}</span>
        </div>
        <div className="game-date">
          {new Date(game.gameDay).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
          })}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pickPage">Add to Pick Page:</label>
          {showNewPageInput ? (
            <div className="new-page-input">
              <input
                type="text"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="Enter page name"
              />
              <div className="new-page-actions">
                <button
                  type="button"
                  onClick={handleCreateNewPage}
                  disabled={loading}
                  className="create-page-button"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPageInput(false)}
                  className="cancel-new-page-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="page-selection">
              <select
                id="pickPage"
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
                required
              >
                <option value="" disabled>Select a pick page</option>
                {pickPages.map(page => (
                  <option key={page.id} value={page.id}>
                    {page.pageName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewPageInput(true)}
                className="new-page-button"
              >
                + New Page
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="predictionType">Prediction Type:</label>
          <div className="prediction-type-options">
            <button
              type="button"
              className={`prediction-type-option ${predictionType === "spread" ? "selected" : ""}`}
              onClick={() => setPredictionType("spread")}
            >
              Point Spread
            </button>
            <button
              type="button"
              className={`prediction-type-option ${predictionType === "total" ? "selected" : ""}`}
              onClick={() => setPredictionType("total")}
            >
              Over/Under
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Your Prediction:</label>
          <div className="prediction-options">
            {predictionType === "spread" && (
              <>
                <button
                  type="button"
                  className={`prediction-option ${prediction === game.awayTeam ? "selected" : ""}`}
                  onClick={() => setPrediction(game.awayTeam)}
                >
                  {game.awayTeam}
                </button>
                <button
                  type="button"
                  className={`prediction-option ${prediction === game.homeTeam ? "selected" : ""}`}
                  onClick={() => setPrediction(game.homeTeam)}
                >
                  {game.homeTeam}
                </button>
              </>
            )}

            {predictionType === "total" && (
              <>
                <button
                  type="button"
                  className={`prediction-option ${prediction === "OVER" ? "selected" : ""}`}
                  onClick={() => setPrediction("OVER")}
                >
                  Over
                </button>
                <button
                  type="button"
                  className={`prediction-option ${prediction === "UNDER" ? "selected" : ""}`}
                  onClick={() => setPrediction("UNDER")}
                >
                  Under
                </button>
              </>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={closeModal}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading || !prediction || !selectedPageId}
          >
            {loading ? "Saving..." : "Submit Prediction"}
          </button>
        </div>
      </form>
    </div>
  );
}



export default PredictionModal;
