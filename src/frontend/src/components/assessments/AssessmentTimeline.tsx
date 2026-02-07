import type { Assessment } from '../../backend';
import { Calendar, Activity } from 'lucide-react';

interface AssessmentTimelineProps {
  assessments: Assessment[];
}

export default function AssessmentTimeline({ assessments }: AssessmentTimelineProps) {
  const sortedAssessments = [...assessments].sort((a, b) => 
    Number(b.assessmentDate - a.assessmentDate)
  );

  const formatDate = (timeNs: bigint) => {
    const date = new Date(Number(timeNs / BigInt(1_000_000)));
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      {sortedAssessments.map((assessment, idx) => (
        <div key={idx} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {formatDate(assessment.assessmentDate)}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Vital Observations</h4>
                  <p className="text-sm text-muted-foreground">{assessment.vitalObservations}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-1">HAD Score</h4>
                    <p className="text-lg font-bold text-foreground">{Number(assessment.hadScore)}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-1">MEAMS</h4>
                    <p className="text-lg font-bold text-foreground">{Number(assessment.meamsScore)}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-1">Shuttle Walk</h4>
                    <p className="text-lg font-bold text-foreground">{Number(assessment.shuttleWalkScore)}m</p>
                  </div>
                  {Number(assessment.copmScore) > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-foreground mb-1">COPM</h4>
                      <p className="text-lg font-bold text-foreground">{Number(assessment.copmScore)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
