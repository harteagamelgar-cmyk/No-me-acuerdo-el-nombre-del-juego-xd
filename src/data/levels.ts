import { LevelDef, TileType, Entity } from '../types';

// Map legend:
// 0 = floor, 1 = wall, 2 = tree, 3 = water, 4 = path
// 9 = houseWall, 10 = houseRoof, 11 = woodFloor

const VILLAGE_LAYOUT = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,10,10,10,0,2,2,4,2,2,10,10,10,0,2],
  [2,9,11,9,0,2,2,4,2,2,9,11,9,6,2],
  [2,9,11,9,0,0,0,4,0,0,9,11,9,0,2],
  [2,9,11,9,4,4,4,7,4,4,9,11,9,0,2],
  [2,0,4,0,4,0,0,4,0,0,0,4,0,0,2],
  [2,2,0,0,4,4,4,4,4,4,4,8,0,0,2],
  [2,2,2,0,0,4,2,2,2,4,0,0,0,3,2],
  [2,2,2,2,0,4,2,2,2,4,4,4,3,3,2],
  [2,2,2,2,0,4,4,4,4,4,2,2,3,3,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

const FOREST_LAYOUT = [
  [2,2,2,2,2,2,2,4,2,2,2,2,2,2,2],
  [2,0,0,0,0,1,0,4,0,1,0,0,0,0,2],
  [2,0,2,2,0,2,5,4,5,2,0,2,2,0,2],
  [2,3,3,3,0,1,0,0,0,1,0,3,3,3,2],
  [2,3,0,0,0,2,2,6,2,2,0,0,0,3,2],
  [2,0,0,5,0,0,0,0,0,0,0,5,0,0,2],
  [2,0,2,2,2,6,2,4,2,6,2,2,2,0,2],
  [2,0,0,0,0,0,2,4,2,0,0,0,0,0,2],
  [2,2,2,2,2,0,5,0,5,0,2,2,2,2,2],
  [2,2,2,2,2,0,0,0,0,0,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

const CAVE_LAYOUT = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,5,3,3,1,0,1,3,3,5,0,0,1],
  [1,1,0,1,1,3,1,0,1,3,1,1,0,1,1],
  [1,0,0,0,5,0,0,0,0,0,5,0,0,0,1],
  [1,0,1,1,1,1,1,5,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
  [1,0,5,0,0,0,0,0,0,0,5,0,0,0,1],
  [1,0,1,1,1,1,0,0,0,1,1,1,1,0,1],
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
      { id: 'dummy', type: 'enemy', name: 'Muñeco de Paja', hp: 5, maxHp: 5, attack: 0, xpReward: 10, x: 9, y: 5, isDead: false },
      { id: 'aldeano1', type: 'npc', name: 'Aldeano', hp: 10, maxHp: 10, attack: 0, xpReward: 0, x: 6, y: 5, isDead: false },
      { id: 'anciano', type: 'npc', name: 'Anciano Mayor', hp: 10, maxHp: 10, attack: 0, xpReward: 0, x: 11, y: 3, isDead: false }
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
    playerStart: { x: 7, y: 8 },
    npcStart: { x: 7, y: 9 },
    enemies: [
      { id: 'e1', type: 'enemy', name: 'Brull', hp: 8, maxHp: 8, attack: 2, xpReward: 10, x: 2, y: 5, isDead: false },
      { id: 'e2', type: 'enemy', name: 'Brull', hp: 8, maxHp: 8, attack: 2, xpReward: 10, x: 12, y: 5, isDead: false },
      { id: 'e3', type: 'enemy', name: 'Espectro Brull', hp: 10, maxHp: 10, attack: 3, xpReward: 15, x: 4, y: 1, isDead: false },
      { id: 'e4', type: 'enemy', name: 'Brull Oscuro', hp: 15, maxHp: 15, attack: 4, xpReward: 25, x: 10, y: 1, isDead: false }
    ],
    items: [
      { id: 'i1', type: 'item', name: 'Poción Menor', hp: 0, maxHp: 0, attack: 0, x: 1, y: 6, isDead: false, itemType: 'potion' },
      { id: 'i2', type: 'item', name: 'Poción Menor', hp: 0, maxHp: 0, attack: 0, x: 13, y: 6, isDead: false, itemType: 'potion' }
    ],
    introDialogue: [
      { speaker: 'Emeo', text: 'El Bosque de Dumur... aquí debe estar oculta.' },
      { speaker: 'Dhalia', text: 'Atento. La magia de los antiguos dragones es inestable. Siento a los Brull.' },
      { speaker: 'Emeo', text: '¡Que vengan! Pueden probar el filo de mi espada, o tu magia [Botón B].' },
      { speaker: 'Dhalia', text: 'El camino tiene rocas y árboles secos. Empuja rocas o quema árboles con mi magia [Botón B]. Si una roca te estorba mucho, puedes romperla con tu espada [Espacio], pero te lastimarás.' }
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
    case 5: return 'rock';
    case 6: return 'bush';
    case 7: return 'well';
    case 8: return 'sign';
    case 9: return 'houseWall';
    case 10: return 'houseRoof';
    case 11: return 'woodFloor';
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
  return tile === 'wall' || tile === 'tree' || tile === 'water' || tile === 'rock' || tile === 'bush' || tile === 'well' || tile === 'sign' || tile === 'houseWall' || tile === 'houseRoof';
};
