import React from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

interface FooterLink {
  label: string;
  href: string;
}

const linkColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
  {
    title: "",
    links: [
      { label: "Market Data API", href: "#" },
      { label: "Content Support", href: "#" },
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      className="bg-[#1a3a2a] text-white"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Branding */}
          <div className="md:col-span-1">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight block mb-4"
            >
              Venato
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Bridging the gap between the field and the market.
              Making agriculture predictable and consistently trust-based.
            </p>
          </div>

          {/* Link Columns */}
          <div className="md:col-span-2 flex flex-wrap gap-16 sm:gap-24 justify-start md:justify-end">
            {linkColumns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-3">
                {col.links.map((link, linkIdx) => (
                  <a
                    key={linkIdx}
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-xs text-white/35 text-center sm:text-left">
            © {new Date().getFullYear()} Venato Agricultural Services.
            Prediction for the Nigerian Futures.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
