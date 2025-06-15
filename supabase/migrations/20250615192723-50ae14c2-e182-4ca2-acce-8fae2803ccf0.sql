
-- Create RLS policies for the stars table to allow users to star/unstar recipes
ALTER TABLE public.stars ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view all stars (needed for counting)
CREATE POLICY "Anyone can view stars" 
  ON public.stars 
  FOR SELECT 
  USING (true);

-- Policy to allow authenticated users to star recipes
CREATE POLICY "Users can star recipes" 
  ON public.stars 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

-- Policy to allow users to remove their own stars
CREATE POLICY "Users can remove their own stars" 
  ON public.stars 
  FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Create RLS policies for the forks table
ALTER TABLE public.forks ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view all forks (needed for counting)
CREATE POLICY "Anyone can view forks" 
  ON public.forks 
  FOR SELECT 
  USING (true);

-- Policy to allow authenticated users to fork recipes
CREATE POLICY "Users can fork recipes" 
  ON public.forks 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

-- Create triggers to automatically update star and fork counts
CREATE OR REPLACE FUNCTION update_recipe_stars()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.recipes 
    SET stars = stars + 1 
    WHERE id = NEW.recipe_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.recipes 
    SET stars = stars - 1 
    WHERE id = OLD.recipe_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_recipe_forks()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.recipes 
  SET forks = forks + 1 
  WHERE id = NEW.original_recipe_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER stars_update_count
  AFTER INSERT OR DELETE ON public.stars
  FOR EACH ROW
  EXECUTE FUNCTION update_recipe_stars();

CREATE TRIGGER forks_update_count
  AFTER INSERT ON public.forks
  FOR EACH ROW
  EXECUTE FUNCTION update_recipe_forks();
