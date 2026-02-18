import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import AdminFaqDashboard from './pages/AdminFaqDashboard';
import AdminDocUploadPage from './pages/AdminDocUploadPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';

import './App.css';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Hide navbar on chat page for full-screen focus
  if (location.pathname === '/chat') return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">🏠 AI Support</Link>

        <div className="nav-links">
          <Link to="/" className={`nav-item ${isActive('/')}`}>Home</Link>

          {token && role === 'user' && (
            <Link to="/chat" className={`nav-item ${isActive('/chat')}`}>Chat</Link>
          )}

          {token && role === 'admin' && (
            <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>Admin</Link>
          )}

          {!token ? (
            <>
              <Link to="/login" className={`nav-item ${isActive('/login')}`}>Login</Link>
              <Link to="/register" className={`nav-item ${isActive('/register')}`}>Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="nav-item logout-btn">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

// Inner app so we can read location inside Router and toggle full-width content
const InnerApp = observer(() => {
  const location = useLocation();
  const isChat = location.pathname === '/chat';

  return (
    <div className="app">
      <NavBar />
      <main className={`content ${isChat ? 'content--full' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/chat"
            element={
              <PrivateRoute role="user">
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminFaqDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/upload-doc"
            element={
              <PrivateRoute role="admin">
                <AdminDocUploadPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
});

const App = () => (
  <Router>
    <InnerApp />
  </Router>
);

export default App;
