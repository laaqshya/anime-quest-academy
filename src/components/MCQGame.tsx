import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import type { MCQQuestion } from "@/data/gameData";
import AnimeCharacter from "./AnimeCharacter";
import forestBg from "@/assets/forest-bg.jpg";

interface Props {
  questions: MCQQuestion[];
  onComplete: (correct: number, total: number, xp: number, coins: number) => void;
  onBack: () => void;
}

const MCQGame = ({ questions, onComplete, onBack }: Props) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [charMood, setCharMood] = useState<"idle" | "happy" | "sad">("idle");
  const [charMsg, setCharMsg] = useState<string | undefined>();
  const [showResult, setShowResult] = useState(false);

  const q = questions[currentIdx];

  const handleSelect = useCallback((idx: number) => {
    if (feedback) return;
    setSelected(idx);
    const isCorrect = idx === q.correctIndex;
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setTotalCorrect((p) => p + 1);
      setTotalXp((p) => p + q.xpReward);
      setTotalCoins((p) => p + q.coinReward);
      setCharMood("happy");
      setCharMsg("Amazing! You got it! 🎉");
    } else {
      setCharMood("sad");
      setCharMsg("Don't worry, keep going! 💪");
    }
  }, [feedback, q]);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((p) => p + 1);
      setSelected(null);
      setFeedback(null);
      setCharMood("idle");
      setCharMsg(undefined);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundImage: `url(${forestBg})`, backgroundSize: "cover" }}>
        <div className="absolute inset-0 bg-background/80" />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative glass rounded-3xl p-10 text-center max-w-md">
          <Trophy className="w-16 h-16 text-gold mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-glow-gold mb-2">Level Complete!</h2>
          <p className="text-muted-foreground mb-6">You answered {totalCorrect}/{questions.length} correctly</p>
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-xp-green">+{totalXp}</p>
              <p className="text-xs text-muted-foreground">XP Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gold">+{totalCoins}</p>
              <p className="text-xs text-muted-foreground">Coins</p>
            </div>
          </div>
          <button onClick={() => onComplete(totalCorrect, questions.length, totalXp, totalCoins)} className="px-8 py-3 rounded-xl bg-primary font-bold text-primary-foreground glow-pink hover:scale-105 transition-transform">
            Continue
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundImage: `url(${forestBg})`, backgroundSize: "cover" }}>
      <div className="absolute inset-0 bg-background/60" />
      
      <div className="relative z-10 flex flex-col h-full p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="glass px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform">
            ← Back
          </button>
          <div className="glass px-4 py-2 rounded-xl text-sm font-bold">
            {currentIdx + 1} / {questions.length}
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            className="h-full rounded-full bg-primary"
          />
        </div>

        <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
          {/* Character */}
          <div className="md:w-1/3 flex justify-center">
            <AnimeCharacter mood={charMood} message={charMsg} />
          </div>

          {/* Question */}
          <div className="md:w-2/3 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="glass rounded-2xl p-6 md:p-8 mb-6"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-6">{q.question}</h3>
                <div className="grid gap-3">
                  {q.options.map((opt, i) => {
                    let optionClass = "glass hover:scale-[1.02] cursor-pointer";
                    if (feedback && i === q.correctIndex) optionClass = "bg-xp-green/20 border-xp-green glow-green";
                    else if (feedback === "wrong" && i === selected) optionClass = "bg-destructive/20 border-destructive animate-shake";
                    else if (feedback) optionClass = "glass opacity-50";
                    
                    return (
                      <motion.button
                        key={i}
                        whileTap={!feedback ? { scale: 0.98 } : undefined}
                        onClick={() => handleSelect(i)}
                        disabled={!!feedback}
                        className={`text-left p-4 rounded-xl border transition-all duration-300 font-semibold ${optionClass}`}
                      >
                        <span className="text-muted-foreground mr-3">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {feedback && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                <button onClick={handleNext} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary font-bold text-primary-foreground glow-pink hover:scale-105 transition-transform">
                  {currentIdx < questions.length - 1 ? "Next" : "Finish"} <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQGame;
