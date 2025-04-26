
import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { FileCode } from "lucide-react";

const Auth = () => {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Link to="/" className="flex items-center space-x-2 mb-10">
        <FileCode className="h-6 w-6 text-emerald-600" />
        <span className="text-2xl font-bold">RecipeRepo</span>
      </Link>
      
      <div className="w-full max-w-md">
        <SignIn
          routing="path"
          path="/auth"
          signUpUrl="/auth/sign-up"
          redirectUrl="/"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-card border border-border shadow-sm rounded-lg",
              header: "text-foreground",
              headerTitle: "text-xl font-semibold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-background border border-input hover:bg-accent",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border border-input",
              footerAction: "text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Auth;
