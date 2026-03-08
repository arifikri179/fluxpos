import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Eye, EyeOff, Check, Circle } from "lucide-react";
import logoImg from "../../assets/pp.png";
import api from "../../api/axios";

export default function ResetPassword() {
  const { uid, token } = useParams(); // ✅ ambil dari URL param

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpper: false,
    hasSymbol: false,
  });

  const navigate = useNavigate();

  const checkPassword = (value) => {
    setPasswordCriteria({
      minLength: value.length >= 8,
      hasUpper: /[A-Z]/.test(value),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!passwordCriteria.minLength || !passwordCriteria.hasUpper || !passwordCriteria.hasSymbol) {
      return Swal.fire({
        icon: "warning",
        title: "Password lemah",
        text: "Penuhi kriteria password terlebih dahulu.",
        background: "#001529",
        color: "#fff",
        confirmButtonColor: "#0095ff",
      });
    }

    if (password !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Konfirmasi tidak cocok",
        text: "Pastikan password sama.",
        background: "#001529",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }

    if (!uid || !token) {
      return Swal.fire({
        icon: "error",
        title: "Token tidak ditemukan",
        text: "Silakan klik ulang link dari email.",
        background: "#001529",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }

    try {
      setLoading(true);

      await api.post(`auth/reset-password-confirm/${uid}/${token}/`, {
        password: password, 
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Password berhasil diperbarui.",
        background: "#001529",
        color: "#fff",
        confirmButtonColor: "#0095ff",
      }).then(() => {
        navigate("/login");
      });

    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        "Token tidak valid atau sudah kedaluwarsa.";

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: errorMsg,
        background: "#001529",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full bg-transparent border-b border-white/20 py-2 px-1 text-white outline-none focus:border-blue-400 transition-all placeholder:text-slate-500 text-sm mb-1";

  return (
    <div className="min-h-screen w-full bg-[#001529] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-[360px] z-10">
        <div className="flex flex-col items-center mb-1">
          <img src={logoImg} alt="FluxPOS Logo" className="w-40 h-16 object-contain" />
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-[1.5rem] shadow-2xl">
          <div className="text-left mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">Reset Password</h2>
            <p className="text-slate-400 text-[10px] mt-1 font-medium uppercase tracking-widest opacity-70">
              Amankan kembali akun Anda
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password baru"
                className={`${inputStyle} pr-8`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkPassword(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex flex-col gap-1 px-1">
              <PasswordCheck label="8+ karakter" active={passwordCriteria.minLength} />
              <div className="flex gap-3">
                <PasswordCheck label="Huruf kapital" active={passwordCriteria.hasUpper} />
                <PasswordCheck label="Simbol" active={passwordCriteria.hasSymbol} />
              </div>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Konfirmasi password"
                className={`${inputStyle} pr-8`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-1 top-2 text-slate-500 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-blue-500 hover:text-white text-[#001529] font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95 text-sm mt-4 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Update password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs">
              Batal reset?
              <Link
                to="/login"
                className="text-white hover:text-blue-400 font-semibold ml-2 transition-colors underline underline-offset-4 decoration-white/20"
              >
                Kembali login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const PasswordCheck = ({ label, active }) => (
  <div className={`flex items-center gap-1.5 text-[10px] transition-all duration-300 ${active ? "text-green-400" : "text-slate-500"}`}>
    {active ? <Check size={12} strokeWidth={3} /> : <Circle size={10} />}
    <span>{label}</span>
  </div>
);
