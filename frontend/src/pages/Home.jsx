import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Pet Companion</h1>
          <p className="hero-subtitle">
            Connect with loving pets waiting for their forever home
          </p>
          <div className="hero-buttons">
            <Link to="/pets" className="btn btn-primary">
              Browse Pets
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-secondary">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose ShelterSoul?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏠</div>
              <h3>Safe Adoption</h3>
              <p>Verified shelters and secure adoption process</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h3>Save Lives</h3>
              <p>Give a loving home to pets in need</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Easy Search</h3>
              <p>Find your perfect match with advanced filters</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💝</div>
              <h3>Support</h3>
              <p>24/7 support throughout your adoption journey</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
