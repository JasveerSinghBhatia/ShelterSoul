import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoriteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Favorites.css';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'adopter') {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const { data } = await favoriteAPI.getAll();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (petId) => {
    try {
      await favoriteAPI.remove(petId);
      setFavorites(favorites.filter((pet) => pet._id !== petId));
    } catch (error) {
      alert(error.response?.data?.message || 'Error removing favorite');
    }
  };

  if (!user || user.role !== 'adopter') {
    return <div className="error">Only adopters can view favorites</div>;
  }

  if (loading) {
    return <div className="loading">Loading favorites...</div>;
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>My Favorite Pets</h1>
        <p>{favorites.length} pet(s) in your favorites</p>
      </div>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>You haven't added any pets to favorites yet.</p>
          <Link to="/pets" className="btn btn-primary">
            Browse Pets
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((pet) => (
            <div key={pet._id} className="favorite-card">
              <div className="pet-image">
                {pet.images && pet.images.length > 0 ? (
                  <img src={`http://localhost:5050${pet.images[0]}`} alt={pet.name} />
                ) : (
                  <div className="no-image">🐾</div>
                )}
                {pet.adopted && <span className="adopted-badge">Adopted</span>}
              </div>
              <div className="pet-info">
                <h3>{pet.name}</h3>
                <p className="pet-breed">{pet.breed}</p>
                <p className="pet-age">Age: {pet.age} years</p>
                <div className="pet-actions">
                  <Link to={`/pets/${pet._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemove(pet._id)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
