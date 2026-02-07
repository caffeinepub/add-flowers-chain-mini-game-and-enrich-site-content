import { useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
import PrimaryNav from '../nav/PrimaryNav';
import MobileAppBar from '../nav/MobileAppBar';
import BottomTabBar from '../nav/BottomTabBar';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useThemePreference } from '../../hooks/useThemePreference';
import { Heart } from 'lucide-react';
import { ToastProvider } from '../patterns/ToastProvider';

export default function AppLayout() {
  const { isStaff } = useCurrentUser();
  const { theme } = useThemePreference();

  // Apply theme on mount
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
        <PrimaryNav />
        {!isStaff && <MobileAppBar />}
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
        {!isStaff && <BottomTabBar />}
        <footer className="border-t border-border bg-card mt-auto">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              © 2026. Built with <Heart className="inline h-4 w-4 text-rose-500 fill-rose-500" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
