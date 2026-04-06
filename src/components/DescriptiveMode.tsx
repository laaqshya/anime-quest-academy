import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Send } from "lucide-react";
import type { DescriptiveQuestion } from "@/data/gameData";

interface Props {
  questions: DescriptiveQuestion[];
  onComplete: (xp: number, coins: number) => void;
  onBack: () => void;
}

const DescriptiveMode = ({ questions, onComplete, onBack }: Props) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const q = questions[currentIdx];
  const totalXp = questions.reduce((a, q) => a + q.xpReward, 0);
  const totalCoins = questions.reduce((a, q) => a + q.coinReward, 0);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx((p) => p + 1);
    else onComplete(totalXp, totalCoins);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="glass px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform">← Back</button>
        <div className="glass px-4 py-2 rounded-xl text-sm font-bold">{currentIdx + 1} / {questions.length}</div>
      </div>

      <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} className="h-full rounded-full bg-secondary" />
      </div>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div key={currentIdx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="flex-1 flex flex-col">
            <div className="glass rounded-2xl p-6 md:p-8 mb-4">
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground font-semibold">
                <span className="text-xp-green">+{q.xpReward} XP</span>
                <span className="text-gold">+{q.coinReward} 💰</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold">{q.question}</h3>
            </div>
            <textarea
              value={answers[q.id] || ""}
              onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
              placeholder="Write your answer here..."
              className="flex-1 min-h-[200px] glass rounded-2xl p-6 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              onPaste={(e) => e.preventDefault()}
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-4">
          <button onClick={() => currentIdx > 0 && setCurrentIdx((p) => p - 1)} disabled={currentIdx === 0} className="flex items-center gap-2 px-6 py-3 rounded-xl glass font-bold disabled:opacity-30 hover:scale-105 transition-transform">
            <ArrowLeft className="w-5 h-5" /> Previous
          </button>
          <button onClick={handleNext} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-secondary font-bold text-secondary-foreground glow-blue hover:scale-105 transition-transform">
            {currentIdx < questions.length - 1 ? (<>Next <ArrowRight className="w-5 h-5" /></>) : (<>Submit <Send className="w-5 h-5" /></>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptiveMode;
