import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { petAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Pets.css';

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    breed: '',
    age: '',
    adopted: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const { data } = await petAPI.getAll();
      setPets(data);
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchParams.breed) params.breed = searchParams.breed;
      if (searchParams.age) params.age = searchParams.age;
      if (searchParams.adopted) params.adopted = searchParams.adopted;
      
      const { data } = await petAPI.search(params);
      setPets(data);
    } catch (error) {
      console.error('Error searching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading pets...</div>;
  }

  return (
    <div className="pets-page">
      <div className="pets-header">
        <h1>Browse Pets</h1>
        <p>Find your perfect companion</p>
      </div>

      <div className="search-section">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by breed..."
            value={searchParams.breed}
            onChange={(e) => setSearchParams({ ...searchParams, breed: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age"
            value={searchParams.age}
            onChange={(e) => setSearchParams({ ...searchParams, age: e.target.value })}
          />
          <select
            value={searchParams.adopted}
            onChange={(e) => setSearchParams({ ...searchParams, adopted: e.target.value })}
          >
            <option value="">All</option>
            <option value="false">Available</option>
            <option value="true">Adopted</option>
          </select>
          <button onClick={handleSearch} className="btn btn-primary">Search</button>
          <button onClick={loadPets} className="btn btn-secondary">Reset</button>
        </div>
      </div>

      <div className="pets-grid">
        {pets.length === 0 ? (
          <div className="no-pets">No pets found</div>
        ) : (
          pets.map((pet) => (
            <div key={pet._id} className="pet-card">
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
                {pet.description && (
                  <p className="pet-description">{pet.description.substring(0, 100)}...</p>
                )}
                <div className="pet-actions">
                  <Link to={`/pets/${pet._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Pets;
