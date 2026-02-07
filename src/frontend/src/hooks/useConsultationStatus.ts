import { useInternetIdentity } from './useInternetIdentity';
import { useGetPatient, useGetAppointments } from './useQueries';

export type ConsultationStatus = 'not-started' | 'requested' | 'scheduled' | 'completed';

export function useConsultationStatus() {
  const { identity } = useInternetIdentity();
  const patientPrincipal = identity?.getPrincipal();
  
  const { data: patient, isLoading: patientLoading } = useGetPatient(patientPrincipal);
  const { data: appointments = [], isLoading: appointmentsLoading } = useGetAppointments(patientPrincipal);

  const isLoading = patientLoading || appointmentsLoading;

  if (isLoading || !patientPrincipal) {
    return { status: 'not-started' as ConsultationStatus, isLoading };
  }

  if (!patient) {
    return { status: 'not-started' as ConsultationStatus, isLoading: false };
  }

  const consultationAppointments = appointments.filter(apt => !apt.isConsultant);
  
  if (consultationAppointments.length === 0) {
    return { status: 'requested' as ConsultationStatus, isLoading: false };
  }

  const now = BigInt(Date.now()) * BigInt(1_000_000);
  const hasCompletedConsultation = consultationAppointments.some(apt => apt.time < now);

  if (hasCompletedConsultation) {
    return { status: 'completed' as ConsultationStatus, isLoading: false };
  }

  return { status: 'scheduled' as ConsultationStatus, isLoading: false };
}
