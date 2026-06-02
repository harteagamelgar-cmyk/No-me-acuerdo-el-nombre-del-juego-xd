import React from 'react';
import { getTileVisualVal } from '../data/levels';
import { Entity, LevelDef, GameState } from '../types';
import { getEntityIcon, getTileVisual } from './Icons';
import { motion } from 'motion/react';

type GridProps = {
  level: LevelDef;
  mapLayout: number[][];
  player: Entity;
  npc: Entity;
  enemies: Entity[];
  items: Entity[];
  gameState: GameState;
};

export const GameGrid: React.FC<GridProps> = ({ level, mapLayout, player, npc, enemies, items, gameState }) => {
  const MAP_WIDTH = level.layout[0].length;
  const MAP_HEIGHT = level.layout.length;
  const layout = mapLayout && mapLayout.length > 0 ? mapLayout : level.layout;

  return (
    <div className="relative w-full mb-2 sm:mb-4 border-4 border-[var(--color-game-ui)] bg-black overflow-hidden isolate z-0">
      <div 
        className="grid w-full h-full"
        style={{ 
          gridTemplateColumns: `repeat(${MAP_WIDTH}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${MAP_HEIGHT}, minmax(0, 1fr))`,
          aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}`,
        }}
      >
        {Array.from({ length: MAP_HEIGHT }).map((_, y) => (
          Array.from({ length: MAP_WIDTH }).map((_, x) => (
            <div key={`terrain-${x}-${y}`} className="relative w-full h-full overflow-hidden flex items-center justify-center">
              {getTileVisual(getTileVisualVal(layout[y][x]))}
            </div>
          ))
        ))}
      </div>

      {items.map((item, idx) => {
        if (item.isDead) return null;
        return (
          <motion.div
            key={`item-${item.id || idx}`}
            className="absolute top-0 left-0 flex items-center justify-center z-10 pointer-events-none"
            initial={false}
            animate={{
              x: `${item.x * 100}%`,
              y: `${item.y * 100}%`,
              width: `${(1 / MAP_WIDTH) * 100}%`,
              height: `${(1 / MAP_HEIGHT) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {getEntityIcon(item.type, item.isDead, item.name)}
          </motion.div>
        );
      })}

      {enemies.map((enemy, idx) => (
        <motion.div
          key={`enemy-${enemy.id || idx}`}
          className="absolute top-0 left-0 flex items-center justify-center z-20 pointer-events-none"
          initial={false}
          animate={{
            x: `${enemy.x * 100}%`,
            y: `${enemy.y * 100}%`,
            width: `${(1 / MAP_WIDTH) * 100}%`,
            height: `${(1 / MAP_HEIGHT) * 100}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {getEntityIcon(enemy.type, enemy.isDead, enemy.name, (enemy.x + enemy.y) % 2 !== 0)}
        </motion.div>
      ))}

      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center z-30 pointer-events-none"
        initial={false}
        animate={{
          x: `${npc.x * 100}%`,
          y: `${npc.y * 100}%`,
          width: `${(1 / MAP_WIDTH) * 100}%`,
          height: `${(1 / MAP_HEIGHT) * 100}%`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {getEntityIcon(npc.type, npc.isDead, npc.name, (npc.x + npc.y) % 2 !== 0)}
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center z-40 pointer-events-none"
        initial={false}
        animate={{
          x: `${player.x * 100}%`,
          y: `${player.y * 100}%`,
          width: `${(1 / MAP_WIDTH) * 100}%`,
          height: `${(1 / MAP_HEIGHT) * 100}%`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {getEntityIcon(player.type, player.isDead, player.name, (player.x + player.y) % 2 !== 0)}
      </motion.div>

      {/* Dynamic Lighting per Level */}
      {level.id === 'cave' ? (
        <>
          <div className="absolute inset-0 pointer-events-none z-50 bg-[#020205] mix-blend-multiply opacity-95" />
          <motion.div 
            className="absolute inset-0 pointer-events-none z-50 mix-blend-screen"
            initial={false}
            animate={{
              background: `radial-gradient(circle at ${(player.x + 0.5) * (100 / MAP_WIDTH)}% ${(player.y + 0.5) * (100 / MAP_HEIGHT)}%, rgba(200,150,50,0.3) 0%, rgba(200,100,20,0.1) 15%, transparent 35%)`
            }}
          />
        </>
      ) : (
        <>
          <div className="absolute inset-0 pointer-events-none z-50 bg-[#050f2c] mix-blend-multiply opacity-80" />
          <div className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-tr from-transparent via-[#2d4b8e]/20 to-[#a3c2ff]/20 mix-blend-lighten" />
        </>
      )}

    </div>
  );
};


