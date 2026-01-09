import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AddPet.css';

const AddPet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    breed: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.role !== 'shelter') {
    return <div className="error">Only shelters can add pets</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('breed', formData.breed);
      formDataToSend.append('description', formData.description);
      
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await petAPI.create(formDataToSend);
      navigate('/pets');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-pet-page">
      <div className="add-pet-container">
        <h1>Add New Pet</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pet Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age (years) *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Breed *</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Tell us about this pet..."
            />
          </div>

          <div className="form-group">
            <label>Images (up to 10)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            {images.length > 0 && (
              <p className="image-count">{images.length} image(s) selected</p>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding Pet...' : 'Add Pet'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/pets')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPet;
