
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitFork, Star, Clock } from "lucide-react";
import { Recipe } from "@/types";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/recipe/${recipe.id}`}>
        <div className="aspect-video w-full overflow-hidden">
          {recipe.coverImage && (
            <img
              src={recipe.coverImage}
              alt={recipe.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <h3 className="text-lg font-bold line-clamp-1">{recipe.name}</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <img
              src={recipe.author.avatarUrl}
              alt={recipe.author.username}
              className="h-5 w-5 rounded-full"
            />
            <span>{recipe.author.username}</span>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="tag" className="text-xs">
                {tag}
              </Badge>
            ))}
            {recipe.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{recipe.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between border-t pt-3 text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4" />
            <span>{recipe.stars}</span>
          </div>
          <div className="flex items-center">
            <GitFork className="mr-1 h-4 w-4" />
            <span>{recipe.forks}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          <span>{new Date(recipe.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
