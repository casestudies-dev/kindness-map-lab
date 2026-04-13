import { ArrowRight, Code2, Globe2, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const features = [
  { icon: MapPin, title: "Interactive Pins", description: "Drop pins for every project, story, or initiative across the globe." },
  { icon: Code2, title: "Easy Embed", description: "One line of code to embed your impact map on any website." },
  { icon: Sparkles, title: "Rich Stories", description: "Attach photos, metrics, and narratives to every location." },
  { icon: Globe2, title: "Live Updates", description: "Maps update in real-time as you add new impact data." },
];

const Index = () => (
  <div className="min-h-screen w-full relative overflow-x-hidden">
    <Navbar />

    {/* Background gradient orbs */}
    <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
    <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

    <main className="pt-28 md:pt-32 px-6 pb-12">
      <div className="flex flex-col items-center text-center min-h-[calc(100vh-4rem)]">
      <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 w-fit mb-6">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        <span className="text-xs text-muted-foreground font-medium">Show the world your impact</span>
      </div>

      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-5 max-w-3xl">
        Your global impact,{" "}
        <span className="text-gradient">beautifully mapped</span>
      </h1>

      <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
        Display stunning maps that showcase your organisation's positive initiatives worldwide.
      </p>

      <div className="flex items-center gap-4 mb-10 flex-wrap justify-center">
        <Button variant="hero" size="lg" className="gap-2">
          Start for free <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="heroOutline" size="lg">
          See examples
        </Button>
      </div>

      {/* Map embed */}
      <div className="w-full max-w-4xl">
        <iframe
          src="https://org-maps.onrender.com"
          width="100%"
          height="600"
          style={{ border: 'none', borderRadius: '12px' }}
          allow="accelerometer; autoplay"
          loading="lazy"
          title="Glastonbury Festival — Worthy Causes"
        />
      </div>
      </div>
    </main>
  </div>
);

export default Index;
