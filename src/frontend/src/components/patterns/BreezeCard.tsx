import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface BreezeCardProps {
  title?: string;
  description?: string;
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
  onClick?: () => void;
}

export default function BreezeCard({
  title,
  description,
  icon: Icon,
  badge,
  badgeColor = 'bg-muted/80 text-muted-foreground',
  action,
  gradient,
  backgroundImage,
  className = '',
  children,
  onClick,
}: BreezeCardProps) {
  const CardWrapper = onClick ? 'button' : 'div';

  return (
    <CardWrapper
      onClick={onClick}
      className={`relative overflow-hidden bg-card rounded-3xl p-6 md:p-8 shadow-soft transition-all duration-300 ${
        onClick
          ? 'cursor-pointer hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]'
          : 'hover:shadow-soft-lg'
      } ${className}`}
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
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
            {badge}
          </span>
        </div>
      )}

      {Icon && (
        <div className="mb-4">
          <Icon className="h-12 w-12 text-primary" />
        </div>
      )}

      {title && <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">{title}</h3>}
      {description && <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>}

      {children}

      {action && (
        <button
          onClick={action.onClick}
          disabled={action.disabled}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {action.label}
        </button>
      )}
    </CardWrapper>
  );
}
