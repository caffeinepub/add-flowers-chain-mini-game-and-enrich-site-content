import { ShieldAlert } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface AccessDeniedScreenProps {
  message?: string;
}

export default function AccessDeniedScreen({ message = 'Access Denied' }: AccessDeniedScreenProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Link
          to="/"
          className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-md transition-colors"
        >
          Return to Overview
        </Link>
      </div>
    </div>
  );
}
