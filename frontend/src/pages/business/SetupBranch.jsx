import { useState } from 'react';
import Radar from 'radar-sdk-js';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { MapPin, Navigation, ChevronRight } from 'lucide-react';
import logoImg from '../../assets/pp.png';

// Initialize Radar
Radar.initialize('prj_test_pk_5f10414280df3d50c7c7514c6808f65dfde8041c');

const SetupBranch = () => {
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

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
      } catch (err) {
        console.error("Radar Error:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (item) => {
    setFormData({ ...formData, address: item.formattedAddress });
    setSuggestions([]);
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    Swal.fire({ 
      title: 'Mendaftarkan Cabang...', 
      text: 'Menghubungkan lokasi ke sistem FluxPOS',
      allowOutsideClick: false,
      background: '#001529',
      color: '#fff',
      didOpen: () => Swal.showLoading() 
    });

    try {
      await api.post('business/branches/', formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Siap Beroperasi!',
        text: 'Cabang pertama Anda berhasil dibuat.',
        background: '#001529',
        color: '#fff',
        confirmButtonColor: '#0095ff',
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Setup Gagal', 
        text: 'Periksa input Anda atau coba alamat lain.',
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
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[420px] z-10">
        <div className="flex flex-col items-center mb-6">
          <img src={logoImg} alt="FluxPOS Logo" className="w-40 h-16 object-contain" />
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative">
          <div className="text-left mb-10">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 italic">
              <MapPin className="text-blue-400" size={24} />
              Setup Cabang
            </h2>
            <p className="text-slate-400 text-[10px] mt-2 font-medium uppercase tracking-[0.2em] opacity-70">
              Tentukan lokasi cabang utama Anda
            </p>
          </div>

          <form className="space-y-10" onSubmit={handleCreateBranch}>
            {/* Branch Name */}
            <div className="relative">
              <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest absolute -top-5 left-1">
                Nama Cabang
              </label>
              <input
                type="text" 
                required
                className={inputStyle}
                placeholder="Contoh: Cabang Pusat Jakarta"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Branch Address with Autocomplete */}
            <div className="relative">
              <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest absolute -top-5 left-1">
                Alamat Lengkap
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className={`${inputStyle} pr-8`}
                  placeholder="Cari alamat di sini..."
                  value={formData.address}
                  onChange={handleAddressChange}
                  autoComplete="off"
                />
                <Navigation className="absolute right-1 top-3 text-slate-500" size={16} />
              </div>

              {/* Suggestions Dropdown (Glassmorphism Style) */}
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-[110%] bg-[#001c38]/90 backdrop-blur-xl border border-white/10 rounded-xl mt-2 z-50 shadow-2xl overflow-hidden">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 text-white/70 hover:bg-blue-500/20 hover:text-white cursor-pointer border-b border-white/5 last:border-none text-[11px] transition-colors flex items-center gap-2"
                      onClick={() => selectSuggestion(item)}
                    >
                      <ChevronRight size={12} className="text-blue-400" />
                      {item.formattedAddress}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-white hover:bg-blue-500 hover:text-white text-[#001529] font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-[0.2em] text-[11px] mt-4">
              Selesaikan Pendaftaran
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-slate-500 text-[10px] font-medium uppercase tracking-widest opacity-50">
          Langkah Akhir • FluxPOS Activation
        </p>
      </div>
    </div>
  );
};

export default SetupBranch;