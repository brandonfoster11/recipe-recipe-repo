-- Fix search_path security warnings for trigger functions
-- These functions were missing proper search_path configuration

-- Fix decrement_recipe_stars trigger function
CREATE OR REPLACE FUNCTION public.decrement_recipe_stars()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    UPDATE public.recipes 
    SET stars = GREATEST(stars - 1, 0)
    WHERE id = OLD.recipe_id;
    RETURN OLD;
END;
$$;

-- Fix increment_recipe_stars trigger function  
CREATE OR REPLACE FUNCTION public.increment_recipe_stars()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.recipes 
  SET stars = stars + 1 
  WHERE id = NEW.recipe_id;
  RETURN NEW;
END;
$$;