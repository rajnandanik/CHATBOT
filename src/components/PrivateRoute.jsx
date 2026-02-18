import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  return token && userRole === role ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
