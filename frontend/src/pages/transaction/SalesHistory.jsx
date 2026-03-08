import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import { 
  FiSearch, FiRefreshCw, FiPrinter, 
  FiDownload, FiTrash2, FiClock, FiCoffee 
} from 'react-icons/fi';

const SalesHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const dummyData = [
        { 
          id: 'TRX-20260304-001', 
          date: '2026-03-04 19:20', 
          customer: 'Fikri', 
          type: 'DINE IN', 
          amount: 155000, 
          status: 'PAID',
          items: [
            { name: 'Caramel Macchiato', qty: 2, price: 45000 },
            { name: 'Croissant Cheese', qty: 1, price: 35000 },
            { name: 'Ice Lychee Tea', qty: 1, price: 30000 }
          ]
        },
        { 
          id: 'TRX-20260304-002', 
          date: '2026-03-04 19:45', 
          customer: 'RUMISIH', 
          type: 'TAKE AWAY', 
          amount: 710000, 
          status: 'PAID',
          items: [
            { name: 'Arabica House Blend 1KG', qty: 2, price: 350000 },
            { name: 'Paper Filter V60', qty: 1, price: 10000 }
          ]
        }
      ];
      setTransactions(dummyData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  // FUNGSI CETAK STRUK (THERMAL STYLE)
  const handlePrintBill = (txn) => {
    const subtotal = txn.items.reduce((acc, item) => acc + (item.qty * item.price), 0);
    const tax = subtotal * 0.1; // PB1 10%
    const total = subtotal + tax;

    Swal.fire({
      background: '#fff', // Kertas Putih
      color: '#000',
      showConfirmButton: true,
      confirmButtonText: 'PRINT NOW',
      confirmButtonColor: '#000',
      showCancelButton: true,
      cancelButtonText: 'CLOSE',
      width: '380px',
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; text-align: left; color: #000; padding: 10px; font-size: 13px;">
          <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
            <h2 style="margin: 0; font-size: 18px; font-weight: bold;">FIKRI CAFE</h2>
            <p style="margin: 2px 0;">Jl. Bintaro No. 12, Jakarta</p>
            <p style="margin: 2px 0;">0812-3456-7890</p>
          </div>

          <div style="margin-bottom: 10px; font-size: 11px;">
            <p style="margin: 2px 0;">INV  : ${txn.id}</p>
            <p style="margin: 2px 0;">DATE : ${txn.date}</p>
            <p style="margin: 2px 0;">CUST : ${txn.customer} (${txn.type})</p>
          </div>

          <table style="width: 100%; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px;">
            ${txn.items.map(item => `
              <tr>
                <td colspan="2" style="padding-top: 5px;">${item.name}</td>
              </tr>
              <tr>
                <td style="font-size: 11px;">${item.qty} x ${item.price.toLocaleString()}</td>
                <td style="text-align: right;">${(item.qty * item.price).toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>

          <table style="width: 100%; font-weight: bold;">
            <tr>
              <td>SUBTOTAL</td>
              <td style="text-align: right;">${subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td>PB1 (10%)</td>
              <td style="text-align: right;">${tax.toLocaleString()}</td>
            </tr>
            <tr style="font-size: 16px; border-top: 1px solid #000;">
              <td style="padding-top: 5px;">TOTAL</td>
              <td style="text-align: right; padding-top: 5px;">Rp ${total.toLocaleString()}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 20px; font-size: 10px;">
            <p>*** THANK YOU ***</p>
            <p>Powered by FluxPOS</p>
          </div>
        </div>
      `,
    });
  };

  const filteredTransactions = transactions.filter(t => 
    t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 font-['Plus_Jakarta_Sans'] text-slate-300">
      
      {/* HEADER SECTION - Sesuai BranchList */}
      <div className="flex flex-row items-center justify-between gap-2 md:gap-4 mb-8">
        <div className="relative flex-1 max-w-xs md:max-w-md">
          <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-white/20" size={12} />
          <input 
            type="text" 
            placeholder="Search invoice..."
            className="bg-white/[0.03] border border-white/10 rounded-xl py-2 md:py-2.5 pl-9 md:pl-11 pr-4 text-[11px] md:text-xs text-white outline-none focus:border-blue-500/50 w-full transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg active:scale-95 font-bold text-xs uppercase">
            <FiDownload size={16} />
            <span className="hidden md:inline">Download CSV</span>
          </button>
          <button onClick={fetchTransactions} className="p-2 md:p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white transition-all">
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-[#000d1a]/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-slate-300">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Order Detail</th>
                <th className="px-6 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Total Amount</th>
                <th className="px-6 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                      <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">{txn.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase">{txn.customer}</p>
                    <div className="mt-1 flex flex-col gap-1">
                      <p className="text-[10px] text-blue-500/80 font-bold">#{txn.id}</p>
                      <p className="text-[10px] text-white/30 font-medium tracking-wider uppercase italic">{txn.type} — {txn.date}</p>
                    </div>
                  </td>
                  <td className="px-6 py-8 font-mono text-sm font-bold text-white/70">
                    Rp {txn.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handlePrintBill(txn)}
                        className="p-2.5 text-white/20 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                      >
                        <FiPrinter size={16} />
                      </button>
                      <button className="p-2.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;