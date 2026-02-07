import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserProfile } from './useQueries';
import { UserRole } from '../backend';

export function useCurrentUser() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isStaff = userProfile?.role === UserRole.admin;
  const isPatient = userProfile?.role === UserRole.user && !isStaff;

  return {
    userProfile,
    isLoading,
    isFetched,
    isAuthenticated,
    isStaff,
    isPatient,
  };
}
