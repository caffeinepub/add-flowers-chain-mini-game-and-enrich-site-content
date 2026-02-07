import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useCurrentUser } from './hooks/useCurrentUser';
import AppLayout from './components/layout/AppLayout';
import ProfileAndRoleSetupModal from './components/auth/ProfileAndRoleSetupModal';
import HomePage from './pages/patient/HomePage';
import JournalPage from './pages/patient/JournalPage';
import TestsPage from './pages/patient/TestsPage';
import GrowthPage from './pages/patient/GrowthPage';
import ProfilePage from './pages/patient/ProfilePage';
import HomeCardDetailsPage from './pages/patient/HomeCardDetailsPage';
import TestFlowPage from './pages/patient/TestFlowPage';
import FlowersChainGamePage from './pages/patient/FlowersChainGamePage';
import DashboardPage from './pages/staff/DashboardPage';
import CaseloadPage from './pages/staff/CaseloadPage';
import StaffAssessmentsPage from './pages/staff/StaffAssessmentsPage';
import SchedulingPage from './pages/staff/SchedulingPage';
import TeamSetupPage from './pages/staff/TeamSetupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const journalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/journal',
  component: JournalPage,
});

const testsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tests',
  component: TestsPage,
});

const growthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/growth',
  component: GrowthPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const cardDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/details/$cardId',
  component: HomeCardDetailsPage,
});

const testFlowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test/$testId',
  component: TestFlowPage,
});

const flowersChainGameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game/flowers-chain',
  component: FlowersChainGamePage,
});

const staffDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/dashboard',
  component: () => (
    <ProtectedRoute requireStaff>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const staffCaseloadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/caseload',
  component: () => (
    <ProtectedRoute requireStaff>
      <CaseloadPage />
    </ProtectedRoute>
  ),
});

const staffAssessmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/assessments',
  component: () => (
    <ProtectedRoute requireStaff>
      <StaffAssessmentsPage />
    </ProtectedRoute>
  ),
});

const staffSchedulingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/scheduling',
  component: () => (
    <ProtectedRoute requireStaff>
      <SchedulingPage />
    </ProtectedRoute>
  ),
});

const staffTeamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/team',
  component: () => (
    <ProtectedRoute requireStaff>
      <TeamSetupPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  journalRoute,
  testsRoute,
  growthRoute,
  profileRoute,
  cardDetailsRoute,
  testFlowRoute,
  flowersChainGameRoute,
  staffDashboardRoute,
  staffCaseloadRoute,
  staffAssessmentsRoute,
  staffSchedulingRoute,
  staffTeamRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { userProfile, isLoading: profileLoading, isFetched } = useCurrentUser();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileAndRoleSetupModal />}
    </>
  );
}
