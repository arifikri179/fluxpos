import { useState, useEffect, useCallback } from 'react';
import Radar from 'radar-sdk-js';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { MapPin, Navigation, Building2, Save, Activity } from 'lucide-react';
import { FiCheckCircle } from 'react-icons/fi';

// Initialize Radar
Radar.initialize('prj_test_pk_5f10414280df3d50c7c7514c6808f65dfde8041c');

const AddBranch = () => {
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [registeredBranches, setRegisteredBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedBranch, setExpandedBranch] = useState(null);
  const navigate = useNavigate();

  // 1. Fungsi untuk mengambil data branch dari server
  const fetchBranches = useCallback(async () => {
    try {
      const activeBizId = localStorage.getItem('active_business_id');
      const res = await api.get('business/branches/');
      
      // Filter: Hanya tampilkan cabang milik bisnis yang sedang aktif
      if (activeBizId) {
        const filtered = res.data.filter(b => String(b.business) === String(activeBizId));
        setRegisteredBranches(filtered);
      } else {
        setRegisteredBranches(res.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  // Load data saat pertama kali buka halaman & pasang listener navbar
  useEffect(() => {
    fetchBranches();
    
    const handleBizChange = () => fetchBranches();
    window.addEventListener('storage_biz_changed', handleBizChange);
    return () => window.removeEventListener('storage_biz_changed', handleBizChange);
  }, [fetchBranches]);

  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });
    if (value.length > 3) {
      try {
        const result = await Radar.autocomplete({
          query: value,
          limit: 5,
          layers: ['address', 'place'],
          country: 'ID' 
        });
        setSuggestions(result.addresses || []);
      } catch (err) { console.error("Radar Error:", err); }
    } else { setSuggestions([]); }
  };

  const selectSuggestion = (item) => {
    setFormData({ ...formData, address: item.formattedAddress });
    setSuggestions([]);
  };

  // 2. Handle Submit dengan Auto-Update UI
  const handleAddBranch = async (e) => {
    e.preventDefault();
    const activeBizId = localStorage.getItem('active_business_id');

    if (!activeBizId) {
      Swal.fire({
        icon: 'error',
        title: 'ENTITY ERROR',
        text: 'Please select a business entity from the navbar first.',
        background: '#000d1a',
        color: '#fff',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        business: activeBizId 
      };

      // Kirim data ke backend
      await api.post('business/branches/', payload);
      
      // --- KRUSIAL: Panggil fetchBranches lagi agar UI langsung update ---
      await fetchBranches(); 
      
      // Reset form input
      setFormData({ name: '', address: '' });

      Swal.fire({
        icon: 'success',
        title: 'NODE INITIALIZED',
        text: 'Branch has been synced to the core network.',
        background: '#000d1a',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6',
        timer: 1500,
        showConfirmButton: false
      });
      
    } catch (err) {
      Swal.fire({ 
        icon: 'error', 
        title: 'DEPLOYMENT FAILED', 
        text: err.response?.data?.detail || 'Internal system error occurred.',
        background: '#000d1a', 
        color: '#fff',
      });
    } finally { setLoading(false); }
  };

  const inputStyle = "w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/20 text-xs md:text-sm font-medium";

  return (
    <div className="w-full px-2 md:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700 font-['Plus_Jakarta_Sans']">
      
      <div className="fixed top-0 right-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: FORM SECTION */}
        <div className="lg:col-span-7 order-1">
          <div className="bg-[#000d1a]/40 backdrop-blur-xl border border-white/10 p-5 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            
            <div className="flex items-center gap-4 mb-6 md:mb-8">
               <div className="p-2.5 md:p-3 bg-blue-600/20 border border-blue-500/30 rounded-2xl">
                 <Building2 className="text-blue-400" size={18} />
               </div>
               <div>
                 <h2 className="text-lg md:text-xl font-black text-white leading-tight tracking-tight uppercase">Initialize Node</h2>
                 <p className="text-[10px] text-blue-400/60 font-black uppercase tracking-[0.2em]">Deployment Registry</p>
               </div>
            </div>

            <form onSubmit={handleAddBranch} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 ml-1 uppercase tracking-[0.3em]">Node Designation</label>
                <input
                  type="text" required className={inputStyle}
                  placeholder="e.g. Flux Downtown HQ"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-white/40 ml-1 uppercase tracking-[0.3em]">Geospatial Location</label>
                <div className="relative">
                  <input
                    type="text" required className={`${inputStyle} pr-12`}
                    placeholder="Search address via Radar API..."
                    value={formData.address}
                    onChange={handleAddressChange}
                    autoComplete="off"
                  />
                  <Navigation size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500/50" />
                </div>

                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-[105%] bg-[#001429] border border-white/10 rounded-2xl mt-2 z-50 shadow-2xl overflow-hidden backdrop-blur-2xl animate-in zoom-in-95 duration-200">
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 text-[11px] md:text-xs text-white/60 hover:bg-blue-600/20 hover:text-blue-300 cursor-pointer border-b border-white/5 last:border-none transition-all flex items-center gap-3"
                        onClick={() => selectSuggestion(item)}
                      >
                        <MapPin size={12} className="text-blue-500" />
                        <span className="truncate">{item.formattedAddress}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 disabled:opacity-60 active:scale-95 tracking-[0.2em] text-[10px] uppercase border border-blue-400/20"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Syncing Node...
                  </div>
                ) : (
                  <><Save size={16} /> Deploy New Node</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: REGISTRY MONITOR */}
        <div className="lg:col-span-5 space-y-4 order-2 pb-10">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-[10px] font-black text-white/50 flex items-center gap-2 uppercase tracking-[0.3em]">
              <Activity size={12} className="text-blue-500" />
              Entity Units
            </h3>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{registeredBranches.length} Online</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {registeredBranches.map((branch) => {
              const isExpanded = expandedBranch === branch.id;
              return (
                <div key={branch.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl transition-all group hover:bg-white/[0.05] animate-in slide-in-from-right-2 duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 border border-white/5 group-hover:border-blue-500/30 transition-all">
                        <FiCheckCircle size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[12px] font-black text-white/90 truncate uppercase tracking-tight">{branch.name}</h4>
                        <p className={`text-[10px] text-white/40 mt-1 font-bold leading-relaxed transition-all ${isExpanded ? '' : 'line-clamp-1'}`}>
                          {branch.address}
                        </p>
                        {branch.address.length > 40 && (
                          <button 
                            onClick={() => setExpandedBranch(isExpanded ? null : branch.id)}
                            className="text-[9px] text-blue-500 font-black mt-2 uppercase tracking-widest hover:text-blue-300"
                          >
                            {isExpanded ? '[ COLLAPSE ]' : '[ VIEW ADDR ]'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {registeredBranches.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.4em]">No Active Nodes</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddBranch;