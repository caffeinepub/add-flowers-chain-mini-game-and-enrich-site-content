import { useState } from 'react';
import { useGetAllUsers, useAddAssessment } from '../../hooks/useQueries';
import { UserRole } from '../../backend';
import { Principal } from '@dfinity/principal';
import { ClipboardList } from 'lucide-react';

export default function StaffAssessmentsPage() {
  const { data: users = [] } = useGetAllUsers();
  const addAssessment = useAddAssessment();

  const [selectedPatient, setSelectedPatient] = useState('');
  const [vitalObservations, setVitalObservations] = useState('');
  const [hadScore, setHadScore] = useState('');
  const [meamsScore, setMeamsScore] = useState('');
  const [shuttleWalkScore, setShuttleWalkScore] = useState('');
  const [copmScore, setCopmScore] = useState('');

  const patients = users.filter(u => u.role === UserRole.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      await addAssessment.mutateAsync({
        patient: Principal.fromText(selectedPatient),
        vitalObservations,
        hadScore: BigInt(hadScore),
        meamsScore: BigInt(meamsScore),
        shuttleWalkScore: BigInt(shuttleWalkScore),
        copmScore: BigInt(copmScore),
        assessmentDate: BigInt(Date.now()) * BigInt(1_000_000),
        videoRecord: null,
      });

      setVitalObservations('');
      setHadScore('');
      setMeamsScore('');
      setShuttleWalkScore('');
      setCopmScore('');
      setSelectedPatient('');
    } catch (err) {
      console.error('Failed to add assessment:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardList className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patient Assessments</h1>
            <p className="text-muted-foreground">Record baseline and follow-up measures</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <label htmlFor="patient" className="block text-sm font-medium text-foreground mb-2">
              Select Patient *
            </label>
            <select
              id="patient"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              required
            >
              <option value="">Choose a patient...</option>
              {patients.map((patient, idx) => (
                <option key={idx} value={idx.toString()}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="vitals" className="block text-sm font-medium text-foreground mb-2">
              Vital Observations *
            </label>
            <textarea
              id="vitals"
              value={vitalObservations}
              onChange={(e) => setVitalObservations(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground resize-none"
              placeholder="Blood pressure, heart rate, etc."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="had" className="block text-sm font-medium text-foreground mb-2">
                HAD Score *
              </label>
              <input
                id="had"
                type="number"
                value={hadScore}
                onChange={(e) => setHadScore(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                placeholder="0-21"
                required
              />
            </div>

            <div>
              <label htmlFor="meams" className="block text-sm font-medium text-foreground mb-2">
                MEAMS Score *
              </label>
              <input
                id="meams"
                type="number"
                value={meamsScore}
                onChange={(e) => setMeamsScore(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                placeholder="0-100"
                required
              />
            </div>

            <div>
              <label htmlFor="shuttle" className="block text-sm font-medium text-foreground mb-2">
                Shuttle Walk Score *
              </label>
              <input
                id="shuttle"
                type="number"
                value={shuttleWalkScore}
                onChange={(e) => setShuttleWalkScore(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                placeholder="Distance in meters"
                required
              />
            </div>

            <div>
              <label htmlFor="copm" className="block text-sm font-medium text-foreground mb-2">
                COPM Score
              </label>
              <input
                id="copm"
                type="number"
                value={copmScore}
                onChange={(e) => setCopmScore(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                placeholder="For second appointment"
              />
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <strong>Note:</strong> COPM should be completed on the second appointment. Video records are erased at discharge.
            </p>
          </div>

          <button
            type="submit"
            disabled={addAssessment.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {addAssessment.isPending ? 'Saving Assessment...' : 'Save Assessment'}
          </button>
        </form>
      </div>
    </div>
  );
}
