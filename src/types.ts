export type Position = {
  x: number;
  y: number;
};

export type EntityType = 'player' | 'enemy' | 'npc';

export type Entity = {
  id: string;
  type: EntityType;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  x: number;
  y: number;
  isDead: boolean;
};

export type TileType = 'floor' | 'wall' | 'tree' | 'water' | 'chest';

export type DialogueLine = {
  speaker: string;
  text: string;
};

export type GameState = 'START_SCREEN' | 'DIALOGUE' | 'PLAYING' | 'GAME_OVER' | 'VICTORY';
