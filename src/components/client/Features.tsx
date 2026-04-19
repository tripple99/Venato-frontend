import { motion, type Variants } from "framer-motion";
import { Bell, BarChart3, ShieldCheck, ArrowUpRight, Star } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ─── Mini chart bars for the Trend Tracking card ─── */
function MiniBarChart() {
  const bars = [
    { month: "JAN", height: 45, delay: 0 },
    { month: "FEB", height: 65, delay: 0.1 },
    { month: "MAR", height: 40, delay: 0.2 },
    { month: "APR", height: 80, delay: 0.3 },
    { month: "MAY", height: 55, delay: 0.4 },
  ];

  return (
    <div className="flex items-end justify-between gap-3 mt-8 px-2">
      {bars.map((bar) => (
        <div key={bar.month} className="flex flex-col items-center gap-2">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: bar.height }}
            transition={{ duration: 0.8, delay: bar.delay, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-8 sm:w-10 rounded-md bg-white/30 backdrop-blur-sm"
            style={{ minHeight: 4 }}
          />
          <span className="text-[10px] sm:text-xs font-semibold text-white/70 uppercase tracking-wider">
            {bar.month}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Market alert notification for Price Alerts card ─── */
function MarketAlertMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      viewport={{ once: true }}
      className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-4 max-w-xs"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
          Market Alert
        </span>
        <span className="text-[10px] text-gray-400">Just now</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#0D6449]/10 flex items-center justify-center flex-shrink-0">
          <ArrowUpRight size={16} className="text-[#0D6449]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Oyo State Maize <span className="text-emerald-600">↑ 14%</span>
          </p>
          <p className="text-xs text-gray-500">
            Price up in Oja Oba, Trade Market
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Avatar stack for Community card ─── */
function AvatarStack() {
  const colors = [
    "bg-amber-500",
    "bg-emerald-500",
    "bg-blue-500",
    "bg-purple-500",
  ];
  const initials = ["AO", "KM", "SC", "BJ"];

  return (
    <div className="flex -space-x-3 mt-4">
      {colors.map((color, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
          viewport={{ once: true }}
          className={`w-10 h-10 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md`}
        >
          {initials[i]}
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        viewport={{ once: true }}
        className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-bold shadow-md"
      >
        5k+
      </motion.div>
    </div>
  );
}

/* ─── Testimonial card ─── */
function TestimonialCard({
  name,
  text,
  delay,
}: {
  name: string;
  text: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-5 max-w-[260px]"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#0D6449]/15 flex items-center justify-center">
          <span className="text-xs font-bold text-[#0D6449]">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{text}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN FEATURES COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function Features() {
  return (
    <section
      id="features"
      className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-6"
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
          Core Capabilities
        </span>
      </motion.div>
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-14 max-w-lg leading-tight"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        The Future of Agribusiness
      </motion.h2>

      {/* ── Top Row: Price Alerts + Trend Tracking ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Card 1: Real-time Price Alerts */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="lg:col-span-3 bg-[#f8f9fa] rounded-3xl p-8 sm:p-10 border border-gray-100 transition-shadow duration-300 hover:shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#0D6449]/10 flex items-center justify-center">
              <Bell size={20} className="text-[#0D6449]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Real-time Price Alerts
            </h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">
            Never miss a price shift. Receive instant notifications when market
            rates for Maize, Cocoa, or Cassava hit your targets.
          </p>
          <MarketAlertMockup />
        </motion.div>

        {/* Card 2: Trend Tracking */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="lg:col-span-2 bg-[#1a3a2a] rounded-3xl p-8 sm:p-10 transition-shadow duration-300 hover:shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Trend Tracking</h3>
          </div>
          <p className="text-sm text-white/65 leading-relaxed">
            Sophisticated analytics simplified. Visualize historical data and
            predict upcoming market fluctuations.
          </p>
          <MiniBarChart />
        </motion.div>
      </div>

      {/* ── Bottom Row: Verified Community ── */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        id="community"
        className="bg-[#f8f9fa] rounded-3xl p-8 sm:p-10 border border-gray-100 transition-shadow duration-300 hover:shadow-xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0D6449]/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-[#0D6449]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Verified Community
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mb-2">
              Join a curated network of over 5,000 professional farmers and
              verified off-takers across Nigeria. Build trust with
              blockchain-backed reputation scores.
            </p>
            <AvatarStack />
          </div>

          {/* Right: Testimonials */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <TestimonialCard
              name="Musa K."
              text="I've been able to plan my sales better with Venato."
              delay={0.2}
            />
            <TestimonialCard
              name="Amina O."
              text="This platform was a game changer for my tomato sales."
              delay={0.35}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
