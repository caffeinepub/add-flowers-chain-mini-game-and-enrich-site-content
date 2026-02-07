import { useState } from 'react';
import { useGetAllUsers, useCreateProgrammePlan } from '../../hooks/useQueries';
import { UserRole } from '../../backend';
import { Principal } from '@dfinity/principal';
import { Users, Plus } from 'lucide-react';

export default function CaseloadPage() {
  const { data: users = [], isLoading } = useGetAllUsers();
  const createPlan = useCreateProgrammePlan();

  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [interventions, setInterventions] = useState<string[]>(['']);
  const [frequency, setFrequency] = useState('');

  const patients = users.filter(u => u.role === UserRole.user);

  const handleAddIntervention = () => {
    setInterventions([...interventions, '']);
  };

  const handleInterventionChange = (idx: number, value: string) => {
    const updated = [...interventions];
    updated[idx] = value;
    setInterventions(updated);
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      await createPlan.mutateAsync({
        patient: Principal.fromText(selectedPatient),
        interventions: interventions.filter(i => i.trim()),
        frequency,
      });
      setShowPlanForm(false);
      setInterventions(['']);
      setFrequency('');
      setSelectedPatient(null);
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Caseload</h1>
            <p className="text-muted-foreground">Manage patient programmes and care</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading patients...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Patients Yet</h2>
            <p className="text-muted-foreground">Patients will appear here once they register.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Name</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Leisure Centre Area</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Contact Preferences</th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {patients.map((patient, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm text-foreground">{patient.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{patient.leisureCentreArea || 'Not specified'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{patient.contactPreferences || 'Not specified'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedPatient(idx.toString());
                            setShowPlanForm(true);
                          }}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          <Plus className="h-4 w-4" />
                          Create Plan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showPlanForm && selectedPatient && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Create Programme Plan</h2>
                <form onSubmit={handleCreatePlan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Interventions</label>
                    {interventions.map((intervention, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={intervention}
                        onChange={(e) => handleInterventionChange(idx, e.target.value)}
                        placeholder="e.g., Gym attendance support, Chair-based exercises"
                        className="w-full px-3 py-2 mb-2 border border-input rounded-md bg-background text-foreground text-sm"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={handleAddIntervention}
                      className="text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      + Add Intervention
                    </button>
                  </div>

                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-foreground mb-2">
                      Frequency
                    </label>
                    <input
                      id="frequency"
                      type="text"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      placeholder="e.g., 3 times per week"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={createPlan.isPending}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                      {createPlan.isPending ? 'Creating...' : 'Create Plan'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPlanForm(false);
                        setSelectedPatient(null);
                      }}
                      className="px-6 text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
