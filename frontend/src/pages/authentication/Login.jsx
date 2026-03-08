import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react'; 
import logoImg from '../../assets/pp.png';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // --- FONT LOADING & ACTIVATION LOGIC ---
  useEffect(() => {
    // Inject Plus Jakarta Sans
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const params = new URLSearchParams(location.search);
    const activated = params.get('activated');

    if (activated === 'true') {
      Swal.fire({
        icon: 'success',
        title: 'IDENTITY VERIFIED',
        text: 'Your account has been activated. Please log in.',
        background: '#001c38',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6',
        customClass: {
          title: 'font-["Plus_Jakarta_Sans"] font-black tracking-[0.2em] uppercase text-sm',
          htmlContainer: 'font-["Plus_Jakarta_Sans"] text-[10px] tracking-widest opacity-60 uppercase font-bold',
          popup: 'rounded-[1.5rem] border border-white/10 shadow-2xl',
          confirmButton: 'font-["Plus_Jakarta_Sans"] text-[10px] uppercase tracking-widest px-8 py-3 rounded-xl font-black',
        }
      });
      navigate('/login', { replace: true });
    } else if (activated === 'false') {
      Swal.fire({
        icon: 'error',
        title: 'ACTIVATION FAILED',
        text: 'Expired link or invalid token.',
        background: '#001c38',
        color: '#ffffff',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-[1.5rem] font-["Plus_Jakarta_Sans"]'
        }
      });
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'PLEASE WAIT',
      text: 'Authenticating credentials...',
      allowOutsideClick: false,
      background: '#001c38',
      color: '#ffffff',
      showConfirmButton: false,
      customClass: {
        title: 'font-["Plus_Jakarta_Sans"] font-bold tracking-widest text-[10px] uppercase',
        htmlContainer: 'font-["Plus_Jakarta_Sans"] font-normal text-[9px] opacity-60',
        popup: 'rounded-xl border border-white/10 shadow-2xl w-[280px]', 
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
          navigate('/profile', { replace: true, state: { loginSuccess: true } });
        } else {
          navigate('/setup-branch', { replace: true, state: { loginSuccess: true } });
        }
      } else {
        navigate('/setup-business', { replace: true, state: { loginSuccess: true } });
      }

    } catch (err) {
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
          title: 'font-["Plus_Jakarta_Sans"] font-black tracking-[0.2em] uppercase text-sm',
          htmlContainer: 'font-["Plus_Jakarta_Sans"] text-[10px] tracking-widest opacity-60 uppercase font-bold',
          popup: 'rounded-[1.5rem] border border-white/10 shadow-2xl',
          confirmButton: 'font-["Plus_Jakarta_Sans"] text-[10px] uppercase tracking-widest px-8 py-3 rounded-xl font-black',
        }
      });
    }
  };

  const inputStyle = "w-full bg-transparent border-b border-white/20 py-2 px-1 text-white outline-none focus:border-blue-400 transition-all placeholder:text-slate-500 text-sm font-['Plus_Jakarta_Sans']";

  return (
    <div className="min-h-screen w-full bg-[#001529] flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[360px] z-10">
        <div className="flex flex-col items-center mb-1">
          <img src={logoImg} alt="FluxPOS Logo" className="w-40 h-16 object-contain opacity-90" />
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-[1.5rem] shadow-2xl">
          <div className="text-left mb-8">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Login</h2>
            <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-[0.2em] opacity-70">
              Manage Business Smarter
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
                  className="text-slate-500 hover:text-blue-400 text-[10px] uppercase tracking-widest font-extrabold transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button className="w-full bg-white hover:bg-blue-500 hover:text-white text-[#001529] font-extrabold py-3 rounded-xl transition-all duration-300 shadow-xl active:scale-95 uppercase tracking-[0.2em] text-[10px] mt-4">
              Sign In Now
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest">
              Don't have an account? 
              <Link to="/register" className="text-white hover:text-blue-400 font-extrabold ml-2 transition-colors underline underline-offset-4 decoration-white/20">
                Register Free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;