import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Kasir from "./pages/Kasir";
import Category from "./pages/items/Category";
import Login from "./auth/Login";

export default function App() {
  const isLogin = !!localStorage.getItem("access");

  return (
    <div className="flex w-screen h-screen bg-[#020617] overflow-hidden">

      {/* Sidebar hanya muncul kalau login */}
      {isLogin && <Sidebar />}

      <main className="flex-1 h-full overflow-hidden relative bg-[#020617]">
        <Routes>

          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />

          {/* ROOT */}
          <Route
            path="/"
            element={
              isLogin
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/login" replace />
            }
          />

          {/* PROTECTED */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Kasir />
              </ProtectedRoute>
            }
          />

    <Route
      path="/catalog/categories"
      element={
        <ProtectedRoute>
          <Category />
        </ProtectedRoute>
      }
    />


        </Routes>
      </main>
    </div>
  );
}
