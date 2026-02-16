import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FiPlus, FiMapPin, FiBriefcase, FiArrowLeft, 
  FiShield, FiZap, FiDatabase, FiSettings, FiTrash2,
  FiHome, FiGrid, FiUser, FiPieChart 
} from 'react-icons/fi';
import Navbar from '../components/Navbar';

const BusinessProfile = () => {
  const [business, setBusiness] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bizRes, branchRes] = await Promise.all([
        api.get('business/info/'),
        api.get('business/branches/')
      ]);
      setBusiness(bizRes.data[0]);
      setBranches(branchRes.data);
    } catch (err) {
      console.error("Error fetching profile data", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk class active menu
  const isActive = (path) => location.pathname === path;

  if (loading) return <div className="min-h-screen bg-[#001529] flex items-center justify-center text-white text-sm tracking-widest uppercase font-bold">Loading Flux Profile...</div>;

  return (
    <div className="min-h-screen w-full bg-[#001529] font-sans pb-32"> {/* pb ditingkatkan agar tidak tertutup bottom bar */}
      <Navbar />

      <div className="text-white p-4 sm:p-8 md:p-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto z-10 relative">
          
          {/* 1. Header Section */}
          <div className="flex flex-row items-center justify-between mb-8 sm:mb-12 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
                <FiBriefcase className="text-brand-blue text-xs sm:text-sm" />
              </div>
              <h1 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-white">
                Business Profile
              </h1>
            </div>
          </div>

          {/* 2. Business Info Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] mb-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <FiBriefcase size={120} />
            </div>
            
            <div className="flex items-center sm:items-start justify-between gap-4 relative z-10">
              <div className="flex-1">
                <p className="text-brand-cyan text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 sm:mb-2">Primary Entity</p>
                <h2 className="text-2xl sm:text-4xl font-black mb-3 sm:mb-4 tracking-tight">{business?.name}</h2>
                <div className="flex flex-wrap gap-3 sm:gap-6 text-slate-400 text-[10px] sm:text-sm font-medium">
                  <span className="flex items-center gap-2"><FiZap className="text-brand-blue" /> {business?.business_type}</span>
                  <span className="flex items-center gap-2"><FiShield className="text-brand-blue" /> Verified Partner</span>
                </div>
              </div>
              <div className="h-16 w-16 sm:h-24 sm:w-24 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl sm:text-4xl font-black text-[#001529] shadow-xl shadow-brand-blue/20">
                {business?.name?.charAt(0)}
              </div>
            </div>
          </div>

          {/* 3. Stats Grid */}
        {/* 3. Stats Grid (Analytics Focused) */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
  {[
    { 
      label: 'Total Branches', 
      value: branches.length, 
      icon: <FiMapPin />, 
      color: 'text-brand-blue' 
    },
    { 
      label: 'Operational', 
      value: 'Online', 
      icon: <FiZap />, 
      color: 'text-emerald-400' 
    },
    { 
      label: 'Daily Sales', 
      value: 'View', 
      icon: <FiPieChart />, 
      color: 'text-brand-cyan',
      isLink: true 
    },
    { 
      label: 'Staff Active', 
      value: '12', 
      icon: <FiUser />, 
      color: 'text-amber-400' 
    },
  ].map((stat, i) => (
    <div 
      key={i} 
      onClick={() => stat.isLink && navigate('/analytics')}
      className={`bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/[0.07] transition-all group ${stat.isLink ? 'cursor-pointer border-brand-cyan/20' : ''}`}
    >
      <div className={`${stat.color} mb-2 text-sm group-hover:scale-110 transition-transform`}>
        {stat.icon}
      </div>
      <p className="text-white text-lg font-bold tracking-tight">
        {stat.value}
      </p>
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">
          {stat.label}
        </p>
        {stat.isLink && <div className="w-1 h-1 rounded-full bg-brand-cyan animate-pulse"></div>}
      </div>
    </div>
  ))}
</div>

          {/* 4. Branches Section */}
          <div className="space-y-4 sm:space-y-6 mb-12">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs sm:text-sm font-black tracking-[0.15em] uppercase text-slate-400">Registered Locations</h3>
              <button 
                onClick={() => navigate('/setup-branch')}
                className="flex items-center bg-brand-blue text-[#001529] hover:bg-brand-cyan transition-all px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-blue/20"
              >
                <FiPlus className="mr-1 sm:mr-2" /> New Branch
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
  {branches.map((branch) => (
    <div key={branch.id} className="bg-white/5 border border-white/5 p-4 sm:p-6 rounded-2xl hover:border-brand-blue/50 transition-all group cursor-pointer relative overflow-hidden">
      
      {/* 1. Status Indicator (Hijau Transparan) */}
      <div className="absolute top-0 right-0">
        <div className="bg-emerald-500/10 border-b border-l border-emerald-500/20 px-3 py-1 rounded-bl-xl flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400">Open</span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 mt-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-sm sm:text-lg text-white group-hover:text-brand-blue transition-colors truncate">
              {branch.name}
            </h4>
          </div>
          
          <p className="text-slate-400 text-[10px] sm:text-xs leading-relaxed line-clamp-2 pr-4">
            {branch.address}
          </p>
          
          {/* 2. Badge Tambahan (Optional) */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[7px] font-bold bg-white/5 px-2 py-0.5 rounded text-slate-500 uppercase tracking-widest">
              Main Store
            </span>
          </div>
        </div>

        <div className="p-2 bg-white/5 rounded-lg text-brand-cyan self-start">
          <FiMapPin size={14} />
        </div>
      </div>
    </div>
  ))}
</div>
          </div>
        </div>
      </div>

      {/* --- FLOATING BOTTOM BAR MENU --- */}
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-[95%] max-w-md z-[200]">
        <div className=" backdrop-blur border border-white/20 p-2 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.10)] flex items-center justify-around">
          
          {/* Nav Item: Home */}
          <button 
            onClick={() => navigate('/dashboard')}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive('/dashboard') ? 'bg-blue text-[#001529]' : 'text-slate-200 hover:text-white'}`}
          >
            <FiHome size={18} />
            <span className="text-[8px] font-white  tracking-tighter">Home</span>
          </button>

          {/* Nav Item: POS/Grid */}
          <button 
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive('/pos') ? 'bg-brand-blue text-[#001529]' : 'text-slate-400 hover:text-white'}`}
          >
            <FiGrid size={18} />
            <span className="text-[8px] font-black  tracking-tighter">POS</span>
          </button>

          {/* Nav Item: Analytics */}
          <button 
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive('/analytics') ? 'bg-brand-blue text-[#001529]' : 'text-slate-400 hover:text-white'}`}
          >
            <FiPieChart size={18} />
            <span className="text-[8px] font-black  tracking-tighter">Stats</span>
          </button>

          {/* Nav Item: Profile (Active) */}
          <button 
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive('/profile') ? 'bg-brand-blue text-[#001529] shadow-lg shadow-brand-blue/40 scale-110' : 'text-slate-400 hover:text-white'}`}
          >
            <FiUser size={18} />
            <span className="text-[8px] font-black  tracking-tighter">Profile</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;