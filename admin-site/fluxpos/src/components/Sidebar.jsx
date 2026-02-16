import { useState, useEffect } from "react"; // Tambahkan useEffect
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Utensils,
  Menu,
  X,
  Layers,
  Settings,
  ShoppingCart,
  BarChart3,
  BrainCircuit,
  Sparkles,
} from "lucide-react";

export default function Sidebar() {
  const [openItems, setOpenItems] = useState(true);
  const [openAnalysis, setOpenAnalysis] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();

  // FIX: Mengunci scroll body saat sidebar mobile terbuka
  useEffect(() => {
    if (openSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openSidebar]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login"; // force re-render
  };
  
  return (
    <>
      {/* MOBILE TOP BAR - Tetap Stay di Atas */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] bg-slate-950/80 backdrop-blur-md text-white flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">F</div>
          <span className="font-bold tracking-tight text-xl">Flux<span className="text-indigo-500">POS</span></span>
        </div>
        <button 
          onClick={() => setOpenSidebar(true)}
          className="p-2 bg-slate-900 rounded-full border border-white/10 active:scale-95 transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* OVERLAY - Menutup seluruh layar */}
      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] md:hidden transition-opacity duration-300"
        />
      )}

      {/* SIDEBAR - Struktur yang sudah diperbaiki */}
      <aside
      className={`
        /* POSISI */
        fixed top-0 left-0 z-[80] 
        
        /* UKURAN */
        w-[280px] md:w-64 h-screen 
        
        /* STYLE */
        bg-[#0f172a] text-slate-300
        flex flex-col
        border-r border-white/5 shadow-2xl
        
        /* ANIMASI & LOGIKA BUKA/TUTUP */
        transition-transform duration-300 ease-in-out
        ${openSidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 /* Di desktop selalu muncul */
      `}
    >
        {/* 1. Header Sidebar - Tetap di Atas */}
        <div className="p-6 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Layers size={22} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Flux<span className="text-indigo-400">POS</span>
            </h1>
          </div>
          <button
            className="md:hidden p-2 hover:bg-white/5 rounded-full transition"
            onClick={() => setOpenSidebar(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* 2. Menu Utama - Area yang bisa di-scroll */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-2 pb-6 scrollbar-hide">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-2 px-4">Utama</p>
          
          <NavLink
            to="/dashboard"
            onClick={() => setOpenSidebar(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg" : "hover:bg-white/5 hover:text-white border border-transparent"}`
            }
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold text-sm">Dashboard</span>
          </NavLink>

          <NavLink
            to="/transactions"
            onClick={() => setOpenSidebar(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg" : "hover:bg-white/5 hover:text-white border border-transparent"}`
            }
          >
            <ShoppingCart size={20} />
            <span className="font-semibold text-sm">Kasir</span>
          </NavLink>

          {/* SMART SYSTEM */}
          <div className="pt-4">
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[2px] mb-2 px-4 flex items-center gap-2">
              <Sparkles size={10} /> Smart System
            </p>
            <div
              onClick={() => setOpenAnalysis(!openAnalysis)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all border border-transparent
                ${openAnalysis ? "bg-indigo-500/5 text-indigo-400" : "hover:bg-white/5 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <BrainCircuit size={20} />
                <span className="font-semibold text-sm">Analisis Apriori</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-300 ${openAnalysis ? "rotate-0" : "-rotate-90 opacity-50"}`} />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${openAnalysis ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="ml-6 pl-4 border-l-2 border-indigo-500/30 space-y-1 mt-1">
                <NavLink to="/analysis/patterns" className="block px-4 py-2 text-[13px] text-slate-500 hover:text-indigo-400">Pola Pembelian</NavLink>
                <NavLink to="/analysis/recommendations" className="block px-4 py-2 text-[13px] text-slate-500 hover:text-indigo-400">Rekomendasi Paket</NavLink>
              </div>
            </div>
          </div>

          {/* MANAJEMEN */}
          <div className="pt-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-2 px-4">Manajemen</p>
            <div
                onClick={() => setOpenItems(!openItems)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all border border-transparent
                ${openItems ? "text-indigo-400" : "hover:bg-white/5 hover:text-white"}`}
            >
                <div className="flex items-center gap-3">
                  <Utensils size={20} />
                  <span className="font-semibold text-sm">Katalog Menu</span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${openItems ? "rotate-0" : "-rotate-90 opacity-50"}`} />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${openItems ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="ml-6 pl-4 border-l-2 border-indigo-500/30 space-y-1 mt-1">
                  <NavLink to="/catalog/categories" className="block px-4 py-2 text-[13px] text-slate-500 hover:text-indigo-400">Category</NavLink>
                  <NavLink to="/catalog/subcategories" className="block px-4 py-2 text-[13px] text-slate-500 hover:text-indigo-400">Subcategory</NavLink>
                  <NavLink to="/catalog/items" className="block px-4 py-2 text-[13px] text-slate-500 hover:text-indigo-400">Item Menu</NavLink>
                </div>
            </div>

            <NavLink to="/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all mt-1">
              <BarChart3 size={20} />
              <span className="font-semibold text-sm">Laporan Sales</span>
            </NavLink>

            <NavLink to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all mt-1">
              <Settings size={20} />
              <span className="font-semibold text-sm">Pengaturan</span>
            </NavLink>
          </div>
        </nav>

        {/* 3. Footer Logout - Tetap di Bawah */}
        <div className="p-4 flex-shrink-0 mt-auto border-t border-white/5 bg-[#0f172a]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}