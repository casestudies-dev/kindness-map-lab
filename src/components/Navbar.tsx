import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => (
  <nav className="fixed inset-x-0 top-0 z-50 bg-background">
    <div className="container flex items-center h-20 px-6 gap-8">
      <div className="flex items-center">
        <Link to="/" className="font-heading text-lg font-bold tracking-tight text-foreground">Mappio</Link>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground">
        <a href="#" className="hover:text-foreground transition-colors">Features</a>
        <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
        <a href="#" className="hover:text-foreground transition-colors">Examples</a>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/login">Log in</Link>
        </Button>
        <Button variant="hero" size="sm" asChild>
          <Link to="/signup">Get Started</Link>
        </Button>
      </div>
    </div>
  </nav>
);

export default Navbar;
