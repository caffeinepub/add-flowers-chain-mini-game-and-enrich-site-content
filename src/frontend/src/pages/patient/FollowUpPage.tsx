import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useGetProgrammePlans } from '../../hooks/useQueries';
import { Heart, TrendingUp } from 'lucide-react';

export default function FollowUpPage() {
  const { identity } = useInternetIdentity();
  const { isAuthenticated } = useCurrentUser();
  const patientPrincipal = identity?.getPrincipal();
  
  const { data: plans = [], isLoading } = useGetProgrammePlans(patientPrincipal);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Follow-Up</h1>
          <p className="text-muted-foreground">Please log in to view your follow-up care.</p>
        </div>
      </div>
    );
  }

  const currentPlan = plans[plans.length - 1];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Follow-Up Care</h1>
            <p className="text-muted-foreground">Post-therapy support and guidance</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading follow-up information...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Your Progress</h2>
              {currentPlan ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                    <div>
                      <p className="font-medium text-foreground">Programme Status</p>
                      <p className="text-sm text-muted-foreground">
                        {currentPlan.completionStatus ? 'Completed' : 'In Progress'}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Continue with your exercises and activities to maintain your progress. Your therapist will schedule follow-up sessions as needed.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Follow-up care will be available after you complete your initial programme.
                </p>
              )}
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Maintaining Your Wellbeing</h2>
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 mb-2">Stay Active</h3>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">
                    Continue your chair-based exercises and gym activities to maintain strength and mobility.
                  </p>
                </div>
                <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                  <h3 className="font-semibold text-teal-900 dark:text-teal-200 mb-2">Stay Connected</h3>
                  <p className="text-sm text-teal-800 dark:text-teal-300">
                    Engage with community activities and group sessions to reduce isolation.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">Monitor Your Progress</h3>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Keep track of your goals and celebrate small wins along the way.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Need Support?</h2>
              <p className="text-muted-foreground mb-4">
                If you need additional support or have concerns about your progress, please reach out to your therapy team.
              </p>
              <p className="text-sm text-muted-foreground">
                You can request help through your <a href="/programme" className="text-primary underline">Programme page</a> or contact us through the <a href="/community" className="text-primary underline">Community noticeboard</a>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
