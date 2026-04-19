import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  title: string;
  href: string;
  isRoute?: boolean;
}

const navItems: NavItem[] = [
  { title: "Price Alerts", href: "features" },
  { title: "Trends", href: "features" },
  { title: "Community", href: "community" },
];

export default function Navbar() {
  const sideRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sideRef.current && !sideRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`hidden lg:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 py-4 transition-all duration-500 ${
          scrolled
            ? "bg-[#1a3a2a]/95 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <RouterLink to="/" className="text-white text-2xl font-bold tracking-tight">
          Venato
        </RouterLink>

        {/* Nav Links — Pill container */}
        <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-1 py-1 gap-1">
          {navItems.map((item, index) => (
            <ScrollLink
              key={index}
              to={item.href}
              spy
              smooth
              offset={-80}
              duration={600}
              className="cursor-pointer text-sm font-medium text-white/80 hover:text-white px-5 py-2 rounded-full transition-all duration-300 hover:bg-white/15"
              activeClass="!bg-white/20 !text-white"
            >
              {item.title}
            </ScrollLink>
          ))}
        </div>

        {/* Login Button */}
        <Button
          asChild
          className="bg-[#0D6449] hover:bg-[#0A503A] text-white rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#0D6449]/25 hover:shadow-[#0D6449]/40"
        >
          <RouterLink to="/auth/login">Login</RouterLink>
        </Button>
      </motion.nav>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <div
          className={`flex justify-between items-center px-6 py-4 transition-all duration-500 ${
            scrolled
              ? "bg-[#1a3a2a]/95 backdrop-blur-xl shadow-lg"
              : "bg-transparent"
          }`}
        >
          <RouterLink to="/" className="text-white text-2xl font-bold tracking-tight">
            Venato
          </RouterLink>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-transparent hover:bg-white/10 p-2 rounded-lg border-0 cursor-pointer"
          >
            <Menu className="text-white" size={24} />
          </Button>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Sidebar Panel */}
              <motion.div
                ref={sideRef}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-[72%] max-w-[320px] bg-[#1a3a2a] z-50 shadow-2xl"
              >
                <div className="flex justify-end p-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col px-6 mt-4 space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.08 }}
                    >
                      <ScrollLink
                        to={item.href}
                        spy
                        smooth
                        offset={-80}
                        duration={600}
                        onClick={() => setIsOpen(false)}
                        className="cursor-pointer block text-lg font-medium text-white/80 hover:text-white py-3 px-4 rounded-xl hover:bg-white/10 transition-all duration-200"
                      >
                        {item.title}
                      </ScrollLink>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-6"
                  >
                    <Button
                      asChild
                      className="w-full bg-[#0D6449] hover:bg-[#0A503A] text-white rounded-xl py-3 text-base font-semibold"
                    >
                      <RouterLink to="/auth/login">Login</RouterLink>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
