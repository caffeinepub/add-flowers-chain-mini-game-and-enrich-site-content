import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useGetProgrammePlans, useUpdateProgrammePlanStatus, useAddNoticeboardPost } from '../../hooks/useQueries';
import ProgrammeProgressSummary from '../../components/programme/ProgrammeProgressSummary';
import SectionHeader from '../../components/patterns/SectionHeader';
import FeatureCard from '../../components/patterns/FeatureCard';
import { Dumbbell, CheckCircle, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function MyProgrammePage() {
  const { identity } = useInternetIdentity();
  const { isAuthenticated } = useCurrentUser();
  const patientPrincipal = identity?.getPrincipal();

  const { data: plans = [], isLoading } = useGetProgrammePlans(patientPrincipal);
  const updateStatus = useUpdateProgrammePlanStatus();
  const addPost = useAddNoticeboardPost();
  const [requestingHelp, setRequestingHelp] = useState(false);

  const handleMarkComplete = async (isCompleted: boolean) => {
    if (!patientPrincipal) return;
    try {
      await updateStatus.mutateAsync({ patient: patientPrincipal, isCompleted });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleRequestHelp = async () => {
    setRequestingHelp(true);
    try {
      await addPost.mutateAsync('I need help with my programme. Could a staff member please contact me?');
      alert('Help request sent! A staff member will contact you soon.');
    } catch (err) {
      console.error('Failed to request help:', err);
      alert('Failed to send help request. Please try again.');
    } finally {
      setRequestingHelp(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">My Programme</h1>
          <p className="text-muted-foreground">Please log in to view your programme.</p>
        </div>
      </div>
    );
  }

  const currentPlan = plans[plans.length - 1];

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        <SectionHeader icon={Dumbbell} title="My Programme" subtitle="Your personalized therapy plan" className="mb-8" />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading programme...</p>
          </div>
        ) : !currentPlan ? (
          <FeatureCard
            icon={Dumbbell}
            title="No Programme Yet"
            description="Your personalized programme will be created after your consultation and assessments."
            className="text-center"
          />
        ) : (
          <div className="space-y-6">
            <ProgrammeProgressSummary plan={currentPlan} />

            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-soft">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">Programme Details</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 text-lg">Interventions</h3>
                  <ul className="space-y-3">
                    {currentPlan.interventions.map((intervention, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{intervention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 text-lg">Frequency</h3>
                  <p className="text-muted-foreground">{currentPlan.frequency}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleMarkComplete(!currentPlan.completionStatus)}
                disabled={updateStatus.isPending}
                className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 px-6 rounded-full transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 ${
                  currentPlan.completionStatus
                    ? 'bg-secondary/80 hover:bg-secondary text-secondary-foreground'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                <CheckCircle className="h-5 w-5" />
                {currentPlan.completionStatus ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
              <button
                onClick={handleRequestHelp}
                disabled={requestingHelp}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 px-6 rounded-full transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <HelpCircle className="h-5 w-5" />
                Request Help
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

