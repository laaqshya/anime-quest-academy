import { useEffect, useRef, useCallback, useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useAntiCheat = (enabled = true) => {
  const tabSwitchCount = useRef(0);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  const handleVisibilityChange = useCallback(() => {
    if (!enabled) return;
    if (document.hidden) {
      tabSwitchCount.current += 1;
      if (tabSwitchCount.current >= 3) {
        setShouldAutoSubmit(true);
        toast({
          title: "⚠️ Auto-Submitting",
          description: "You switched tabs 3 times. Your answers are being submitted.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `⚠️ Tab Switch Detected (${tabSwitchCount.current}/3)`,
          description: "Switching tabs again may auto-submit your answers!",
          variant: "destructive",
        });
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enabled, handleVisibilityChange]);

  const preventCopyPaste = {
    onPaste: (e: React.ClipboardEvent) => e.preventDefault(),
    onCopy: (e: React.ClipboardEvent) => e.preventDefault(),
    onCut: (e: React.ClipboardEvent) => e.preventDefault(),
  };

  return { shouldAutoSubmit, tabSwitchCount: tabSwitchCount.current, preventCopyPaste };
};
