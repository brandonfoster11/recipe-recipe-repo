
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import RecipeCard from "@/components/RecipeCard";
import { recipes } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const MyRecipes = () => {
  const { isSignedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/auth");
    }
  }, [isSignedIn, navigate]);

  if (!isSignedIn) {
    return null;
  }

  // Filter recipes by current user (mock data uses specific usernames)
  // In a real app, this would filter by user ID
  const userRecipes = recipes.filter(recipe => 
    recipe.author.username === user?.username || 
    recipe.author.username === "johndoe" // Mock data fallback
  );

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

        {userRecipes.length === 0 ? (
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
