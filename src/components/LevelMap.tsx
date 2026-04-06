import { motion } from "framer-motion";
import { Lock, Star, CheckCircle } from "lucide-react";
import type { Level } from "@/data/gameData";

interface Props {
  levels: Level[];
  onSelectLevel: (level: Level) => void;
}

const LevelMap = ({ levels, onSelectLevel }: Props) => {
  return (
    <div className="relative py-8">
      {/* Path line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-primary/50 via-secondary/50 to-muted/30 rounded-full" />
      
      <div className="flex flex-col gap-8 items-center">
        {levels.map((level, i) => {
          const isEven = i % 2 === 0;
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`flex items-center gap-4 ${isEven ? "flex-row" : "flex-row-reverse"} w-full max-w-md`}
            >
              <div className="flex-1" />
              <button
                disabled={!level.unlocked}
                onClick={() => level.unlocked && onSelectLevel(level)}
                className={`relative group flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
                  level.completed
                    ? "glass glow-green cursor-pointer"
                    : level.unlocked
                    ? "glass glow-pink cursor-pointer hover:scale-105"
                    : "bg-muted/30 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${
                  level.completed
                    ? "bg-xp-green/20 text-xp-green"
                    : level.unlocked
                    ? "anime-gradient text-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {level.completed ? (
                    <CheckCircle className="w-7 h-7" />
                  ) : level.unlocked ? (
                    level.number
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
                <span className="text-sm font-bold">{level.name}</span>
                {level.completed && (
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= level.stars ? "text-gold fill-gold" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                )}
                {level.unlocked && !level.completed && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"
                  />
                )}
              </button>
              <div className="flex-1" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelMap;
