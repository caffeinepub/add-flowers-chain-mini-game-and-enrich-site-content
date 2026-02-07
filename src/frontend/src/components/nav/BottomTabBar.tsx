import { Link, useRouterState } from '@tanstack/react-router';
import { Home, BookOpen, Heart, TrendingUp, User } from 'lucide-react';

export default function BottomTabBar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const tabs = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/journal', label: 'Journal', icon: BookOpen },
    { path: '/tests', label: 'Tests', icon: Heart },
    { path: '/growth', label: 'Growth', icon: TrendingUp },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-soft-lg">
      <nav className="flex items-center justify-around px-2 py-2 safe-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px] ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
