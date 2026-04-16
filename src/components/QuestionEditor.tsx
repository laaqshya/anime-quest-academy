import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, GripVertical, Check, X, Save } from "lucide-react";
import { useQuestions, type DbQuestion } from "@/hooks/useChapters";
import { toast } from "@/hooks/use-toast";

interface Props {
  chapterId: string;
  chapterName: string;
  initialType: "mcq" | "descriptive";
  onClose: () => void;
}

type QType = "mcq" | "descriptive";

const QuestionEditor = ({ chapterId, chapterName, initialType, onClose }: Props) => {
  const { mcqQuestions, descQuestions, loading, addQuestion, updateQuestion, deleteQuestion } = useQuestions(chapterId);
  const [activeTab, setActiveTab] = useState<QType>(initialType);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<DbQuestion>>({});
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

  const resetMcqForm = () => { setNewMcqText(""); setNewMcqOptions(["", "", "", ""]); setNewMcqCorrect(0); setNewMcqXp(25); setNewMcqCoins(8); setShowNewForm(null); };
  const resetDescForm = () => { setNewDescText(""); setNewDescXp(30); setNewDescCoins(10); setShowNewForm(null); };

  const handleAddMcq = async () => {
    if (!newMcqText.trim() || newMcqOptions.some((o) => !o.trim())) {
      toast({ title: "Fill all fields", variant: "destructive" }); return;
    }
    await addQuestion({
      chapter_id: chapterId, type: "mcq", question_text: newMcqText,
      options: newMcqOptions, correct_index: newMcqCorrect,
      xp_reward: newMcqXp, coin_reward: newMcqCoins, sort_order: mcqQuestions.length,
    });
    resetMcqForm();
    toast({ title: "MCQ added ✨" });
  };

  const handleAddDesc = async () => {
    if (!newDescText.trim()) { toast({ title: "Enter question text", variant: "destructive" }); return; }
    await addQuestion({
      chapter_id: chapterId, type: "descriptive", question_text: newDescText,
      options: [], correct_index: 0,
      xp_reward: newDescXp, coin_reward: newDescCoins, sort_order: descQuestions.length,
    });
    resetDescForm();
    toast({ title: "Descriptive question added ✨" });
  };

  const startEdit = (q: DbQuestion) => { setEditingId(q.id); setEditData({ ...q }); };

  const saveEdit = async () => {
    if (!editingId || !editData) return;
    await updateQuestion(editingId, editData);
    setEditingId(null); setEditData({});
    toast({ title: "Question updated ✨" });
  };

  const handleDelete = async (id: string) => {
    await deleteQuestion(id);
    toast({ title: "Question deleted" });
  };

  const questions = activeTab === "mcq" ? mcqQuestions : descQuestions;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="glass px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform">
            <X className="w-4 h-4 inline mr-1" /> Close
          </button>
          <h2 className="text-xl font-bold">📝 {chapterName}</h2>
        </div>
      </div>

      <div className="flex gap-2 p-4">
        {(["mcq", "descriptive"] as QType[]).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-xl font-bold transition-all ${activeTab === t ? "bg-primary text-primary-foreground glow-pink" : "glass hover:scale-105"}`}>
            {t === "mcq" ? `🎯 MCQ (${mcqQuestions.length})` : `✍️ Descriptive (${descQuestions.length})`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4 max-w-4xl mx-auto w-full">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading questions...</div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <motion.div key={q.id} layout className="glass rounded-xl p-4 flex items-start gap-3">
                <GripVertical className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-muted-foreground">Q{i + 1}</span>
                    <span className="text-xs text-xp-green">+{q.xp_reward} XP</span>
                    <span className="text-xs text-gold">+{q.coin_reward} 💰</span>
                  </div>
                  {editingId === q.id ? (
                    <div className="space-y-2">
                      {activeTab === "mcq" ? (
                        <>
                          <input value={editData.question_text || ""} onChange={(e) => setEditData((p) => ({ ...p, question_text: e.target.value }))}
                            className="w-full glass rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                          {(editData.options || []).map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input type="radio" checked={(editData.correct_index ?? 0) === oi}
                                onChange={() => setEditData((p) => ({ ...p, correct_index: oi }))} className="accent-xp-green" />
                              <input value={opt} onChange={(e) => {
                                const opts = [...(editData.options || [])]; opts[oi] = e.target.value;
                                setEditData((p) => ({ ...p, options: opts }));
                              }} className="flex-1 glass rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                          ))}
                        </>
                      ) : (
                        <textarea value={editData.question_text || ""} onChange={(e) => setEditData((p) => ({ ...p, question_text: e.target.value }))}
                          className="w-full glass rounded-lg p-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                      )}
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="px-3 py-1 rounded-lg bg-xp-green text-foreground text-sm font-bold"><Check className="w-3 h-3 inline" /> Save</button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded-lg glass text-sm font-bold">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-sm">{q.question_text}</p>
                      {activeTab === "mcq" && q.options.length > 0 && (
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          {q.options.map((opt, oi) => (
                            <span key={oi} className={`text-xs px-2 py-1 rounded ${oi === q.correct_index ? "bg-xp-green/20 text-xp-green font-bold" : "text-muted-foreground"}`}>
                              {String.fromCharCode(65 + oi)}. {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => startEdit(q)} className="p-1.5 rounded-lg hover:bg-muted"><Edit className="w-4 h-4 text-gem" /></button>
                  <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded-lg hover:bg-destructive/20"><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {showNewForm === activeTab && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass rounded-xl p-5 space-y-3 overflow-hidden">
                  <h4 className="font-bold text-sm">New {activeTab === "mcq" ? "MCQ" : "Descriptive"} Question</h4>
                  {activeTab === "mcq" ? (
                    <>
                      <input value={newMcqText} onChange={(e) => setNewMcqText(e.target.value)} placeholder="Question text..."
                        className="w-full glass rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary" />
                      {newMcqOptions.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="radio" checked={newMcqCorrect === i} onChange={() => setNewMcqCorrect(i)} className="accent-xp-green" />
                          <input value={opt} onChange={(e) => { const opts = [...newMcqOptions]; opts[i] = e.target.value; setNewMcqOptions(opts); }}
                            placeholder={`Option ${String.fromCharCode(65 + i)}`} className="flex-1 glass rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                      ))}
                      <div className="flex gap-3">
                        <div><label className="text-xs text-muted-foreground">XP</label>
                          <input type="number" value={newMcqXp} onChange={(e) => setNewMcqXp(+e.target.value)} className="w-20 glass rounded-lg p-2 text-sm" /></div>
                        <div><label className="text-xs text-muted-foreground">Coins</label>
                          <input type="number" value={newMcqCoins} onChange={(e) => setNewMcqCoins(+e.target.value)} className="w-20 glass rounded-lg p-2 text-sm" /></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleAddMcq} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform">Add</button>
                        <button onClick={resetMcqForm} className="px-5 py-2 rounded-xl glass font-bold">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <textarea value={newDescText} onChange={(e) => setNewDescText(e.target.value)} placeholder="Question text..."
                        className="w-full glass rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                      <div className="flex gap-3">
                        <div><label className="text-xs text-muted-foreground">XP</label>
                          <input type="number" value={newDescXp} onChange={(e) => setNewDescXp(+e.target.value)} className="w-20 glass rounded-lg p-2 text-sm" /></div>
                        <div><label className="text-xs text-muted-foreground">Coins</label>
                          <input type="number" value={newDescCoins} onChange={(e) => setNewDescCoins(+e.target.value)} className="w-20 glass rounded-lg p-2 text-sm" /></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleAddDesc} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform">Add</button>
                        <button onClick={resetDescForm} className="px-5 py-2 rounded-xl glass font-bold">Cancel</button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {showNewForm !== activeTab && (
              <button onClick={() => setShowNewForm(activeTab)} className="w-full glass rounded-xl p-4 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform border-2 border-dashed border-muted-foreground/30">
                <Plus className="w-5 h-5" /> Add {activeTab === "mcq" ? "MCQ" : "Descriptive"} Question
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionEditor;
