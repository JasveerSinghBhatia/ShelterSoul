import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adoptionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MyAdoptions.css';

const MyAdoptions = () => {
  const { user } = useAuth();
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'adopter') {
      loadAdoptions();
    }
  }, [user]);

  const loadAdoptions = async () => {
    try {
      const { data } = await adoptionAPI.getMy();
      setAdoptions(data);
    } catch (error) {
      console.error('Error loading adoptions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'adopter') {
    return <div className="error">Only adopters can view their adoption requests</div>;
  }

  if (loading) {
    return <div className="loading">Loading your requests...</div>;
  }

  return (
    <div className="my-adoptions-page">
      <div className="adoptions-header">
        <h1>My Adoption Requests</h1>
        <p>{adoptions.length} request(s) submitted</p>
      </div>

      {adoptions.length === 0 ? (
        <div className="no-adoptions">
          <p>You haven't submitted any adoption requests yet.</p>
          <Link to="/pets" className="btn btn-primary">
            Browse Pets
          </Link>
        </div>
      ) : (
        <div className="adoptions-list">
          {adoptions.map((adoption) => (
            <div key={adoption._id} className="adoption-card">
              <div className="adoption-header">
                <div>
                  <h3>
                    <Link to={`/pets/${adoption.pet._id}`}>{adoption.pet.name}</Link>
                  </h3>
                  <p className="pet-breed">{adoption.pet.breed}</p>
                </div>
                <span className={`status-badge status-${adoption.status}`}>
                  {adoption.status}
                </span>
              </div>

              <div className="adoption-info">
                {adoption.message && (
                  <div className="adoption-message">
                    <strong>Your message:</strong>
                    <p>{adoption.message}</p>
                  </div>
                )}
                <div className="adoption-date">
                  Submitted on: {new Date(adoption.createdAt).toLocaleDateString()}
                </div>
                {adoption.pet.adopted && (
                  <div className="adoption-note">
                    {adoption.status === 'approved' ? '✅ This pet has been adopted!' : 'This pet is no longer available'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAdoptions;
