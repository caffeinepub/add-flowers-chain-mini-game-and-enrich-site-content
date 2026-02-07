import { useNavigate } from '@tanstack/react-router';
import { Lightbulb, Briefcase, Share2 } from 'lucide-react';
import SectionHeader from '../../components/patterns/SectionHeader';
import BreezeCard from '../../components/patterns/BreezeCard';
import BreezePrimaryButton from '../../components/patterns/BreezePrimaryButton';
import TodayPanel from '../../components/home/TodayPanel';
import LoadingState from '../../components/patterns/LoadingState';
import { useGetRandomAffirmation } from '../../hooks/useQueries';
import { useToast } from '../../components/patterns/ToastProvider';

export default function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: affirmation, isLoading: affirmationLoading } = useGetRandomAffirmation();

  const handleShare = async () => {
    if (affirmation) {
      try {
        await navigator.clipboard.writeText(affirmation.text);
        showToast('Affirmation copied to clipboard!');
      } catch (error) {
        showToast('Failed to copy affirmation', 'error');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      {/* Header Ribbon */}
      <div
        className="relative h-32 md:h-40 rounded-3xl mb-8 overflow-hidden shadow-soft"
        style={{
          backgroundImage: 'url(/assets/generated/breeze-header-ribbon.dim_1400x240.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onError={(e) => {
          e.currentTarget.style.background =
            'linear-gradient(135deg, oklch(0.95 0.05 320) 0%, oklch(0.90 0.06 340) 100%)';
        }}
      />

      {/* Today Panel */}
      <TodayPanel />

      {/* Daily Affirmation */}
      <SectionHeader icon={Lightbulb} title="Daily Affirmation" className="mb-4" />
      <BreezeCard
        className="mb-8"
        gradient="linear-gradient(135deg, oklch(0.95 0.02 240) 0%, oklch(0.92 0.03 220) 100%)"
      >
        {affirmationLoading ? (
          <LoadingState message="Loading your affirmation..." />
        ) : affirmation ? (
          <>
            <p className="text-lg md:text-xl font-medium text-foreground mb-6 leading-relaxed">
              {affirmation.text}
            </p>
            {affirmation.author && (
              <p className="text-sm text-muted-foreground mb-6">— {affirmation.author}</p>
            )}
            <BreezePrimaryButton onClick={handleShare} icon={Share2} variant="outline">
              Share
            </BreezePrimaryButton>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">💭</div>
            <p className="text-muted-foreground">No affirmation available today.</p>
          </div>
        )}
      </BreezeCard>

      {/* Opportunities */}
      <SectionHeader icon={Briefcase} title="Opportunities" className="mb-4" />
      <BreezeCard
        className="mb-8"
        gradient="linear-gradient(135deg, oklch(0.95 0.03 140) 0%, oklch(0.92 0.04 120) 100%)"
        badge="Sponsored"
        badgeColor="bg-primary/20 text-primary"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
            <div className="text-4xl">🌿</div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3 text-center">Unlock a Happier You</h3>
        <p className="text-muted-foreground mb-6 text-center leading-relaxed">
          Your safe space for healing, accessible anywhere, anytime.
        </p>
        <div className="flex justify-center">
          <BreezePrimaryButton
            onClick={() => navigate({ to: '/details/$cardId', params: { cardId: 'betterhelp' } })}
          >
            Explore BetterHelp →
          </BreezePrimaryButton>
        </div>
      </BreezeCard>

      {/* Promo Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <BreezeCard
          onClick={() => navigate({ to: '/game/flowers-chain' })}
          gradient="linear-gradient(135deg, oklch(0.95 0.05 320) 0%, oklch(0.90 0.06 340) 100%)"
          className="hover:scale-[1.02] transition-transform"
        >
          <div className="text-center">
            <div className="text-5xl mb-4">🌸</div>
            <h3 className="text-xl font-bold text-foreground mb-2">GAME FOR YOU</h3>
            <p className="text-lg font-semibold text-primary mb-2">Flowers Chain</p>
            <p className="text-sm text-muted-foreground">Music and flowers for your relaxation</p>
          </div>
        </BreezeCard>

        <BreezeCard
          onClick={() => navigate({ to: '/details/$cardId', params: { cardId: 'specialist' } })}
          gradient="linear-gradient(135deg, oklch(0.95 0.03 200) 0%, oklch(0.90 0.04 220) 100%)"
          className="hover:scale-[1.02] transition-transform"
        >
          <div className="text-center">
            <div className="text-5xl mb-4">☁️</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Find a Specialist</h3>
            <p className="text-sm text-muted-foreground mt-4">
              what's been weighing on you?
              <br />
              <span className="text-lg font-semibold text-primary italic">My parents</span>
            </p>
          </div>
        </BreezeCard>
      </div>
    </div>
  );
}
