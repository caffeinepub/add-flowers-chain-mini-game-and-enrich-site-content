import { Award, BookOpen, CheckCircle, Flame, Sparkles } from 'lucide-react';
import SectionHeader from '../patterns/SectionHeader';
import BreezeCard from '../patterns/BreezeCard';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocked: boolean;
  condition: string;
}

interface AchievementsSectionProps {
  journalCount: number;
  completedTests: number;
  streak: number;
}

export default function AchievementsSection({
  journalCount,
  completedTests,
  streak,
}: AchievementsSectionProps) {
  const achievements: Achievement[] = [
    {
      id: 'first-journal',
      title: 'First Steps',
      description: 'Created your first journal entry',
      icon: BookOpen,
      unlocked: journalCount >= 1,
      condition: 'Write 1 journal entry',
    },
    {
      id: 'journal-3',
      title: 'Reflective Mind',
      description: 'Created 3 journal entries',
      icon: BookOpen,
      unlocked: journalCount >= 3,
      condition: 'Write 3 journal entries',
    },
    {
      id: 'first-test',
      title: 'Self-Discovery',
      description: 'Completed your first test',
      icon: CheckCircle,
      unlocked: completedTests >= 1,
      condition: 'Complete 1 test',
    },
    {
      id: 'test-3',
      title: 'Quest Master',
      description: 'Completed 3 tests',
      icon: Award,
      unlocked: completedTests >= 3,
      condition: 'Complete 3 tests',
    },
    {
      id: 'streak-7',
      title: 'Consistency Champion',
      description: 'Maintained a 7-day journal streak',
      icon: Flame,
      unlocked: streak >= 7,
      condition: 'Journal for 7 consecutive days',
    },
    {
      id: 'journal-10',
      title: 'Prolific Writer',
      description: 'Created 10 journal entries',
      icon: Sparkles,
      unlocked: journalCount >= 10,
      condition: 'Write 10 journal entries',
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      <SectionHeader
        icon={Award}
        title="Achievements"
        subtitle={`${unlockedCount}/${achievements.length} unlocked`}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <BreezeCard
              key={achievement.id}
              className={`transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-primary/10 to-accent/10'
                  : 'opacity-60 grayscale'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                    {achievement.title}
                    {achievement.unlocked && <span className="text-primary">✓</span>}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                  {!achievement.unlocked && (
                    <p className="text-xs text-muted-foreground italic">{achievement.condition}</p>
                  )}
                </div>
              </div>
            </BreezeCard>
          );
        })}
      </div>
    </div>
  );
}
