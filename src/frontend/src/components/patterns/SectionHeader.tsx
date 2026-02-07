import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-6 ${className}`}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex-shrink-0 mt-1">
            <Icon className="h-7 w-7 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground mt-1 text-sm md:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
