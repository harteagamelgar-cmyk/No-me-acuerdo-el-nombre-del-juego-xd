import React from 'react';
import { getTileVisualVal } from '../data/levels';
import { Entity, LevelDef } from '../types';
import { getEntityIcon, getTileVisual } from './Icons';

type GridProps = {
  level: LevelDef;
  player: Entity;
  npc: Entity;
  enemies: Entity[];
  items: Entity[];
};

export const GameGrid: React.FC<GridProps> = ({ level, player, npc, enemies, items }) => {
  const getCellContent = (x: number, y: number) => {
    // Entities
    if (player.x === x && player.y === y) return getEntityIcon(player.type, player.isDead, player.name);
    if (npc.x === x && npc.y === y) return getEntityIcon(npc.type, npc.isDead, npc.name);
    
    const enemyAt = enemies.find(e => e.x === x && e.y === y);
    if (enemyAt) return getEntityIcon(enemyAt.type, enemyAt.isDead, enemyAt.name);

    const itemAt = items.find(i => i.x === x && i.y === y && !i.isDead);
    if (itemAt) return getEntityIcon(itemAt.type, itemAt.isDead, itemAt.name);

    // Terrain
    const val = level.layout[y][x];
    return getTileVisual(getTileVisualVal(val));
  };

  const MAP_WIDTH = level.layout[0].length;
  const MAP_HEIGHT = level.layout.length;

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

