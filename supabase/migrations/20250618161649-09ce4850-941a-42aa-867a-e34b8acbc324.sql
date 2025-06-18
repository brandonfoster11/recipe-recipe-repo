
-- First, let's create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone'
    ) THEN
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Public profiles are viewable by everyone" 
          ON public.profiles 
          FOR SELECT 
          USING (true);

        CREATE POLICY "Users can insert their own profile" 
          ON public.profiles 
          FOR INSERT 
          WITH CHECK (auth.uid()::text = id);

        CREATE POLICY "Users can update their own profile" 
          ON public.profiles 
          FOR UPDATE 
          USING (auth.uid()::text = id);
    END IF;
END
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, name, avatar_url)
  VALUES (
    NEW.id::text,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://www.gravatar.com/avatar/' || encode(digest(NEW.email, 'md5'), 'hex') || '?d=mp')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all recipe-related tables if not already enabled
DO $$
BEGIN
    -- Enable RLS on tables
    ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.recipe_tags ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.stars ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.forks ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.versions ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN
        -- Tables may already have RLS enabled, continue
        NULL;
END
$$;

-- Create policies only if they don't exist
DO $$
BEGIN
    -- Recipes policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Anyone can view recipes') THEN
        CREATE POLICY "Anyone can view recipes" ON public.recipes FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Authenticated users can create recipes') THEN
        CREATE POLICY "Authenticated users can create recipes" ON public.recipes FOR INSERT WITH CHECK (auth.uid()::text = author_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Users can update their own recipes') THEN
        CREATE POLICY "Users can update their own recipes" ON public.recipes FOR UPDATE USING (auth.uid()::text = author_id);
    END IF;

    -- Ingredients policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ingredients' AND policyname = 'Anyone can view ingredients') THEN
        CREATE POLICY "Anyone can view ingredients" ON public.ingredients FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ingredients' AND policyname = 'Recipe authors can manage ingredients') THEN
        CREATE POLICY "Recipe authors can manage ingredients" ON public.ingredients FOR ALL 
        USING (EXISTS (SELECT 1 FROM public.recipes WHERE recipes.id = ingredients.recipe_id AND recipes.author_id = auth.uid()::text));
    END IF;

    -- Steps policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'steps' AND policyname = 'Anyone can view steps') THEN
        CREATE POLICY "Anyone can view steps" ON public.steps FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'steps' AND policyname = 'Recipe authors can manage steps') THEN
        CREATE POLICY "Recipe authors can manage steps" ON public.steps FOR ALL 
        USING (EXISTS (SELECT 1 FROM public.recipes WHERE recipes.id = steps.recipe_id AND recipes.author_id = auth.uid()::text));
    END IF;

    -- Recipe tags policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipe_tags' AND policyname = 'Anyone can view recipe tags') THEN
        CREATE POLICY "Anyone can view recipe tags" ON public.recipe_tags FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipe_tags' AND policyname = 'Recipe authors can manage tags') THEN
        CREATE POLICY "Recipe authors can manage tags" ON public.recipe_tags FOR ALL 
        USING (EXISTS (SELECT 1 FROM public.recipes WHERE recipes.id = recipe_tags.recipe_id AND recipes.author_id = auth.uid()::text));
    END IF;

    -- Stars policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stars' AND policyname = 'Anyone can view stars') THEN
        CREATE POLICY "Anyone can view stars" ON public.stars FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stars' AND policyname = 'Users can star recipes') THEN
        CREATE POLICY "Users can star recipes" ON public.stars FOR INSERT WITH CHECK (auth.uid()::text = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stars' AND policyname = 'Users can remove their own stars') THEN
        CREATE POLICY "Users can remove their own stars" ON public.stars FOR DELETE USING (auth.uid()::text = user_id);
    END IF;

    -- Forks policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'forks' AND policyname = 'Anyone can view forks') THEN
        CREATE POLICY "Anyone can view forks" ON public.forks FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'forks' AND policyname = 'Users can fork recipes') THEN
        CREATE POLICY "Users can fork recipes" ON public.forks FOR INSERT WITH CHECK (auth.uid()::text = user_id);
    END IF;

    -- Versions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'versions' AND policyname = 'Anyone can view versions') THEN
        CREATE POLICY "Anyone can view versions" ON public.versions FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'versions' AND policyname = 'Users can create versions') THEN
        CREATE POLICY "Users can create versions" ON public.versions FOR INSERT WITH CHECK (auth.uid()::text = author_id);
    END IF;
END
$$;
