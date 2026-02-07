import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useGetAssessments } from '../../hooks/useQueries';
import AssessmentTimeline from '../../components/assessments/AssessmentTimeline';
import { ClipboardList } from 'lucide-react';

export default function AssessmentsPage() {
  const { identity } = useInternetIdentity();
  const { isAuthenticated } = useCurrentUser();
  const patientPrincipal = identity?.getPrincipal();
  
  const { data: assessments = [], isLoading } = useGetAssessments(patientPrincipal);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">My Assessments</h1>
          <p className="text-muted-foreground">Please log in to view your assessments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardList className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Assessments</h1>
            <p className="text-muted-foreground">Track your progress over time</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading assessments...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <ClipboardList className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Assessments Yet</h2>
            <p className="text-muted-foreground">
              Your baseline assessments will appear here after your initial consultation.
            </p>
          </div>
        ) : (
          <AssessmentTimeline assessments={assessments} />
        )}
      </div>
    </div>
  );
}
