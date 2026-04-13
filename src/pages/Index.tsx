import { ArrowRight, Code2, Globe2, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import globeHero from "@/assets/globe-hero.jpg";

const features = [
  { icon: MapPin, title: "Interactive Pins", description: "Drop pins for every project, story, or initiative across the globe." },
  { icon: Code2, title: "Easy Embed", description: "One line of code to embed your impact map on any website." },
  { icon: Sparkles, title: "Rich Stories", description: "Attach photos, metrics, and narratives to every location." },
  { icon: Globe2, title: "Live Updates", description: "Maps update in real-time as you add new impact data." },
];

const Index = () => (
  <div className="h-screen w-screen overflow-hidden relative">
    <Navbar />

    {/* Background gradient orbs */}
    <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
    <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

    <div className="h-full pt-16 flex flex-col items-center justify-center text-center px-6">
      <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 w-fit mb-6">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        <span className="text-xs text-muted-foreground font-medium">Show the world your impact</span>
      </div>

      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-5 max-w-3xl">
        Your global impact,{" "}
        <span className="text-gradient">beautifully mapped</span>
      </h1>

      <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
        Build stunning interactive maps that showcase your charity or company's positive initiatives worldwide — embeddable anywhere in seconds.
      </p>

      <div className="flex items-center gap-4 mb-10">
        <Button variant="hero" size="lg" className="gap-2">
          Start for free <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="heroOutline" size="lg">
          See examples
        </Button>
      </div>

      {/* Globe visual */}
      <div className="relative animate-float">
        <img
          src={globeHero}
          alt="Interactive globe showing global impact network"
          width={1024}
          height={1024}
          className="w-[280px] md:w-[340px] lg:w-[400px] h-auto drop-shadow-2xl"
        />
        <div className="absolute top-4 -left-16 glass rounded-xl px-3 py-2 animate-pulse-glow">
          <div className="text-xs text-muted-foreground">Projects Active</div>
          <div className="font-heading text-lg font-bold text-primary">2,847</div>
        </div>
        <div className="absolute bottom-8 -right-12 glass rounded-xl px-3 py-2" style={{ animationDelay: '1.5s' }}>
          <div className="text-xs text-muted-foreground">Countries Reached</div>
          <div className="font-heading text-lg font-bold text-foreground">94</div>
        </div>
      </div>
    </div>
  </div>
);

export default Index;
