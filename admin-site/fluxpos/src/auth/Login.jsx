import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        { username, password }
      );

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      window.location.href = "/dashboard";
    } catch (err) {
      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8">
        
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          FluxPOS Admin
        </h1>
        <p className="text-slate-400 text-center mb-6 text-sm">
          Login untuk mengelola sistem
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm px-4 py-2 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm text-slate-400">Username</label>
            <input
              className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-800 text-white
                         border border-slate-700 focus:outline-none
                         focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-800 text-white
                         border border-slate-700 focus:outline-none
                         focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition
              ${
                loading
                  ? "bg-blue-600/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              }
              text-white`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-6">
          © {new Date().getFullYear()} FluxPOS
        </p>
      </div>
    </div>
  );
}
