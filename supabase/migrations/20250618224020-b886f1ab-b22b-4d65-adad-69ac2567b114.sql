-- Ensure functions use a stable search_path for security

-- Set search_path on update_recipe_stars
CREATE OR REPLACE FUNCTION update_recipe_stars()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
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
$$;

-- Set search_path on update_recipe_forks
CREATE OR REPLACE FUNCTION update_recipe_forks()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.recipes
  SET forks = forks + 1
  WHERE id = NEW.original_recipe_id;
  RETURN NEW;
END;
$$;

-- Set search_path on handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 1;
BEGIN
  -- Generate base username
  base_username := COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8));
  final_username := base_username;

  -- Check if username exists and append counter if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    final_username := base_username || '_' || counter;
    counter := counter + 1;
  END LOOP;

  INSERT INTO public.profiles (id, username, name, avatar_url)
  VALUES (
    NEW.id::text,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'New User'),
    'https://www.gravatar.com/avatar/default?d=mp'
  );
  RETURN NEW;
END;
$$ SECURITY DEFINER;
