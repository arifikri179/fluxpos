import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiPackage, FiShoppingBag, FiGrid, FiBarChart2, FiUser, 
  FiSettings, FiLogOut, FiChevronDown, FiMenu, FiX, FiPlus, FiZap,
  FiMapPin, FiList, FiTag, FiLayers, FiClock, FiRotateCcw, FiUsers, FiXCircle,
  FiBriefcase, FiActivity, FiPlusCircle, FiHome // Tambahkan FiHome untuk ikon Toko
} from 'react-icons/fi'; // Import icon tambahan untuk sub-menu
import logoImg from '../assets/pp.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleSubMenu = (label) => {
    if (isCollapsed && !isMobileOpen) {
      setIsCollapsed(false);
    }
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const menuItems = [
    { id: '/profile', label: 'Dashboard', icon: <FiGrid /> },
    {
      label: 'Business',
      icon: <FiBriefcase />,
      subItems: [
        { id: '/business/info', label: 'Business Profile', icon: <FiActivity /> },
        { id: '/business/list', label: 'My Businesses', icon: <FiList /> },
        { id: '/business/add', label: 'Add Business', icon: <FiPlusCircle /> },
      ]
    },
    { id: '/pos', label: 'Point of Sale', icon: <FiShoppingBag /> },
    
    {
      label: 'Branches',
      // Menggunakan FiShoppingBag agar terlihat seperti toko/outlet
      icon: <FiShoppingBag />, 
      subItems: [
        { id: '/add-branch', label: 'Add New Branch', icon: <FiShoppingBag /> },
        { id: '/branch-list', label: 'All Branches', icon: <FiShoppingBag /> },
      ]
    },
    { 
      label: 'Inventory', 
      icon: <FiPackage />,
      subItems: [
        { id: '/inventory/items', label: 'Items', icon: <FiList /> },
        { id: '/inventory/category', label: 'Item Category', icon: <FiTag /> },
        { id: '/inventory/subcategory', label: 'Item Subcategory', icon: <FiLayers /> },
      ]
    },

    {
      label: 'Transactions',
      icon: <FiZap />,
      subItems: [
        { id: '/transactions/history', label: 'Sales History', icon: <FiClock /> },
        { id: '/transactions/refunds', label: 'Refunds', icon: <FiRotateCcw /> },
        // Tambahan menu untuk menangani kasus double hit/duplikat
        { id: '/transactions/void', label: 'Void Transactions', icon: <FiXCircle /> },
      ],
    },

    { id: '/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
    
    {
      label: 'Management',
      icon: <FiUser />,
      subItems: [
        { id: '/management/customers', label: 'Customers', icon: <FiUsers /> },
        { id: '/management/employees', label: 'Employees', icon: <FiBriefcase /> },
      ]
    },
    
    { id: '/settings', label: 'Settings', icon: <FiSettings /> },
  ];

  const isActive = (path) => location.pathname === path;
  const isParentActive = (item) => item.subItems?.some(sub => location.pathname === sub.id);

  return (
    <>
      {/* MOBILE TRIGGER */}
      {!isMobileOpen && (
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed top-4 left-3 z-[120] p-1.5 bg-[#000d1a]/80 backdrop-blur-sm text-blue-400 rounded-lg border border-white/10 shadow-[0_0_10px_rgba(59,130,246,0.15)] animate-in fade-in zoom-in duration-300"
        >
          <FiMenu size={18} />
        </button>
      )}

      {/* OVERLAY */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* SIDEBAR MAIN */}
      <aside className={`
        fixed lg:sticky top-0 h-screen z-[110]
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-24' : 'lg:w-72'}
        w-72 bg-[#000d1a] border-r border-white/5 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] font-['Plus_Jakarta_Sans']
      `}>
        
        {/* HEADER */}
        <div className="p-8 flex items-center relative min-h-[100px]">
          <div className={`
            absolute left-8 transition-all duration-500 
            ${isCollapsed ? 'lg:opacity-0 lg:scale-50' : 'opacity-100 scale-100'}
          `}>
            <img 
              src={logoImg} 
              alt="Logo" 
              className="h-10 md:h-12 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]" 
            />
          </div>
          <div className="flex-1"></div>
          <button 
            onClick={() => isMobileOpen ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-blue-400 transition-colors z-10"
          >
            {isMobileOpen ? <FiX size={18} className="text-red-400" /> : <FiMenu size={18} className="hidden lg:block" />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {!isCollapsed && (
            <div className="flex items-center gap-3 mt-4 mb-6 px-4">
              <p className="text-[9px] font-black text-blue-500/60 uppercase tracking-[0.3em]">Core Systems</p>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
            </div>
          )}
          
          {menuItems.map((item) => {
            const hasSub = !!item.subItems;
            const active = isActive(item.id) || isParentActive(item);
            const isOpen = openMenus[item.label];

            return (
              <div key={item.label} className="relative group px-1">
                {active && !isCollapsed && (
                  <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-blue-500 rounded-r-full shadow-[4px_0_12px_rgba(59,130,246,0.4)] z-10" />
                )}

                <button
                  onClick={() => hasSub ? toggleSubMenu(item.label) : navigate(item.id)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden
                    ${active ? 'bg-blue-600/10 text-white font-bold' : 'text-white/40 hover:bg-white/[0.03] hover:text-white'}
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <span className={`text-xl shrink-0 transition-transform duration-300 ${active ? 'text-blue-400 scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-[13px] flex-1 text-left tracking-wide font-semibold">{item.label}</span>
                  )}
                  {hasSub && !isCollapsed && (
                    <FiChevronDown className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-400' : 'opacity-40'}`} />
                  )}
                </button>

                {/* SUBMENU WITH ICONS */}
                {hasSub && isOpen && !isCollapsed && (
                  <div className="mt-2 ml-7 pl-4 border-l-2 border-white/5 space-y-1 animate-in slide-in-from-left-4 duration-500">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => navigate(sub.id)}
                        className={`
                          w-full flex items-center gap-3 py-2.5 px-4 text-[11px] font-bold tracking-wider rounded-xl transition-all
                          ${isActive(sub.id) ? 'text-blue-400 bg-blue-400/5' : 'text-white/30 hover:text-white hover:bg-white/5'}
                        `}
                      >
                        <span className={`text-sm ${isActive(sub.id) ? 'text-blue-400' : 'text-white/20'}`}>
                          {sub.icon}
                        </span>
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-6 border-t border-white/5 mt-auto bg-black/20">
          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className={`
              w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <FiLogOut className="text-xl shrink-0 group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-[0.2em]">Exit Session</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;