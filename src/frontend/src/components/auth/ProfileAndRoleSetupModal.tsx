import { useState } from 'react';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { UserRole } from '../../backend';
import { User, Stethoscope } from 'lucide-react';

export default function ProfileAndRoleSetupModal() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'staff' | null>(null);
  const [leisureCentreArea, setLeisureCentreArea] = useState('');
  const [contactPreferences, setContactPreferences] = useState('');
  const [error, setError] = useState('');

  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !role) {
      setError('Please fill in all required fields');
      return;
    }

    if (role === 'patient' && !leisureCentreArea.trim()) {
      setError('Please select your preferred leisure centre area');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        role: role === 'staff' ? UserRole.admin : UserRole.user,
        leisureCentreArea: leisureCentreArea.trim(),
        contactPreferences: contactPreferences.trim(),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Platonic Therapy</h2>
        <p className="text-muted-foreground mb-6">Let's set up your profile to get started.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Your Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">I am a *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                  role === 'patient'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
              >
                <User className="h-8 w-8" />
                <span className="font-medium">Patient</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                  role === 'staff'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
              >
                <Stethoscope className="h-8 w-8" />
                <span className="font-medium">Staff</span>
              </button>
            </div>
          </div>

          {role === 'patient' && (
            <>
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-foreground mb-1">
                  Preferred Leisure Centre Area *
                </label>
                <input
                  id="area"
                  type="text"
                  value={leisureCentreArea}
                  onChange={(e) => setLeisureCentreArea(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Manchester City Centre"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-foreground mb-1">
                  Contact Preferences
                </label>
                <input
                  id="contact"
                  type="text"
                  value={contactPreferences}
                  onChange={(e) => setContactPreferences(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Email, Phone"
                />
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saveProfile.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveProfile.isPending ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
