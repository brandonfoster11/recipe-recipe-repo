
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import RecipeDetail from "@/components/RecipeDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types";

const RecipeView = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching recipe with ID:", id);
        
        const { data: recipeData, error: recipeError } = await supabase
          .from("recipes")
          .select(`
            *,
            profiles:author_id (
              id,
              username,
              name,
              avatar_url
            ),
            ingredients (*),
            steps (*),
            recipe_tags (tag)
          `)
          .eq('id', id)
          .single();

        if (recipeError) {
          console.error("Error fetching recipe:", recipeError);
          setError(true);
          setLoading(false);
          return;
        }

        if (!recipeData) {
          setError(true);
          setLoading(false);
          return;
        }

        console.log("Raw recipe data:", recipeData);

        // Transform the data to match our Recipe type
        const transformedRecipe: Recipe = {
          id: recipeData.id,
          name: recipeData.name,
          description: recipeData.description,
          coverImage: recipeData.cover_image || undefined,
          author: {
            id: recipeData.profiles?.id || '',
            username: recipeData.profiles?.username || 'Unknown',
            name: recipeData.profiles?.name || 'Unknown User',
            avatarUrl: recipeData.profiles?.avatar_url || `https://www.gravatar.com/avatar/${recipeData.author_id}?d=mp`
          },
          stars: recipeData.stars,
          forks: recipeData.forks,
          createdAt: recipeData.created_at,
          updatedAt: recipeData.updated_at,
          tags: recipeData.recipe_tags?.map((tag: any) => tag.tag) || [],
          ingredients: recipeData.ingredients?.map((ing: any) => ({
            id: ing.id,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit
          })) || [],
          steps: recipeData.steps?.map((step: any) => ({
            id: step.id,
            order: step.order_num,
            description: step.description,
            image: step.image
          })) || [],
          versions: [] // We'll implement this later if needed
        };

        console.log("Transformed recipe:", transformedRecipe);
        setRecipe(transformedRecipe);

      } catch (error) {
        console.error("Error in fetchRecipe:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setRecipe(updatedRecipe);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="text-lg text-gray-600">Loading recipe...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold">Recipe Not Found</h1>
            <p className="mb-6 text-gray-600">
              Sorry, the recipe you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Button variant="outline" size="sm" className="mb-6" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Link>
        </Button>
        <RecipeDetail recipe={recipe} onRecipeUpdate={handleRecipeUpdate} />
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} RecipeRepo. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeView;
