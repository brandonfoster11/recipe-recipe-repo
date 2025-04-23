
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import RecipeDetail from "@/components/RecipeDetail";
import { recipes } from "@/data/mock";
import { useEffect } from "react";

const RecipeView = () => {
  const { id } = useParams<{ id: string }>();
  const recipe = recipes.find((r) => r.id === id);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold">Recipe Not Found</h1>
            <p className="mb-6 text-gray-600">
              Sorry, the recipe you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <RecipeDetail recipe={recipe} />
      
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

export default RecipeView;
