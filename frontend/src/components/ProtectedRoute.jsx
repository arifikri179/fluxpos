import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    // Jika tidak ada token, paksa ke halaman login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;