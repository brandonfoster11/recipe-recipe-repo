
-- Enable RLS on existing tables that don't have it enabled
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for recipes table
CREATE POLICY "Anyone can view recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create recipes" ON public.recipes FOR INSERT 
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update their recipes" ON public.recipes FOR UPDATE 
  USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete their recipes" ON public.recipes FOR DELETE 
  USING (auth.uid() = author_id);

-- Create RLS policies for ingredients table
CREATE POLICY "Anyone can view ingredients" ON public.ingredients FOR SELECT USING (true);
CREATE POLICY "Recipe authors can manage ingredients" ON public.ingredients FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND recipes.author_id = auth.uid()
    )
  );

-- Create RLS policies for steps table
CREATE POLICY "Anyone can view steps" ON public.steps FOR SELECT USING (true);
CREATE POLICY "Recipe authors can manage steps" ON public.steps FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = steps.recipe_id 
      AND recipes.author_id = auth.uid()
    )
  );

-- Create RLS policies for recipe_tags table
CREATE POLICY "Anyone can view recipe tags" ON public.recipe_tags FOR SELECT USING (true);
CREATE POLICY "Recipe authors can manage tags" ON public.recipe_tags FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.recipes 
      WHERE recipes.id = recipe_tags.recipe_id 
      AND recipes.author_id = auth.uid()
    )
  );
