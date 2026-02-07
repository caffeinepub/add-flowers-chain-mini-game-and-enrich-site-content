import type { ProgrammePlan } from '../../backend';
import { CheckCircle, Circle } from 'lucide-react';

interface ProgrammeProgressSummaryProps {
  plan: ProgrammePlan;
}

export default function ProgrammeProgressSummary({ plan }: ProgrammeProgressSummaryProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Progress</h2>
        <div className="flex items-center gap-2">
          {plan.completionStatus ? (
            <>
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">Completed</span>
            </>
          ) : (
            <>
              <Circle className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-600">In Progress</span>
            </>
          )}
        </div>
      </div>
      
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all ${
            plan.completionStatus ? 'bg-emerald-600' : 'bg-amber-600'
          }`}
          style={{ width: plan.completionStatus ? '100%' : '50%' }}
        />
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        {plan.completionStatus
          ? 'Great work! You have completed your programme.'
          : 'Keep going! Continue with your assigned interventions.'}
      </div>
    </div>
  );
}
