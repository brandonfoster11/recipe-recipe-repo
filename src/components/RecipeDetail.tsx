import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Recipe } from "@/types";
import { GitFork, Star, Clock, FileCode } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface RecipeDetailProps {
  recipe: Recipe;
}

const RecipeDetail = ({ recipe }: RecipeDetailProps) => {
  const handleStar = () => {
    toast({
      title: "Recipe Starred!",
      description: `You starred "${recipe.name}"`,
    });
  };

  const handleFork = () => {
    toast({
      title: "Recipe Forked!",
      description: `You forked "${recipe.name}" to your recipes`,
    });
  };

  const handleClone = () => {
    toast({
      title: "Recipe Cloned!",
      description: "Recipe copied to your clipboard",
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
          <Button variant="outline" size="sm" onClick={handleStar}>
            <Star className="mr-2 h-4 w-4" />
            Star {recipe.stars}
          </Button>
          <Button variant="outline" size="sm" onClick={handleFork}>
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
