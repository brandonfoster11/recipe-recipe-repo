
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitFork, Star, FileCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types";

const Index = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch recipes and tags from Supabase
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        console.log("Fetching recipes...");
        
        // Fetch recipes with their authors, ingredients, steps, and tags
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
          .order('created_at', { ascending: false });

        if (recipesError) {
          console.error("Error fetching recipes:", recipesError);
          return;
        }

        console.log("Raw recipes data:", recipesData);

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
          versions: [] // We'll implement this later if needed
        })) || [];

        console.log("Transformed recipes:", transformedRecipes);
        setAllRecipes(transformedRecipes);

        // Extract unique tags for trending tags
        const allTags = transformedRecipes.flatMap(recipe => recipe.tags);
        const tagCounts = allTags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        // Sort tags by frequency and take top 7
        const sortedTags = Object.entries(tagCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 7)
          .map(([tag]) => tag);
        
        setTrendingTags(sortedTags);

      } catch (error) {
        console.error("Error in fetchRecipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);
  
  // Filter recipes whenever category or allRecipes changes
  useEffect(() => {
    if (category === null) {
      setFilteredRecipes(allRecipes);
    } else {
      const filtered = allRecipes.filter(recipe => 
        recipe.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  }, [category, allRecipes]);
  
  // Get featured recipe (most stars)
  const featuredRecipe = allRecipes.length > 0 ? [...allRecipes].sort((a, b) => b.stars - a.stars)[0] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading recipes...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 p-8 shadow-lg">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h1 className="mb-4 text-4xl font-bold text-white">
                  Discover, Fork & Share Your Recipes
                </h1>
                <p className="mb-6 text-lg text-emerald-100">
                  The GitHub for recipes. Collaborate, version control, and build your cooking repertoire.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" className="bg-white text-emerald-700 hover:bg-gray-100" asChild>
                    <Link to="/create">Create Recipe</Link>
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-700 bg-white/10 backdrop-blur-sm" asChild>
                    <Link to="/explore">Explore Recipes</Link>
                  </Button>
                </div>
              </div>
              {/* ... keep existing code (hero code illustration) */}
              <div className="hidden md:flex items-center justify-end">
                <div className="aspect-square w-64 rounded-lg bg-white p-4 shadow-xl rotate-3 -mt-6 border border-emerald-200">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileCode className="h-5 w-5 text-emerald-500" />
                        <span className="font-medium">Recipe.js</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span className="text-xs">142</span>
                        </div>
                        <div className="flex items-center">
                          <GitFork className="h-4 w-4 text-gray-500" />
                          <span className="text-xs">38</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-[2px] w-full bg-gray-100"></div>
                    <div className="space-y-2 text-sm">
                      <div className="text-emerald-700">
                        <span className="text-gray-500">// ingredients</span>
                      </div>
                      <div className="text-blue-600">const <span className="text-purple-600">ingredients</span> = [</div>
                      <div className="pl-4">&#123; name: <span className="text-amber-600">"Flour"</span>, amount: <span className="text-amber-600">"2 cups"</span> &#125;,</div>
                      <div className="pl-4">&#123; name: <span className="text-amber-600">"Sugar"</span>, amount: <span className="text-amber-600">"1 cup"</span> &#125;,</div>
                      <div className="pl-4">&#123; name: <span className="text-amber-600">"Butter"</span>, amount: <span className="text-amber-600">"1/2 cup"</span> &#125;</div>
                      <div>];</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Recipe */}
        {featuredRecipe && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Recipe</h2>
              <Link to="/explore" className="text-emerald-600 hover:text-emerald-700">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="aspect-video overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                {featuredRecipe.coverImage ? (
                  <img
                    src={featuredRecipe.coverImage}
                    alt={featuredRecipe.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500">No image available</div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="mb-2 text-2xl font-bold">{featuredRecipe.name}</h3>
                <div className="mb-3 flex items-center space-x-2">
                  <img
                    src={featuredRecipe.author.avatarUrl}
                    alt={featuredRecipe.author.username}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-gray-700">{featuredRecipe.author.username}</span>
                </div>
                <p className="mb-4 text-gray-600">{featuredRecipe.description}</p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {featuredRecipe.tags.map((tag) => (
                    <Badge key={tag} variant="tag">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" asChild>
                    <Link to={`/recipe/${featuredRecipe.id}`}>View Recipe</Link>
                  </Button>
                  <Button variant="outline">
                    <GitFork className="mr-2 h-4 w-4" />
                    Fork Recipe
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        {trendingTags.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Browse By Category</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={category === null ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(null)}
              >
                All
              </Button>
              {trendingTags.map((tag) => (
                <Button
                  key={tag}
                  variant={category === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(tag)}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Recipe Grid */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">
            {category
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Recipes`
              : "Recent Recipes"}
          </h2>
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {category ? `No recipes found for "${category}"` : "No recipes found. Create the first one!"}
              </p>
              <Button className="mt-4" asChild>
                <Link to="/create">Create Recipe</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <FileCode className="h-5 w-5 text-emerald-600" />
              <span className="text-lg font-bold">RecipeRepo</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <Link to="/about" className="hover:text-gray-900">About</Link>
              <Link to="/explore" className="hover:text-gray-900">Explore</Link>
              <Link to="/trending" className="hover:text-gray-900">Trending</Link>
              <Link to="/blog" className="hover:text-gray-900">Blog</Link>
              <Link to="/help" className="hover:text-gray-900">Help</Link>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} RecipeRepo. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
