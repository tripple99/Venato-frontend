import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShieldAlert, MoveLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden font-rubik">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, -5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mb-8"
        >
          <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 shadow-2xl shadow-red-500/20">
            <ShieldAlert className="w-20 h-20 text-red-500" />
          </div>
        </motion.div>

        <h1 className="text-7xl font-bold tracking-tighter text-foreground mb-4">
          403
        </h1>

        <div className="space-y-3 mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            You don't have the necessary permissions to access this specific area. 
            Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 flex items-center gap-2 group border-red-500/20 hover:bg-red-500/5"
              onClick={() => navigate(-1)}
            >
              <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 bg-primary-venato hover:bg-primary-venato-hover text-white flex items-center gap-2 group"
            >
              <Link to="/">
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-sm text-muted-foreground font-medium opacity-50">
        Venato Security System • Build v1.0.0
      </div>
    </div>
  );
}
