import { TrendingUp, BookOpen, CheckCircle, Flame } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import SectionHeader from '../../components/patterns/SectionHeader';
import BreezeCard from '../../components/patterns/BreezeCard';
import EmptyState from '../../components/patterns/EmptyState';
import LoadingState from '../../components/patterns/LoadingState';
import AchievementsSection from '../../components/growth/AchievementsSection';
import LoginButton from '../../components/auth/LoginButton';
import { useGetUserGrowthSummary } from '../../hooks/useQueries';

export default function GrowthPage() {
  const { identity } = useInternetIdentity();
  const { data: growth, isLoading } = useGetUserGrowthSummary();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <SectionHeader icon={TrendingUp} title="Growth" subtitle="Track your wellness journey" />
        <EmptyState
          title="Login to Track Your Growth"
          description="Create an account to see your progress and celebrate your achievements."
          illustration="/assets/generated/breeze-blob-soft.dim_1200x1200.png"
          gradient="linear-gradient(135deg, oklch(0.95 0.03 140) 0%, oklch(0.92 0.04 120) 100%)"
        >
          <LoginButton />
        </EmptyState>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <SectionHeader icon={TrendingUp} title="Growth" subtitle="Track your wellness journey" />
        <LoadingState message="Loading your growth data..." />
      </div>
    );
  }

  const journalCount = Number(growth?.journalCount || 0);
  const completedTests = Number(growth?.completedTests || 0);
  const streak = Number(growth?.streak || 0);
  const overallProgress = Math.min(
    100,
    Math.round(((journalCount * 10 + completedTests * 20) / 100) * 100)
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <SectionHeader icon={TrendingUp} title="Growth" subtitle="Track your wellness journey" />

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BreezeCard gradient="linear-gradient(135deg, oklch(0.95 0.03 280) 0%, oklch(0.92 0.04 260) 100%)">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{journalCount}</p>
              <p className="text-sm text-muted-foreground">Journal Entries</p>
            </div>
          </div>
        </BreezeCard>

        <BreezeCard gradient="linear-gradient(135deg, oklch(0.95 0.05 320) 0%, oklch(0.90 0.06 340) 100%)">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{completedTests}</p>
              <p className="text-sm text-muted-foreground">Tests Completed</p>
            </div>
          </div>
        </BreezeCard>

        <BreezeCard gradient="linear-gradient(135deg, oklch(0.95 0.03 140) 0%, oklch(0.92 0.04 120) 100%)">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
              <Flame className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{streak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </BreezeCard>

        <BreezeCard gradient="linear-gradient(135deg, oklch(0.98 0.02 60) 0%, oklch(0.95 0.03 50) 100%)">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{overallProgress}%</p>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </div>
          </div>
        </BreezeCard>
      </div>

      {/* Achievements Section */}
      <AchievementsSection
        journalCount={journalCount}
        completedTests={completedTests}
        streak={streak}
      />
    </div>
  );
}
