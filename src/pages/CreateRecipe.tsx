
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const CreateRecipe = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create a recipe");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const ingredientsText = formData.get("ingredients") as string;
      const instructionsText = formData.get("instructions") as string;

      console.log("Creating recipe with user ID:", user.id);

      // First, ensure the user profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError);
        throw profileError;
      }

      if (!profile) {
        console.log("Creating new profile for user:", user.id);
        // Create profile if it doesn't exist
        const { error: createProfileError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            username: user.user_metadata?.username || `user_${user.id.slice(-8)}`,
            name: user.user_metadata?.full_name || user.user_metadata?.name || "New User",
            avatar_url: user.user_metadata?.avatar_url || `https://www.gravatar.com/avatar/${user.id}?d=mp`
          });

        if (createProfileError) {
          console.error("Create profile error:", createProfileError);
          throw createProfileError;
        }
      }

      console.log("Creating recipe...");
      // Create the recipe
      const { data: recipe, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          name: title,
          description: description,
          author_id: user.id,
        })
        .select()
        .single();

      if (recipeError) {
        console.error("Recipe creation error:", recipeError);
        throw recipeError;
      }

      console.log("Recipe created:", recipe);

      // Parse and insert ingredients
      const ingredients = ingredientsText.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.trim().split(' ');
          const quantity = parts[0];
          const unit = parts[1];
          const name = parts.slice(2).join(' ') || parts.slice(1).join(' ');
          
          return {
            recipe_id: recipe.id,
            name: name || line.trim(),
            quantity: quantity || "1",
            unit: unit && !name ? null : unit
          };
        });

      if (ingredients.length > 0) {
        console.log("Adding ingredients:", ingredients);
        const { error: ingredientsError } = await supabase
          .from("ingredients")
          .insert(ingredients);

        if (ingredientsError) {
          console.error("Ingredients error:", ingredientsError);
          throw ingredientsError;
        }
      }

      // Parse and insert steps
      const steps = instructionsText.split('\n')
        .filter(line => line.trim())
        .map((step, index) => ({
          recipe_id: recipe.id,
          order_num: index + 1,
          description: step.trim()
        }));

      if (steps.length > 0) {
        console.log("Adding steps:", steps);
        const { error: stepsError } = await supabase
          .from("steps")
          .insert(steps);

        if (stepsError) {
          console.error("Steps error:", stepsError);
          throw stepsError;
        }
      }

      toast.success("Recipe created successfully!");
      navigate("/my-recipes");
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error("Failed to create recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to auth page if user is not signed in
  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container max-w-3xl py-8">
        <h1 className="mb-8 text-3xl font-bold">Create New Recipe</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Recipe Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter recipe title"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of your recipe"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="ingredients" className="text-sm font-medium">
              Ingredients
            </label>
            <Textarea
              id="ingredients"
              name="ingredients"
              placeholder="List your ingredients (one per line)&#10;Example:&#10;2 cups flour&#10;1 tsp salt&#10;3 eggs"
              required
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="instructions" className="text-sm font-medium">
              Instructions
            </label>
            <Textarea
              id="instructions"
              name="instructions"
              placeholder="Step by step instructions (one per line)"
              required
              className="min-h-[200px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Recipe"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
