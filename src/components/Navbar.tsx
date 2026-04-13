import { Globe } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass">
    <div className="container flex items-center justify-between h-16 px-6">
      <div className="flex items-center gap-2.5">
        <Globe className="w-6 h-6 text-primary" />
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">ImpactMap</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">Features</a>
        <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
        <a href="#" className="hover:text-foreground transition-colors">Examples</a>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">Log in</Button>
        <Button variant="hero" size="sm">Get Started</Button>
      </div>
    </div>
  </nav>
);

export default Navbar;
