import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/authentication/Register';
import Login from './pages/authentication/Login';
import SetupBusiness from './pages/business/SetupBusiness';
import SetupBranch from './pages/business/SetupBranch';
import AddBranch from './pages/business/AddBranch';
import BusinessProfile from './pages/business/BusinessProfile';
import ForgotPassword from './pages/authentication/ForgotPassword';
import ResetPassword from './pages/authentication/ResetPassword';
import AdminLayout from './layouts/AdminLayout';
import NotFound from './pages/404/NotFound';
import BusinessPage from './pages/business/BusinessPage';
import BranchList from './pages/business/BranchList';
import SalesHistory from './pages/transaction/SalesHistory';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC --- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* PINDAH: BusinessPage sekarang di bawah agar mendapatkan Sidebar */}
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        {/* --- ONBOARDING (No Sidebar) --- */}
        <Route path="/setup-business" element={<ProtectedRoute><SetupBusiness /></ProtectedRoute>} />
        <Route path="/setup-branch" element={<ProtectedRoute><SetupBranch /></ProtectedRoute>} />

        {/* --- ADMIN (With Sidebar) --- */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <AdminLayout><BusinessProfile /></AdminLayout>
          </ProtectedRoute>
        } />
        
        {/* Business List Page diletakkan di sini agar ada Sidebar-nya */}
        <Route path="/business/list" element={
          <ProtectedRoute>
            <AdminLayout><BusinessPage /></AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/add-branch" element={
          <ProtectedRoute>
            <AdminLayout><AddBranch /></AdminLayout>
          </ProtectedRoute>
        } />

      <Route path="/branch-list" element={
          <ProtectedRoute>
            <AdminLayout><BranchList /></AdminLayout>
          </ProtectedRoute>
        } />

      <Route path="/transactions/history" element={
          <ProtectedRoute>
            <AdminLayout><SalesHistory /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;