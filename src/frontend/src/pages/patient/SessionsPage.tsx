import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetAppointments } from '../../hooks/useQueries';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function SessionsPage() {
  const { identity } = useInternetIdentity();
  const patientPrincipal = identity?.getPrincipal();
  const { data: appointments = [], isLoading } = useGetAppointments(patientPrincipal);

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Sessions</h1>
          <p className="text-muted-foreground mb-6">Please log in to view your scheduled sessions.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Your Sessions</h1>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedAppointments = [...appointments].sort((a, b) => Number(a.time - b.time));

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Sessions</h1>
        <p className="text-muted-foreground mb-8">View and manage your upcoming therapy sessions.</p>

        {sortedAppointments.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Sessions Scheduled</h2>
            <p className="text-muted-foreground mb-6">
              Please <Link to="/" className="underline font-medium">visit your home page</Link> to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAppointments.map((appointment, index) => {
              const appointmentDate = new Date(Number(appointment.time) / 1000000);
              const isConsultant = appointment.isConsultant;

              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isConsultant ? 'bg-teal-100 dark:bg-teal-900/20' : 'bg-primary/10'}`}>
                        <Calendar className={`h-6 w-6 ${isConsultant ? 'text-teal-600 dark:text-teal-400' : 'text-primary'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {isConsultant ? 'Consultant Appointment' : 'Therapy Session'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isConsultant ? 'Ward Round' : 'Individual Session'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {appointmentDate.toLocaleDateString('en-GB', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        {' at '}
                        {appointmentDate.toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{appointment.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Staff ID: {appointment.staff.toString().slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
