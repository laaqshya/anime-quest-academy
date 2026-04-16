import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { initialPlayerStats } from "@/data/gameData";
import { useChapters, useQuestions, type DbChapter } from "@/hooks/useChapters";
import PlayerStatsBar from "@/components/PlayerStatsBar";
import AnimeCharacter from "@/components/AnimeCharacter";
import MCQGame from "@/components/MCQGame";
import DescriptiveMode from "@/components/DescriptiveMode";
import CherryBlossoms from "@/components/CherryBlossoms";

type View = "home" | "chapters" | "mcq" | "descriptive";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("home");
  const [stats, setStats] = useState(initialPlayerStats);
  const [selectedChapter, setSelectedChapter] = useState<DbChapter | null>(null);
  const { chapters, loading: chaptersLoading } = useChapters();

  const handleChapterSelect = (ch: DbChapter) => {
    setSelectedChapter(ch);
  };

  const handleMCQComplete = useCallback((correct: number, total: number, xp: number, coins: number) => {
    setStats((p) => ({ ...p, xp: p.xp + xp, coins: p.coins + coins }));
    setSelectedChapter(null);
    setView("chapters");
  }, []);

  const handleDescComplete = useCallback((xp: number, coins: number) => {
    setStats((p) => ({ ...p, xp: p.xp + xp, coins: p.coins + coins }));
    setSelectedChapter(null);
    setView("chapters");
  }, []);

  // MCQ Mode
  if (view === "mcq" && selectedChapter) {
    return (
      <MCQGameWrapper
        chapterId={selectedChapter.id}
        onComplete={handleMCQComplete}
        onBack={() => { setView("chapters"); setSelectedChapter(null); }}
      />
    );
  }

  // Descriptive Mode
  if (view === "descriptive" && selectedChapter) {
    return (
      <DescriptiveModeWrapper
        chapterId={selectedChapter.id}
        onComplete={handleDescComplete}
        onBack={() => { setView("chapters"); setSelectedChapter(null); }}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CherryBlossoms />
      <div className="relative z-20 p-4 md:p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <button onClick={() => view === "home" ? navigate("/") : setView("home")} className="glass px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform">
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
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setView("chapters")}
              className="glass glow-pink rounded-2xl px-12 py-5 text-xl font-bold hover:scale-105 transition-transform">
              ⚔️ Enter Chapters
            </motion.button>
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
        {view === "chapters" && !selectedChapter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {chaptersLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading chapters...</div>
            ) : chapters.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No chapters available yet. Ask your teacher to create some!</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {chapters.map((ch, i) => (
                  <motion.button key={ch.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.03 }} onClick={() => handleChapterSelect(ch)}
                    className="glass rounded-2xl p-6 text-left hover:glow-pink transition-all">
                    <div className="text-3xl mb-2">{ch.icon}</div>
                    <h3 className="text-xl font-bold mb-1">{ch.name}</h3>
                    <p className="text-sm text-muted-foreground">{ch.description}</p>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Chapter selected - show level options */}
        {view === "chapters" && selectedChapter && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
            <div className="glass rounded-2xl p-8 text-center max-w-md w-full">
              <h2 className="text-2xl font-bold mb-1">{selectedChapter.icon} {selectedChapter.name}</h2>
              <p className="text-muted-foreground mb-6">{selectedChapter.description}</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => setView("mcq")} className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary font-bold text-primary-foreground glow-pink hover:scale-105 transition-transform">
                  <Swords className="w-5 h-5" /> 🎯 Objective Level (MCQ)
                </button>
                <button onClick={() => setView("descriptive")} className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-secondary font-bold text-secondary-foreground glow-blue hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" /> ✍️ Descriptive Level
                </button>
              </div>
            </div>
            <button onClick={() => setSelectedChapter(null)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Choose another chapter
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Wrapper that fetches questions from DB for MCQ
function MCQGameWrapper({ chapterId, onComplete, onBack }: { chapterId: string; onComplete: (c: number, t: number, xp: number, coins: number) => void; onBack: () => void }) {
  const { mcqQuestions, loading } = useQuestions(chapterId);
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading questions...</div>;
  if (mcqQuestions.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">No MCQ questions available for this chapter yet.</p>
      <button onClick={onBack} className="glass px-6 py-3 rounded-xl font-bold">← Back</button>
    </div>
  );
  // Map DB questions to the MCQGame format
  const mapped = mcqQuestions.map((q) => ({
    id: q.id, question: q.question_text, options: q.options,
    correctIndex: q.correct_index, xpReward: q.xp_reward, coinReward: q.coin_reward,
  }));
  return <MCQGame questions={mapped} onComplete={onComplete} onBack={onBack} />;
}

// Wrapper that fetches questions from DB for Descriptive
function DescriptiveModeWrapper({ chapterId, onComplete, onBack }: { chapterId: string; onComplete: (xp: number, coins: number) => void; onBack: () => void }) {
  const { descQuestions, loading } = useQuestions(chapterId);
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading questions...</div>;
  if (descQuestions.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">No descriptive questions available for this chapter yet.</p>
      <button onClick={onBack} className="glass px-6 py-3 rounded-xl font-bold">← Back</button>
    </div>
  );
  const mapped = descQuestions.map((q) => ({
    id: q.id, question: q.question_text, xpReward: q.xp_reward, coinReward: q.coin_reward,
  }));
  return <DescriptiveMode questions={mapped} chapterId={chapterId} onComplete={onComplete} onBack={onBack} />;
}

export default StudentDashboard;
