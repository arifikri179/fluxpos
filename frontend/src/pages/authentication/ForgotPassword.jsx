import { useState, useEffect } from 'react'; // Tambahkan useEffect
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import logoImg from '../../assets/pp.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Memasukkan Font Plus Jakarta Sans secara dinamis
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,800;1,800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Cleanup saat komponen di-unmount (opsional)
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    Swal.fire({
      title: 'INITIALIZING',
      text: 'Mencari akun dan mengirim instruksi...',
      allowOutsideClick: false,
      background: '#001c38',
      color: '#ffffff',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await api.post('auth/forgot-password/', { email });

      Swal.fire({
        icon: 'success',
        title: 'TRANSMISSION SUCCESS',
        text: response.data.detail,
        background: '#001c38',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-[1.5rem] border border-white/10 shadow-2xl',
          // Menambahkan font-family ke SweetAlert
          title: 'font-["Plus_Jakarta_Sans"] font-black tracking-[0.2em] uppercase text-sm',
          confirmButton: 'font-["Plus_Jakarta_Sans"] text-[10px] uppercase tracking-widest px-8 py-3 rounded-xl font-black',
        }
      });

      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'TRANSMISSION FAILED',
        text: err.response?.data?.detail || 'Terjadi kesalahan sistem.',
        background: '#001c38',
        color: '#ffffff',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-transparent border-b border-white/20 py-3 px-1 text-white outline-none focus:border-blue-400 transition-all placeholder:text-slate-600 text-sm font-['Plus_Jakarta_Sans']";

  return (
    <div className="min-h-screen w-full bg-[#001529] flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Glow Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[360px] z-10">
        <div className="flex flex-col items-center mb-6">
          <img src={logoImg} alt="FluxPOS Logo" className="w-32 h-auto object-contain opacity-90" />
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[1.5rem] shadow-2xl">
          <div className="text-left mb-8">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Forgot Password</h2>
            <p className="text-slate-400 text-[10px] mt-1 font-extrabold uppercase tracking-widest opacity-70">
              Masukkan email untuk reset password
            </p>
          </div>

          <form onSubmit={handleRequestReset} className="space-y-8">
            <div className="relative">
              <input
                type="email"
                required
                className={inputStyle}
                placeholder="Email Terdaftar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button 
              disabled={loading}
              className={`w-full ${loading ? 'bg-slate-700' : 'bg-white hover:bg-blue-500 hover:text-white'} text-[#001529] font-extrabold py-4 rounded-xl transition-all duration-300 shadow-xl active:scale-95 uppercase tracking-[0.2em] text-[10px]`}
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link 
              to="/login" 
              className="text-slate-500 hover:text-white text-[10px] font-extrabold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              ← Kembali ke Login
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-600 text-[9px] uppercase tracking-[0.3em] font-extrabold">
          FluxPOS Security Protocol v1.0
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;