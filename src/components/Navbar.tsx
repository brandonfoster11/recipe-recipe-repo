
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileCode, GitFork, Star, Menu, Search, User, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleGenericFork = () => {
    toast.success("Fork Feature - Fork functionality coming soon! Select a specific recipe to fork it.");
  };

  const handleGenericStar = () => {
    toast.success("Star Feature - Star functionality coming soon! You can star individual recipes.");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

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
            {user && (
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
            <Button variant="ghost" size="sm" onClick={handleGenericFork}>
              <GitFork className="h-4 w-4 mr-2" />
              Fork
            </Button>
            <Button variant="ghost" size="sm" onClick={handleGenericStar}>
              <Star className="h-4 w-4 mr-2" />
              Star
            </Button>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/create">
                <Button size="sm" variant="outline">Create Recipe</Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-recipes">My Recipes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/auth">Sign In</Link>
              </Button>
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
                      {user && (
                        <Link to="/my-recipes" className="text-gray-600 hover:text-gray-900 py-2">My Recipes</Link>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button variant="ghost" size="sm" onClick={handleGenericFork}>
                          <GitFork className="h-4 w-4 mr-2" />
                          Fork
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleGenericStar}>
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
