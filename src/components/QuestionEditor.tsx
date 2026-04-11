import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Plus, Trash2, Edit, GripVertical, Check, X, Save } from "lucide-react";
import type { MCQQuestion, DescriptiveQuestion } from "@/data/gameData";
import { toast } from "@/hooks/use-toast";

interface Props {
  levelId: string;
  levelName: string;
  mcqQuestions: MCQQuestion[];
  descriptiveQuestions: DescriptiveQuestion[];
  onSave: (levelId: string, mcq: MCQQuestion[], desc: DescriptiveQuestion[]) => void;
  onClose: () => void;
}

type QType = "mcq" | "descriptive";

const QuestionEditor = ({ levelId, levelName, mcqQuestions, descriptiveQuestions, onSave, onClose }: Props) => {
  const [mcqs, setMcqs] = useState<MCQQuestion[]>([...mcqQuestions]);
  const [descs, setDescs] = useState<DescriptiveQuestion[]>([...descriptiveQuestions]);
  const [activeTab, setActiveTab] = useState<QType>("mcq");
  const [editingMcq, setEditingMcq] = useState<MCQQuestion | null>(null);
  const [editingDesc, setEditingDesc] = useState<DescriptiveQuestion | null>(null);
  const [showNewForm, setShowNewForm] = useState<QType | null>(null);

  // New MCQ form state
  const [newMcqText, setNewMcqText] = useState("");
  const [newMcqOptions, setNewMcqOptions] = useState(["", "", "", ""]);
  const [newMcqCorrect, setNewMcqCorrect] = useState(0);
  const [newMcqXp, setNewMcqXp] = useState(25);
  const [newMcqCoins, setNewMcqCoins] = useState(8);

  // New Desc form state
  const [newDescText, setNewDescText] = useState("");
  const [newDescXp, setNewDescXp] = useState(30);
  const [newDescCoins, setNewDescCoins] = useState(10);

  const resetMcqForm = () => {
    setNewMcqText("");
    setNewMcqOptions(["", "", "", ""]);
    setNewMcqCorrect(0);
    setNewMcqXp(25);
    setNewMcqCoins(8);
    setShowNewForm(null);
  };

  const resetDescForm = () => {
    setNewDescText("");
    setNewDescXp(30);
    setNewDescCoins(10);
    setShowNewForm(null);
  };

  const addMcq = () => {
    if (!newMcqText.trim() || newMcqOptions.some((o) => !o.trim())) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }
    const q: MCQQuestion = {
      id: `mcq-${Date.now()}`,
      question: newMcqText,
      options: newMcqOptions,
      correctIndex: newMcqCorrect,
      xpReward: newMcqXp,
      coinReward: newMcqCoins,
    };
    setMcqs((p) => [...p, q]);
    resetMcqForm();
    toast({ title: "MCQ added ✨" });
  };

  const addDesc = () => {
    if (!newDescText.trim()) {
      toast({ title: "Enter question text", variant: "destructive" });
      return;
    }
    const q: DescriptiveQuestion = {
      id: `desc-${Date.now()}`,
      question: newDescText,
      xpReward: newDescXp,
      coinReward: newDescCoins,
    };
    setDescs((p) => [...p, q]);
    resetDescForm();
    toast({ title: "Descriptive question added ✨" });
  };

  const deleteMcq = (id: string) => setMcqs((p) => p.filter((q) => q.id !== id));
  const deleteDesc = (id: string) => setDescs((p) => p.filter((q) => q.id !== id));

  const handleSave = () => {
    onSave(levelId, mcqs, descs);
    toast({ title: "Questions saved! 🎉" });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="glass px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform">
            <X className="w-4 h-4 inline mr-1" /> Close
          </button>
          <h2 className="text-xl font-bold">📝 Edit: {levelName}</h2>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform">
          <Save className="w-4 h-4" /> Save All
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-4">
        {(["mcq", "descriptive"] as QType[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-xl font-bold transition-all ${activeTab === t ? "bg-primary text-primary-foreground glow-pink" : "glass hover:scale-105"}`}
          >
            {t === "mcq" ? `🎯 MCQ (${mcqs.length})` : `✍️ Descriptive (${descs.length})`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4 max-w-4xl mx-auto w-full">
        {/* MCQ Tab */}
        {activeTab === "mcq" && (
          <div className="space-y-3">
            <Reorder.Group axis="y" values={mcqs} onReorder={setMcqs} className="space-y-3">
              {mcqs.map((q, i) => (
                <Reorder.Item key={q.id} value={q}>
                  <motion.div layout className="glass rounded-xl p-4 flex items-start gap-3 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-muted-foreground">Q{i + 1}</span>
                        <span className="text-xs text-xp-green">+{q.xpReward} XP</span>
                        <span className="text-xs text-gold">+{q.coinReward} 💰</span>
                      </div>
                      {editingMcq?.id === q.id ? (
                        <div className="space-y-2">
                          <input
                            value={editingMcq.question}
                            onChange={(e) => setEditingMcq({ ...editingMcq, question: e.target.value })}
                            className="w-full glass rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          {editingMcq.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input
                                type="radio"
                                checked={editingMcq.correctIndex === oi}
                                onChange={() => setEditingMcq({ ...editingMcq, correctIndex: oi })}
                                className="accent-xp-green"
                              />
                              <input
                                value={opt}
                                onChange={(e) => {
                                  const opts = [...editingMcq.options];
                                  opts[oi] = e.target.value;
                                  setEditingMcq({ ...editingMcq, options: opts });
                                }}
                                className="flex-1 glass rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setMcqs((p) => p.map((x) => (x.id === editingMcq.id ? editingMcq : x)));
                                setEditingMcq(null);
                              }}
                              className="px-3 py-1 rounded-lg bg-xp-green text-foreground text-sm font-bold"
                            >
                              <Check className="w-3 h-3 inline" /> Save
                            </button>
                            <button onClick={() => setEditingMcq(null)} className="px-3 py-1 rounded-lg glass text-sm font-bold">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold text-sm">{q.question}</p>
                          <div className="grid grid-cols-2 gap-1 mt-2">
                            {q.options.map((opt, oi) => (
                              <span key={oi} className={`text-xs px-2 py-1 rounded ${oi === q.correctIndex ? "bg-xp-green/20 text-xp-green font-bold" : "text-muted-foreground"}`}>
                                {String.fromCharCode(65 + oi)}. {opt}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditingMcq(q)} className="p-1.5 rounded-lg hover:bg-muted"><Edit className="w-4 h-4 text-gem" /></button>
                      <button onClick={() => deleteMcq(q.id)} className="p-1.5 rounded-lg hover:bg-destructive/20"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {/* Add MCQ Form */}
            <AnimatePresence>
              {showNewForm === "mcq" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass rounded-xl p-5 space-y-3 overflow-hidden">
                  <h4 className="font-bold text-sm">New MCQ Question</h4>
                  <input
                    value={newMcqText}
                    onChange={(e) => setNewMcqText(e.target.value)}
                    placeholder="Question text..."
                    className="w-full glass rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {newMcqOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="radio" checked={newMcqCorrect === i} onChange={() => setNewMcqCorrect(i)} className="accent-xp-green" />
                      <input
                        value={opt}
                        onChange={(e) => {
                          const opts = [...newMcqOptions];
                          opts[i] = e.target.value;
                          setNewMcqOptions(opts);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className="flex-1 glass rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">XP</label>
                      <input type="number" value={newMcqXp} onChange={(e) => setNewMcqXp(+e.target.value)} className="w-20 glass rounded-lg p-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Coins</label>
                      <input type="number" value={newMcqCoins} onChange={(e) => setNewMcqCoins(+e.target.value)} className="w-20 glass rounded-lg p-2 text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addMcq} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform">Add</button>
                    <button onClick={resetMcqForm} className="px-5 py-2 rounded-xl glass font-bold">Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {showNewForm !== "mcq" && (
              <button onClick={() => setShowNewForm("mcq")} className="w-full glass rounded-xl p-4 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform border-2 border-dashed border-muted-foreground/30">
                <Plus className="w-5 h-5" /> Add MCQ Question
              </button>
            )}
          </div>
        )}

        {/* Descriptive Tab */}
        {activeTab === "descriptive" && (
          <div className="space-y-3">
            <Reorder.Group axis="y" values={descs} onReorder={setDescs} className="space-y-3">
              {descs.map((q, i) => (
                <Reorder.Item key={q.id} value={q}>
                  <motion.div layout className="glass rounded-xl p-4 flex items-start gap-3 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-muted-foreground">Q{i + 1}</span>
                        <span className="text-xs text-xp-green">+{q.xpReward} XP</span>
                        <span className="text-xs text-gold">+{q.coinReward} 💰</span>
                      </div>
                      {editingDesc?.id === q.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingDesc.question}
                            onChange={(e) => setEditingDesc({ ...editingDesc, question: e.target.value })}
                            className="w-full glass rounded-lg p-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setDescs((p) => p.map((x) => (x.id === editingDesc.id ? editingDesc : x)));
                                setEditingDesc(null);
                              }}
                              className="px-3 py-1 rounded-lg bg-xp-green text-foreground text-sm font-bold"
                            >
                              <Check className="w-3 h-3 inline" /> Save
                            </button>
                            <button onClick={() => setEditingDesc(null)} className="px-3 py-1 rounded-lg glass text-sm font-bold">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p className="font-semibold text-sm">{q.question}</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditingDesc(q)} className="p-1.5 rounded-lg hover:bg-muted"><Edit className="w-4 h-4 text-gem" /></button>
                      <button onClick={() => deleteDesc(q.id)} className="p-1.5 rounded-lg hover:bg-destructive/20"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <AnimatePresence>
              {showNewForm === "descriptive" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass rounded-xl p-5 space-y-3 overflow-hidden">
                  <h4 className="font-bold text-sm">New Descriptive Question</h4>
                  <textarea
                    value={newDescText}
                    onChange={(e) => setNewDescText(e.target.value)}
                    placeholder="Question text..."
                    className="w-full glass rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <div className="flex gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">XP</label>
                      <input type="number" value={newDescXp} onChange={(e) => setNewDescXp(+e.target.value)} className="w-20 glass rounded-lg p-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Coins</label>
                      <input type="number" value={newDescCoins} onChange={(e) => setNewDescCoins(+e.target.value)} className="w-20 glass rounded-lg p-2 text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addDesc} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform">Add</button>
                    <button onClick={resetDescForm} className="px-5 py-2 rounded-xl glass font-bold">Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {showNewForm !== "descriptive" && (
              <button onClick={() => setShowNewForm("descriptive")} className="w-full glass rounded-xl p-4 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform border-2 border-dashed border-muted-foreground/30">
                <Plus className="w-5 h-5" /> Add Descriptive Question
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionEditor;
