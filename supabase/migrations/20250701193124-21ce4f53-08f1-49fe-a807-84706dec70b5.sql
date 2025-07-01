-- Add updated_at column to ingredients table
ALTER TABLE ingredients ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Add updated_at column to steps table (likely same issue)
ALTER TABLE steps ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Create trigger for ingredients updated_at
CREATE TRIGGER update_ingredients_updated_at
    BEFORE UPDATE ON ingredients
    FOR EACH ROW
    EXECUTE FUNCTION update_recipe_updated_at();

-- Create trigger for steps updated_at  
CREATE TRIGGER update_steps_updated_at
    BEFORE UPDATE ON steps
    FOR EACH ROW
    EXECUTE FUNCTION update_recipe_updated_at();