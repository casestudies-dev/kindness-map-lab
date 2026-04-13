import { type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="glass rounded-xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors group">
    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="w-4.5 h-4.5 text-primary" />
    </div>
    <h3 className="font-heading text-sm font-semibold text-foreground">{title}</h3>
    <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

export default FeatureCard;
