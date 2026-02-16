import { 
    Package, Tags, Users, ArrowUpRight, TrendingUp, 
    History, Star, MoreVertical, Search 
  } from "lucide-react";
  
  export default function Dashboard() {
    const stats = [
      { label: "Total Items", value: "120", icon: <Package size={24} />, color: "from-indigo-500 to-blue-600", trend: "+12%" },
      { label: "Categories", value: "8", icon: <Tags size={24} />, color: "from-emerald-500 to-teal-600", trend: "Stabil" },
      { label: "Active Users", value: "3", icon: <Users size={24} />, color: "from-orange-500 to-amber-600", trend: "+1" },
    ];
  
    const recentSales = [
      { id: "#1244", item: "Nasi Goreng Spesial", price: "Rp 25.000", status: "Selesai" },
      { id: "#1245", item: "Es Teh Manis", price: "Rp 5.000", status: "Pending" },
      { id: "#1246", item: "Ayam Bakar Madu", price: "Rp 35.000", status: "Selesai" },
    ];
  
    return (
      <div className="pt-24 pb-12 px-6 md:pt-10 md:px-10 max-w-7xl mx-auto space-y-10">
        
        {/* 1. HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Flux<span className="text-indigo-500">Analytics</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Laporan performa toko anda hari ini.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-white/5 p-1.5 rounded-2xl">
             <button className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">Harian</button>
             <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition">Bulanan</button>
          </div>
        </div>
  
        {/* 2. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden group">
              <div className={`absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl`} />
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h2 className="text-4xl font-black text-white mt-1">{stat.value}</h2>
            </div>
          ))}
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 3. RECENT TRANSACTIONS (Tabel Simple) */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <History size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Transaksi Terakhir</h3>
              </div>
              <button className="text-xs font-bold text-indigo-400 hover:underline">Lihat Semua</button>
            </div>
            
            <div className="space-y-4">
              {recentSales.map((sale, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {sale.id}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{sale.item}</p>
                      <p className="text-xs text-slate-500">{sale.status}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-indigo-400">{sale.price}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* 4. TOP PRODUCT CARD */}
          <div className="bg-gradient-to-b from-indigo-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
            <Star className="absolute -right-4 -top-4 w-32 h-32 text-white/10 rotate-12" />
            <div className="relative z-10">
              <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                Best Seller
              </div>
              <h3 className="text-2xl font-black mb-1">Ayam Geprek Jumbo</h3>
              <p className="text-indigo-100 text-sm mb-6">Terjual 450 porsi bulan ini</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-xs">
                  <span>Target Penjualan</span>
                  <span>85%</span>
                </div>
                <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-white rounded-full" />
                </div>
              </div>
  
              <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs hover:bg-indigo-50 transition-colors shadow-xl">
                Promosikan Produk
              </button>
            </div>
          </div>
  
        </div>
  
        {/* 5. SEARCH QUICK ACTION */}
        <div className="bg-slate-900 border border-white/5 p-4 rounded-3xl flex items-center gap-4 group focus-within:border-indigo-500/50 transition-all">
          <Search className="text-slate-500 group-focus-within:text-indigo-500" size={20} />
          <input 
            type="text" 
            placeholder="Cari transaksi atau produk dengan cepat..." 
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-600"
          />
          <kbd className="hidden md:block bg-slate-800 text-slate-500 px-2 py-1 rounded text-[10px] font-bold">CTRL + K</kbd>
        </div>
  
      </div>
    );
  }