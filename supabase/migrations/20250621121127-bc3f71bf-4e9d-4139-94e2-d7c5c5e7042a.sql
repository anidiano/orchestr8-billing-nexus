
-- Add timezone and language columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN timezone TEXT DEFAULT 'UTC',
ADD COLUMN language TEXT DEFAULT 'en';
