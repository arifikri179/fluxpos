import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios'; 
import Swal from 'sweetalert2';
import { 
  FiUser, FiLogOut, FiSettings, FiChevronDown, 
  FiGrid, FiShoppingBag, FiPackage, FiBarChart2, FiZap, FiPlus, FiBriefcase, FiGlobe, FiMapPin
} from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [businesses, setBusinesses] = useState([]); 
  const [selectedBiz, setSelectedBiz] = useState(null); 
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Konfigurasi Dinamis berdasarkan URL
  const getPageConfig = (path) => {
    if (path.includes('/profile')) return { title: 'Enterprise', sub: 'Main Profile', icon: <FiGrid /> };
    if (path.includes('/pos')) return { title: 'Point of Sale', sub: 'Terminal System', icon: <FiShoppingBag /> };
    if (path.includes('/inventory')) return { title: 'Inventory', sub: 'Stock Control', icon: <FiPackage /> };
    if (path.includes('/branch-list')) return { title: 'Branch', sub: 'Branch Directory', icon: <FiShoppingBag /> };
    if (path.includes('/add-branch')) return { title: 'Network', sub: 'New Branch', icon: <FiPlus /> };
    if (path.includes('/business/list')) return { title: 'Entity', sub: 'Business Registry', icon: <FiGlobe /> };
    return { title: 'FluxPOS', sub: 'Cloud Terminal', icon: <FiZap /> };
  };

  const config = getPageConfig(location.pathname);

  useEffect(() => {
    fetchBusinesses();
    
    // Injeksi Font Jakarta Sans (Hanya jika belum ada)
    if (!document.getElementById('jakarta-sans-font')) {
      const link = document.createElement('link');
      link.id = 'jakarta-sans-font';
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await api.get('/business/info/');
      setBusinesses(res.data);
      
      const savedBizId = localStorage.getItem('active_business_id');
      if (savedBizId && res.data.length > 0) {
        const found = res.data.find(b => String(b.id) === String(savedBizId));
        setSelectedBiz(found || res.data[0]);
      } else if (res.data.length > 0) {
        setSelectedBiz(res.data[0]);
        localStorage.setItem('active_business_id', res.data[0].id);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleSelectBusiness = (biz) => {
    setSelectedBiz(biz);
    localStorage.setItem('active_business_id', biz.id);
    setIsOpen(false);
    window.dispatchEvent(new Event('storage_biz_changed'));
    
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      background: '#001c38',
      color: '#fff'
    });
    Toast.fire({
      icon: 'info',
      title: `Switched to ${biz.name}`
    });
  };

  const handleLogout = () => {
    setIsOpen(false);
    Swal.fire({
      title: 'TERMINATE SESSION?',
      text: "You will be logged out from the system.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#1e293b',
      confirmButtonText: 'Yes, Logout',
      background: '#001c38',
      color: '#ffffff',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('active_business_id');
        navigate('/login', { replace: true });
      }
    });
  };

  return (
    <nav className="w-full bg-[#000d1a]/90 backdrop-blur-2xl px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-[50] border-b border-white/[0.05] font-['Plus_Jakarta_Sans']">
      
      {/* --- LEFT SECTION: Tampilan Icon Dinamis di Sini --- */}
      <div className="flex items-center gap-3 flex-1 md:flex-none">
        <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          {/* RENDER ICON BERDASARKAN HALAMAN */}
          <span className="text-sm md:text-lg block">
            {config.icon}
          </span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[11px] md:text-sm font-black text-white leading-none tracking-widest uppercase">
            {config.title}
          </h1>
          <p className="text-[8px] md:text-[10px] text-blue-400/60 font-bold mt-1 tracking-tight truncate max-w-[150px]">
             {selectedBiz ? `CORE: ${selectedBiz.name}` : config.sub}
          </p>
        </div>
      </div>

      {/* --- RIGHT SECTION --- */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Indikator System Online */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">System Online</span>
        </div>

        {/* User & Business Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 md:gap-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 p-1 md:p-1.5 md:pr-4 rounded-xl transition-all active:scale-95"
          >
            {/* AVATAR BOX: Menggunakan Inisial Bisnis atau Icon Halaman sebagai Fallback */}
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/20 shrink-0 uppercase">
              {selectedBiz ? selectedBiz.name.charAt(0) : config.icon}
            </div>
            
            <div className="hidden sm:block text-left">
              <p className="text-white text-[11px] font-black leading-none truncate max-w-[120px] uppercase">
                {selectedBiz ? selectedBiz.name : 'No Entity'}
              </p>
              <p className="text-slate-500 text-[8px] font-bold mt-1 tracking-widest uppercase">
                {selectedBiz ? selectedBiz.business_type : 'Select Business'}
              </p>
            </div>
            <FiChevronDown className={`text-slate-500 text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mega Dropdown Menu */}
          {isOpen && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
              <div className="absolute right-0 mt-4 w-64 bg-[#001429] border border-white/10 rounded-[1.5rem] shadow-2xl py-3 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                <div className="px-4 py-2 mb-2">
                  <p className="text-[8px] text-blue-400/50 font-black uppercase tracking-[0.3em] mb-3">Switch Business Entity</p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {businesses.length > 0 ? (
                      businesses.map((biz) => (
                        <button
                          key={biz.id}
                          onClick={() => handleSelectBusiness(biz)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-between transition-all group ${selectedBiz?.id === biz.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          <div className="flex items-center gap-3 truncate">
                            <FiBriefcase className={selectedBiz?.id === biz.id ? 'text-white' : 'text-blue-500'} />
                            <span className="truncate">{biz.name}</span>
                          </div>
                          {selectedBiz?.id === biz.id && <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>}
                        </button>
                      ))
                    ) : (
                      <p className="text-[9px] text-white/20 italic px-2">No business found</p>
                    )}
                  </div>
                </div>

                <div className="h-[1px] bg-white/5 my-2 mx-4"></div>

                <div className="px-2 space-y-1">
                  <button 
                    onClick={() => { navigate('/profile'); setIsOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-all"
                  >
                    <FiSettings className="text-slate-500" /> Account Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-[10px] font-bold text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-all"
                  >
                    <FiLogOut /> Logout Terminal
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;