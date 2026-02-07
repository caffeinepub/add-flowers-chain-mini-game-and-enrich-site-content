import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle, TrendingUp } from 'lucide-react';
import BreezeCard from '../../components/patterns/BreezeCard';
import BreezePrimaryButton from '../../components/patterns/BreezePrimaryButton';
import LoadingState from '../../components/patterns/LoadingState';
import { useStartTest, useCompleteTest, useGetUserTestProgress } from '../../hooks/useQueries';
import { useToast } from '../../components/patterns/ToastProvider';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Progress } from '../../components/ui/progress';

const testData: Record<string, { name: string; questions: string[] }> = {
  'personality-type': {
    name: 'Personality Type',
    questions: [
      'Do you prefer spending time alone or with others?',
      'Are you more practical or imaginative?',
      'Do you make decisions based on logic or feelings?',
    ],
  },
  'childhood-experience': {
    name: 'Childhood Experience',
    questions: [
      'How would you describe your childhood home environment?',
      'What was your relationship like with your primary caregiver?',
      'How did you typically handle conflicts as a child?',
    ],
  },
  'love-language': {
    name: 'Love Language',
    questions: [
      'How do you prefer to receive affection?',
      'What makes you feel most loved?',
      'How do you typically show love to others?',
    ],
  },
  'relationship-quiz': {
    name: 'Relationship Quiz',
    questions: ['What do you value most in a relationship?', 'How do you handle disagreements?'],
  },
  'self-care-quiz': {
    name: 'Self-Care Quiz',
    questions: ['How often do you take time for yourself?', 'What activities help you relax?'],
  },
};

export default function TestFlowPage() {
  const navigate = useNavigate();
  const { testId } = useParams({ from: '/test/$testId' });
  const { showToast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const { data: progress = [], isLoading: progressLoading } = useGetUserTestProgress();
  const startMutation = useStartTest();
  const completeMutation = useCompleteTest();

  const test = testData[testId];
  const testProgress = progress.find((p) => p.testId === testId);
  const isCompleted = testProgress?.completed || false;
  const progressPercentage = test ? ((currentQuestion + 1) / test.questions.length) * 100 : 0;

  if (!test) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
        <BreezeCard>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Test not found</p>
            <BreezePrimaryButton onClick={() => navigate({ to: '/tests' })} className="mt-4">
              Back to Tests
            </BreezePrimaryButton>
          </div>
        </BreezeCard>
      </div>
    );
  }

  const handleStart = async () => {
    try {
      await startMutation.mutateAsync(testId);
      setCurrentQuestion(0);
      setAnswers([]);
    } catch (error: any) {
      if (error.message?.includes('already started')) {
        setCurrentQuestion(0);
        setAnswers([]);
      } else {
        showToast('Failed to start test', 'error');
      }
    }
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) {
      showToast('Please select an answer', 'error');
      return;
    }

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete(newAnswers);
    }
  };

  const handleComplete = async (finalAnswers: string[]) => {
    setIsCompleting(true);
    try {
      await completeMutation.mutateAsync({ testId, answers: finalAnswers });
      showToast('Test completed successfully!');
    } catch (error) {
      showToast('Failed to complete test', 'error');
      setIsCompleting(false);
    }
  };

  if (progressLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
        <LoadingState message="Loading test..." />
      </div>
    );
  }

  if (isCompleted || isCompleting) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
        <BreezeCard gradient="linear-gradient(135deg, oklch(0.95 0.03 140) 0%, oklch(0.92 0.04 120) 100%)">
          <div className="text-center py-8">
            <CheckCircle className="h-20 w-20 text-primary mx-auto mb-6 animate-in zoom-in duration-500" />
            <h2 className="text-3xl font-bold text-foreground mb-3">Test Completed!</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Great job completing the {test.name} test! Your results have been saved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BreezePrimaryButton
                onClick={() => navigate({ to: '/tests' })}
                variant="secondary"
                className="hover:scale-105 active:scale-95"
              >
                Back to Tests
              </BreezePrimaryButton>
              <BreezePrimaryButton
                onClick={() => navigate({ to: '/growth' })}
                icon={TrendingUp}
                className="hover:scale-105 active:scale-95"
              >
                View Growth
              </BreezePrimaryButton>
            </div>
          </div>
        </BreezeCard>
      </div>
    );
  }

  if (!testProgress && currentQuestion === 0 && answers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
        <button
          onClick={() => navigate({ to: '/tests' })}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Tests
        </button>

        <BreezeCard gradient="linear-gradient(135deg, oklch(0.95 0.03 280) 0%, oklch(0.92 0.04 260) 100%)">
          <div className="text-center py-8">
            <div className="text-6xl mb-6">🌟</div>
            <h2 className="text-3xl font-bold text-foreground mb-3">{test.name}</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Ready to discover more about yourself? This test has {test.questions.length} questions.
            </p>
            <BreezePrimaryButton
              onClick={handleStart}
              disabled={startMutation.isPending}
              className="hover:scale-105 active:scale-95"
            >
              {startMutation.isPending ? 'Starting...' : 'Start Test'}
            </BreezePrimaryButton>
          </div>
        </BreezeCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
      <button
        onClick={() => navigate({ to: '/tests' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Tests
      </button>

      <BreezeCard>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-foreground">{test.name}</h2>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {test.questions.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-foreground mb-6">{test.questions[currentQuestion]}</h3>

          <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
            <div className="space-y-3">
              {['Option A', 'Option B', 'Option C', 'Option D'].map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 p-4 rounded-2xl border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setCurrentAnswer(option)}
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <BreezePrimaryButton
          onClick={handleNext}
          disabled={!currentAnswer || completeMutation.isPending}
          className="w-full hover:scale-[1.02] active:scale-95"
        >
          {currentQuestion < test.questions.length - 1 ? 'Next Question' : 'Complete Test'}
        </BreezePrimaryButton>
      </BreezeCard>
    </div>
  );
}
