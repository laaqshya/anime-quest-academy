import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Edit, Users, BarChart3, BookOpen, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SimpleChapter {
  id: string;
  name: string;
  levels: number;
  totalQuestions: number;
}

const mockChapters: SimpleChapter[] = [
  { id: "1", name: "The Awakening", levels: 5, totalQuestions: 15 },
  { id: "2", name: "The Dark Forest", levels: 5, totalQuestions: 10 },
];

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
  const [chapters, setChapters] = useState(mockChapters);

  const addChapter = () => {
    const name = prompt("Enter chapter name:");
    if (name) {
      setChapters((p) => [...p, { id: String(Date.now()), name, levels: 0, totalQuestions: 0 }]);
    }
  };

  const deleteChapter = (id: string) => {
    setChapters((p) => p.filter((c) => c.id !== id));
  };

  const tabs = [
    { key: "content" as Tab, icon: BookOpen, label: "Content" },
    { key: "analytics" as Tab, icon: BarChart3, label: "Analytics" },
    { key: "security" as Tab, icon: Shield, label: "Anti-Cheat" },
  ];

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
            <h2 className="text-xl font-bold">Chapters</h2>
            <button onClick={addChapter} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" /> Add Chapter
            </button>
          </div>
          <div className="grid gap-3">
            {chapters.map((ch, i) => (
              <motion.div key={ch.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{ch.name}</h3>
                  <p className="text-sm text-muted-foreground">{ch.levels} levels · {ch.totalQuestions} questions</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors"><Edit className="w-4 h-4 text-gem" /></button>
                  <button onClick={() => deleteChapter(ch.id)} className="p-2 rounded-lg hover:bg-destructive/20 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
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
          {[
            { label: "Randomize MCQ order", desc: "Shuffle questions for each student", enabled: true },
            { label: "Time limits", desc: "Set per-question time constraints", enabled: true },
            { label: "Copy-paste disabled", desc: "Prevent text copying in descriptive mode", enabled: true },
            { label: "Tab switch detection", desc: "Warn & auto-submit after 3 tab switches", enabled: false },
            { label: "AI plagiarism check", desc: "Detect AI-generated descriptive answers", enabled: false },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <div className={`w-12 h-7 rounded-full flex items-center px-1 cursor-pointer transition-colors ${item.enabled ? "bg-xp-green" : "bg-muted"}`}>
                <div className={`w-5 h-5 rounded-full bg-foreground transition-transform ${item.enabled ? "translate-x-5" : ""}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TeacherDashboard;
