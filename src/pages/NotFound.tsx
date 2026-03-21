import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HelpCircle, MoveLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mb-8"
        >
          <HelpCircle className="w-24 h-24 text-primary-venato opacity-20" />
        </motion.div>

        <h1 className="text-9xl font-bold tracking-tighter text-foreground mb-4">
          404
        </h1>

        <div className="space-y-2 mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to another URL.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 bg-primary-venato hover:bg-primary-venato-hover text-white flex items-center gap-2 group"
          >
            <Link to="/">
              <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Subtle Bottom Text */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-sm text-muted-foreground font-medium opacity-50">
        Venato Admin Dashboard • Build v1.0.0
      </div>
    </div>
  );
}
