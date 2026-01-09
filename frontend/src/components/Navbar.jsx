import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🐾</span>
          <span>ShelterSoul</span>
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/pets" className="nav-link">Browse Pets</Link>
          
          {user ? (
            <>
              {user.role === 'adopter' && (
                <>
                  <Link to="/favorites" className="nav-link">Favorites</Link>
                  <Link to="/my-adoptions" className="nav-link">My Requests</Link>
                </>
              )}
              {user.role === 'shelter' && (
                <>
                  <Link to="/add-pet" className="nav-link">Add Pet</Link>
                  <Link to="/adoptions" className="nav-link">Requests</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
              <div className="nav-user">
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
