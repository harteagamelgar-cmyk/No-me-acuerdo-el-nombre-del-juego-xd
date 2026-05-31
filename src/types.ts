export type Position = {
  x: number;
  y: number;
};

export type EntityType = 'player' | 'enemy' | 'npc' | 'item';

export type Entity = {
  id: string;
  type: EntityType;
  name: string;
  hp: number;
  maxHp: number;
  mp?: number;
  maxMp?: number;
  xp?: number;
  level?: number;
  attack: number;
  x: number;
  y: number;
  isDead: boolean;
  itemType?: 'potion' | 'key';
  xpReward?: number;
};

export type TileType = 'floor' | 'wall' | 'tree' | 'water' | 'chest' | 'path' | 'rock' | 'bush' | 'well' | 'sign' | 'houseWall' | 'houseRoof' | 'woodFloor';

export type DialogueOption = {
  label: string;
  response: DialogueLine[];
};

export type DialogueLine = {
  speaker: string;
  text: string;
  options?: DialogueOption[];
};

export type GameState = 'STUDIO_LOGO' | 'MAIN_MENU' | 'CONFIG' | 'CREDITS' | 'INTRO_SCROLL' | 'DIALOGUE' | 'PLAYING' | 'GAME_OVER' | 'VICTORY';

export type LevelDef = {
  id: string;
  name: string;
  layout: number[][];
  playerStart: Position;
  npcStart: Position | null;
  enemies: Entity[];
  items: Entity[];
  introDialogue: DialogueLine[];
  winDialogue: DialogueLine[];
};

