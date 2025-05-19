import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./HomePage.css";


function HomePage() {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Welcome to Sports Gurus</h1>
        <p>Your ultimate platform for sports predictions and analysis</p>

        {!sessionUser && (
          <div className="cta-buttons">
            <Link to="/games" className="cta-button primary">Browse Games</Link>
            <Link to="/results" className="cta-button secondary">View Results</Link>
          </div>
        )}
      </section>

      <section className="features-section">
        <h2 className="section-title">What We Offer</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Live Game Tracking</h3>
            <p>Stay updated with all the latest games across multiple sports leagues.</p>
          </div>

          <div className="feature-card">
            <h3>Make Predictions</h3>
            <p>Create your own pick pages and predict outcomes for upcoming games.</p>
          </div>

          <div className="feature-card">
            <h3>Track Results</h3>
            <p>See how your predictions stack up against the actual results.</p>
          </div>

          <div className="feature-card">
            <h3>Compete with Friends</h3>
            <p>Share your pick pages and compete with friends to see who&apos;s the ultimate sports guru.</p>
          </div>
        </div>
      </section>

      {sessionUser && (
        <section className="user-dashboard">
          <h2 className="section-title">Your Dashboard</h2>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Your Picks</h3>
              <p>View and manage your pick pages</p>
              <Link to="/pickpages" className="dashboard-link">Go to My Picks</Link>
            </div>

            <div className="dashboard-card">
              <h3>Today&apos;s Games</h3>
              <p>Check out today&apos;s lineup and make your predictions</p>
              <Link to="/games" className="dashboard-link">View Games</Link>
            </div>

            <div className="dashboard-card">
              <h3>Recent Results</h3>
              <p>See the latest game results and how your picks performed</p>
              <Link to="/results" className="dashboard-link">View Results</Link>
            </div>

            <div className="dashboard-card">
              <h3>Profile Settings</h3>
              <p>Update your profile information and preferences</p>
              <Link to="/profile/settings" className="dashboard-link">Edit Profile</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}



export default HomePage;
