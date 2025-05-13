import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileIconSelector from "../SportIcon/ProfileIconSelector"; //
import SportIcon from "../SportIcon/SportIcon";
import { updateProfile } from "../../store/session";
import "./ProfilePage.css";


function ProfilePage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [aboutMe, setAboutMe] = useState(sessionUser?.aboutMe || "");
  const [sportIcon, setSportIcon] = useState(sessionUser?.sportIcon || "usercircle");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  // retrieve aboutMe, sportIcon from logged in user session
  useEffect(() => {
    if (sessionUser) {
      setAboutMe(sessionUser.aboutMe || "");
      setSportIcon(sessionUser.sportIcon || "usercircle");
    }
  }, [sessionUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with sportIcon:", sportIcon);

    try {
      const result = await dispatch(updateProfile(sessionUser.id, {
        aboutMe,
        sportIcon
      }));
      console.log("Profile update result:", result);

      setMessage("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    }
  };

  // only update local state when an icon is selected, then when user clicks out of icon menu, dispatch the last clicked icon to store & db
  const handleSelectIcon = (iconId, isTemporary) => {
    console.log("Selected icon:", iconId);
    setSportIcon(iconId);   // updates the local component state
    // only dispatch if this is not a temporary update
    if (!isTemporary && sessionUser && sessionUser.id) {
      dispatch(updateProfile(sessionUser.id, {
        sportIcon: iconId
      }));
    }
  }; // this should batch the API calls, only sending the final selection to the server when the user clicks outside the dropdown - while also providing immediate visual feedback in the user"s local UI.

  if (!sessionUser) return null;


  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {message && <div className="profile-message">{message}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sportIcon">Choose Your Profile Icon</label>
            <ProfileIconSelector
              currentIcon={sportIcon}
              onSelectIcon={handleSelectIcon}
            />
          </div>

          <div className="form-group">
            <label htmlFor="aboutMe">About Me</label>
            <textarea
              id="aboutMe"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              maxLength={300}
              placeholder="Tell us about yourself (max 300 characters)"
              rows={5}
            />
            <div className="char-count">{aboutMe.length}/300</div>
          </div>

          <div className="button-group">
            <button type="submit" className="save-button">Save Changes</button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setIsEditing(false);
                setAboutMe(sessionUser.aboutMe || "");
                setSportIcon(sessionUser.sportIcon || "usercircle");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-display">
          <div className="profile-header">
            <div className="user-icon">
              {/* display profile icon next to user info */}
              <SportIcon sporticon={sportIcon} size="3em" />
            </div>
            <div className="user-info">
              <h2>{sessionUser.firstName} {sessionUser.lastName}</h2>
              <p>{sessionUser.userName}</p>
              <p>{sessionUser.email}</p>
            </div>
          </div>

          <div className="about-section">
            <h3>About Me</h3>
            <p>{aboutMe || "Not provided yet."}</p>
          </div>

          <button
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}



export default ProfilePage;
