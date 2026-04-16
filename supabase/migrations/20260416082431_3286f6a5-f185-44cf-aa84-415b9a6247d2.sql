-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📖',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create question type enum
CREATE TYPE public.question_type AS ENUM ('mcq', 'descriptive');

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  type public.question_type NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  correct_index INTEGER DEFAULT 0,
  xp_reward INTEGER NOT NULL DEFAULT 25,
  coin_reward INTEGER NOT NULL DEFAULT 8,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student answers table
CREATE TABLE public.student_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  image_url TEXT,
  selected_option INTEGER,
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth yet)
CREATE POLICY "Anyone can read chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Anyone can manage chapters" ON public.chapters FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Anyone can manage questions" ON public.questions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can read answers" ON public.student_answers FOR SELECT USING (true);
CREATE POLICY "Anyone can manage answers" ON public.student_answers FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_questions_chapter ON public.questions(chapter_id);
CREATE INDEX idx_questions_type ON public.questions(type);
CREATE INDEX idx_answers_question ON public.student_answers(question_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for student uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('student-uploads', 'student-uploads', true);

CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'student-uploads');
CREATE POLICY "Anyone can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'student-uploads');
CREATE POLICY "Anyone can delete uploads" ON storage.objects FOR DELETE USING (bucket_id = 'student-uploads');