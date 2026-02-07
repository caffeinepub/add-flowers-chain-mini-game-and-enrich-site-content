import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: string;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  gradient?: string;
  backgroundImage?: string;
  className?: string;
  children?: ReactNode;
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  badge,
  badgeColor = 'bg-primary/10 text-primary',
  action,
  gradient,
  backgroundImage,
  className = '',
  children,
}: FeatureCardProps) {
  return (
    <div
      className={`relative overflow-hidden bg-card rounded-3xl p-6 md:p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 ${className}`}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : gradient
            ? { background: gradient }
            : undefined
      }
    >
      {badge && (
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>{badge}</span>
        </div>
      )}

      {Icon && (
        <div className="mb-4">
          <Icon className="h-12 w-12 text-primary" />
        </div>
      )}

      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>

      {children}

      {action && (
        <button
          onClick={action.onClick}
          disabled={action.disabled}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

