import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import { 
  FiMapPin, FiTrash2, FiSearch, FiPlus, 
  FiFilter, FiRefreshCw, FiEdit3, FiHome 
} from 'react-icons/fi';

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const activeBizId = localStorage.getItem('active_business_id');
      const res = await api.get('business/branches/');
      
      if (activeBizId) {
        const filtered = res.data.filter(b => String(b.business) === String(activeBizId));
        setBranches(filtered);
      } else {
        setBranches(res.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
    const handleBizChange = () => fetchBranches();
    window.addEventListener('storage_biz_changed', handleBizChange);
    return () => window.removeEventListener('storage_biz_changed', handleBizChange);
  }, []);

  const handleAddBranch = async () => {
    const activeBizId = localStorage.getItem('active_business_id');
    if (!activeBizId) {
      return Swal.fire({
        icon: 'error',
        title: 'Business not found',
        text: 'Please select a business entity first.',
        background: '#000d1a',
        color: '#fff'
      });
    }

    const { value: formValues } = await Swal.fire({
      title: 'Register New Branch',
      background: '#000d1a',
      color: '#fff',
      html: `
        <div style="text-align: left; font-family: 'Plus Jakarta Sans', sans-serif; padding: 10px;">
          <label style="font-size: 10px; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px;">Branch Name</label>
          <input id="add-name" class="swal2-input" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 12px; font-size: 14px; width: 90%; margin: 10px 0 20px 0;" placeholder="Enter branch name">
          
          <label style="font-size: 10px; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px; display: block;">Branch Address</label>
          <textarea id="add-address" class="swal2-textarea" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 12px; font-size: 14px; width: 90%; height: 80px; margin: 10px 0;" placeholder="Enter complete address"></textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Create Branch',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#1e293b',
      preConfirm: () => {
        const name = document.getElementById('add-name').value;
        const address = document.getElementById('add-address').value;
        if (!name || !address) {
          Swal.showValidationMessage('Please fill in all fields');
        }
        return { name, address, business: activeBizId };
      }
    });

    if (formValues) {
      try {
        await api.post('business/branches/', formValues);
        Swal.fire({
          icon: 'success',
          title: 'Branch Created',
          text: 'New outlet has been added to your network.',
          background: '#000d1a',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });
        fetchBranches();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Registration failed', background: '#000d1a', color: '#fff' });
      }
    }
  };

  const handleEdit = async (branch) => {
    const { value: formValues } = await Swal.fire({
      title: 'Update Branch Data',
      background: '#000d1a',
      color: '#fff',
      html: `
        <div style="text-align: left; font-family: 'Plus Jakarta Sans', sans-serif; padding: 10px;">
          <label style="font-size: 10px; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px;">Branch Name</label>
          <input id="swal-input1" class="swal2-input" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 12px; font-size: 14px; width: 90%; margin: 10px 0 20px 0;" value="${branch.name}">
          
          <label style="font-size: 10px; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px; display: block;">Branch Address</label>
          <textarea id="swal-input2" class="swal2-textarea" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 12px; font-size: 14px; width: 90%; height: 80px; margin: 10px 0;">${branch.address}</textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#1e293b',
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const address = document.getElementById('swal-input2').value;
        if (!name || !address) {
          Swal.showValidationMessage('Please fill in all fields');
        }
        return { name, address };
      }
    });

    if (formValues) {
      try {
        await api.patch(`business/branches/${branch.id}/`, formValues);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Branch information has been updated.',
          background: '#000d1a',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });
        fetchBranches(); 
      } catch (err) {
        Swal.fire({ 
          icon: 'error', 
          title: 'Update failed', 
          background: '#000d1a', 
          color: '#fff' 
        });
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Remove branch?',
      text: "This branch will be disconnected from your network.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#1e293b',
      confirmButtonText: 'Yes, delete',
      background: '#000d1a',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`business/branches/${id}/`);
        setBranches(branches.filter(b => b.id !== id));
        Swal.fire({
            title: 'Removed',
            icon: 'success',
            background: '#000d1a',
            color: '#fff',
            timer: 1000,
            showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({ title: 'Error', text: 'Failed to delete', icon: 'error', background: '#000d1a', color: '#fff' });
      }
    }
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 font-['Plus_Jakarta_Sans']">
      
      {/* HEADER SECTION */}
      <div className="flex flex-row items-center justify-between gap-2 md:gap-4 mb-8">
        {/* Search Bar - Mengambil ruang sisa */}
        <div className="relative flex-1 max-w-xs md:max-w-md">
          <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-white/20" size={12} />
          <input 
            type="text" 
            placeholder="Search..."
            className="bg-white/[0.03] border border-white/10 rounded-xl py-2 md:py-2.5 pl-9 md:pl-11 pr-4 text-[11px] md:text-xs text-white outline-none focus:border-blue-500/50 w-full transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Add Branch Button - Ikon saja di mobile, Teks di desktop */}
          <button 
            onClick={handleAddBranch}
            className="flex items-center justify-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <FiPlus size={16} />
            <span className="hidden md:inline text-xs font-bold">Add Branch</span>
          </button>

          {/* Refresh Button */}
          <button 
            onClick={fetchBranches}
            className="p-2 md:p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
            title="Refresh Data"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-[#000d1a]/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-4 md:px-6 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Status</th>
                <th className="px-4 md:px-6 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Branch Name</th>
                <th className="hidden sm:table-cell px-4 md:px-6 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Location</th>
                <th className="px-4 md:px-6 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                      <span className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5">
                  <p className="text-xs md:text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {branch.name}
                  </p>
                  
                  <div className="flex flex-col gap-1.5 mt-2">
                    {/* Created At Section dengan Label */}
                    <div className="flex flex-col">
                      <h3 className="text-[9px] text-blue-400/50 uppercase font-black tracking-widest mb-0.5">
                        Created at
                      </h3>
                      <p className="text-[12px] md:text-[13px] text-white/60 font-mono leading-none">
                        {new Date(branch.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16)}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Address */}
                  <p className="sm:hidden text-[11px] text-white/40 mt-2 line-clamp-1 italic">
                    {branch.address}
                  </p>
                </td>
                  <td className="hidden sm:table-cell px-4 md:px-6 py-4 md:py-5">
                    <div className="flex items-start gap-2 text-white/50 max-w-xs">
                      <FiMapPin size={12} className="shrink-0 text-blue-500/50 mt-0.5" />
                      <span className="text-[11px] font-medium leading-relaxed line-clamp-2">{branch.address}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5 text-center">
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                      <button 
                        onClick={() => handleEdit(branch)}
                        className="p-2 md:p-2.5 text-white/20 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg md:rounded-xl transition-all"
                      >
                        <FiEdit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(branch.id)}
                        className="p-2 md:p-2.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg md:rounded-xl transition-all"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBranches.length === 0 && !loading && (
            <div className="py-16 md:py-24 text-center">
              <p className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">No branches detected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchList;