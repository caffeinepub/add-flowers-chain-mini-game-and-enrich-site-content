import { useNavigate } from '@tanstack/react-router';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import SectionHeader from '../patterns/SectionHeader';
import BreezeCard from '../patterns/BreezeCard';
import BreezePrimaryButton from '../patterns/BreezePrimaryButton';
import LoginButton from '../auth/LoginButton';
import {
  useGetAllJournalEntries,
  useGetUserTestProgress,
} from '../../hooks/useQueries';

const journalPrompts = [
  'What made you smile today?',
  'What are you grateful for right now?',
  'What challenge did you overcome recently?',
  'What would make today great?',
  'How are you feeling in this moment?',
  'What lesson did you learn today?',
  'What are you looking forward to?',
];

const testData = [
  { id: 'personality-type', name: 'Personality Type' },
  { id: 'childhood-experience', name: 'Childhood Experience' },
  { id: 'love-language', name: 'Love Language' },
  { id: 'relationship-quiz', name: 'Relationship Quiz' },
  { id: 'self-care-quiz', name: 'Self-Care Quiz' },
];

export default function TodayPanel() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: entries = [] } = useGetAllJournalEntries();
  const { data: progress = [] } = useGetUserTestProgress();

  const todayPrompt = journalPrompts[new Date().getDay() % journalPrompts.length];

  const incompleteTests = testData.filter(
    (test) => !progress.find((p) => p.testId === test.id && p.completed)
  );
  const recommendedTest = incompleteTests[0];

  if (!identity) {
    return (
      <div className="mb-8">
        <SectionHeader icon={Sparkles} title="Today" className="mb-4" />
        <BreezeCard gradient="linear-gradient(135deg, oklch(0.98 0.02 60) 0%, oklch(0.95 0.04 80) 100%)">
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Start Your Wellness Journey
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Login to get personalized journal prompts, track your progress, and discover insights
              about yourself through our self-discovery tests.
            </p>
            <LoginButton />
          </div>
        </BreezeCard>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <SectionHeader icon={Sparkles} title="Today" subtitle="Your daily wellness check-in" />
      <div className="grid md:grid-cols-2 gap-6">
        {/* Journal Prompt */}
        <BreezeCard
          onClick={() => navigate({ to: '/journal', search: { prompt: 'true' } })}
          gradient="linear-gradient(135deg, oklch(0.95 0.03 280) 0%, oklch(0.92 0.04 260) 100%)"
          className="hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">Journal Prompt</h3>
              <p className="text-muted-foreground mb-4 italic">"{todayPrompt}"</p>
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                Write now <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </BreezeCard>

        {/* Recommended Test */}
        {recommendedTest ? (
          <BreezeCard
            onClick={() => navigate({ to: '/test/$testId', params: { testId: recommendedTest.id } })}
            gradient="linear-gradient(135deg, oklch(0.95 0.05 320) 0%, oklch(0.90 0.06 340) 100%)"
            className="hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Next Test</h3>
                <p className="text-muted-foreground mb-4">{recommendedTest.name}</p>
                <div className="flex items-center gap-2 text-accent text-sm font-medium">
                  Start test <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </BreezeCard>
        ) : (
          <BreezeCard gradient="linear-gradient(135deg, oklch(0.95 0.03 140) 0%, oklch(0.92 0.04 120) 100%)">
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-bold text-foreground mb-2">All Tests Complete!</h3>
              <p className="text-sm text-muted-foreground">
                You've completed all available tests. Check your Growth page to see your achievements!
              </p>
            </div>
          </BreezeCard>
        )}
      </div>
    </div>
  );
}
