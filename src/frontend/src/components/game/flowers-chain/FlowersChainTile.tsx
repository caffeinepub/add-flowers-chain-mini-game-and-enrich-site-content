import { Tile } from './flowersChainLogic';

interface FlowersChainTileProps {
  tile: Tile;
  isSelected: boolean;
  onClick: () => void;
}

const flowerEmojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '🏵️'];

export default function FlowersChainTile({ tile, isSelected, onClick }: FlowersChainTileProps) {
  return (
    <button
      onClick={onClick}
      className={`aspect-square rounded-2xl transition-all duration-200 flex items-center justify-center text-3xl md:text-4xl ${
        isSelected
          ? 'bg-primary/20 scale-110 shadow-lg ring-2 ring-primary'
          : 'bg-card hover:bg-muted/50 hover:scale-105 shadow-sm hover:shadow-md'
      }`}
      aria-label={`Flower type ${tile.type}`}
    >
      {flowerEmojis[tile.type]}
    </button>
  );
}
