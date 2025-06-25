
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Recipe } from "@/types";
import { GitFork, Star, Clock, FileCode } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

interface RecipeDetailProps {
  recipe: Recipe;
  onRecipeUpdate?: (updatedRecipe: Recipe) => void;
}

const RecipeDetail = ({ recipe, onRecipeUpdate }: RecipeDetailProps) => {
  const { user } = useAuth();
  const [isStarred, setIsStarred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has already starred this recipe
  useEffect(() => {
    const checkIfStarred = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("stars")
          .select("id")
          .eq("recipe_id", recipe.id)
          .eq("user_id", user.id)
          .single();

        setIsStarred(!!data);
      } catch (error) {
        // User hasn't starred this recipe
        setIsStarred(false);
      }
    };

    checkIfStarred();
  }, [recipe.id, user]);

  const handleStar = async () => {
    if (!user) {
      toast.error("Please sign in to star recipes");
      return;
    }

    setIsLoading(true);

    try {
      if (isStarred) {
        // Remove star
        const { error } = await supabase
          .from("stars")
          .delete()
          .eq("recipe_id", recipe.id)
          .eq("user_id", user.id);

        if (error) throw error;

        setIsStarred(false);
        const updatedRecipe = { ...recipe, stars: recipe.stars - 1 };
        onRecipeUpdate?.(updatedRecipe);
        
        toast.success(`You removed "${recipe.name}" from your starred recipes`);
      } else {
        // Add star
        const { error } = await supabase
          .from("stars")
          .insert({
            recipe_id: recipe.id,
            user_id: user.id,
          });

        if (error) throw error;

        setIsStarred(true);
        const updatedRecipe = { ...recipe, stars: recipe.stars + 1 };
        onRecipeUpdate?.(updatedRecipe);
        
        toast.success(`You starred "${recipe.name}"`);
      }
    } catch (error) {
      console.error("Error starring recipe:", error);
      toast.error("Failed to star recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFork = async () => {
    if (!user) {
      toast.error("Please sign in to fork recipes");
      return;
    }

    setIsLoading(true);

    try {
      // Check if user has already forked this recipe
      const { data: existingFork } = await supabase
        .from("forks")
        .select("id")
        .eq("original_recipe_id", recipe.id)
        .eq("user_id", user.id)
        .single();

      if (existingFork) {
        toast.error("You have already forked this recipe");
        setIsLoading(false);
        return;
      }

      // Create a fork entry
      const { error } = await supabase
        .from("forks")
        .insert({
          original_recipe_id: recipe.id,
          forked_recipe_id: recipe.id, // For now, just reference the same recipe
          user_id: user.id,
        });

      if (error) throw error;

      const updatedRecipe = { ...recipe, forks: recipe.forks + 1 };
      onRecipeUpdate?.(updatedRecipe);

      toast.success(`You forked "${recipe.name}" to your recipes`);
    } catch (error) {
      console.error("Error forking recipe:", error);
      toast.error("Failed to fork recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClone = () => {
    const recipeText = `Recipe: ${recipe.name}\n\nIngredients:\n${recipe.ingredients
      .map((ing) => `- ${ing.quantity}${ing.unit ? ' ' + ing.unit : ''} ${ing.name}`)
      .join('\n')}\n\nInstructions:\n${recipe.steps
      .map((step) => `${step.order}. ${step.description}`)
      .join('\n')}`;

    navigator.clipboard.writeText(recipeText).then(() => {
      toast.success("Recipe copied to your clipboard");
    }).catch(() => {
      toast.error("Failed to copy recipe to clipboard");
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{recipe.name}</h1>
          <div className="mt-2 flex items-center space-x-2">
            <img
              src={recipe.author.avatarUrl}
              alt={recipe.author.username}
              className="h-6 w-6 rounded-full"
            />
            <span className="text-gray-700">{recipe.author.username}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">
              Updated {new Date(recipe.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleStar}
            disabled={isLoading}
          >
            <Star className={`mr-2 h-4 w-4 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            {isStarred ? 'Starred' : 'Star'} {recipe.stars}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleFork}
            disabled={isLoading}
          >
            <GitFork className="mr-2 h-4 w-4" />
            Fork {recipe.forks}
          </Button>
          <Button variant="default" size="sm" onClick={handleClone}>
            <FileCode className="mr-2 h-4 w-4" />
            Clone
          </Button>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-xl">
        {recipe.coverImage && (
          <img
            src={recipe.coverImage}
            alt={recipe.name}
            className="h-[300px] w-full object-cover"
          />
        )}
      </div>

      <div className="mb-6">
        <p className="text-lg text-gray-700">{recipe.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="tag">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="recipe" className="w-full">
        <TabsList>
          <TabsTrigger value="recipe">Recipe</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
        </TabsList>
        <TabsContent value="recipe" className="pt-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <h3 className="mb-4 text-xl font-semibold">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex items-start">
                    <Badge variant="ingredient" className="mr-2 mt-0.5">
                      {ingredient.quantity} {ingredient.unit}
                    </Badge>
                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="mb-4 text-xl font-semibold">Instructions</h3>
              <ol className="space-y-6">
                {recipe.steps.map((step) => (
                  <li key={step.id} className="flex">
                    <span className="mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium">
                      {step.order}
                    </span>
                    <div>
                      <p className="text-gray-700">{step.description}</p>
                      {step.image && (
                        <img
                          src={step.image}
                          alt={`Step ${step.order}`}
                          className="mt-2 h-auto max-w-md rounded-md"
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history" className="pt-4">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Version History</h3>
            <ul className="space-y-3">
              {recipe.versions.map((version) => (
                <li
                  key={version.id}
                  className="flex items-start rounded-lg border p-4"
                >
                  <div className="mr-4">
                    <img
                      src={version.author.avatarUrl}
                      alt={version.author.username}
                      className="h-8 w-8 rounded-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">
                        {version.author.username}
                      </span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(version.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700">{version.commitMessage}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipeDetail;
