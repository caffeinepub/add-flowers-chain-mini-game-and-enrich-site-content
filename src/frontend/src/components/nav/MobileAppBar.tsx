import { useRouterState } from '@tanstack/react-router';
import { Bell } from 'lucide-react';

const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/journal': 'Journal',
  '/tests': 'Tests',
  '/growth': 'Growth',
  '/profile': 'Profile',
  '/game/flowers-chain': 'Flowers Chain',
  '/staff/dashboard': 'Dashboard',
  '/staff/caseload': 'Caseload',
  '/staff/assessments': 'Assessments',
  '/staff/scheduling': 'Scheduling',
  '/staff/team': 'Team Setup',
};

export default function MobileAppBar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  
  // Handle dynamic routes
  let title = routeTitles[currentPath];
  if (!title) {
    if (currentPath.startsWith('/details/')) {
      title = 'Details';
    } else if (currentPath.startsWith('/test/')) {
      title = 'Test';
    } else {
      title = 'Breeze';
    }
  }

  return (
    <div className="md:hidden sticky top-0 z-40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="w-10" />
        <h1 className="text-lg font-semibold text-foreground text-center">{title}</h1>
        <button className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
