import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import BreezeCard from './BreezeCard';
import BreezePrimaryButton from './BreezePrimaryButton';

interface EmptyStateProps {
  title: string;
  description: string;
  illustration?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  gradient?: string;
  children?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  illustration,
  icon: Icon,
  action,
  gradient,
  children,
}: EmptyStateProps) {
  return (
    <BreezeCard gradient={gradient}>
      <div className="text-center py-8">
        {illustration ? (
          <div className="mb-6 flex justify-center">
            <img
              src={illustration}
              alt=""
              className="w-32 h-32 object-contain opacity-90"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : Icon ? (
          <Icon className="h-16 w-16 text-primary mx-auto mb-6" />
        ) : (
          <div className="text-6xl mb-6">✨</div>
        )}
        <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
        {action && (
          <BreezePrimaryButton onClick={action.onClick}>{action.label}</BreezePrimaryButton>
        )}
        {children}
      </div>
    </BreezeCard>
  );
}
