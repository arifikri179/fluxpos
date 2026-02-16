import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { Search, Plus, Minus, CreditCard, Banknote, ShoppingCart, ReceiptText, Loader2 } from "lucide-react";

export default function Kasir() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const componentRef = useRef();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("access");
  
        const response = await axios.get(
          "http://127.0.0.1:8000/api/items/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setProducts(response.data);
      } catch (error) {
        console.error("ERROR GET ITEMS:", error);
  
        if (error.response?.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, []);
  

  const addToCart = (p) => {
    const exist = cart.find((i) => i.id === p.id);
    if (exist) setCart(cart.map((i) => i.id === p.id ? { ...exist, qty: exist.qty + 1 } : i));
    else setCart([...cart, { ...p, qty: 1 }]);
  };

  const decreaseQty = (p) => {
    const exist = cart.find((i) => i.id === p.id);
    if (exist.qty === 1) setCart(cart.filter((i) => i.id !== p.id));
    else setCart(cart.map((i) => i.id === p.id ? { ...exist, qty: exist.qty - 1 } : i));
  };

  const subtotal = cart.reduce((a, c) => a + (parseFloat(c.price) * c.qty), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    // h-full w-full di sini akan mengikuti ukuran <main> di App.jsx
    <div className="flex h-full w-full bg-[#020617] text-slate-200 overflow-hidden">
      
      {/* AREA KIRI: KATALOG */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/5">
        <header className="px-6 py-4 flex items-center justify-between bg-[#070c1d]/50 backdrop-blur-md border-b border-white/5">
          <div>
            <h1 className="text-lg font-black text-white uppercase tracking-tight">Katalog Menu</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Flux POS System</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Cari menu..." 
              className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs outline-none focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map((product) => (
                <div key={product.id} onClick={() => addToCart(product)} className="bg-slate-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-indigo-500/50 cursor-pointer transition-all group">
                  <div className="aspect-square bg-slate-800 overflow-hidden">
                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={product.name} />
                  </div>
                  <div className="p-3">
                    <h3 className="text-[11px] font-bold text-white truncate uppercase">{product.name}</h3>
                    <p className="text-indigo-400 font-black text-[10px] mt-1">Rp {parseFloat(product.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AREA KANAN: CHECKOUT (ASIDE) */}
      <aside className="w-80 bg-[#070c1d] flex flex-col border-l border-white/5">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} className="text-indigo-500" />
            <span className="text-xs font-black uppercase text-white">Checkout</span>
          </div>
          <button onClick={() => setCart([])} className="text-[9px] text-red-400 font-bold border border-red-400/20 px-2 py-1 rounded-md hover:bg-red-400/10">RESET</button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-700">
              <ReceiptText size={32} strokeWidth={1} />
              <p className="text-[9px] mt-2 font-bold uppercase">Kosong</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-2 bg-slate-900/30 p-2 rounded-lg border border-white/5">
                <img src={item.image} className="w-8 h-8 rounded-md object-cover" alt={item.name} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-bold text-white truncate uppercase">{item.name}</h4>
                  <p className="text-[9px] text-indigo-400 font-bold">Rp {parseFloat(item.price).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 bg-black/20 rounded-md p-1">
                  <button onClick={() => decreaseQty(item)} className="text-slate-400 p-0.5 hover:text-white"><Minus size={8} /></button>
                  <span className="text-white text-[10px] font-bold w-3 text-center">{item.qty}</span>
                  <button onClick={() => addToCart(item)} className="text-slate-400 p-0.5 hover:text-white"><Plus size={8} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-[#020617] border-t border-white/10 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase"><span>Subtotal</span><span className="text-white">Rp {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase"><span>Pajak (10%)</span><span className="text-white">Rp {tax.toLocaleString()}</span></div>
            <div className="pt-2 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-black text-white uppercase">Total</span>
              <span className="text-lg font-black text-indigo-500">Rp {total.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-slate-800 text-white rounded-lg text-[9px] font-bold uppercase hover:bg-slate-700 flex items-center justify-center gap-2">
              <Banknote size={12} /> Tunai
            </button>
            <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-bold uppercase hover:bg-indigo-500 flex items-center justify-center gap-2">
              <CreditCard size={12} /> QRIS
            </button>
          </div>
          <button disabled={cart.length === 0} className="w-full py-3 bg-white text-black rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-20">
            Selesaikan Transaksi
          </button>
        </div>
      </aside>
    </div>
  );
}