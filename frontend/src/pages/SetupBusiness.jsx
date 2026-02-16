import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Store, ChevronDown } from 'lucide-react';
import logoImg from '../assets/pp.png';

const SetupBusiness = () => {
  const [formData, setFormData] = useState({
    name: '',
    business_type: 'fnb' 
  });
  const navigate = useNavigate();

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    Swal.fire({ 
      title: 'Menyiapkan Toko...', 
      text: 'Membangun infrastruktur bisnis Anda',
      allowOutsideClick: false,
      background: '#001529',
      color: '#fff',
      didOpen: () => Swal.showLoading() 
    });

    try {
      await api.post('business/info/', formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Toko Berhasil Dibuat!',
        text: 'Selamat datang di keluarga FluxPOS.',
        background: '#001529',
        color: '#fff',
        confirmButtonColor: '#0095ff',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => navigate('/setup-branch'), 2000);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.response?.data?.detail || 'Lengkapi semua data atau coba nama lain.',
        background: '#001529',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const inputStyle = "w-full bg-transparent border-b border-white/20 py-3 px-1 text-white outline-none focus:border-blue-400 transition-all placeholder:text-slate-500 text-sm";

  return (
    <div className="min-h-screen w-full bg-[#001529] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[400px] z-10">
        <div className="flex flex-col items-center mb-6">
          <img src={logoImg} alt="FluxPOS Logo" className="w-40 h-16 object-contain" />
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl">
          <div className="text-left mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Store className="text-blue-400" size={24} />
              Setup Bisnis
            </h2>
            <p className="text-slate-400 text-[10px] mt-2 font-medium uppercase tracking-[0.2em] opacity-70">
              Satu langkah terakhir untuk memulai
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleCreateBusiness}>
            {/* Input Nama Bisnis */}
            <div className="relative">
              <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest absolute -top-5 left-1">
                Nama Bisnis
              </label>
              <input
                type="text" 
                required
                className={inputStyle}
                placeholder="Contoh: Flux Coffee & Eatery"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Select Tipe Bisnis */}
            <div className="relative">
              <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest absolute -top-5 left-1">
                Tipe Bisnis
              </label>
              <div className="relative">
                <select 
                  className={`${inputStyle} appearance-none cursor-pointer pr-8`}
                  onChange={(e) => setFormData({...formData, business_type: e.target.value})}
                  value={formData.business_type}
                >
                  <option value="fnb" className="bg-[#001529] text-white">Food & Beverage (Cafe, Resto)</option>
                  <option value="retail" className="bg-[#001529] text-white">Retail (Toko, Warung)</option>
                  <option value="service" className="bg-[#001529] text-white">Service (Laundry, Barbershop)</option>
                </select>
                <ChevronDown className="absolute right-1 top-3 text-slate-500 pointer-events-none" size={16} />
              </div>
            </div>

            <button type="submit" className="w-full bg-white hover:bg-blue-500 hover:text-white text-[#001529] font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-[0.2em] text-[11px] mt-4">
              Buka Toko Sekarang
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-slate-500 text-[10px] font-medium uppercase tracking-widest opacity-50">
          Powered by FluxPOS Engine v3.0
        </p>
      </div>
    </div>
  );
};

export default SetupBusiness;