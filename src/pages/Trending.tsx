
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, GitFork, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types";

const Trending = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [timeFilter, setTimeFilter] = useState<string>("week");
  const [loading, setLoading] = useState(true);
  
  // Fetch trending recipes from Supabase
  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      try {
        console.log("Fetching trending recipes...");
        
        // Calculate date filter based on selected time period
        const now = new Date();
        let dateFilter = new Date();
        switch (timeFilter) {
          case "day":
            dateFilter.setDate(now.getDate() - 1);
            break;
          case "week":
            dateFilter.setDate(now.getDate() - 7);
            break;
          case "month":
            dateFilter.setMonth(now.getMonth() - 1);
            break;
          case "all":
            dateFilter = new Date("2020-01-01"); // Very old date to include all
            break;
        }

        // Fetch recipes with their authors, ingredients, steps, and tags
        // Order by stars descending, then by forks, then by recent updates
        const { data: recipesData, error: recipesError } = await supabase
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
          .gte('updated_at', dateFilter.toISOString())
          .order('stars', { ascending: false })
          .order('forks', { ascending: false })
          .order('updated_at', { ascending: false })
          .limit(20);

        if (recipesError) {
          console.error("Error fetching trending recipes:", recipesError);
          return;
        }

        console.log("Raw trending recipes data:", recipesData);

        // Transform the data to match our Recipe type
        const transformedRecipes: Recipe[] = recipesData?.map(recipe => ({
          id: recipe.id,
          name: recipe.name,
          description: recipe.description,
          coverImage: recipe.cover_image || undefined,
          author: {
            id: recipe.profiles?.id || '',
            username: recipe.profiles?.username || 'Unknown',
            name: recipe.profiles?.name || 'Unknown User',
            avatarUrl: recipe.profiles?.avatar_url || `https://www.gravatar.com/avatar/${recipe.author_id}?d=mp`
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
          versions: []
        })) || [];

        console.log("Transformed trending recipes:", transformedRecipes);
        setRecipes(transformedRecipes);

      } catch (error) {
        console.error("Error in fetchTrendingRecipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRecipes();
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading trending recipes...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-emerald-600" />
              <h1 className="text-3xl font-bold">Trending Recipes</h1>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            Discover the most popular recipes based on stars, forks, and recent activity.
          </p>

          {/* Time Filter */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "day", label: "Today" },
              { key: "week", label: "This Week" },
              { key: "month", label: "This Month" },
              { key: "all", label: "All Time" }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={timeFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter(filter.key)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Top Recipe */}
        {recipes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Star className="h-6 w-6 text-amber-500 mr-2" />
              Top Trending Recipe
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm border">
              <div className="aspect-video overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                {recipes[0].coverImage ? (
                  <img
                    src={recipes[0].coverImage}
                    alt={recipes[0].name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500">No image available</div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="mb-2 text-2xl font-bold">{recipes[0].name}</h3>
                <div className="mb-3 flex items-center space-x-2">
                  <img
                    src={recipes[0].author.avatarUrl}
                    alt={recipes[0].author.username}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-gray-700">{recipes[0].author.username}</span>
                </div>
                <p className="mb-4 text-gray-600">{recipes[0].description}</p>
                <div className="mb-4 flex items-center space-x-4">
                  <div className="flex items-center text-amber-600">
                    <Star className="h-4 w-4 mr-1" />
                    <span className="font-semibold">{recipes[0].stars}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GitFork className="h-4 w-4 mr-1" />
                    <span>{recipes[0].forks}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(recipes[0].updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mb-6 flex flex-wrap gap-2">
                  {recipes[0].tags.map((tag) => (
                    <Badge key={tag} variant="tag">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button asChild>
                  <Link to={`/recipe/${recipes[0].id}`}>View Recipe</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Trending Grid */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">All Trending Recipes</h2>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">
                No trending recipes found for this time period.
              </p>
              <Button asChild>
                <Link to="/create">Create the First Trending Recipe</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Trending;
