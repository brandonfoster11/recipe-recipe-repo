
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileCode, GitFork, Star, Menu, X, Search } from "lucide-react";
import { SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <FileCode className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">RecipeRepo</span>
          </Link>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/explore" className="text-gray-600 hover:text-gray-900">Explore</Link>
            <Link to="/trending" className="text-gray-600 hover:text-gray-900">Trending</Link>
            <Link to="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
            {isSignedIn && (
              <Link to="/my-recipes" className="text-gray-600 hover:text-gray-900">My Recipes</Link>
            )}
          </div>
        </div>
        
        <div className={`${isSearchVisible ? 'flex' : 'hidden'} md:block md:w-1/3 absolute top-16 md:static left-4 right-4 z-10 md:z-auto`}>
          <Input 
            type="search" 
            placeholder="Search recipes..." 
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:flex space-x-2">
            <Button variant="ghost" size="sm">
              <GitFork className="h-4 w-4 mr-2" />
              Fork
            </Button>
            <Button variant="ghost" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Star
            </Button>
          </div>
          
          {isSignedIn ? (
            <div className="flex items-center space-x-4">
              <Link to="/create">
                <Button size="sm" variant="outline">Create Recipe</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-6">
                      <Link to="/explore" className="text-gray-600 hover:text-gray-900 py-2">Explore</Link>
                      <Link to="/trending" className="text-gray-600 hover:text-gray-900 py-2">Trending</Link>
                      <Link to="/categories" className="text-gray-600 hover:text-gray-900 py-2">Categories</Link>
                      {isSignedIn && (
                        <Link to="/my-recipes" className="text-gray-600 hover:text-gray-900 py-2">My Recipes</Link>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button variant="ghost" size="sm">
                          <GitFork className="h-4 w-4 mr-2" />
                          Fork
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Star className="h-4 w-4 mr-2" />
                          Star
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
