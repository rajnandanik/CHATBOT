import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const API = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

  const handleRegister = async () => {
    try {
      await axios.post(`${API}/auth/register`, { email, password, role });
      setSuccess('Registration successful! You can now login.');
      setError('');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'calc(100vh - 64px)'}}>
      <div className="auth-card">
        <h2 className="auth-title">📝 Register</h2>

        {error && <p style={{color:'#fecaca', marginBottom:'8px'}}>{error}</p>}
        {success && <p style={{color:'#bbf7d0', marginBottom:'8px'}}>{success}</p>}

        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{marginBottom: '10px'}}
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{marginBottom: '10px'}}
        />

        <select
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{marginBottom: '14px'}}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleRegister} className="btn">Register</button>
      </div>
    </div>
  );
};

export default RegisterPage;
