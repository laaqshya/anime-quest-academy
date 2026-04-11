import { useEffect, useCallback } from "react";

const STORAGE_KEY = "questlearn_answers";

interface SavedProgress {
  levelId: string;
  mode: "mcq" | "descriptive";
  answers: Record<string, string>;
  currentIdx: number;
  timestamp: number;
}

export const useAutoSave = (levelId: string, mode: "mcq" | "descriptive") => {
  const key = `${STORAGE_KEY}_${levelId}_${mode}`;

  const save = useCallback(
    (answers: Record<string, string>, currentIdx: number) => {
      const data: SavedProgress = { levelId, mode, answers, currentIdx, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(data));
    },
    [key, levelId, mode]
  );

  const load = useCallback((): SavedProgress | null => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      const data: SavedProgress = JSON.parse(raw);
      // Expire after 24h
      if (Date.now() - data.timestamp > 86400000) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }, [key]);

  const clear = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return { save, load, clear };
};
