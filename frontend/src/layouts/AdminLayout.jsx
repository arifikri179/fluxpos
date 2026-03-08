import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-[#000d1a] overflow-hidden">
      
      {/* 1. SIDEBAR: Jangan di-hidden di sini! Biarkan Sidebar.jsx yang atur sendiri */}
      <Sidebar />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <Navbar />

        {/* Efek Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        {/* 3. SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar">
          <div className="w-full max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;