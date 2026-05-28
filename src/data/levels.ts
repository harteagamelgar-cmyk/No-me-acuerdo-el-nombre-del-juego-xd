import { LevelDef, TileType, Entity } from '../types';

// Map legend:
// 0 = floor, 1 = wall, 2 = tree, 3 = water, 4 = path

const VILLAGE_LAYOUT = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,0,2,0,0,0,2,0,0,0,2,2,2],
  [2,0,1,1,2,0,0,0,0,0,0,0,0,0,2],
  [2,0,1,1,0,0,1,1,1,0,0,0,0,0,2],
  [2,0,4,4,4,4,4,1,1,0,0,0,0,2,2],
  [2,0,0,0,0,0,4,4,4,4,4,4,4,0,2],
  [2,0,1,1,0,0,0,0,0,0,0,0,4,0,2],
  [2,0,1,1,0,0,0,0,0,0,0,0,4,0,2],
  [2,2,4,4,4,4,4,4,0,0,0,2,2,2,2],
  [2,2,2,2,0,0,0,4,4,4,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

const FOREST_LAYOUT = [
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

const CAVE_LAYOUT = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,3,3,3,3,3,1,0,0,0,1],
  [1,0,1,0,1,3,1,1,1,3,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,0,1,0,1,0,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export const MAP_WIDTH = 15;
export const MAP_HEIGHT = 11;

export const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2,9)}`;

export const extractBasePlayer = (currentPlayer: Entity | null): Entity => {
  if (currentPlayer) {
    return { ...currentPlayer, isDead: false };
  }
  return {
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
    x: 0,
    y: 0,
    isDead: false
  };
};

export const LEVELS: LevelDef[] = [
  {
    id: 'village',
    name: 'Aldea de Camoris',
    layout: VILLAGE_LAYOUT,
    playerStart: { x: 3, y: 5 },
    npcStart: { x: 4, y: 5 },
    enemies: [
      { id: 'dummy', type: 'enemy', name: 'Muñeco de Paja', hp: 5, maxHp: 5, attack: 0, xpReward: 10, x: 10, y: 4, isDead: false }
    ],
    items: [],
    introDialogue: [
      { speaker: 'Emeo', text: 'Majestad, las tropas están listas.' },
      { speaker: 'Rey', text: 'Emeo, guerrero de Camoris. Los Brull avanzan. Debes ir al bosque de Dumur y hallar la semilla de prisma.' },
      { speaker: 'Emeo', text: 'Entendido. Dhalia me acompañará.' },
      { speaker: 'Dhalia', text: 'Así es. Pero antes de irnos, destruye ese muñeco de paja con tus ataques [Pulsa A o choca con él].' }
    ],
    winDialogue: [
      { speaker: 'Dhalia', text: 'Bien hecho. Estás listo.' },
      { speaker: 'Emeo', text: '¡Hacia el Bosque de Dumur!' }
    ]
  },
  {
    id: 'forest',
    name: 'Bosque de Dumur',
    layout: FOREST_LAYOUT,
    playerStart: { x: 2, y: 5 },
    npcStart: { x: 2, y: 6 },
    enemies: [
      { id: 'e1', type: 'enemy', name: 'Brull', hp: 8, maxHp: 8, attack: 2, xpReward: 10, x: 8, y: 3, isDead: false },
      { id: 'e2', type: 'enemy', name: 'Brull Oscuro', hp: 15, maxHp: 15, attack: 4, xpReward: 25, x: 11, y: 7, isDead: false },
      { id: 'e3', type: 'enemy', name: 'Brull', hp: 8, maxHp: 8, attack: 2, xpReward: 10, x: 7, y: 8, isDead: false },
      { id: 'e4', type: 'enemy', name: 'Espectro Brull', hp: 10, maxHp: 10, attack: 3, xpReward: 15, x: 5, y: 2, isDead: false }
    ],
    items: [
      { id: 'i1', type: 'item', name: 'Poción Menor', hp: 0, maxHp: 0, attack: 0, x: 4, y: 8, isDead: false, itemType: 'potion' },
      { id: 'i2', type: 'item', name: 'Poción Menor', hp: 0, maxHp: 0, attack: 0, x: 12, y: 1, isDead: false, itemType: 'potion' }
    ],
    introDialogue: [
      { speaker: 'Emeo', text: 'El Bosque de Dumur... aquí debe estar oculta.' },
      { speaker: 'Dhalia', text: 'Atento. La magia de los antiguos dragones es inestable. Siento a los Brull.' },
      { speaker: 'Emeo', text: '¡Que vengan! Pueden probar el filo de mi espada, o tu magia [Botón B].' }
    ],
    winDialogue: [
      { speaker: 'Emeo', text: 'El área está despejada.' },
      { speaker: 'Dhalia', text: 'Los Brull eran solo la vanguardia. El bosque es más profundo de lo que pensé...' },
      { speaker: 'Emeo', text: 'Mira esa entrada oculta... una cueva.' },
      { speaker: 'Dhalia', text: 'Vamos, la presencia es más fuerte allí abajo.' }
    ]
  },
  {
    id: 'cave',
    name: 'Cueva de los Secretos',
    layout: CAVE_LAYOUT,
    playerStart: { x: 7, y: 9 },
    npcStart: { x: 8, y: 9 },
    enemies: [
      { id: 'c1', type: 'enemy', name: 'Murciélago', hp: 12, maxHp: 12, attack: 3, xpReward: 15, x: 2, y: 1, isDead: false },
      { id: 'c2', type: 'enemy', name: 'Lobo Cavernario', hp: 20, maxHp: 20, attack: 5, xpReward: 30, x: 12, y: 1, isDead: false },
      { id: 'c3', type: 'enemy', name: 'Murciélago', hp: 12, maxHp: 12, attack: 3, xpReward: 15, x: 12, y: 7, isDead: false },
      { id: 'c4', type: 'enemy', name: 'Golem Brull', hp: 30, maxHp: 30, attack: 7, xpReward: 50, x: 7, y: 3, isDead: false }
    ],
    items: [
      { id: 'i3', type: 'item', name: 'Poción Mayor', hp: 0, maxHp: 0, attack: 0, x: 7, y: 1, isDead: false, itemType: 'potion' }
    ],
    introDialogue: [
      { speaker: 'Emeo', text: 'Está muy oscuro aquí.' },
      { speaker: 'Dhalia', text: 'Cuidado, hay monstruos fuertes adelante. ¡Prepárate!' }
    ],
    winDialogue: [
      { speaker: 'Emeo', text: 'Hemos vencido a la bestia de la cueva.' },
      { speaker: 'Dhalia', text: 'Allí está, Emeo. La Semilla de Prisma brilla en el pedestal.' },
      { speaker: 'Emeo', text: 'Lo hemos logrado. Volvamos a la aldea.' },
      { speaker: 'Sistema', text: '[FIN DE LA DEMO]' }
    ]
  }
];

export const getTileVisualVal = (val: number): TileType => {
  switch (val) {
    case 1: return 'wall';
    case 2: return 'tree';
    case 3: return 'water';
    case 4: return 'path';
    case 0:
    default:
      return 'floor';
  }
};

export const getTile = (mapLayout: number[][], x: number, y: number): TileType => {
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return 'wall';
  const val = mapLayout[y][x];
  return getTileVisualVal(val);
};

export const isSolid = (mapLayout: number[][], x: number, y: number): boolean => {
  const tile = getTile(mapLayout, x, y);
  return tile === 'wall' || tile === 'tree' || tile === 'water';
};
