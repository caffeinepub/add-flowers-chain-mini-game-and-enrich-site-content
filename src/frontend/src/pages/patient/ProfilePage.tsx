import { useState } from 'react';
import { User, Moon, Sun, LogOut } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useThemePreference } from '../../hooks/useThemePreference';
import SectionHeader from '../../components/patterns/SectionHeader';
import BreezeCard from '../../components/patterns/BreezeCard';
import BreezePrimaryButton from '../../components/patterns/BreezePrimaryButton';
import EmptyState from '../../components/patterns/EmptyState';
import LoadingState from '../../components/patterns/LoadingState';
import LoginButton from '../../components/auth/LoginButton';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { useToast } from '../../components/patterns/ToastProvider';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useQueryClient } from '@tanstack/react-query';
import { UserRole } from '../../backend';

export default function ProfilePage() {
  const { identity, clear } = useInternetIdentity();
  const { theme, toggleTheme } = useThemePreference();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();

  const [name, setName] = useState(profile?.name || '');
  const [leisureCentreArea, setLeisureCentreArea] = useState(profile?.leisureCentreArea || '');
  const [contactPreferences, setContactPreferences] = useState(profile?.contactPreferences || '');

  // Update form when profile loads
  useState(() => {
    if (profile) {
      setName(profile.name);
      setLeisureCentreArea(profile.leisureCentreArea);
      setContactPreferences(profile.contactPreferences);
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }

    try {
      await saveMutation.mutateAsync({
        name: name.trim(),
        leisureCentreArea: leisureCentreArea.trim(),
        contactPreferences: contactPreferences.trim(),
        role: profile?.role || UserRole.user,
      });
      showToast('Profile updated successfully!');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    showToast('Logged out successfully');
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <SectionHeader icon={User} title="Profile" subtitle="Manage your account" />
        <EmptyState
          title="Login to View Profile"
          description="Create an account to personalize your wellness experience."
          icon={User}
          gradient="linear-gradient(135deg, oklch(0.95 0.03 200) 0%, oklch(0.90 0.04 220) 100%)"
        >
          <LoginButton />
        </EmptyState>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <SectionHeader icon={User} title="Profile" subtitle="Manage your account" />
        <LoadingState message="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <SectionHeader icon={User} title="Profile" subtitle="Manage your account" />

      {/* Theme Toggle */}
      <BreezeCard className="mb-6" gradient="linear-gradient(135deg, oklch(0.95 0.03 200) 0%, oklch(0.90 0.04 220) 100%)">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Theme</h3>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 hover:bg-primary/30 text-primary transition-colors active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <>
                <Moon className="h-5 w-5" />
                <span className="font-medium">Dark</span>
              </>
            ) : (
              <>
                <Sun className="h-5 w-5" />
                <span className="font-medium">Light</span>
              </>
            )}
          </button>
        </div>
      </BreezeCard>

      {/* Profile Form */}
      <BreezeCard className="mb-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-foreground">
              Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="area" className="text-foreground">
              Leisure Centre Area
            </Label>
            <Input
              id="area"
              value={leisureCentreArea}
              onChange={(e) => setLeisureCentreArea(e.target.value)}
              placeholder="Your preferred area"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contact" className="text-foreground">
              Contact Preferences
            </Label>
            <Textarea
              id="contact"
              value={contactPreferences}
              onChange={(e) => setContactPreferences(e.target.value)}
              placeholder="How would you like to be contacted?"
              rows={3}
              className="mt-1"
            />
          </div>

          <BreezePrimaryButton
            type="submit"
            disabled={saveMutation.isPending}
            className="hover:scale-105 active:scale-95"
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </BreezePrimaryButton>
        </form>
      </BreezeCard>

      {/* Account Info */}
      <BreezeCard className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Account Information</h3>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Principal ID</p>
            <p className="text-xs font-mono text-foreground break-all">
              {identity.getPrincipal().toString()}
            </p>
          </div>
        </div>
      </BreezeCard>

      {/* Logout */}
      <BreezeCard>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Logout</h3>
            <p className="text-sm text-muted-foreground">Sign out of your account</p>
          </div>
          <BreezePrimaryButton
            onClick={handleLogout}
            variant="outline"
            icon={LogOut}
            className="hover:scale-105 active:scale-95"
          >
            Logout
          </BreezePrimaryButton>
        </div>
      </BreezeCard>
    </div>
  );
}
