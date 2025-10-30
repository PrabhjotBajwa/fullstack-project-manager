import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post('/auth/register', { email, password });
      auth.login(response.data.token, response.data.email);
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response && err.response.data) {
        const data = err.response.data;

        // FIX IS HERE: We check what kind of error data we received
        
        // Case 1: It's an array (like from Identity)
        if (Array.isArray(data)) {
          errorMessage = data.map((e: any) => e.description).join(' ');
        
        // Case 2: It's an object (like from DTO validation)
        } else if (typeof data === 'object' && data.errors) {
          errorMessage = Object.values(data.errors)
            .flat()
            .join(' ');
        
        // Case 3: It's just a string
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center">Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password (min 6 chars)</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;