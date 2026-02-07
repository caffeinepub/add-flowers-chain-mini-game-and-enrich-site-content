import { Link, useRouterState } from '@tanstack/react-router';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import LoginButton from '../auth/LoginButton';
import { Menu, X, Home, BookOpen, Heart, TrendingUp, User, Users, Calendar, ClipboardList } from 'lucide-react';
import { useState } from 'react';

export default function PrimaryNav() {
  const { isStaff } = useCurrentUser();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;

  const patientLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/journal', label: 'Journal', icon: BookOpen },
    { path: '/tests', label: 'Tests', icon: Heart },
    { path: '/growth', label: 'Growth', icon: TrendingUp },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const staffLinks = [
    { path: '/staff/dashboard', label: 'Dashboard', icon: Home },
    { path: '/staff/caseload', label: 'Caseload', icon: Users },
    { path: '/staff/assessments', label: 'Assessments', icon: ClipboardList },
    { path: '/staff/scheduling', label: 'Scheduling', icon: Calendar },
    { path: '/staff/team', label: 'Team Setup', icon: Users },
  ];

  const links = isStaff ? staffLinks : patientLinks;

  return (
    <header className="hidden md:block sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
              <img
                src="/assets/generated/platonic-logo.dim_512x512.png"
                alt="Breeze"
                className="h-10 w-10"
              />
              <span className="hidden sm:inline">Breeze</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LoginButton />
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
