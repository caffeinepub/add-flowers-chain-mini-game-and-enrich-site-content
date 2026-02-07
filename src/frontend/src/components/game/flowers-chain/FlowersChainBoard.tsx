import { Tile } from './flowersChainLogic';
import FlowersChainTile from './FlowersChainTile';
import BreezePrimaryButton from '../../patterns/BreezePrimaryButton';
import { Check } from 'lucide-react';

interface FlowersChainBoardProps {
  board: Tile[][];
  currentChain: { row: number; col: number }[];
  onTileClick: (row: number, col: number) => void;
  onChainEnd: () => void;
}

export default function FlowersChainBoard({
  board,
  currentChain,
  onTileClick,
  onChainEnd,
}: FlowersChainBoardProps) {
  const isInChain = (row: number, col: number) => {
    return currentChain.some((pos) => pos.row === row && pos.col === col);
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-3xl p-4 md:p-6 shadow-soft">
        <div className="grid grid-cols-6 gap-2 md:gap-3 max-w-xl mx-auto">
          {board.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <FlowersChainTile
                key={`${rowIndex}-${colIndex}`}
                tile={tile}
                isSelected={isInChain(rowIndex, colIndex)}
                onClick={() => onTileClick(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>

      {currentChain.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{currentChain.length}</div>
            <div className="text-xs text-muted-foreground">Flowers Selected</div>
          </div>
          <BreezePrimaryButton
            onClick={onChainEnd}
            icon={Check}
            disabled={currentChain.length < 3}
            size="sm"
          >
            Complete Chain
          </BreezePrimaryButton>
        </div>
      )}
    </div>
  );
}
