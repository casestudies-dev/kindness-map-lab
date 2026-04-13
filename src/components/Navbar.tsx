import { Button } from "./ui/button";

const Navbar = () => (
  <nav className="fixed inset-x-0 top-0 z-50 bg-background">
    <div className="container flex items-center h-20 px-6 gap-8">
      <div className="flex items-center">
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">mappio.org</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">Features</a>
        <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
        <a href="#" className="hover:text-foreground transition-colors">Examples</a>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <Button variant="ghost" size="sm">Log in</Button>
        <Button variant="hero" size="sm">Get Started</Button>
      </div>
    </div>
  </nav>
);

export default Navbar;
