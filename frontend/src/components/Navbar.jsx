import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 
import Swal from 'sweetalert2'; // 1. Import SweetAlert2
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import logoImg from '../assets/pp.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('business/info/'); 
        if (res.data && res.data.length > 0) {
          setDisplayName(res.data[0].name); 
        }
      } catch (err) {
        console.error("Gagal mengambil data", err);
      }
    };
    fetchUser();
  }, []);

  // 2. Modifikasi handleLogout dengan SweetAlert
  const handleLogout = () => {
    setIsOpen(false); // Tutup dropdown dulu

    Swal.fire({
      title: 'Sign Out?',
      text: "Sesi Anda akan diakhiri.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6', // Warna brand-blue kamu
      cancelButtonColor: '#1e293b', // Warna slate-800
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal',
      background: '#001c38', // Match dengan theme Navbar
      color: '#ffffff',
      backdrop: `rgba(0, 21, 41, 0.8)`
    }).then((result) => {
      if (result.isConfirmed) {
        // Hapus token
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Tampilkan loading sukses sebentar
        Swal.fire({
          title: 'Logging out...',
          timer: 1000,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
          background: '#001c38',
          color: '#ffffff',
        }).then(() => {
          navigate('/login', { replace: true });
        });
      }
    });
  };

  return (
    <nav className="w-full bg-[#001529]/80 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-[100]">
      {/* Logo Section */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
        <img src={logoImg} alt="FluxPOS" className="h-15 w-auto object-contain group-hover:scale-105 transition-transform" />
   
      </div>

      {/* User Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 pr-3 rounded-full transition-all active:scale-95"
        >
          <div className="h-8 w-8 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full flex items-center justify-center text-[#001529] font-bold text-xs shadow-lg shadow-brand-blue/20">
            {displayName ? displayName.charAt(0).toUpperCase() : <FiUser />}
          </div>
          
          <span className="text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] hidden xs:block">
            {displayName || 'Loading...'}
          </span>
          
          <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
            <div className="absolute right-0 mt-3 w-52 bg-[#001c38] border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 border-b border-white/5 mb-1">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active Entity</p>
                <p className="text-white text-xs font-bold truncate">{displayName}</p>
              </div>

              <button 
                onClick={() => { navigate('/profile'); setIsOpen(false); }}
                className="w-full px-4 py-3 text-left text-xs text-slate-300 hover:bg-brand-blue/10 hover:text-brand-cyan flex items-center gap-3 transition-all uppercase font-bold tracking-widest"
              >
                <FiSettings className="text-brand-blue" /> Business Profile
              </button>
              
              <div className="border-t border-white/5 my-1"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-all uppercase font-bold tracking-widest"
              >
                <FiLogOut /> Logout Session
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;