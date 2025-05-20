import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { csrfFetch } from "../../store/csrf";
import "./PredictionModal.css";


function PredictionModal({ game, preSelectedPageId }) {
  const { closeModal } = useModal();
  const sessionUser = useSelector(state => state.session.user);
  const [predictionType, setPredictionType] = useState("winner");
  const [prediction, setPrediction] = useState("");
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [newPageName, setNewPageName] = useState("");
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // fetch user"s pick pages
  useEffect(() => {
    async function fetchPages() {
      try {
        const response = await csrfFetch("/api/pickpages");
        if (response.ok) {
          const data = await response.json();
          setPages(data.pickPages || []);

          // if preSelectedPageId is provided, use it
          if (preSelectedPageId) {
            setSelectedPage(preSelectedPageId);
            // clear it from sessionStorage after using it once
            sessionStorage.removeItem("selectedPickPageId");
          }
          // otherwise select the first page by default if available
          else if (data.pickPages && data.pickPages.length > 0) {
            setSelectedPage(data.pickPages[0].id.toString());
          } else {
            // if no pages exist, show the new page form
            setShowNewPageForm(true);
          }
        }
      } catch (error) {
        console.error("Error fetching pick pages:", error);
      }
    }

    if (sessionUser) {
      fetchPages();
    }
  }, [sessionUser, preSelectedPageId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!prediction) {
      setErrors({ prediction: "Please select a prediction" });
      return;
    }

    if (!selectedPage && !newPageName) {
      setErrors({ page: "Please select a pick page or create a new one" });
      return;
    }

    try {
      setIsSubmitting(true);

      // if creating a new page
      let pageId = selectedPage;
      if (showNewPageForm) {
        if (!newPageName.trim()) {
          setErrors({ newPageName: "Page name is required" });
          setIsSubmitting(false);
          return;
        }

        // Create new pick page
        const pageResponse = await csrfFetch("/api/pickpages", {
          method: "POST",
          body: JSON.stringify({
            pageName: newPageName,
            user_id: sessionUser.id
          })
        });

        if (!pageResponse.ok) {
          const pageError = await pageResponse.json();
          setErrors(pageError.errors || { general: pageError.message });
          setIsSubmitting(false);
          return;
        }

        const pageData = await pageResponse.json();
        pageId = pageData.pickPage.id;
      }

      // Create the pick
      const response = await csrfFetch("/api/picks", {
        method: "POST",
        body: JSON.stringify({
          user_id: sessionUser.id,
          page_id: pageId,
          game_id: game.id,
          predictionType,
          prediction
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          closeModal();
        }, 1500);
      } else {
        const data = await response.json();
        setErrors(data.errors || { general: data.message });
      }
    } catch (err) {
      console.error("Error submitting prediction:", err);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePredictionTypeChange = (e) => {
    setPredictionType(e.target.value);
    setPrediction(""); // Reset prediction when type changes
  };

  const handlePageChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setShowNewPageForm(true);
      setSelectedPage("");
    } else {
      setShowNewPageForm(false);
      setSelectedPage(value);
    }
  };


  return (
    <div className="prediction-modal">
      <h2>Make a Prediction</h2>

      <div className="game-info">
        <div className="game-teams-modal">
          <span className="team-name">{game.awayTeam}</span>
          <span className="vs">@</span>
          <span className="team-name">{game.homeTeam}</span>
        </div>
        <div className="game-details">
          <span className="league">{game.league}</span>
          <span className="date">
            {new Date(game.gameDay).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>
      </div>

      {success ? (
        <div className="success-message">
          <p>Your prediction has been saved!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Prediction Type:</label>
            <div className="prediction-type-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="predictionType"
                  value="winner"
                  checked={predictionType === "winner"}
                  onChange={handlePredictionTypeChange}
                />
                Winner
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="predictionType"
                  value="spread"
                  checked={predictionType === "spread"}
                  onChange={handlePredictionTypeChange}
                />
                Against Spread
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="predictionType"
                  value="total"
                  checked={predictionType === "total"}
                  onChange={handlePredictionTypeChange}
                />
                Over/Under
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Your Prediction:</label>
            {predictionType === "winner" && (
              <div className="prediction-options">
                <button
                  type="button"
                  className={`team-button ${prediction === game.awayTeam ? "selected" : ""}`}
                  onClick={() => setPrediction(game.awayTeam)}
                >
                  {game.awayTeam} Win
                </button>
                <button
                  type="button"
                  className={`team-button ${prediction === game.homeTeam ? "selected" : ""}`}
                  onClick={() => setPrediction(game.homeTeam)}
                >
                  {game.homeTeam} Win
                </button>
              </div>
            )}

            {predictionType === "spread" && (
              <div className="prediction-options">
                <button
                  type="button"
                  className={`team-button ${prediction === game.awayTeam ? "selected" : ""}`}
                  onClick={() => setPrediction(game.awayTeam)}
                >
                  {game.awayTeam} Cover
                </button>
                <button
                  type="button"
                  className={`team-button ${prediction === game.homeTeam ? "selected" : ""}`}
                  onClick={() => setPrediction(game.homeTeam)}
                >
                  {game.homeTeam} Cover
                </button>
              </div>
            )}

            {predictionType === "total" && (
              <div className="prediction-options">
                <button
                  type="button"
                  className={`team-button ${prediction === "OVER" ? "selected" : ""}`}
                  onClick={() => setPrediction("OVER")}
                >
                  Over
                </button>
                <button
                  type="button"
                  className={`team-button ${prediction === "UNDER" ? "selected" : ""}`}
                  onClick={() => setPrediction("UNDER")}
                >
                  Under
                </button>
              </div>
            )}

            {errors.prediction && <p className="error-message">{errors.prediction}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="pickPage">Add to Pick Page:</label>
            <select
              id="pickPage"
              value={selectedPage}
              onChange={handlePageChange}
            >
              <option value="">Select a Pick Page</option>
              {pages.map(page => (
                <option key={page.id} value={page.id}>
                  {page.pageName}
                </option>
              ))}
              <option value="new">+ Create New Pick Page</option>
            </select>
            {errors.page && <p className="error-message">{errors.page}</p>}
          </div>

          {showNewPageForm && (
            <div className="form-group">
              <label htmlFor="newPageName">New Page Name:</label>
              <input
                id="newPageName"
                type="text"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="Enter a name for your new pick page"
                maxLength={40}
              />
              {errors.newPageName && <p className="error-message">{errors.newPageName}</p>}
            </div>
          )}

          {errors.general && <p className="error-message general-error">{errors.general}</p>}

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Prediction"}
            </button>
            <button type="button" className="cancel-button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}


export default PredictionModal;
