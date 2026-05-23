import React from 'react';
import { MAP_WIDTH, MAP_HEIGHT, getTile } from '../data/map';
import { Entity } from '../types';
import { getEntityIcon, getTileVisual } from './Icons';

type GridProps = {
  player: Entity;
  npc: Entity;
  enemies: Entity[];
};

export const GameGrid: React.FC<GridProps> = ({ player, npc, enemies }) => {
  const getCellContent = (x: number, y: number) => {
    // Entities
    if (player.x === x && player.y === y) return getEntityIcon(player.type, player.isDead);
    if (npc.x === x && npc.y === y) return getEntityIcon(npc.type, npc.isDead);
    
    const enemyAt = enemies.find(e => e.x === x && e.y === y);
    if (enemyAt) return getEntityIcon(enemyAt.type, enemyAt.isDead);

    // Terrain
    return getTileVisual(getTile(x, y));
  };

  return (
    <div 
      className="grid mb-2 sm:mb-4 border-4 border-[var(--color-game-ui)] bg-black w-full"
      style={{ 
        gridTemplateColumns: `repeat(${MAP_WIDTH}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${MAP_HEIGHT}, minmax(0, 1fr))`,
        aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}`,
      }}
    >
      {Array.from({ length: MAP_HEIGHT }).map((_, y) => (
        Array.from({ length: MAP_WIDTH }).map((_, x) => (
          <div key={`${x}-${y}`} className="relative w-full h-full overflow-hidden flex items-center justify-center">
            {getCellContent(x, y)}
          </div>
        ))
      ))}
    </div>
  );
};
