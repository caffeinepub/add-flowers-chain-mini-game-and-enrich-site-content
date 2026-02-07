import { useState } from 'react';
import { useGetAllUsers, useBookAppointment } from '../../hooks/useQueries';
import { UserRole } from '../../backend';
import { Principal } from '@dfinity/principal';
import { Clock, AlertCircle } from 'lucide-react';

export default function ConsultantSlotPicker() {
  const { data: users = [] } = useGetAllUsers();
  const bookAppointment = useBookAppointment();

  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [location, setLocation] = useState('');

  const patients = users.filter(u => u.role === UserRole.user);
  const staff = users.filter(u => u.role === UserRole.admin);

  // Generate 15-minute slots for Wednesday ward round (e.g., 2-4 PM)
  const generateSlots = () => {
    const slots: string[] = [];
    const startHour = 14; // 2 PM
    const endHour = 16; // 4 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const slots = generateSlots();

  const handleBookSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !selectedStaff || !selectedDate || !selectedSlot) return;

    try {
      const dateTime = new Date(`${selectedDate}T${selectedSlot}`);
      const timeNs = BigInt(dateTime.getTime()) * BigInt(1_000_000);

      await bookAppointment.mutateAsync({
        patientPrincipal: Principal.fromText(selectedPatient),
        staff: Principal.fromText(selectedStaff),
        location: location || 'Consultant Room',
        time: timeNs,
        isConsultant: true,
      });

      setSelectedPatient('');
      setSelectedSlot('');
      setLocation('');
    } catch (err) {
      console.error('Failed to book consultant slot:', err);
    }
  };

  // Get next Wednesday
  const getNextWednesday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilWednesday = (3 - dayOfWeek + 7) % 7 || 7;
    const nextWednesday = new Date(today);
    nextWednesday.setDate(today.getDate() + daysUntilWednesday);
    return nextWednesday.toISOString().split('T')[0];
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Consultant Ward Round</h2>
      </div>

      <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-teal-900 dark:text-teal-200">
          <p className="font-medium mb-1">Wednesday Ward Round: 2:00 PM - 4:00 PM</p>
          <p className="text-teal-800 dark:text-teal-300">
            Book 15-minute consultant slots for patients. Slots are limited and cannot overlap.
          </p>
        </div>
      </div>

      <form onSubmit={handleBookSlot} className="space-y-4">
        <div>
          <label htmlFor="cons-patient" className="block text-sm font-medium text-foreground mb-2">
            Patient *
          </label>
          <select
            id="cons-patient"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
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
          <label htmlFor="cons-staff" className="block text-sm font-medium text-foreground mb-2">
            Staff Member *
          </label>
          <select
            id="cons-staff"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
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
          <label htmlFor="cons-date" className="block text-sm font-medium text-foreground mb-2">
            Wednesday Date *
          </label>
          <input
            id="cons-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getNextWednesday()}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Available 15-Minute Slots *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  selectedSlot === slot
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-input hover:border-primary/50'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="cons-location" className="block text-sm font-medium text-foreground mb-2">
            Location
          </label>
          <input
            id="cons-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Consultant Room (default)"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={bookAppointment.isPending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {bookAppointment.isPending ? 'Booking Slot...' : 'Book Consultant Slot'}
        </button>
      </form>
    </div>
  );
}
