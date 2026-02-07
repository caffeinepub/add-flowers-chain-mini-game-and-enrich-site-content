import { useGetAllUsers } from '../../hooks/useQueries';
import { UserRole } from '../../backend';
import { Users, Award } from 'lucide-react';

export default function TeamSetupPage() {
  const { data: users = [], isLoading } = useGetAllUsers();

  const staff = users.filter(u => u.role === UserRole.admin);
  const patients = users.filter(u => u.role === UserRole.user);

  const teams = [
    { name: 'Team Alpha', lead: 'Service Lead (Band 8a)', capacity: 6 },
    { name: 'Team Beta', lead: 'Service Lead (Band 8a)', capacity: 6 },
    { name: 'Team Gamma', lead: 'Service Lead (Band 8a)', capacity: 6 },
  ];

  const roles = [
    { title: 'Service Lead', band: 'Band 8a', capacity: 6, color: 'emerald' },
    { title: 'Team Lead Specialist', band: 'Band 7', capacity: 12, color: 'teal' },
    { title: 'Rehabilitation Specialist', band: 'Band 6', capacity: 5, color: 'cyan' },
    { title: 'Junior Therapist', band: 'Band 5', capacity: 7, color: 'amber' },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Setup</h1>
            <p className="text-muted-foreground">Manage teams, roles, and capacity</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading team data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              {teams.map((team, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{team.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{team.lead}</p>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">Capacity: {team.capacity} patients</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Role Capacity Overview</h2>
              <div className="space-y-4">
                {roles.map((role, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h3 className="font-medium text-foreground">{role.title}</h3>
                      <p className="text-sm text-muted-foreground">{role.band}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">Capacity: {role.capacity} patients</p>
                      <p className="text-xs text-muted-foreground">Per staff member</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Staff Members</h2>
                <p className="text-3xl font-bold text-foreground mb-2">{staff.length}</p>
                <p className="text-sm text-muted-foreground">Total staff across all teams</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Total Patients</h2>
                <p className="text-3xl font-bold text-foreground mb-2">{patients.length}</p>
                <p className="text-sm text-muted-foreground">Active patients in the system</p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">Capacity Planning</h3>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                The system tracks capacity assumptions based on NHS band guidelines. Ensure caseload assignments stay within these thresholds for optimal patient care.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
