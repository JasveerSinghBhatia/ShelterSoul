import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adoptionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Adoptions.css';

const Adoptions = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'shelter') {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      const { data } = await adoptionAPI.getAll();
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adoptionAPI.updateStatus(id, status);
      loadRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  if (!user || user.role !== 'shelter') {
    return <div className="error">Only shelters can view adoption requests</div>;
  }

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  return (
    <div className="adoptions-page">
      <div className="adoptions-header">
        <h1>Adoption Requests</h1>
        <p>{requests.length} request(s) for your pets</p>
      </div>

      {requests.length === 0 ? (
        <div className="no-requests">
          <p>No adoption requests yet.</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <div>
                  <h3>
                    <Link to={`/pets/${request.pet._id}`}>{request.pet.name}</Link>
                  </h3>
                  <p className="pet-breed">{request.pet.breed}</p>
                </div>
                <span className={`status-badge status-${request.status}`}>
                  {request.status}
                </span>
              </div>

              <div className="request-info">
                <div className="requester-info">
                  <strong>Requested by:</strong> {request.user.name} ({request.user.email})
                </div>
                {request.message && (
                  <div className="request-message">
                    <strong>Message:</strong>
                    <p>{request.message}</p>
                  </div>
                )}
                <div className="request-date">
                  Requested on: {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="request-actions">
                  <button
                    onClick={() => handleStatusUpdate(request._id, 'approved')}
                    className="btn btn-success"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(request._id, 'rejected')}
                    className="btn btn-danger"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Adoptions;
