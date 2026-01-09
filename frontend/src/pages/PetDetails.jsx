import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petAPI, adoptionAPI, favoriteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PetDetails.css';

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [adoptionMessage, setAdoptionMessage] = useState('');
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);

  useEffect(() => {
    loadPet();
    if (user && user.role === 'adopter') {
      checkFavorite();
    }
  }, [id, user]);

  const loadPet = async () => {
    try {
      const { data } = await petAPI.getById(id);
      setPet(data);
    } catch (error) {
      console.error('Error loading pet:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const { data } = await favoriteAPI.getAll();
      setIsFavorite(data.some((f) => f._id === id));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await favoriteAPI.remove(id);
        setIsFavorite(false);
      } else {
        await favoriteAPI.add(id);
        setIsFavorite(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating favorite');
    }
  };

  const handleAdoptionRequest = async (e) => {
    e.preventDefault();
    try {
      await adoptionAPI.request(id, adoptionMessage);
      alert('Adoption request submitted successfully!');
      setShowAdoptionForm(false);
      setAdoptionMessage('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting request');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;
    
    try {
      await petAPI.delete(id);
      navigate('/pets');
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting pet');
    }
  };

  if (loading) {
    return <div className="loading">Loading pet details...</div>;
  }

  if (!pet) {
    return <div className="error">Pet not found</div>;
  }

  const isOwner = user && pet.shelter._id === user._id;

  return (
    <div className="pet-details">
      <div className="pet-details-container">
        <div className="pet-images">
          {pet.images && pet.images.length > 0 ? (
            <div className="image-gallery">
              {pet.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5050${img}`}
                  alt={`${pet.name} ${idx + 1}`}
                />
              ))}
            </div>
          ) : (
            <div className="no-image-large">🐾</div>
          )}
        </div>

        <div className="pet-details-info">
          <div className="pet-header">
            <h1>{pet.name}</h1>
            {pet.adopted && <span className="adopted-badge">Adopted</span>}
          </div>

          <div className="pet-meta">
            <div className="meta-item">
              <strong>Breed:</strong> {pet.breed}
            </div>
            <div className="meta-item">
              <strong>Age:</strong> {pet.age} years
            </div>
            <div className="meta-item">
              <strong>Shelter:</strong> {pet.shelter.name}
            </div>
          </div>

          {pet.description && (
            <div className="pet-description">
              <h3>About</h3>
              <p>{pet.description}</p>
            </div>
          )}

          <div className="pet-actions">
            {user ? (
              <>
                {user.role === 'adopter' && !pet.adopted && (
                  <>
                    <button
                      onClick={handleFavorite}
                      className={`btn ${isFavorite ? 'btn-secondary' : 'btn-primary'}`}
                    >
                      {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                    </button>
                    <button
                      onClick={() => setShowAdoptionForm(!showAdoptionForm)}
                      className="btn btn-primary"
                    >
                      Request Adoption
                    </button>
                  </>
                )}
                {isOwner && (
                  <>
                    <button
                      onClick={() => navigate(`/edit-pet/${id}`)}
                      className="btn btn-secondary"
                    >
                      Edit Pet
                    </button>
                    <button onClick={handleDelete} className="btn btn-danger">
                      Delete Pet
                    </button>
                  </>
                )}
              </>
            ) : (
              <p>Please login to interact with pets</p>
            )}
          </div>

          {showAdoptionForm && (
            <form onSubmit={handleAdoptionRequest} className="adoption-form">
              <h3>Adoption Request</h3>
              <textarea
                value={adoptionMessage}
                onChange={(e) => setAdoptionMessage(e.target.value)}
                placeholder="Tell us why you'd like to adopt this pet..."
                rows="4"
                required
              />
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdoptionForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
