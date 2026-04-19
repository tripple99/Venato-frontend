import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { images } from "@/assets/images";
import { useState } from "react";

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function About() {
  const [email, setEmail] = useState("");

  return (
    <section className="px-6 sm:px-10 lg:px-16 py-16 sm:py-20 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="bg-[#1a3a2a] rounded-3xl overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Left Content */}
          <motion.div
            variants={fadeInLeft}
            className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center"
          >
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Join the Revolution.
            </h2>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-8 max-w-md">
              Start optimizing your agricultural business today. Join thousands
              of Nigerians building the future of farming.
            </p>

            {/* Email Input + Button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your work email"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#0D6449] focus:ring-1 focus:ring-[#0D6449] transition-all duration-300"
              />
              <Button className="bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded-xl px-7 py-3.5 text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#e74c3c]/25 hover:shadow-[#e74c3c]/40 whitespace-nowrap">
                Join Now
              </Button>
            </div>

            <p className="text-xs text-white/35">
              No credit card required. Free 30-day trial. Cancel anytime.
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            variants={fadeInRight}
            className="relative min-h-[300px] lg:min-h-0"
          >
            <img
              src={images.tractor}
              alt="Modern tractor in agricultural field"
              className="w-full h-full object-cover"
            />
            {/* Subtle left gradient blend */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#1a3a2a] to-transparent" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
