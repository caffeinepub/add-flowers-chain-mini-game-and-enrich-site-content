import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useGetProgrammePlans } from '../../hooks/useQueries';
import { Dumbbell, CheckCircle } from 'lucide-react';

export default function ExercisesPage() {
  const { identity } = useInternetIdentity();
  const { isAuthenticated } = useCurrentUser();
  const patientPrincipal = identity?.getPrincipal();
  
  const { data: plans = [], isLoading } = useGetProgrammePlans(patientPrincipal);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Chair-Based Exercises</h1>
          <p className="text-muted-foreground">Please log in to view your exercises.</p>
        </div>
      </div>
    );
  }

  const currentPlan = plans[plans.length - 1];
  const hasChairExercises = currentPlan?.interventions.some(i => 
    i.toLowerCase().includes('chair') || i.toLowerCase().includes('exercise')
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Dumbbell className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chair-Based Exercises</h1>
            <p className="text-muted-foreground">Accessible exercises you can do at home</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading exercises...</p>
          </div>
        ) : !hasChairExercises ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Exercises Assigned Yet</h2>
            <p className="text-muted-foreground">
              Chair-based exercises will be added to your programme after your consultation.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <p className="text-emerald-900 dark:text-emerald-200">
                <strong>Note:</strong> Chair-based exercises are part of your programme. Complete them at your own pace and mark your progress.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Your Exercise Programme</h2>
              <div className="space-y-3">
                {currentPlan.interventions
                  .filter(i => i.toLowerCase().includes('chair') || i.toLowerCase().includes('exercise'))
                  .map((exercise, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <CheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        currentPlan.completionStatus ? 'text-emerald-600' : 'text-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{exercise}</p>
                        <p className="text-sm text-muted-foreground mt-1">Frequency: {currentPlan.frequency}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3">Exercise Tips</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Always warm up before starting your exercises</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Stop if you feel any pain or discomfort</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Stay hydrated throughout your session</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Contact your therapist if you have any concerns</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
