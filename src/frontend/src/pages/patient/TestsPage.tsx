import { useNavigate } from '@tanstack/react-router';
import { Heart, Sparkles, Gift } from 'lucide-react';
import SectionHeader from '../../components/patterns/SectionHeader';
import BreezeCard from '../../components/patterns/BreezeCard';
import BreezePrimaryButton from '../../components/patterns/BreezePrimaryButton';
import LoadingState from '../../components/patterns/LoadingState';
import { useGetAllTests, useGetUserTestProgress } from '../../hooks/useQueries';
import { Progress } from '../../components/ui/progress';

export default function TestsPage() {
  const navigate = useNavigate();
  const { data: tests = [], isLoading: testsLoading } = useGetAllTests();
  const { data: progress = [], isLoading: progressLoading } = useGetUserTestProgress();

  const completedCount = progress.filter((p) => p.completed).length;
  const totalQuestTests = 3;
  const questProgress = (completedCount / totalQuestTests) * 100;

  const testResults = [
    {
      id: 'personality-type',
      name: 'Personality Type',
      image: '/assets/generated/breeze-illustration-test-personality.dim_512x512.png',
    },
    {
      id: 'childhood-experience',
      name: 'Childhood Experience',
      image: '/assets/generated/breeze-illustration-test-childhood.dim_512x512.png',
    },
    {
      id: 'love-language',
      name: 'Love Language',
      image: '/assets/generated/breeze-illustration-quiz-relationship.dim_512x512.png',
    },
  ];

  const upliftingQuizzes = [
    {
      id: 'relationship-quiz',
      name: 'Relationship Quiz',
      image: '/assets/generated/breeze-illustration-quiz-relationship.dim_512x512.png',
    },
    {
      id: 'self-care-quiz',
      name: 'Self-Care Quiz',
      image: '/assets/generated/breeze-illustration-test-personality.dim_512x512.png',
    },
  ];

  if (testsLoading || progressLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <LoadingState message="Loading tests..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      {/* Quest Card */}
      <BreezeCard
        className="mb-8"
        gradient="linear-gradient(135deg, oklch(0.98 0.02 60) 0%, oklch(0.95 0.03 50) 100%)"
      >
        <div className="flex items-start gap-4">
          <div className="text-6xl">☁️</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">Self-discovery quest</h2>
            <p className="text-muted-foreground mb-4">
              Take 3 tests to unlock a reward and better understand yourself
            </p>
            <div className="flex items-center gap-3 mb-4">
              <Progress value={questProgress} className="flex-1" />
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {completedCount}/{totalQuestTests}
              </span>
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <BreezePrimaryButton
              onClick={() => {
                const nextTest = testResults.find(
                  (test) => !progress.find((p) => p.testId === test.id && p.completed)
                );
                if (nextTest) {
                  navigate({ to: '/test/$testId', params: { testId: nextTest.id } });
                }
              }}
              variant="secondary"
              className="hover:scale-105 active:scale-95"
            >
              Start Now
            </BreezePrimaryButton>
          </div>
        </div>
      </BreezeCard>

      {/* Test Results */}
      <SectionHeader
        icon={Heart}
        title="Test Results"
        subtitle={`${progress.filter((p) => p.completed).length}/${tests.length} completed`}
      />
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {testResults.map((test) => {
          const testProgress = progress.find((p) => p.testId === test.id);
          const isCompleted = testProgress?.completed || false;

          return (
            <BreezeCard
              key={test.id}
              onClick={() => navigate({ to: '/test/$testId', params: { testId: test.id } })}
              className="text-center hover:scale-[1.02] transition-transform"
            >
              <div
                className="w-full h-40 rounded-2xl mb-4 bg-cover bg-center"
                style={{ backgroundImage: `url(${test.image})` }}
                onError={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, oklch(0.95 0.03 280) 0%, oklch(0.92 0.04 260) 100%)';
                }}
              />
              <h3 className="text-lg font-bold text-foreground mb-2">{test.name}</h3>
              {isCompleted && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  Completed ✓
                </span>
              )}
            </BreezeCard>
          );
        })}
      </div>

      {/* Uplifting Quizzes */}
      <SectionHeader
        icon={Sparkles}
        title="Uplifting Quizzes"
        subtitle={`${progress.filter((p) => p.completed && upliftingQuizzes.some((q) => q.id === p.testId)).length}/${upliftingQuizzes.length} completed`}
      />
      <div className="grid md:grid-cols-2 gap-6">
        {upliftingQuizzes.map((quiz) => {
          const quizProgress = progress.find((p) => p.testId === quiz.id);
          const isCompleted = quizProgress?.completed || false;

          return (
            <BreezeCard
              key={quiz.id}
              onClick={() => navigate({ to: '/test/$testId', params: { testId: quiz.id } })}
              className="text-center hover:scale-[1.02] transition-transform"
            >
              <div
                className="w-full h-48 rounded-2xl mb-4 bg-cover bg-center"
                style={{ backgroundImage: `url(${quiz.image})` }}
                onError={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, oklch(0.95 0.05 320) 0%, oklch(0.90 0.06 340) 100%)';
                }}
              />
              <h3 className="text-lg font-bold text-foreground mb-2">{quiz.name}</h3>
              {isCompleted && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  Completed ✓
                </span>
              )}
            </BreezeCard>
          );
        })}
      </div>
    </div>
  );
}
