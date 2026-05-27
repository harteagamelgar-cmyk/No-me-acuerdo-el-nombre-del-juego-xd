import { TileType, Entity } from '../types';

// 1 = wall, 0 = floor, 2 = tree, 3 = water
const layout = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,0,0,0,1,1,0,0,0,2,2,2,1],
  [1,2,0,0,0,0,0,0,0,0,0,0,0,2,1],
  [1,0,0,0,1,1,0,0,1,1,0,0,0,1,1],
  [1,0,0,1,1,1,0,0,1,1,1,0,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,0,1,0,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,2,0,0,0,0,0,0,0,0,0,2,2,0,1],
  [1,2,2,2,0,0,0,0,0,0,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export const MAP_WIDTH = layout[0].length;
export const MAP_HEIGHT = layout.length;

export const getTile = (x: number, y: number): TileType => {
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return 'wall';
  const val = layout[y][x];
  switch (val) {
    case 1: return 'wall';
    case 2: return 'tree';
    case 3: return 'water';
    default: return 'floor';
  }
};

export const isSolid = (x: number, y: number): boolean => {
  const tile = getTile(x, y);
  return tile === 'wall' || tile === 'tree' || tile === 'water';
};

export const INITIAL_PLAYER: Entity = {
  id: 'p1',
  type: 'player',
  name: 'Emeo',
  hp: 25,
  maxHp: 25,
  mp: 10,
  maxMp: 10,
  xp: 0,
  level: 1,
  attack: 4,
  x: 2,
  y: 5,
  isDead: false
};

export const INITIAL_NPC: Entity = {
  id: 'npc1',
  type: 'npc',
  name: 'Dhalia',
  hp: 15,
  maxHp: 15,
  attack: 8,
  x: 2,
  y: 6,
  isDead: false
};

export const INITIAL_ENEMIES: Entity[] = [
  { id: 'e1', type: 'enemy', name: 'Brull', hp: 8, maxHp: 8, attack: 2, xp: 10, x: 8, y: 3, isDead: false },
  { id: 'e2', type: 'enemy', name: 'Brull Oscuro', hp: 15, maxHp: 15, attack: 4, xp: 25, x: 11, y: 7, isDead: false },
  { id: 'e3', type: 'enemy', name: 'Brull', hp: 8, maxHp: 8, attack: 2, xp: 10, x: 7, y: 8, isDead: false },
  { id: 'e4', type: 'enemy', name: 'Espectro Brull', hp: 10, maxHp: 10, attack: 3, xp: 15, x: 5, y: 2, isDead: false }
];

export const INITIAL_ITEMS: Entity[] = [
  { id: 'i1', type: 'item', name: 'Poción Menor', hp: 0, maxHp: 0, attack: 0, x: 4, y: 8, isDead: false, itemType: 'potion' },
  { id: 'i2', type: 'item', name: 'Poción Menor', hp: 0, maxHp: 0, attack: 0, x: 12, y: 1, isDead: false, itemType: 'potion' }
];
