
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileCode, GitFork, Star, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <FileCode className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">RecipeRepo</span>
          </Link>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/explore" className="text-gray-600 hover:text-gray-900">Explore</Link>
            <Link to="/trending" className="text-gray-600 hover:text-gray-900">Trending</Link>
            <Link to="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
          </div>
        </div>
        
        <div className="hidden md:block w-1/3">
          <Input 
            type="search" 
            placeholder="Search recipes..." 
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <GitFork className="h-4 w-4 mr-2" />
            Fork
          </Button>
          <Button variant="ghost" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Star
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/auth">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
