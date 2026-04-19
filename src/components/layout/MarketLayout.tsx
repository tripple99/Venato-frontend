import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Bell, Settings, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { title: "Marketplace", href: "/markets", active: true },
    { title: "Analytics", href: "#", active: false },
    { title: "Inventory", href: "#", active: false },
    { title: "Trade", href: "#", active: false },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-rubik flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tight text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            The Earth's Architect
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <div key={idx} className="relative h-16 flex items-center">
                <Link
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    link.active ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {link.title}
                </Link>
                {link.active && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0D6449] rounded-t-sm"
                  />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Nav Icons */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors p-1">
              <Bell size={18} />
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors p-1">
              <Settings size={18} />
            </button>
          </div>
          
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer flex-shrink-0">
            <img 
              src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            onClick={() => setMobileOpen(true)}
            size="icon"
            variant="ghost"
            className="md:hidden text-gray-600"
          >
            <Menu size={20} />
          </Button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[70] p-6 shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-6 flex-1">
                {navLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg font-medium ${
                      link.active ? "text-[#0D6449]" : "text-gray-600"
                    }`}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
              <div className="flex gap-6 mt-auto border-t pt-6">
                <button className="flex items-center gap-2 text-gray-600">
                  <Bell size={20} /> Alerts
                </button>
                <button className="flex items-center gap-2 text-gray-600">
                  <Settings size={20} /> Settings
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full bg-[#f8f9fa]">
        <Outlet />
      </main>
    </div>
  );
}
