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

    <div className="h-full pt-16 flex">
      {/* Left - Content */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-2xl">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 w-fit mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs text-muted-foreground font-medium">Show the world your impact</span>
        </div>

        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-5">
          Your global impact,{" "}
          <span className="text-gradient">beautifully mapped</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
          Build stunning interactive maps that showcase your charity or company's positive initiatives worldwide — embeddable anywhere in seconds.
        </p>

        <div className="flex items-center gap-4 mb-12">
          <Button variant="hero" size="lg" className="gap-2">
            Start for free <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="heroOutline" size="lg">
            See examples
          </Button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>

      {/* Right - Globe visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        <div className="relative animate-float">
          <img
            src={globeHero}
            alt="Interactive globe showing global impact network"
            width={1024}
            height={1024}
            className="w-[500px] xl:w-[580px] h-auto drop-shadow-2xl"
          />
          {/* Floating stat badges */}
          <div className="absolute top-16 -left-8 glass rounded-xl px-4 py-3 animate-pulse-glow">
            <div className="text-xs text-muted-foreground">Projects Active</div>
            <div className="font-heading text-xl font-bold text-primary">2,847</div>
          </div>
          <div className="absolute bottom-24 -right-4 glass rounded-xl px-4 py-3" style={{ animationDelay: '1.5s' }}>
            <div className="text-xs text-muted-foreground">Countries Reached</div>
            <div className="font-heading text-xl font-bold text-foreground">94</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Index;
