import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Patient, Assessment, ProgrammePlan, Appointment, CommunityActivity, NoticeboardPost, JournalEntry, TestData, TestProgress, Affirmation } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useOnboardPatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conditionSummary, goals }: { conditionSummary: string; goals: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.onboardPatient(conditionSummary, goals);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient'] });
    },
  });
}

export function useGetPatient(patientPrincipal?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Patient | null>({
    queryKey: ['patient', patientPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !patientPrincipal) return null;
      return actor.getPatient(patientPrincipal);
    },
    enabled: !!actor && !actorFetching && !!patientPrincipal,
  });
}

export function useGetAppointments(patientPrincipal?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Appointment[]>({
    queryKey: ['appointments', patientPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !patientPrincipal) return [];
      return actor.getAppointmentsForPatient(patientPrincipal);
    },
    enabled: !!actor && !actorFetching && !!patientPrincipal,
  });
}

export function useBookAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientPrincipal,
      staff,
      location,
      time,
      isConsultant,
    }: {
      patientPrincipal: Principal;
      staff: Principal;
      location: string;
      time: bigint;
      isConsultant: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookAppointment(patientPrincipal, staff, location, time, isConsultant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useGetAssessments(patientPrincipal?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Assessment[]>({
    queryKey: ['assessments', patientPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !patientPrincipal) return [];
      return actor.getAssessmentsForPatient(patientPrincipal);
    },
    enabled: !!actor && !actorFetching && !!patientPrincipal,
  });
}

export function useAddAssessment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patient,
      vitalObservations,
      hadScore,
      meamsScore,
      shuttleWalkScore,
      copmScore,
      assessmentDate,
      videoRecord,
    }: {
      patient: Principal;
      vitalObservations: string;
      hadScore: bigint;
      meamsScore: bigint;
      shuttleWalkScore: bigint;
      copmScore: bigint;
      assessmentDate: bigint;
      videoRecord: any;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAssessment(
        patient,
        vitalObservations,
        hadScore,
        meamsScore,
        shuttleWalkScore,
        copmScore,
        assessmentDate,
        videoRecord
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
}

export function useGetProgrammePlans(patientPrincipal?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProgrammePlan[]>({
    queryKey: ['programmePlans', patientPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !patientPrincipal) return [];
      return actor.getProgrammePlansForPatient(patientPrincipal);
    },
    enabled: !!actor && !actorFetching && !!patientPrincipal,
  });
}

export function useCreateProgrammePlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patient,
      interventions,
      frequency,
    }: {
      patient: Principal;
      interventions: string[];
      frequency: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProgrammePlan(patient, interventions, frequency);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programmePlans'] });
    },
  });
}

export function useUpdateProgrammePlanStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patient, isCompleted }: { patient: Principal; isCompleted: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProgrammePlanStatus(patient, isCompleted);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programmePlans'] });
    },
  });
}

export function useGetAllCommunityActivities() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CommunityActivity[]>({
    queryKey: ['communityActivities'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCommunityActivities();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddCommunityActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, location, description }: { name: string; location: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCommunityActivity(name, location, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityActivities'] });
    },
  });
}

export function useGetAllNoticeboardPosts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NoticeboardPost[]>({
    queryKey: ['noticeboardPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNoticeboardPosts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddNoticeboardPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNoticeboardPost(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['noticeboardPosts'] });
    },
  });
}

export function useDischargePatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patientPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.dischargePatient(patientPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient'] });
    },
  });
}

export function useGetAllUsersSortedByName() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsersSortedByName();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Alias for backward compatibility
export const useGetAllUsers = useGetAllUsersSortedByName;

// Journal Queries

export function useGetAllJournalEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JournalEntry[]>({
    queryKey: ['journalEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJournalEntries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateJournalEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content }: { title: string | null; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createJournalEntry(title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['growthSummary'] });
    },
  });
}

export function useDeleteJournalEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJournalEntry(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['growthSummary'] });
    },
  });
}

// Tests Queries

export function useGetAllTests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TestData[]>({
    queryKey: ['tests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetUserTestProgress() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TestProgress[]>({
    queryKey: ['testProgress'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserTestProgress();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useStartTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startTest(testId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testProgress'] });
    },
  });
}

export function useCompleteTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ testId, answers }: { testId: string; answers: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeTest(testId, answers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testProgress'] });
      queryClient.invalidateQueries({ queryKey: ['growthSummary'] });
    },
  });
}

// Affirmation Queries

export function useGetRandomAffirmation() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Affirmation | null>({
    queryKey: ['randomAffirmation'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRandomAffirmation();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Growth Summary

export function useGetUserGrowthSummary() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ journalCount: bigint; completedTests: bigint; streak: bigint }>({
    queryKey: ['growthSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserGrowthSummary();
    },
    enabled: !!actor && !actorFetching,
  });
}
