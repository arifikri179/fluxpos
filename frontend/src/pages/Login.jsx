import { useState, useEffect } from 'react'; // Tambah useEffect
import api from '../api/axios';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Tambah useLocation
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react'; 
import logoImg from '../assets/pp.png';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Untuk menangkap parameter ?activated=true

  // --- LOGIC UNTUK MENANGKAP SINYAL AKTIVASI ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const activated = params.get('activated');

    if (activated === 'true') {
      Swal.fire({
        icon: 'success',
        title: 'IDENTITY VERIFIED',
        text: 'Akun Anda telah diaktifkan. Silakan masuk ke sistem.',
        background: '#001c38',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6',
        customClass: {
          title: 'font-sans font-black tracking-[0.2em] uppercase text-sm',
          htmlContainer: 'font-sans text-[10px] tracking-widest opacity-60 uppercase font-bold',
          popup: 'rounded-[1.5rem] border border-white/10 shadow-2xl',
          confirmButton: 'text-[10px] uppercase tracking-widest px-8 py-3 rounded-xl font-black',
        }
      });
      // Bersihkan URL agar alert tidak muncul lagi saat refresh
      navigate('/login', { replace: true });
    } else if (activated === 'false') {
      Swal.fire({
        icon: 'error',
        title: 'ACTIVATION FAILED',
        text: 'Link kadaluarsa atau token tidak valid.',
        background: '#001c38',
        color: '#ffffff',
        confirmButtonColor: '#ef4444',
      });
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'AUTHENTICATING',
      text: 'Connecting to FluxPOS Engine...',
      allowOutsideClick: false,
      background: '#001c38',
      color: '#ffffff',
      showConfirmButton: false,
      customClass: {
        title: 'font-sans font-black tracking-[0.2em] uppercase text-sm',
        htmlContainer: 'font-sans text-[10px] tracking-widest opacity-60 uppercase font-bold',
        popup: 'rounded-[1.5rem] border border-white/10 shadow-2xl',
      },
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await api.post('auth/login/', credentials);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      const bizCheck = await api.get('business/info/');
      
      Swal.close(); 

      if (bizCheck.data && bizCheck.data.length > 0) {
        const branchCheck = await api.get('business/branches/');
        if (branchCheck.data && branchCheck.data.length > 0) {
          navigate('/profile', { replace: true });
        } else {
          navigate('/setup-branch', { replace: true });
        }
      } else {
        navigate('/setup-business', { replace: true });
      }

    } catch (err) {
      // Jika error 403 (Permission Denied) biasanya karena belum aktivasi
      const errorDetail = err.response?.data?.detail || 'Invalid identification credentials';
      
      Swal.fire({
        icon: 'error',
        title: 'ACCESS DENIED',
        text: errorDetail,
        background: '#001c38',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6',
        iconColor: '#ef4444',
        customClass: {
          title: 'font-sans font-black tracking-[0.2em] uppercase text-sm',
          htmlContainer: 'font-sans text-[10px] tracking-widest opacity-60 uppercase font-bold',
          popup: 'rounded-[1.5rem] border border-white/10 shadow-2xl',
          confirmButton: 'text-[10px] uppercase tracking-widest px-8 py-3 rounded-xl font-black',
        }
      });
    }
  };

  const inputStyle = "w-full bg-transparent border-b border-white/20 py-2 px-1 text-white outline-none focus:border-blue-400 transition-all placeholder:text-slate-500 text-sm";

  return (
    <div className="min-h-screen w-full bg-[#001529] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[360px] z-10">
        <div className="flex flex-col items-center mb-1">
          <img src={logoImg} alt="FluxPOS Logo" className="w-40 h-16 object-contain" />
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-[1.5rem] shadow-2xl">
          <div className="text-left mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight">Login</h2>
            <p className="text-slate-400 text-[10px] mt-1 font-medium uppercase tracking-widest opacity-70">
              Kelola Bisnis Lebih Pintar
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-6">
              <input
                type="text" required
                className={inputStyle}
                placeholder="Username"
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              />

              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"} 
                  required
                  className={`${inputStyle} pr-8`}
                  placeholder="Password"
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
              <Link 
                to="/forgot-password" 
                className="text-slate-500 hover:text-blue-400 text-[10px] uppercase tracking-widest font-bold transition-colors"
              >
                Lupa Password?
              </Link>
            </div>
            </div>

            <button className="w-full bg-white hover:bg-blue-500 hover:text-white text-[#001529] font-black py-3 rounded-lg transition-all duration-300 shadow-xl active:scale-95 uppercase tracking-widest text-[10px] mt-4">
              Masuk Sekarang
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">
              Belum punya akun? 
              <Link to="/register" className="text-white hover:text-blue-400 font-bold ml-2 transition-colors underline underline-offset-4 decoration-white/20">
                Daftar Gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;