import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Edit, Users, BarChart3, BookOpen, Shield, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sampleChapters, type Chapter, type Level, type MCQQuestion, type DescriptiveQuestion } from "@/data/gameData";
import QuestionEditor from "@/components/QuestionEditor";
import { toast } from "@/hooks/use-toast";

const mockStudents = [
  { name: "Sakura Tanaka", progress: 78, accuracy: 85, streak: 7 },
  { name: "Ryu Nakamura", progress: 65, accuracy: 72, streak: 3 },
  { name: "Hana Yamamoto", progress: 92, accuracy: 94, streak: 12 },
  { name: "Kenji Sato", progress: 45, accuracy: 60, streak: 1 },
];

type Tab = "content" | "analytics" | "security";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("content");
  const [chapters, setChapters] = useState<Chapter[]>([...sampleChapters]);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [editingLevel, setEditingLevel] = useState<{ chapterId: string; level: Level } | null>(null);
  const [securityToggles, setSecurityToggles] = useState<Record<string, boolean>>({
    randomize: true, timeLimits: true, copyPaste: true, tabSwitch: false, aiPlagiarism: false,
  });

  const addChapter = () => {
    const name = prompt("Enter chapter name:");
    if (!name) return;
    const ch: Chapter = {
      id: `ch-${Date.now()}`,
      name,
      description: "New chapter",
      icon: "📖",
      levels: Array.from({ length: 5 }, (_, i) => ({
        id: `ch-${Date.now()}-l${i + 1}`,
        name: `Level ${i + 1}`,
        number: i + 1,
        unlocked: i === 0,
        completed: false,
        stars: 0,
        mcqQuestions: [],
        descriptiveQuestions: [],
      })),
    };
    setChapters((p) => [...p, ch]);
    toast({ title: "Chapter created! 📚" });
  };

  const deleteChapter = (id: string) => {
    setChapters((p) => p.filter((c) => c.id !== id));
    toast({ title: "Chapter deleted" });
  };

  const handleSaveQuestions = (levelId: string, mcq: MCQQuestion[], desc: DescriptiveQuestion[]) => {
    setChapters((prev) =>
      prev.map((ch) => ({
        ...ch,
        levels: ch.levels.map((l) => (l.id === levelId ? { ...l, mcqQuestions: mcq, descriptiveQuestions: desc } : l)),
      }))
    );
    setEditingLevel(null);
  };

  const tabs = [
    { key: "content" as Tab, icon: BookOpen, label: "Content" },
    { key: "analytics" as Tab, icon: BarChart3, label: "Analytics" },
    { key: "security" as Tab, icon: Shield, label: "Anti-Cheat" },
  ];

  const securityItems = [
    { key: "randomize", label: "Randomize MCQ order", desc: "Shuffle questions for each student" },
    { key: "timeLimits", label: "Time limits", desc: "Set per-question time constraints" },
    { key: "copyPaste", label: "Copy-paste disabled", desc: "Prevent text copying in descriptive mode" },
    { key: "tabSwitch", label: "Tab switch detection", desc: "Warn & auto-submit after 3 tab switches" },
    { key: "aiPlagiarism", label: "AI plagiarism check", desc: "Detect AI-generated descriptive answers" },
  ];

  // Question editor overlay
  if (editingLevel) {
    return (
      <QuestionEditor
        levelId={editingLevel.level.id}
        levelName={editingLevel.level.name}
        mcqQuestions={editingLevel.level.mcqQuestions}
        descriptiveQuestions={editingLevel.level.descriptiveQuestions}
        onSave={handleSaveQuestions}
        onClose={() => setEditingLevel(null)}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/")} className="glass px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform">
          <ArrowLeft className="w-4 h-4 inline mr-1" /> Home
        </button>
        <h1 className="text-2xl font-bold text-glow">🏫 Teacher Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${tab === t.key ? "bg-primary text-primary-foreground glow-pink" : "glass hover:scale-105"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {tab === "content" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Chapters & Levels</h2>
            <button onClick={addChapter} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" /> Add Chapter
            </button>
          </div>
          <div className="space-y-3">
            {chapters.map((ch, i) => (
              <motion.div key={ch.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="glass rounded-xl overflow-hidden">
                  {/* Chapter header */}
                  <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpandedChapter(expandedChapter === ch.id ? null : ch.id)}>
                    <div className="flex items-center gap-3">
                      {expandedChapter === ch.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      <div>
                        <h3 className="font-bold text-lg">{ch.icon} {ch.name}</h3>
                        <p className="text-sm text-muted-foreground">{ch.levels.length} levels · {ch.levels.reduce((a, l) => a + l.mcqQuestions.length + l.descriptiveQuestions.length, 0)} questions</p>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteChapter(ch.id); }} className="p-2 rounded-lg hover:bg-destructive/20 transition-colors">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>

                  {/* Levels */}
                  {expandedChapter === ch.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border px-5 pb-4 pt-2 space-y-2">
                      {ch.levels.map((level) => (
                        <div key={level.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <div>
                            <span className="font-bold text-sm">{level.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {level.mcqQuestions.length} MCQ · {level.descriptiveQuestions.length} Descriptive
                            </span>
                          </div>
                          <button
                            onClick={() => setEditingLevel({ chapterId: ch.id, level })}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
                          >
                            <Edit className="w-3 h-3" /> Edit Questions
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {tab === "analytics" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5" /> Student Progress</h2>
          <div className="grid gap-3">
            {mockStudents.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">{s.name}</h3>
                  <span className="text-sm text-destructive font-bold">🔥 {s.streak} days</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="font-bold text-primary">{s.progress}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                    <p className="font-bold text-xp-green">{s.accuracy}%</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${s.progress}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Security Tab */}
      {tab === "security" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">🚫 Anti-Cheating Controls</h2>
          {securityItems.map((item, i) => (
            <motion.div key={item.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => setSecurityToggles((p) => ({ ...p, [item.key]: !p[item.key] }))}
                className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${securityToggles[item.key] ? "bg-xp-green" : "bg-muted"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-foreground transition-transform ${securityToggles[item.key] ? "translate-x-5" : ""}`} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TeacherDashboard;
