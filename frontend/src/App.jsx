import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SetupBusiness from './pages/SetupBusiness';
import SetupBranch from './pages/SetupBranch';
import BusinessProfile from './pages/BusinessProfile';
import ForgotPassword from './pages/ForgotPassword';

// --- KOMPONEN PROTECTED ROUTE (SATPAM) ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    // Jika tidak ada token, tendang ke login dan hapus history
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect awal ke Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Routes (Bisa diakses tanpa login) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes (Hanya bisa diakses jika ada token) */}
        <Route 
          path="/setup-business" 
          element={<ProtectedRoute><SetupBusiness /></ProtectedRoute>} 
        />
        <Route 
          path="/setup-branch" 
          element={<ProtectedRoute><SetupBranch /></ProtectedRoute>} 
        /> 
        <Route 
          path="/profile" 
          element={<ProtectedRoute><BusinessProfile /></ProtectedRoute>} 
        />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Contoh jika Dashboard sudah aktif nanti */}
        {/* <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        /> 
        */}

        {/* Catch-all: Jika route tidak ditemukan, lempar ke login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;