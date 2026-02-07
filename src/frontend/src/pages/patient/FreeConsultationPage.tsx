import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useOnboardPatient, useSaveCallerUserProfile, useGetPatient } from '../../hooks/useQueries';
import { useConsultationStatus } from '../../hooks/useConsultationStatus';
import { CheckCircle, Clock, Calendar } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function FreeConsultationPage() {
  const { identity } = useInternetIdentity();
  const { userProfile, isAuthenticated } = useCurrentUser();
  const patientPrincipal = identity?.getPrincipal();
  
  const { data: patient } = useGetPatient(patientPrincipal);
  const { status } = useConsultationStatus();
  const onboardPatient = useOnboardPatient();
  const saveProfile = useSaveCallerUserProfile();

  const [conditionSummary, setConditionSummary] = useState('');
  const [goals, setGoals] = useState('');
  const [leisureCentreArea, setLeisureCentreArea] = useState(userProfile?.leisureCentreArea || '');
  const [contactPreferences, setContactPreferences] = useState(userProfile?.contactPreferences || '');
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Free Consultation</h1>
          <p className="text-muted-foreground mb-6">Please log in to book your free consultation.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!conditionSummary.trim() || !goals.trim() || !leisureCentreArea.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (userProfile) {
        await saveProfile.mutateAsync({
          ...userProfile,
          leisureCentreArea: leisureCentreArea.trim(),
          contactPreferences: contactPreferences.trim(),
        });
      }
      
      await onboardPatient.mutateAsync({
        conditionSummary: conditionSummary.trim(),
        goals: goals.trim(),
      });

      setConditionSummary('');
      setGoals('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit consultation request');
    }
  };

  if (patient) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              {status === 'completed' ? (
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              ) : status === 'scheduled' ? (
                <Calendar className="h-10 w-10 text-teal-600" />
              ) : (
                <Clock className="h-10 w-10 text-amber-600" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">Consultation Status</h1>
                <p className="text-muted-foreground capitalize">{status.replace('-', ' ')}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Your Condition Summary</h3>
                <p className="text-muted-foreground">{patient.conditionSummary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Your Goals</h3>
                <p className="text-muted-foreground">{patient.goals}</p>
              </div>
            </div>

            {status === 'requested' && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                <p className="text-amber-900 dark:text-amber-200">
                  Your consultation request has been received. Our team will contact you soon to schedule your appointment.
                </p>
              </div>
            )}

            {status === 'scheduled' && (
              <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4 mb-6">
                <p className="text-teal-900 dark:text-teal-200">
                  Your consultation has been scheduled. Check your <Link to="/" className="underline font-medium">Home</Link> page for details.
                </p>
              </div>
            )}

            {status === 'completed' && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                <p className="text-emerald-900 dark:text-emerald-200">
                  Your consultation is complete. View your <Link to="/" className="underline font-medium">Home</Link> to continue your journey.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Free Consultation</h1>
        <p className="text-muted-foreground mb-8">
          Tell us about yourself so we can create a personalized therapy plan for you.
        </p>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-foreground mb-2">
              Condition Summary *
            </label>
            <textarea
              id="condition"
              value={conditionSummary}
              onChange={(e) => setConditionSummary(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Please describe your long-term condition, anxiety, or low mood..."
              required
            />
          </div>

          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-foreground mb-2">
              Your Goals *
            </label>
            <textarea
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="What would you like to achieve through therapy?"
              required
            />
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-foreground mb-2">
              Preferred Leisure Centre Area *
            </label>
            <input
              id="area"
              type="text"
              value={leisureCentreArea}
              onChange={(e) => setLeisureCentreArea(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g., Manchester City Centre, Salford, Stockport"
              required
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-foreground mb-2">
              Contact Preferences
            </label>
            <input
              id="contact"
              type="text"
              value={contactPreferences}
              onChange={(e) => setContactPreferences(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g., Email, Phone, Text"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={onboardPatient.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {onboardPatient.isPending ? 'Submitting...' : 'Submit Consultation Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
