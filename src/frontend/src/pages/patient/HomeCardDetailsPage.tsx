import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import BreezeCard from '../../components/patterns/BreezeCard';
import BreezePrimaryButton from '../../components/patterns/BreezePrimaryButton';

const cardContent: Record<string, { title: string; description: string; details: string }> = {
  betterhelp: {
    title: 'Unlock a Happier You',
    description: 'Your safe space for healing, accessible anywhere, anytime.',
    details:
      'This is a wellness opportunity designed to support your mental health journey. Connect with resources and tools that help you grow and thrive. Remember, taking care of your mental health is a sign of strength.',
  },
  game: {
    title: 'Flowers Chain',
    description: 'Music and flowers for your relaxation',
    details:
      'Immerse yourself in a calming experience with soothing music and beautiful flower animations. This relaxation game is designed to help you unwind and find peace in your day.',
  },
  specialist: {
    title: 'Find a Specialist',
    description: 'Connect with professionals who understand',
    details:
      'Finding the right specialist can make all the difference. Whether you\'re dealing with family issues, relationships, or personal challenges, we can help you connect with someone who understands your unique situation.',
  },
};

export default function HomeCardDetailsPage() {
  const navigate = useNavigate();
  const { cardId } = useParams({ from: '/details/$cardId' });
  const content = cardContent[cardId] || cardContent.betterhelp;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Home
      </button>

      <BreezeCard gradient="linear-gradient(135deg, oklch(0.95 0.03 140) 0%, oklch(0.92 0.04 120) 100%)">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {cardId === 'game' ? '🌸' : cardId === 'specialist' ? '☁️' : '🌿'}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4 text-center">{content.title}</h1>
        <p className="text-lg text-muted-foreground mb-6 text-center">{content.description}</p>
        <p className="text-foreground leading-relaxed mb-8">{content.details}</p>
        <div className="flex justify-center">
          <BreezePrimaryButton onClick={() => navigate({ to: '/' })}>
            Back to Home
          </BreezePrimaryButton>
        </div>
      </BreezeCard>
    </div>
  );
}
