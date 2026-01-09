import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pets from './pages/Pets';
import PetDetails from './pages/PetDetails';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import Favorites from './pages/Favorites';
import Adoptions from './pages/Adoptions';
import MyAdoptions from './pages/MyAdoptions';
import Admin from './pages/Admin';
import './App.css';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pets" element={<Pets />} />
              <Route path="/pets/:id" element={<PetDetails />} />
              <Route
                path="/add-pet"
                element={
                  <PrivateRoute requiredRole="shelter">
                    <AddPet />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-pet/:id"
                element={
                  <PrivateRoute requiredRole="shelter">
                    <EditPet />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <PrivateRoute requiredRole="adopter">
                    <Favorites />
                  </PrivateRoute>
                }
              />
              <Route
                path="/adoptions"
                element={
                  <PrivateRoute requiredRole="shelter">
                    <Adoptions />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-adoptions"
                element={
                  <PrivateRoute requiredRole="adopter">
                    <MyAdoptions />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Admin />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
