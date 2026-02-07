import { ReactNode } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import AccessDeniedScreen from './AccessDeniedScreen';

interface ProtectedRouteProps {
  children: ReactNode;
  requireStaff?: boolean;
}

export default function ProtectedRoute({ children, requireStaff = false }: ProtectedRouteProps) {
  const { isAuthenticated, isStaff, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDeniedScreen message="Please log in to access this page." />;
  }

  if (requireStaff && !isStaff) {
    return <AccessDeniedScreen message="This page is only accessible to staff members." />;
  }

  return <>{children}</>;
}
