import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B0F19] text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="text-center max-w-lg"
      >
        <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-gray-400 mb-8">
          This page doesn’t exist (or it moved). Let’s get you back.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:scale-[1.03] transition"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}