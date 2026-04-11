import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Send, Upload, FileText, X } from "lucide-react";
import type { DescriptiveQuestion } from "@/data/gameData";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import { toast } from "@/hooks/use-toast";

interface Props {
  questions: DescriptiveQuestion[];
  levelId?: string;
  onComplete: (xp: number, coins: number) => void;
  onBack: () => void;
}

const DescriptiveMode = ({ questions, levelId = "default", onComplete, onBack }: Props) => {
  const { save, load, clear } = useAutoSave(levelId, "descriptive");
  const { shouldAutoSubmit, preventCopyPaste } = useAntiCheat(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; size: number }>>({});

  const totalXp = questions.reduce((a, q) => a + q.xpReward, 0);
  const totalCoins = questions.reduce((a, q) => a + q.coinReward, 0);

  // Load saved progress
  useEffect(() => {
    const saved = load();
    if (saved) {
      setAnswers(saved.answers);
      setCurrentIdx(saved.currentIdx);
      toast({ title: "📂 Progress restored!" });
    }
  }, []);

  // Auto-save on change
  useEffect(() => {
    save(answers, currentIdx);
  }, [answers, currentIdx]);

  // Auto-submit on cheat
  useEffect(() => {
    if (shouldAutoSubmit) {
      clear();
      onComplete(totalXp, totalCoins);
    }
  }, [shouldAutoSubmit]);

  const q = questions[currentIdx];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large (max 10MB)", variant: "destructive" });
      return;
    }
    setUploadedFiles((p) => ({ ...p, [q.id]: { name: file.name, size: file.size } }));
    toast({ title: `📎 ${file.name} attached` });
  };

  const removeFile = (qId: string) => {
    setUploadedFiles((p) => {
      const next = { ...p };
      delete next[qId];
      return next;
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((p) => p + 1);
    } else {
      clear();
      onComplete(totalXp, totalCoins);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="glass px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform">← Back</button>
        <div className="glass px-4 py-2 rounded-xl text-sm font-bold">Question {currentIdx + 1} of {questions.length}</div>
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

            {/* Text answer */}
            <textarea
              value={answers[q.id] || ""}
              onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
              placeholder="Write your answer here..."
              className="flex-1 min-h-[160px] glass rounded-2xl p-6 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              {...preventCopyPaste}
            />

            {/* File upload */}
            <div className="mt-3">
              {uploadedFiles[q.id] ? (
                <div className="glass rounded-xl p-3 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold flex-1 truncate">{uploadedFiles[q.id].name}</span>
                  <span className="text-xs text-muted-foreground">{(uploadedFiles[q.id].size / 1024).toFixed(0)} KB</span>
                  <button onClick={() => removeFile(q.id)} className="p-1 rounded hover:bg-destructive/20"><X className="w-4 h-4 text-destructive" /></button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full glass rounded-xl p-3 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:scale-[1.01] transition-all border-2 border-dashed border-muted-foreground/30"
                >
                  <Upload className="w-4 h-4" /> Upload PDF / Image (optional)
                </button>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleFileUpload} />
            </div>
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
