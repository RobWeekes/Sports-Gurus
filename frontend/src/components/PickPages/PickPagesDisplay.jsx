import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";
import "./PickPagesDisplay.css";


function PickPagesDisplay() {
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);
  // state, setter variables
  const [pickPages, setPickPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!sessionUser) {
      setLoading(false);
      return;
    }

    async function fetchPickPages() {
      try {
        setLoading(true);
        const response = await csrfFetch(`/api/pickpages/user/${sessionUser.id}`);

        if (response.ok) {
          const data = await response.json();
          setPickPages(data.pickPages || []);
          setError(null);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch pick pages");
        }
      } catch (err) {
        console.error("Error fetching pick pages:", err);
        setError("Failed to load pick pages. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPickPages();
  }, [sessionUser]);

  const handleCreatePage = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!newPageName.trim()) {
      setFormErrors({ pageName: "Page name is required" });
      return;
    }

    try {
      const response = await csrfFetch("/api/pickpages", {
        method: "POST",
        body: JSON.stringify({
          pageName: newPageName,
          user_id: sessionUser.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPickPages([...pickPages, data.pickPage]);
        setNewPageName("");
        setShowCreateForm(false);
      } else {
        const errorData = await response.json();
        setFormErrors(errorData.errors || { pageName: errorData.message });
      }
    } catch (err) {
      console.error("Error creating pick page:", err);
      setFormErrors({ general: "An unexpected error occurred. Please try again." });
    }
  };

  const handleViewPage = (pageId) => {
    navigate(`/pickpages/${pageId}`);
  };

  // // TO DO: ADD THIS EDIT function TO PICKS PAGE
  // const handleEditPage = (pageId) => {
  //   navigate(`/pickpages/${pageId}/edit`);
  // };

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
      <div className="pick-pages-display">
        <h1 className="section-title">My Pick Pages</h1>
        <div className="login-prompt">
          <p>Please log in to view and create pick pages.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="pick-pages-display">
      <div className="pick-pages-header">
        <h1 className="section-title">My Pick Pages</h1>
        <button
          className="create-button"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create New Page"}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form">
          <h2>Create New Pick Page</h2>
          <form onSubmit={handleCreatePage}>
            <div className="form-group">
              <label htmlFor="pageName">Page Name:</label>
              <input
                id="pageName"
                type="text"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                required
                placeholder="Enter a name for your pick page"
                maxLength={40}
              />
              {formErrors.pageName && (
                <p className="error-message">{formErrors.pageName}</p>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">
                Create
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPageName("");
                  setFormErrors({});
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-indicator">Loading pick pages...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : pickPages.length === 0 ? (
        <div className="no-pages-message">
          <p>You haven&apos;t created any pick pages yet.</p>
          {!showCreateForm && (
            <button
              className="create-button"
              onClick={() => setShowCreateForm(true)}
            >
              Create Your First Page
            </button>
          )}
        </div>
      ) : (
        <div className="pick-pages-list">
          {pickPages.map(page => (
            <div key={page.id} className="pick-page-card">
              <div className="pick-page-header">
                <h3 className="pick-page-name">{page.pageName}</h3>
                <span className="pick-page-date">Created: {formatDate(page.createdAt)}</span>
              </div>

              <div className="pick-page-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Picks:</span>
                  <span className="stat-value">{page.UserPicks?.length || page.totalPicks || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Wins:</span>
                  <span className="stat-value">{page.UserPicks?.filter(pick => pick.result === "WIN").length || page.correctPicks || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Win Rate:</span>
                  <span className="stat-value">
                    {/* {page.totalPicks ? ((page.correctPicks / page.totalPicks) * 100).toFixed(1) + "%" : "N/A"} */}
                    {page.UserPicks?.length ? Math.round((page.UserPicks.filter(pick => pick.result === "WIN").length /
                      page.UserPicks.length) * 100) + "%"
                      : "0%"}
                  </span>
                </div>
              </div>

              <div className="pick-page-actions">
                <button
                  className="view-button"
                  onClick={() => handleViewPage(page.id)}
                >View Picks
                </button>
                <button className="edit-button">Add Picks</button>
                {/* TO DO: ADD THIS EDIT BUTTON TO PICKS PAGE */}
                {/* <button
                  className="edit-button"
                  onClick={() => handleEditPage(page.id)}
                >
                  Edit Pick Page
                </button> */}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



export default PickPagesDisplay;
