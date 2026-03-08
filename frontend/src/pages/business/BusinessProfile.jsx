import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FiPlus, FiMapPin, FiBriefcase, 
  FiShield, FiZap, FiUser, FiPieChart 
} from 'react-icons/fi';

const BusinessProfile = () => {
  const [business, setBusiness] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Fungsi Fetch Data dengan logika pemfilteran berdasarkan ID aktif
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const activeBizId = localStorage.getItem('active_business_id');
      
      // Ambil data Bisnis dan Cabang secara paralel
      const [bizRes, branchRes] = await Promise.all([
        api.get('business/info/'), 
        api.get('business/branches/')
      ]);

      let selected;
      if (activeBizId) {
        // Cari bisnis yang ID-nya cocok dengan yang ada di localStorage
        selected = bizRes.data.find(b => String(b.id) === String(activeBizId));
      }
      
      // Fallback: Jika ID tidak ditemukan atau storage kosong, pakai bisnis pertama
      const finalBiz = selected || bizRes.data[0];
      
      if (finalBiz) {
        setBusiness(finalBiz);
        
        // FILTER: Pastikan cabang yang tampil HANYA milik bisnis yang terpilih
        const filtered = branchRes.data.filter(br => String(br.business) === String(finalBiz.id));
        setBranches(filtered);
        
        // Pastikan localStorage sinkron jika tadinya kosong
        if (!activeBizId) localStorage.setItem('active_business_id', finalBiz.id);
      }
    } catch (err) {
      console.error("Error fetching profile data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Setup Awal: Font dan Fetch Data Pertama Kali
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,800;1,800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    fetchData();
  }, [fetchData]);

  // 3. EVENT LISTENER: Mendengarkan perubahan dari Navbar
  useEffect(() => {
    const handleBizChange = () => {
      console.log("Detecting business switch from Navbar...");
      fetchData();
    };

    window.addEventListener('storage_biz_changed', handleBizChange);
    return () => window.removeEventListener('storage_biz_changed', handleBizChange);
  }, [fetchData]);

  // 4. Toast Sukses Login
  useEffect(() => {
    if (location.state?.loginSuccess) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#001c38',
        color: '#ffffff',
      });

      Toast.fire({
        icon: 'success',
        title: 'LOGIN BERHASIL',
        html: '<span style="font-size: 8px; opacity: 0.5; letter-spacing: 1.5px; font-family: \'Plus Jakarta Sans\', sans-serif;">SISTEM FLUXPOS ONLINE</span>',
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh] text-blue-400 text-[9px] tracking-[0.4em] uppercase font-extrabold font-['Plus_Jakarta_Sans'] animate-pulse">
      Syncing Entity Data...
    </div>
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-700 font-['Plus_Jakarta_Sans']">
      <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="w-full relative z-10">
        
        {/* 1. Business Info Card */}
        <div className="bg-[#000d1a]/40 backdrop-blur-3xl border border-white/5 p-6 md:p-10 rounded-[2.5rem] mb-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <FiBriefcase size={150} />
          </div>
          
          <div className="relative z-10">
            <p className="text-blue-400 text-[8px] font-black uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-blue-500"></span> Main Entity Dashboard
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tighter text-white leading-none">
              {business?.name || "No Business Found"}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              <span className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 text-[8px] font-black uppercase tracking-[0.2em] text-blue-400 shadow-lg shadow-blue-500/5">
                <FiZap className="animate-pulse" /> {business?.business_type || 'General Service'}
              </span>
              <span className="flex items-center gap-2 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10 text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/80">
                <FiShield /> Verified Partner
              </span>
            </div>
          </div>
        </div>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Network Nodes', value: branches.length, icon: <FiMapPin />, color: 'text-blue-400' },
            { label: 'Operational', value: 'Live', icon: <FiZap />, color: 'text-emerald-400' },
            { label: 'Daily Sales', value: 'View', icon: <FiPieChart />, color: 'text-cyan-400', isLink: true },
            { label: 'Management', value: 'Owner', icon: <FiUser />, color: 'text-amber-400' },
          ].map((stat, i) => (
            <div 
              key={i} 
              onClick={() => stat.isLink && navigate('/analytics')}
              className={`bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.04] transition-all group ${stat.isLink ? 'cursor-pointer hover:border-cyan-400/30' : ''}`}
            >
              <div className={`${stat.color} mb-4 text-xl opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all`}>
                {stat.icon}
              </div>
              <p className="text-white text-2xl font-black tracking-tighter mb-1">{stat.value}</p>
              <p className="text-slate-500 text-[7px] uppercase font-black tracking-[0.3em]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 3. Branches Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]"></div>
              <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40">Active Business Nodes</h3>
            </div>
            <button 
              onClick={() => navigate('/add-branch')}
              className="bg-blue-600 hover:bg-blue-500 text-white transition-all px-6 py-3 rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] active:scale-95 flex items-center gap-2 shadow-xl shadow-blue-900/40 border border-blue-400/20"
            >
              <FiPlus size={14} /> Initialize Node
            </button>
          </div>

          {branches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <div key={branch.id} className="bg-white/[0.02] border border-white/5 p-7 rounded-[2.2rem] hover:border-blue-500/40 transition-all group relative overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                      <FiMapPin size={18} />
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[8px] font-black text-emerald-500 tracking-widest uppercase">Connected</span>
                    </div>
                  </div>
                  <h4 className="font-black text-lg text-white group-hover:text-blue-400 transition-colors mb-2 tracking-tight">
                    {branch.name}
                  </h4>
                  <p className="text-slate-400 text-[10px] leading-relaxed font-bold mb-6 line-clamp-2 tracking-wide uppercase opacity-70">
                    {branch.address}
                  </p>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[7px] font-black text-white/10 tracking-[0.2em] uppercase">Core Location</span>
                     <button className="text-[8px] font-black text-blue-500/50 hover:text-blue-400 transition-colors tracking-widest uppercase">Manage</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.4em]">No branches linked to this entity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;