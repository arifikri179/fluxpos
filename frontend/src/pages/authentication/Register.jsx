import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Eye, EyeOff, Check, Circle } from 'lucide-react'; 
import logoImg from '../../assets/pp.png';

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    first_name: '', 
    last_name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpper: false,
    hasSymbol: false,
  });

  const navigate = useNavigate();

  // Load Plus Jakarta Sans
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const checkPassword = (password) => {
    setPasswordCriteria({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return Swal.fire({ 
        icon: 'error', 
        title: 'MISMATCH', 
        text: 'Passwords do not match!', 
        background: '#001c38',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        customClass: { popup: 'font-["Plus_Jakarta_Sans"]' }
      });
    }

    if (!passwordCriteria.minLength || !passwordCriteria.hasUpper || !passwordCriteria.hasSymbol) {
      return Swal.fire({ 
        icon: 'warning', 
        title: 'WEAK PASSWORD', 
        text: 'Please meet all password security criteria.', 
        background: '#001c38',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        customClass: { popup: 'font-["Plus_Jakarta_Sans"]' }
      });
    }

    Swal.fire({
      title: 'PROCESSING',
      text: 'Sending activation link to your email...',
      allowOutsideClick: false,
      background: '#001c38',
      color: '#fff',
      customClass: { 
        popup: 'font-["Plus_Jakarta_Sans"] rounded-2xl',
        title: 'text-sm font-black tracking-widest'
      },
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const { confirmPassword, ...dataToSubmit } = formData;
      
      await api.post('auth/register/', dataToSubmit, {
        headers: { 'Authorization': '' }
      });

      Swal.fire({ 
        icon: 'success', 
        title: 'REGISTRATION SUCCESS', 
        html: '<p class="text-[12px] opacity-80">Please check your <b>Inbox</b> or <b>Spam</b> to activate your account.</p>',
        background: '#001c38',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        customClass: { 
            popup: 'font-["Plus_Jakarta_Sans"] rounded-[1.5rem]',
            title: 'font-black tracking-widest text-sm uppercase'
        }
      }).then(() => {
        navigate('/login');
      });

    } catch (err) {
      const errorData = err.response?.data;
      const errorMsg = errorData?.detail || errorData?.username?.[0] || errorData?.email?.[0] || 'Registration failed.';
      
      Swal.fire({ 
        icon: 'error', 
        title: 'FAILED', 
        text: errorMsg, 
        background: '#001c38',
        color: '#fff',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'font-["Plus_Jakarta_Sans"]' }
      });
    }
  };

  const inputStyle = "w-full bg-transparent border-b border-white/20 py-2 px-1 text-white outline-none focus:border-blue-400 transition-all placeholder:text-slate-500 text-sm mb-1 font-['Plus_Jakarta_Sans']";

  return (
    <div className="min-h-screen w-full bg-[#001529] flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans']">
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[360px] z-10">
        <div className="flex flex-col items-center mb-1">
          <img src={logoImg} alt="FluxPOS Logo" className="w-40 h-16 object-contain opacity-90" />
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-[1.5rem] shadow-2xl">
          <div className="text-left mb-6">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Sign Up</h2>
            <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-[0.2em] opacity-70">Manage Business Smarter</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" required className={inputStyle} placeholder="Username"
              onChange={(e) => setFormData({...formData, username: e.target.value})} />

            <div className="flex gap-4">
              <input type="text" required className={inputStyle} placeholder="First Name"
                onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
              <input type="text" required className={inputStyle} placeholder="Last Name"
                onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
            </div>

            <input type="email" required className={inputStyle} placeholder="Email Address"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />

            <div className="relative">
              <input type={showPassword ? "text" : "password"} required className={`${inputStyle} pr-8`} placeholder="Password"
                onChange={(e) => { setFormData({...formData, password: e.target.value}); checkPassword(e.target.value); }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-2 text-slate-500 hover:text-white transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex flex-col gap-1 px-1">
              <PasswordCheck label="8+ Characters" active={passwordCriteria.minLength} />
              <div className="flex gap-3">
                 <PasswordCheck label="Uppercase" active={passwordCriteria.hasUpper} />
                 <PasswordCheck label="Symbol" active={passwordCriteria.hasSymbol} />
              </div>
            </div>

            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} required className={`${inputStyle} pr-8`} placeholder="Confirm Password"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-1 top-2 text-slate-500 hover:text-white transition-colors">
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" className="w-full bg-white hover:bg-blue-500 hover:text-white text-[#001529] font-black py-3 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-[0.2em] text-[10px] mt-4">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-[10px] font-semibold tracking-widest uppercase">
              Already have an account? 
              <Link to="/login" className="text-white hover:text-blue-400 font-extrabold ml-2 transition-colors underline underline-offset-4 decoration-white/20">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PasswordCheck = ({ label, active }) => (
  <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tighter transition-all duration-300 ${active ? 'text-green-400' : 'text-slate-500'}`}>
    {active ? <Check size={10} strokeWidth={3} /> : <Circle size={8} />}
    <span>{label}</span>
  </div>
);

export default Register;