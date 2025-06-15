
-- Drop ALL existing policies on all tables
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop all policies on profiles table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
    
    -- Drop all policies on recipes table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'recipes' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.recipes';
    END LOOP;
    
    -- Drop all policies on ingredients table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'ingredients' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.ingredients';
    END LOOP;
    
    -- Drop all policies on steps table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'steps' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.steps';
    END LOOP;
    
    -- Drop all policies on recipe_tags table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'recipe_tags' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.recipe_tags';
    END LOOP;
    
    -- Drop all policies on stars table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'stars' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.stars';
    END LOOP;
    
    -- Drop all policies on forks table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'forks' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.forks';
    END LOOP;
    
    -- Drop all policies on versions table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'versions' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.versions';
    END LOOP;
END $$;

-- Drop all foreign key constraints
ALTER TABLE public.recipes DROP CONSTRAINT IF EXISTS recipes_author_id_fkey;
ALTER TABLE public.versions DROP CONSTRAINT IF EXISTS versions_author_id_fkey;
ALTER TABLE public.stars DROP CONSTRAINT IF EXISTS stars_user_id_fkey;
ALTER TABLE public.forks DROP CONSTRAINT IF EXISTS forks_user_id_fkey;
ALTER TABLE public.ingredients DROP CONSTRAINT IF EXISTS ingredients_recipe_id_fkey;
ALTER TABLE public.steps DROP CONSTRAINT IF EXISTS steps_recipe_id_fkey;
ALTER TABLE public.recipe_tags DROP CONSTRAINT IF EXISTS recipe_tags_recipe_id_fkey;
ALTER TABLE public.stars DROP CONSTRAINT IF EXISTS stars_recipe_id_fkey;
ALTER TABLE public.forks DROP CONSTRAINT IF EXISTS forks_original_recipe_id_fkey;
ALTER TABLE public.forks DROP CONSTRAINT IF EXISTS forks_forked_recipe_id_fkey;
ALTER TABLE public.versions DROP CONSTRAINT IF EXISTS versions_recipe_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Update column types
ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.recipes ALTER COLUMN author_id TYPE TEXT;
ALTER TABLE public.recipes ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.versions ALTER COLUMN author_id TYPE TEXT;
ALTER TABLE public.versions ALTER COLUMN recipe_id TYPE TEXT;
ALTER TABLE public.stars ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.stars ALTER COLUMN recipe_id TYPE TEXT;
ALTER TABLE public.forks ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.forks ALTER COLUMN original_recipe_id TYPE TEXT;
ALTER TABLE public.forks ALTER COLUMN forked_recipe_id TYPE TEXT;
ALTER TABLE public.ingredients ALTER COLUMN recipe_id TYPE TEXT;
ALTER TABLE public.steps ALTER COLUMN recipe_id TYPE TEXT;
ALTER TABLE public.recipe_tags ALTER COLUMN recipe_id TYPE TEXT;

-- Recreate foreign key constraints
ALTER TABLE public.recipes ADD CONSTRAINT recipes_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.versions ADD CONSTRAINT versions_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.versions ADD CONSTRAINT versions_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;
ALTER TABLE public.stars ADD CONSTRAINT stars_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.stars ADD CONSTRAINT stars_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;
ALTER TABLE public.forks ADD CONSTRAINT forks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.forks ADD CONSTRAINT forks_original_recipe_id_fkey FOREIGN KEY (original_recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;
ALTER TABLE public.forks ADD CONSTRAINT forks_forked_recipe_id_fkey FOREIGN KEY (forked_recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;
ALTER TABLE public.ingredients ADD CONSTRAINT ingredients_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;
ALTER TABLE public.steps ADD CONSTRAINT steps_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;
ALTER TABLE public.recipe_tags ADD CONSTRAINT recipe_tags_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;

-- Recreate simplified RLS policies for Clerk authentication
CREATE POLICY "Allow all profile operations" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all recipe operations" ON public.recipes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all ingredient operations" ON public.ingredients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all step operations" ON public.steps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all recipe tag operations" ON public.recipe_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all star operations" ON public.stars FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all fork operations" ON public.forks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all version operations" ON public.versions FOR ALL USING (true) WITH CHECK (true);
