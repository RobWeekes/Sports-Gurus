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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRenameForm, setShowRenameForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          setNewPageName(data.pickPage.pageName);
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

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowRenameForm(false);
    setShowDeleteConfirm(false);
  };

  const handleRenameClick = () => {
    setShowRenameForm(true);
    setShowDeleteConfirm(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setShowRenameForm(false);
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!newPageName.trim() || newPageName === pickPage.pageName) {
      handleCloseModal();
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await csrfFetch(`/api/pickpages/${pageId}`, {
        method: "PUT",
        body: JSON.stringify({ pageName: newPageName })
      });

      if (response.ok) {
        const data = await response.json();
        setPickPage(data.pickPage);
        handleCloseModal();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update page name");
      }
    } catch (err) {
      console.error("Error updating page name:", err);
      setError("Failed to update page name. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      const response = await csrfFetch(`/api/pickpages/${pageId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        navigate("/pickpages");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete page");
        handleCloseModal();
      }
    } catch (err) {
      console.error("Error deleting page:", err);
      setError("Failed to delete page. Please try again.");
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPicks = () => {
    navigate(`/games?pageId=${pageId}`);
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
        <button className="edit-button" onClick={handleEditClick}>
          Edit Page
        </button>
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

      <div className="page-actions">
        <button
          className="back-button"
          onClick={() => navigate("/pickpages")}
        >
          Back to My Pages
        </button>
        <button
          className="add-picks-button"
          onClick={handleAddPicks}
        >
          Add More Picks
        </button>
      </div>

      {pickPage.UserPicks?.length > 0 ? (
        <div className="picks-list">
          <h2 className="section-title">Your Picks</h2>
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
            onClick={handleAddPicks}
          >
            Add Your First Pick
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="edit-modal" onClick={e => e.stopPropagation()}>
            {!showRenameForm && !showDeleteConfirm ? (
              <>
                <h3>Edit Page Options</h3>
                <button className="rename-button" onClick={handleRenameClick}>
                  Change Page Name
                </button>
                <button className="delete-button" onClick={handleDeleteClick}>
                  Delete Page
                </button>
                <button className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
              </>
            ) : showRenameForm ? (
              <form onSubmit={handleRenameSubmit} className="rename-form">
                <h3>Rename Page</h3>
                <div className="form-group">
                  <label htmlFor="pageName">New Page Name:</label>
                  <input
                    type="text"
                    id="pageName"
                    value={newPageName}
                    onChange={e => setNewPageName(e.target.value)}
                    required
                    maxLength={40}
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-button"
                    disabled={isSubmitting || !newPageName.trim() || newPageName === pickPage.pageName}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="delete-confirm">
                <h3>Delete Page</h3>
                <p>Are you sure you want to delete this page? This action cannot be undone.</p>
                <div className="form-actions">
                  <button
                    className="delete-confirm-button"
                    onClick={handleDeleteConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Deleting..." : "Delete Page"}
                  </button>
                  <button
                    className="cancel-button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



export default PickPageDetail;
