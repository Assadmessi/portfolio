import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B0F19] text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-gray-400 mb-8">This page does not exist.</p>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:scale-105 transition"
        >
          Back Home
        </Link>
      </motion.div>
    </div>
  );
}
