import { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import Swal from 'sweetalert2';
import { Building2, Save, Activity, Globe, Trash2, Tag, Calendar } from 'lucide-react';

const BusinessPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    business_type: 'fnb' // Default value sesuai Model TYPES
  });
  const [registeredBusinesses, setRegisteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await api.get('/business/info/');
      setRegisteredBusinesses(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mengirim 'name' dan 'business_type' sesuai model Django
      await api.post('/business/info/', formData);
      Swal.fire({
        icon: 'success',
        title: 'SUCCESS',
        text: 'Business profile created.',
        background: '#000d1a',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        showConfirmButton: false
      });
      setFormData({ name: '', business_type: 'fnb' });
      fetchBusinesses();
    } catch (err) {
      Swal.fire({ 
        icon: 'error', 
        title: 'FAILED', 
        text: 'Sync failed. Check backend fields.',
        background: '#000d1a', 
        color: '#fff',
      });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This entity will be permanently removed.",
      icon: 'warning',
      showCancelButton: true,
      background: '#000d1a',
      color: '#fff',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`info/${id}/`);
        Swal.fire({ title: 'Deleted!', icon: 'success', background: '#000d1a', color: '#fff', showConfirmButton: false, timer: 1500 });
        fetchBusinesses();
      } catch (err) {
        Swal.fire({ title: 'Error', text: 'Action denied.', icon: 'error', background: '#000d1a', color: '#fff' });
      }
    }
  };

  const inputStyle = "w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/20 text-xs md:text-sm font-medium appearance-none";

  return (
    <div className="w-full px-2 md:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700 font-['Plus_Jakarta_Sans']">
      
      {/* Background Glows */}
      <div className="fixed top-0 right-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-0 left-0 w-[200px] h-[200px] bg-cyan-600/10 rounded-full blur-[80px] -z-10"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: FORM SECTION */}
        <div className="lg:col-span-7 order-1">
          <div className="bg-[#000d1a]/40 backdrop-blur-xl border border-white/10 p-5 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-2xl shadow-inner text-blue-400">
                 <Globe size={20} />
               </div>
               <div>
                 <h2 className="text-xl font-black text-white tracking-tight">Business Profile</h2>
                 <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-[0.2em]">Master Entity Configuration</p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 ml-1 uppercase tracking-widest flex items-center gap-2">
                  <Building2 size={10} /> Company Name
                </label>
                <input
                  type="text" required className={inputStyle}
                  placeholder="e.g. PT. Teknologi Maju Jaya"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 ml-1 uppercase tracking-widest flex items-center gap-2">
                  <Tag size={10} /> Business Category
                </label>
                <div className="relative">
                  <select 
                    className={inputStyle}
                    value={formData.business_type}
                    onChange={(e) => setFormData({...formData, business_type: e.target.value})}
                  >
                    <option value="fnb" className="bg-[#000d1a]">Food & Beverage (FNB)</option>
                    <option value="retail" className="bg-[#000d1a]">Retail / Shop</option>
                    <option value="service" className="bg-[#000d1a]">Service / Agency</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-[10px]">▼</div>
                </div>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 tracking-widest text-[10px]"
              >
                {loading ? "SYNCING..." : <><Save size={16} /> SAVE BUSINESS PROFILE</>}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: MONITOR SECTION */}
        <div className="lg:col-span-5 space-y-4 order-2 pb-10">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-[10px] font-black text-white/50 flex items-center gap-2 uppercase tracking-[0.2em]">
              <Activity size={12} className="text-blue-500" /> Registry Monitor
            </h3>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-500">
               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
               <span className="text-[9px] font-black uppercase">{registeredBusinesses.length} Active</span>
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {registeredBusinesses.map((biz) => (
              <div key={biz.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl transition-all group hover:bg-white/[0.04]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 border border-white/5 group-hover:border-blue-500/30 transition-all">
                      <Building2 size={18} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-bold text-white/90 truncate">{biz.name}</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[8px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-black uppercase tracking-wider">
                          {biz.business_type}
                        </span>
                        <div className="flex items-center gap-1 text-[8px] text-white/20 font-bold uppercase tracking-tighter">
                          <Calendar size={8} /> {new Date(biz.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(biz.id)}
                    className="p-2 text-white/10 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            
            {registeredBusinesses.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">System Empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;