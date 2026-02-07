import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RotateCcw, Info, Sparkles } from 'lucide-react';
import SectionHeader from '../../components/patterns/SectionHeader';
import BreezeCard from '../../components/patterns/BreezeCard';
import BreezePrimaryButton from '../../components/patterns/BreezePrimaryButton';
import FlowersChainBoard from '../../components/game/flowers-chain/FlowersChainBoard';
import CalmingAudioControls from '../../components/game/flowers-chain/CalmingAudioControls';
import { useFlowersChainGame } from '../../components/game/flowers-chain/useFlowersChainGame';
import { useRotatingSnippet } from '../../components/game/flowers-chain/useRotatingSnippet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function FlowersChainGamePage() {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const { snippet } = useRotatingSnippet();

  const {
    board,
    score,
    movesLeft,
    gameOver,
    currentChain,
    startGame,
    restartGame,
    startChain,
    extendChain,
    endChain,
  } = useFlowersChainGame();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div
        className="relative h-48 md:h-64 overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/flowers-chain-bg.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onError={(e) => {
          e.currentTarget.style.background =
            'linear-gradient(135deg, oklch(0.95 0.05 320) 0%, oklch(0.90 0.06 340) 100%)';
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 px-4 py-2 bg-card/90 backdrop-blur rounded-full shadow-md hover:shadow-lg transition-all text-foreground font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Game Area */}
          <div>
            <SectionHeader
              title="Flowers Chain"
              subtitle="Match adjacent flowers to create calming chains"
              className="mb-6"
            />

            {/* Game Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{score}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{movesLeft}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Moves</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalmingAudioControls />
                <BreezePrimaryButton
                  onClick={restartGame}
                  icon={RotateCcw}
                  variant="outline"
                  size="sm"
                >
                  New Game
                </BreezePrimaryButton>
              </div>
            </div>

            {/* Game Board */}
            {!board ? (
              <BreezeCard className="text-center py-12">
                <div className="text-6xl mb-6">🌸</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Welcome to Flowers Chain
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  A calming puzzle game where you match adjacent flowers to create beautiful chains
                  and find your inner peace.
                </p>
                <BreezePrimaryButton onClick={startGame} size="lg">
                  Start Playing
                </BreezePrimaryButton>
              </BreezeCard>
            ) : gameOver ? (
              <BreezeCard
                className="text-center py-12"
                gradient="linear-gradient(135deg, oklch(0.95 0.05 320) 0%, oklch(0.90 0.06 340) 100%)"
              >
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-3xl font-bold text-foreground mb-4">Game Complete!</h3>
                <div className="text-5xl font-bold text-primary mb-6">{score}</div>
                <p className="text-lg text-muted-foreground mb-8">
                  {score >= 1000
                    ? 'Amazing! You created beautiful flower chains!'
                    : score >= 500
                      ? 'Well done! A peaceful performance!'
                      : 'Great effort! Try again for a higher score!'}
                </p>
                <BreezePrimaryButton onClick={restartGame} size="lg">
                  Play Again
                </BreezePrimaryButton>
              </BreezeCard>
            ) : (
              <FlowersChainBoard
                board={board}
                currentChain={currentChain}
                onTileClick={(row, col) => {
                  if (currentChain.length === 0) {
                    startChain(row, col);
                  } else {
                    extendChain(row, col);
                  }
                }}
                onChainEnd={endChain}
              />
            )}

            {/* How to Play */}
            <Collapsible open={showInstructions} onOpenChange={setShowInstructions} className="mt-6">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
                  <Info className="h-5 w-5" />
                  How to Play
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <BreezeCard className="mt-4">
                  <h4 className="font-bold text-foreground mb-3">Game Rules:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Click or tap a flower to start a chain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Select adjacent flowers of the same type (up, down, left, right)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Create chains of 3 or more flowers to score points</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Longer chains earn more points!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>You have 20 moves to create the highest score</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Click outside the chain or press the end button to complete it</span>
                    </li>
                  </ul>
                </BreezeCard>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Sidebar - Wellness Content */}
          <div className="space-y-6">
            <BreezeCard
              gradient="linear-gradient(135deg, oklch(0.95 0.03 140) 0%, oklch(0.92 0.04 120) 100%)"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h4 className="font-bold text-foreground">Moment of Calm</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{snippet}</p>
            </BreezeCard>

            <BreezeCard>
              <h4 className="font-bold text-foreground mb-3">Take Your Time</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                This game is designed to help you relax and unwind. There's no rush—enjoy the
                process of creating beautiful flower chains.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Take deep breaths between moves and let the calming music guide you to a peaceful
                state of mind.
              </p>
            </BreezeCard>
          </div>
        </div>
      </div>
    </div>
  );
}
