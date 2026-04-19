import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { images } from "@/assets/images";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={images.heroBg}
          alt="Nigerian farmland with cattle"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f15]/90 via-[#0a1f15]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f15]/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20 sm:pb-28 lg:pb-32 pt-32"
      >
        {/* Badge */}
        <motion.div variants={fadeUp}>
          <span className="inline-block bg-[#0D6449] text-white text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6 shadow-lg shadow-[#0D6449]/30">
            Precision Agriculture
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 max-w-3xl"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Stay Ahead of
          <br />
          the Market.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-base sm:text-lg text-white/75 max-w-lg mb-10 leading-relaxed"
        >
          Empowering Nigerian farmers with real-time data,
          precision insights, and a verified network of trade
          partners.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
          <Button
            asChild
            className="bg-white text-[#1a3a2a] hover:bg-white/90 rounded-full px-8 py-6 text-base font-semibold shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
          >
            <Link to="/auth/register">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-2 border-white/40 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/60 rounded-full px-8 py-6 text-base font-semibold transition-all duration-300"
          >
            <Link to="/markets">View Demo</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom fade for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
