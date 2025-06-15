
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types";

const MyRecipes = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/auth");
    }
  }, [isSignedIn, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchUserRecipes();
    }
  }, [user?.id]);

  const fetchUserRecipes = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Get recipes with all related data
      const { data: recipesData, error: recipesError } = await supabase
        .from("recipes")
        .select(`
          *,
          ingredients (*),
          steps (*),
          recipe_tags (tag),
          profiles!recipes_author_id_fkey (*)
        `)
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (recipesError) throw recipesError;

      // Transform the data to match our Recipe type
      const transformedRecipes: Recipe[] = (recipesData || []).map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        coverImage: recipe.cover_image,
        author: {
          id: recipe.profiles?.id || user.id,
          username: recipe.profiles?.username || user.username || "user",
          name: recipe.profiles?.name || user.fullName || "User",
          avatarUrl: recipe.profiles?.avatar_url || user.imageUrl || "",
          bio: recipe.profiles?.bio
        },
        stars: recipe.stars,
        forks: recipe.forks,
        createdAt: recipe.created_at,
        updatedAt: recipe.updated_at,
        tags: recipe.recipe_tags?.map((tag: any) => tag.tag) || [],
        ingredients: recipe.ingredients?.map((ing: any) => ({
          id: ing.id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit
        })) || [],
        steps: recipe.steps?.map((step: any) => ({
          id: step.id,
          order: step.order_num,
          description: step.description,
          image: step.image
        })) || [],
        versions: [] // We'll implement this later if needed
      }));

      setUserRecipes(transformedRecipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Recipes</h1>
            <p className="text-gray-600 mt-2">
              Manage and view all your created recipes
            </p>
          </div>
          <Button asChild>
            <Link to="/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Recipe
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your recipes...</p>
          </div>
        ) : userRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">No recipes yet</h3>
              <p className="text-gray-600 mb-6">
                Start sharing your culinary creations with the community!
              </p>
              <Button asChild>
                <Link to="/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Recipe
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {userRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} RecipeRepo. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyRecipes;
