import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadShelters();
    }
  }, [user]);

  const loadShelters = async () => {
    try {
      const { data } = await adminAPI.getShelters();
      setShelters(data);
    } catch (error) {
      console.error('Error loading shelters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shelterId) => {
    try {
      await adminAPI.approveShelter(shelterId);
      loadShelters();
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving shelter');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      loadShelters();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting user');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="error">Only admins can access this page</div>;
  }

  if (loading) {
    return <div className="loading">Loading shelters...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage shelters and users</p>
      </div>

      <div className="shelters-section">
        <h2>Shelters ({shelters.length})</h2>
        
        {shelters.length === 0 ? (
          <div className="no-data">No shelters found</div>
        ) : (
          <div className="shelters-list">
            {shelters.map((shelter) => (
              <div key={shelter._id} className="shelter-card">
                <div className="shelter-info">
                  <h3>{shelter.name}</h3>
                  <p className="shelter-email">{shelter.email}</p>
                  <span className={`approval-badge ${shelter.isApproved ? 'approved' : 'pending'}`}>
                    {shelter.isApproved ? '✅ Approved' : '⏳ Pending'}
                  </span>
                </div>
                <div className="shelter-actions">
                  {!shelter.isApproved && (
                    <button
                      onClick={() => handleApprove(shelter._id)}
                      className="btn btn-success"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(shelter._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
