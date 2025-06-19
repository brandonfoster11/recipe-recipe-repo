-- Ensure additional functions use a stable search_path

-- Add search_path on decrement_recipe_stars
CREATE OR REPLACE FUNCTION public.decrement_recipe_stars(p_recipe_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.recipes
  SET stars = GREATEST(stars - 1, 0)
  WHERE id = p_recipe_id;
END;
$$;

-- Add search_path on increment_recipe_stars
CREATE OR REPLACE FUNCTION public.increment_recipe_stars(p_recipe_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.recipes
  SET stars = stars + 1
  WHERE id = p_recipe_id;
END;
$$;

-- Add search_path on increment_recipe_forks
CREATE OR REPLACE FUNCTION public.increment_recipe_forks(p_recipe_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.recipes
  SET forks = forks + 1
  WHERE id = p_recipe_id;
END;
$$;

-- Add search_path on update_recipe_updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_recipe_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;
