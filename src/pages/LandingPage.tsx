import { motion } from "framer-motion";
import { GraduationCap, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CherryBlossoms from "@/components/CherryBlossoms";
import animeBg from "@/assets/anime-bg.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={animeBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/70" />
      <CherryBlossoms />

      <div className="relative z-20 text-center px-4">
        <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-black text-glow mb-2 font-pixel leading-tight">
            Quest<span className="text-primary">Learn</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 font-semibold">
            Your anime adventure awaits — solve questions, level up! ⚔️
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.button
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/student")}
            className="glass glow-pink rounded-2xl px-10 py-6 flex flex-col items-center gap-3 min-w-[200px] group"
          >
            <div className="w-16 h-16 rounded-full anime-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8 text-foreground" />
            </div>
            <span className="text-xl font-bold">Student</span>
            <span className="text-sm text-muted-foreground">Start your quest</span>
          </motion.button>

          <motion.button
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/teacher")}
            className="glass glow-blue rounded-2xl px-10 py-6 flex flex-col items-center gap-3 min-w-[200px] group"
          >
            <div className="w-16 h-16 rounded-full bg-gem/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8 text-gem" />
            </div>
            <span className="text-xl font-bold">Teacher</span>
            <span className="text-sm text-muted-foreground">Manage quests</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
