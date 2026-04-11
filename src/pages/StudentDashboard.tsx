import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sampleChapters, initialPlayerStats, type Chapter, type Level } from "@/data/gameData";
import PlayerStatsBar from "@/components/PlayerStatsBar";
import AnimeCharacter from "@/components/AnimeCharacter";
import LevelMap from "@/components/LevelMap";
import MCQGame from "@/components/MCQGame";
import DescriptiveMode from "@/components/DescriptiveMode";
import CherryBlossoms from "@/components/CherryBlossoms";

type View = "home" | "chapters" | "levels" | "mcq" | "descriptive";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("home");
  const [stats, setStats] = useState(initialPlayerStats);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const handleChapterSelect = (ch: Chapter) => {
    setSelectedChapter(ch);
    setView("levels");
  };

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
  };

  const handleMCQComplete = useCallback((correct: number, total: number, xp: number, coins: number) => {
    setStats((p) => ({ ...p, xp: p.xp + xp, coins: p.coins + coins }));
    setView("levels");
    setSelectedLevel(null);
  }, []);

  const handleDescComplete = useCallback((xp: number, coins: number) => {
    setStats((p) => ({ ...p, xp: p.xp + xp, coins: p.coins + coins }));
    setView("levels");
    setSelectedLevel(null);
  }, []);

  // MCQ Mode
  if (view === "mcq" && selectedLevel) {
    return <MCQGame questions={selectedLevel.mcqQuestions} onComplete={handleMCQComplete} onBack={() => { setView("levels"); setSelectedLevel(null); }} />;
  }

  // Descriptive Mode
  if (view === "descriptive" && selectedLevel) {
    return <DescriptiveMode questions={selectedLevel.descriptiveQuestions} levelId={selectedLevel.id} onComplete={handleDescComplete} onBack={() => { setView("levels"); setSelectedLevel(null); }} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CherryBlossoms />
      <div className="relative z-20 p-4 md:p-8 max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <button onClick={() => view === "home" ? navigate("/") : (view === "levels" ? setView("chapters") : setView("home"))} className="glass px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform">
            <ArrowLeft className="w-4 h-4 inline mr-1" /> {view === "home" ? "Home" : "Back"}
          </button>
          <PlayerStatsBar stats={stats} />
        </div>

        {/* Home */}
        {view === "home" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-8">
            <AnimeCharacter mood="wave" />
            <div className="text-center">
              <h2 className="text-3xl font-bold text-glow mb-2">Welcome back, Adventurer!</h2>
              <p className="text-muted-foreground">Choose your path to continue the journey</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView("chapters")}
              className="glass glow-pink rounded-2xl px-12 py-5 text-xl font-bold hover:scale-105 transition-transform"
            >
              ⚔️ Enter Chapters
            </motion.button>
            {/* Badges */}
            {stats.badges.length > 0 && (
              <div className="glass rounded-2xl p-6 w-full max-w-md">
                <h3 className="font-bold mb-3 text-gold">🏆 Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.badges.map((b) => (
                    <span key={b} className="px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-semibold">{b}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Chapters */}
        {view === "chapters" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-2">
            {sampleChapters.map((ch, i) => (
              <motion.button
                key={ch.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleChapterSelect(ch)}
                className="glass rounded-2xl p-6 text-left hover:glow-pink transition-all"
              >
                <div className="text-3xl mb-2">{ch.icon}</div>
                <h3 className="text-xl font-bold mb-1">{ch.name}</h3>
                <p className="text-sm text-muted-foreground">{ch.description}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  {ch.levels.filter((l) => l.completed).length}/{ch.levels.length} levels completed
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Level Select */}
        {view === "levels" && selectedChapter && !selectedLevel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-center mb-2 text-glow">{selectedChapter.icon} {selectedChapter.name}</h2>
            <LevelMap levels={selectedChapter.levels} onSelectLevel={setSelectedLevel} />
          </motion.div>
        )}

        {/* Level Actions */}
        {view === "levels" && selectedLevel && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
            <div className="glass rounded-2xl p-8 text-center max-w-md w-full">
              <h2 className="text-2xl font-bold mb-1">{selectedLevel.name}</h2>
              <p className="text-muted-foreground mb-6">Level {selectedLevel.number}</p>
              <div className="flex flex-col gap-3">
                {selectedLevel.mcqQuestions.length > 0 && (
                  <button onClick={() => setView("mcq")} className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary font-bold text-primary-foreground glow-pink hover:scale-105 transition-transform">
                    <Swords className="w-5 h-5" /> MCQ Battle ({selectedLevel.mcqQuestions.length} questions)
                  </button>
                )}
                {selectedLevel.descriptiveQuestions.length > 0 && (
                  <button onClick={() => setView("descriptive")} className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-secondary font-bold text-secondary-foreground glow-blue hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" /> Descriptive Quest ({selectedLevel.descriptiveQuestions.length} questions)
                  </button>
                )}
              </div>
            </div>
            <button onClick={() => setSelectedLevel(null)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Choose another level
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
