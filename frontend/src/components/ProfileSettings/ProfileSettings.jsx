import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as sessionActions from "../../store/session";
import ProfileIconSelector from "../SportIcon/ProfileIconSelector"; //
// import SportIcon from "../SportIcon/SportIcon";
// import { updateProfile } from "../../store/session";
import "./ProfileSettings.css";


function ProfileSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);

  const [aboutMe, setAboutMe] = useState("");
  const [sportIcon, setSportIcon] = useState("usercircle");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionUser) {
      navigate("/");
      return;
    }

    // initialize form with user data
    setAboutMe(sessionUser.aboutMe || "");
    setSportIcon(sessionUser.sportIcon || "usercircle");
  }, [sessionUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sessionUser) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await dispatch(sessionActions.updateProfile(sessionUser.id, {
        aboutMe,
        sportIcon
      }));

      setSuccess(true);

      // reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIcon = (iconId) => {
    setSportIcon(iconId);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    // reset form to original values
    // setAboutMe(sessionUser.aboutMe || "");
    setSportIcon(sessionUser.sportIcon || "usercircle");
    // and navigate away
    if (window.history.length > 1) {
      navigate(-1);
    } else {  // fallback to home if there"s no history
      navigate("/");
    }
  };

  if (!sessionUser) return null;

  return (
    <div className="profile-settings">
      <h1 className="section-title">Profile Settings</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Profile updated successfully!</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Profile Icon</h2>
          <div className="icon-selection">
            <ProfileIconSelector
              currentIcon={sportIcon}
              onSelectIcon={handleSelectIcon}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>About Me</h2>
          <div className="form-group">
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              maxLength={300}
              placeholder="Tell us about yourself (max 300 characters)"
              rows={5}
            />
            <div className="char-count">{aboutMe.length}/300</div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="save-button"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="account-info">
        <h2>Account Information</h2>
        <div className="info-item">
          <span className="info-label">Username:</span>
          <span className="info-value">{sessionUser.userName}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Name:</span>
          <span className="info-value">{sessionUser.firstName} {sessionUser.lastName}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Email:</span>
          <span className="info-value">{sessionUser.email}</span>
        </div>
      </div>
    </div>
  );
}



export default ProfileSettings;
