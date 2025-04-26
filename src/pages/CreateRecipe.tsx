
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const CreateRecipe = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      toast.success("Recipe created successfully!");
      setIsSubmitting(false);
      navigate("/");
    }, 1500);
  };

  // Redirect to auth page if user is not signed in
  if (!isSignedIn) {
    navigate("/auth");
    return null;
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
              placeholder="List your ingredients (one per line)"
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
              placeholder="Step by step instructions"
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
