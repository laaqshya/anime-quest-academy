import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useStudentAnswers() {
  const submitMcqAnswer = useCallback(async (questionId: string, selectedOption: number, isCorrect: boolean) => {
    const { error } = await supabase.from("student_answers").insert({
      question_id: questionId,
      selected_option: selectedOption,
      is_correct: isCorrect,
    });
    if (error) console.error("Failed to save MCQ answer:", error);
  }, []);

  const submitDescriptiveAnswer = useCallback(async (questionId: string, answerText?: string, imageFile?: File) => {
    let imageUrl: string | null = null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `answers/${questionId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("student-uploads")
        .upload(path, imageFile);
      if (uploadError) {
        toast({ title: "Image upload failed", variant: "destructive" });
        return false;
      }
      const { data: urlData } = supabase.storage.from("student-uploads").getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("student_answers").insert({
      question_id: questionId,
      answer_text: answerText || null,
      image_url: imageUrl,
    });
    if (error) {
      console.error("Failed to save descriptive answer:", error);
      return false;
    }
    return true;
  }, []);

  return { submitMcqAnswer, submitDescriptiveAnswer };
}
