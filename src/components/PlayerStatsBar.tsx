import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { PlayerStats } from "@/data/gameData";

const PlayerStatsBar = ({ stats }: { stats: PlayerStats }) => {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center gap-4 glass rounded-xl px-5 py-3"
    >
      <div className="flex items-center gap-1.5 font-bold text-gold">
        <span className="text-lg">💰</span>
        <span>{stats.coins}</span>
      </div>
      <div className="flex items-center gap-1.5 font-bold text-gem">
        <span className="text-lg">💎</span>
        <span>{stats.gems}</span>
      </div>
      <div className="flex items-center gap-2 flex-1 max-w-[200px]">
        <span className="text-xs font-bold text-xp-green">LV{stats.level}</span>
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(stats.xp / stats.maxXp) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, hsl(140 70% 50%), hsl(160 80% 55%))" }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{stats.xp}/{stats.maxXp}</span>
      </div>
      <div className="flex items-center gap-1 font-bold text-destructive">
        <Flame className="w-4 h-4" />
        <span>{stats.streak}</span>
      </div>
    </motion.div>
  );
};

export default PlayerStatsBar;
