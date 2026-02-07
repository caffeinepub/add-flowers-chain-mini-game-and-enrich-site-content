import type { Appointment } from '../../backend';
import { Calendar, MapPin, User, Stethoscope } from 'lucide-react';

interface AppointmentListProps {
  appointments: Appointment[];
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
  const formatDateTime = (timeNs: bigint) => {
    const date = new Date(Number(timeNs / BigInt(1_000_000)));
    return {
      date: date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
    <div className="space-y-3">
      {appointments.map((appointment, idx) => {
        const { date, time } = formatDateTime(appointment.time);
        return (
          <div
            key={idx}
            className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {appointment.isConsultant ? (
                  <Stethoscope className="h-5 w-5 text-rose-600" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
                <span className="font-semibold text-foreground">
                  {appointment.isConsultant ? 'Consultant Appointment' : 'Therapy Session'}
                </span>
              </div>
              {appointment.isConsultant && (
                <span className="text-xs bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 px-2 py-1 rounded">
                  15 min
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {date} at {time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{appointment.location}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
