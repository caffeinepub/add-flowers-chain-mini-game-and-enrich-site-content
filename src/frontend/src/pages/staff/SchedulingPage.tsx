import { useState } from 'react';
import { useGetAllUsers, useBookAppointment } from '../../hooks/useQueries';
import { UserRole } from '../../backend';
import { Principal } from '@dfinity/principal';
import ConsultantSlotPicker from '../../components/scheduling/ConsultantSlotPicker';
import { Calendar } from 'lucide-react';

export default function SchedulingPage() {
  const { data: users = [] } = useGetAllUsers();
  const bookAppointment = useBookAppointment();

  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isConsultant, setIsConsultant] = useState(false);

  const patients = users.filter(u => u.role === UserRole.user);
  const staff = users.filter(u => u.role === UserRole.admin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !selectedStaff) return;

    try {
      const dateTime = new Date(`${date}T${time}`);
      const timeNs = BigInt(dateTime.getTime()) * BigInt(1_000_000);

      await bookAppointment.mutateAsync({
        patientPrincipal: Principal.fromText(selectedPatient),
        staff: Principal.fromText(selectedStaff),
        location,
        time: timeNs,
        isConsultant,
      });

      setSelectedPatient('');
      setLocation('');
      setDate('');
      setTime('');
      setIsConsultant(false);
    } catch (err) {
      console.error('Failed to book appointment:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Scheduling</h1>
            <p className="text-muted-foreground">Manage patient appointments</p>
          </div>
        </div>

        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Book Appointment</h2>

            <div>
              <label htmlFor="patient" className="block text-sm font-medium text-foreground mb-2">
                Patient *
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
              <label htmlFor="staff" className="block text-sm font-medium text-foreground mb-2">
                Staff Member *
              </label>
              <select
                id="staff"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                required
              >
                <option value="">Choose a staff member...</option>
                {staff.map((member, idx) => (
                  <option key={idx} value={idx.toString()}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                Location *
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                placeholder="e.g., Manchester Leisure Centre"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                  Date *
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
                  Time *
                </label>
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="consultant"
                type="checkbox"
                checked={isConsultant}
                onChange={(e) => setIsConsultant(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="consultant" className="text-sm text-foreground">
                Consultant appointment (15-minute slot)
              </label>
            </div>

            <button
              type="submit"
              disabled={bookAppointment.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {bookAppointment.isPending ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>

          <ConsultantSlotPicker />
        </div>
      </div>
    </div>
  );
}
