import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { csrfFetch } from "../../store/csrf";
import "./PredictionModal.css";


function PredictionModal({ game }) {
  const { closeModal } = useModal();
  const sessionUser = useSelector(state => state.session.user);

  const [predictionType, setPredictionType] = useState("POINT SPREAD");
  const [prediction, setPrediction] = useState("");
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [newPageName, setNewPageName] = useState("");
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // fetch user's pick pages
  useEffect(() => {
    async function fetchPages() {
      try {
        const response = await csrfFetch("/api/pickpages");
        if (response.ok) {
          const data = await response.json();
          setPages(data.pickPages || []);

          // select the first page by default if available
          if (data.pickPages && data.pickPages.length > 0) {
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
  }, [sessionUser]);

  // create a new pick page
  const handleCreatePage = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!newPageName.trim()) {
      setErrors({ pageName: "Page name is required" });
      return;
    }

    try {
      const response = await csrfFetch("/api/pickpages", {
        method: "POST",
        body: JSON.stringify({ pageName: newPageName })
      });

      if (response.ok) {
        const data = await response.json();
        setPages([...pages, data.pickPage]);
        setSelectedPage(data.pickPage.id.toString());
        setShowNewPageForm(false);
        setNewPageName("");
      } else {
        const data = await response.json();
        setErrors({ pageName: data.message || "Failed to create page" });
      }
    } catch (error) {
      console.error("Error creating page:", error);
      setErrors({ pageName: "Failed to create page" });
    }
  };

  // submit the prediction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // validate inputs
    const validationErrors = {};
    if (!selectedPage) validationErrors.page = "Please select or create a page";
    if (!predictionType) validationErrors.predictionType = "Please select a prediction type";
    if (!prediction) validationErrors.prediction = "Please make a prediction";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await csrfFetch("/api/picks", {
        method: "POST",
        body: JSON.stringify({
          page_id: parseInt(selectedPage),
          game_id: game.id,
          predictionType,
          prediction
        })
      });

      if (response.ok) {
        closeModal();
      } else {
        const data = await response.json();
        setErrors(data.errors || { general: data.message });
      }
    } catch (error) {
      console.error("Error submitting prediction:", error);
      setErrors({ general: "Failed to submit prediction" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="prediction-modal">
      <h2>Make a Prediction</h2>

      <div className="game-info">
        <div className="game-teams">
          <span className="home-team">{game.homeTeam}</span>
          <span className="vs">vs</span>
          <span className="away-team">{game.awayTeam}</span>
        </div>
        <div className="game-date">
          {new Date(game.gameDay).toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* pick page selection */}
        <div className="form-group">
          <label htmlFor="page-select">Add to Pick Page:</label>
          {showNewPageForm ? (
            <div className="new-page-form">
              <input
                type="text"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="Enter page name"
              />
              <button
                type="button"
                onClick={handleCreatePage}
                className="create-page-btn"
              >
                Create
              </button>
              {pages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewPageForm(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              )}
              {errors.pageName && <p className="error">{errors.pageName}</p>}
            </div>
          ) : (
            <div className="page-select-container">
              <select
                id="page-select"
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
              >
                {pages.map(page => (
                  <option key={page.id} value={page.id}>
                    {page.pageName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewPageForm(true)}
                className="new-page-btn"
              >
                + New Page
              </button>
            </div>
          )}
          {errors.page && <p className="error">{errors.page}</p>}
        </div>

        {/* prediction type */}
        <div className="form-group">
          <label>Prediction Type:</label>
          <div className="prediction-type-options">
            <label className="radio-label">
              <input
                type="radio"
                name="predictionType"
                value="POINT SPREAD"
                checked={predictionType === "POINT SPREAD"}
                onChange={() => setPredictionType("POINT SPREAD")}
              />
              Point Spread
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="predictionType"
                value="OVER / UNDER"
                checked={predictionType === "OVER / UNDER"}
                onChange={() => setPredictionType("OVER / UNDER")}
              />
              Over/Under
            </label>
          </div>
          {errors.predictionType && <p className="error">{errors.predictionType}</p>}
        </div>

        {/* prediction selection */}
        <div className="form-group">
          <label>Your Prediction:</label>
          {predictionType === "POINT SPREAD" ? (
            <div className="team-selection">
              <button
                type="button"
                className={`team-btn ${prediction === game.homeTeam ? 'selected' : ''}`}
                onClick={() => setPrediction(game.homeTeam)}
              >
                {game.homeTeam}
              </button>
              <button
                type="button"
                className={`team-btn ${prediction === game.awayTeam ? 'selected' : ''}`}
                onClick={() => setPrediction(game.awayTeam)}
              >
                {game.awayTeam}
              </button>
            </div>
          ) : (
            <div className="over-under-selection">
              <button
                type="button"
                className={`over-under-btn ${prediction === "OVER" ? 'selected' : ''}`}
                onClick={() => setPrediction("OVER")}
              >
                OVER
              </button>
              <button
                type="button"
                className={`over-under-btn ${prediction === "UNDER" ? 'selected' : ''}`}
                onClick={() => setPrediction("UNDER")}
              >
                UNDER
              </button>
            </div>
          )}
          {errors.prediction && <p className="error">{errors.prediction}</p>}
        </div>

        {errors.general && <p className="error general-error">{errors.general}</p>}

        <div className="form-actions">
          <button type="button" onClick={closeModal} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Prediction"}
          </button>
        </div>
      </form>
    </div>
  );
}



export default PredictionModal;
