import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface DbChapter {
  id: string;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface DbQuestion {
  id: string;
  chapter_id: string;
  type: "mcq" | "descriptive";
  question_text: string;
  options: string[];
  correct_index: number;
  xp_reward: number;
  coin_reward: number;
  sort_order: number;
}

export function useChapters() {
  const [chapters, setChapters] = useState<DbChapter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChapters = useCallback(async () => {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .order("sort_order");
    if (error) {
      toast({ title: "Failed to load chapters", variant: "destructive" });
      return;
    }
    setChapters(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchChapters(); }, [fetchChapters]);

  const addChapter = async (name: string, description = "", icon = "📖") => {
    const { data, error } = await supabase
      .from("chapters")
      .insert({ name, description, icon, sort_order: chapters.length })
      .select()
      .single();
    if (error) { toast({ title: "Failed to create chapter", variant: "destructive" }); return null; }
    setChapters((p) => [...p, data]);
    toast({ title: "Chapter created! 📚" });
    return data;
  };

  const deleteChapter = async (id: string) => {
    const { error } = await supabase.from("chapters").delete().eq("id", id);
    if (error) { toast({ title: "Failed to delete", variant: "destructive" }); return; }
    setChapters((p) => p.filter((c) => c.id !== id));
    toast({ title: "Chapter deleted" });
  };

  const updateChapter = async (id: string, updates: Partial<Pick<DbChapter, "name" | "description" | "icon">>) => {
    const { error } = await supabase.from("chapters").update(updates).eq("id", id);
    if (error) { toast({ title: "Failed to update", variant: "destructive" }); return; }
    setChapters((p) => p.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  return { chapters, loading, fetchChapters, addChapter, deleteChapter, updateChapter };
}

export function useQuestions(chapterId: string | null) {
  const [mcqQuestions, setMcqQuestions] = useState<DbQuestion[]>([]);
  const [descQuestions, setDescQuestions] = useState<DbQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = useCallback(async () => {
    if (!chapterId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("chapter_id", chapterId)
      .order("sort_order");
    if (error) {
      toast({ title: "Failed to load questions", variant: "destructive" });
      setLoading(false);
      return;
    }
    const questions = (data || []).map((q) => ({
      ...q,
      type: q.type as "mcq" | "descriptive",
      options: (q.options as string[]) || [],
      correct_index: q.correct_index ?? 0,
    }));
    setMcqQuestions(questions.filter((q) => q.type === "mcq"));
    setDescQuestions(questions.filter((q) => q.type === "descriptive"));
    setLoading(false);
  }, [chapterId]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const addQuestion = async (q: Omit<DbQuestion, "id">) => {
    const { data, error } = await supabase
      .from("questions")
      .insert({
        chapter_id: q.chapter_id,
        type: q.type,
        question_text: q.question_text,
        options: q.options as unknown as any,
        correct_index: q.correct_index,
        xp_reward: q.xp_reward,
        coin_reward: q.coin_reward,
        sort_order: q.sort_order,
      })
      .select()
      .single();
    if (error) { toast({ title: "Failed to add question", variant: "destructive" }); return null; }
    const mapped = { ...data, type: data.type as "mcq" | "descriptive", options: (data.options as string[]) || [], correct_index: data.correct_index ?? 0 };
    if (mapped.type === "mcq") setMcqQuestions((p) => [...p, mapped]);
    else setDescQuestions((p) => [...p, mapped]);
    return mapped;
  };

  const updateQuestion = async (id: string, updates: Partial<Omit<DbQuestion, "id">>) => {
    const { error } = await supabase.from("questions").update({
      question_text: updates.question_text,
      options: updates.options as unknown as any,
      correct_index: updates.correct_index,
      xp_reward: updates.xp_reward,
      coin_reward: updates.coin_reward,
      sort_order: updates.sort_order,
    }).eq("id", id);
    if (error) { toast({ title: "Failed to update question", variant: "destructive" }); return; }
    const updater = (p: DbQuestion[]) => p.map((q) => (q.id === id ? { ...q, ...updates } : q));
    setMcqQuestions(updater);
    setDescQuestions(updater);
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) { toast({ title: "Failed to delete question", variant: "destructive" }); return; }
    setMcqQuestions((p) => p.filter((q) => q.id !== id));
    setDescQuestions((p) => p.filter((q) => q.id !== id));
  };

  return { mcqQuestions, descQuestions, loading, fetchQuestions, addQuestion, updateQuestion, deleteQuestion };
}
