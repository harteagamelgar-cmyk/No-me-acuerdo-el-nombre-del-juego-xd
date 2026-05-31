import React from 'react';
import { EntityType } from '../types';

// Pixel Art Definitions (8x8)
const SPRITES = {
  player: [
    "01111100",
    "1bbbb100",
    "1bsse110",
    "1bbbb1v1",
    "01bb11v1",
    "1h1b11v1",
    "01bbbb10",
    "01b11b10"
  ],
  npc: [
    "00111100",
    "01mmmm10",
    "1mmsms11",
    "1mseee10",
    "01mmmm10",
    "01m11m10",
    "1mm11mm1",
    "01m11m10"
  ],
  villager: [
    "01111100",
    "1LLLL100",
    "1Lsse110",
    "1Lss1100",
    "01TTTT10",
    "01T11T10",
    "01LLLL10",
    "01L11L10"
  ],
  elder: [
    "01111100",
    "1eeee100",
    "1esse110",
    "1eeee100",
    "01mmmm10",
    "01m11m10",
    "01mmmm10",
    "01m11m10"
  ],
  brull: [
    "00111100",
    "01RrrR10",
    "1Ry11yR1",
    "1RrrrrR1",
    "01111110",
    "1rRRRRr1",
    "1R1001R1",
    "01000010"
  ],
  brullOscuro: [
    "00111100",
    "01XBBX10",
    "1Xr11rX1",
    "1XBBBBX1",
    "01111110",
    "1BXXXXB1",
    "1X1001X1",
    "01000010"
  ],
  spectre: [
    "00111100",
    "01p11p10",
    "1pppppp1",
    "11p11p11",
    "10100101",
    "00100100",
    "00000000",
    "00000000"
  ],
  potion: [
    "00011000",
    "001ee100",
    "01eee100",
    "01g1g100",
    "1gggg100",
    "1gggg100",
    "01111000",
    "00000000"
  ],
  tree: [
    "00111000",
    "01tTtt10",
    "1ttTtT10",
    "1TtttT10",
    "01tTt100",
    "001c1000",
    "011c1100",
    "00000000"
  ],
  wall: [
    "1W111111",
    "WWWW1WWW",
    "111WWW11",
    "W1WWWWW1",
    "WWW111WW",
    "111WWW11",
    "WW1WWWW1",
    "11111111"
  ],
  floor: [
    "00000000",
    "00f00000",
    "00000F00",
    "0000000f",
    "0f000000",
    "0000f000",
    "00F00000",
    "00000000"
  ],
  water: [
    "w00w000w",
    "0w00w000",
    "00w00w00",
    "000w00w0",
    "w000w000",
    "0w000w00",
    "00w000w0",
    "000w000w"
  ],
  dead: [
    "00000000",
    "00011000",
    "001DD100",
    "01D11D10",
    "01DDDD10",
    "01DDDD10",
    "01111110",
    "00000000"
  ],
  dummy: [
    "00011000",
    "001ss100",
    "001cc100",
    "011cc110",
    "001cc100",
    "001cc100",
    "01100110",
    "11000011"
  ],
  rock: [
    "00000000",
    "00011100",
    "0011DD10",
    "01k1DD10",
    "01kkDD11",
    "0111kDD1",
    "00011110",
    "00000000"
  ],
  bush: [
    "00000000",
    "00011000",
    "011uu110",
    "1UuuuuU1",
    "1UuuuuU1",
    "011UU110",
    "00011000",
    "00000000"
  ],
  well: [
    "00000000",
    "00LZZL00",
    "00LnnL00",
    "0LnnnnL0",
    "0LkkkkL0",
    "00kDDk00",
    "00000000",
    "00000000"
  ],
  sign: [
    "00000000",
    "00000000",
    "00LnnL00",
    "0LnnnnL0",
    "0LnnnnL0",
    "000L0000",
    "000L0000",
    "00000000"
  ],
  houseRoof: [
    "KKKKKKKK",
    "1JJJJJJ1",
    "11JJJJ11",
    "KKKKKKKK",
    "1JJJJJJ1",
    "11JJJJ11",
    "KKKKKKKK",
    "1JJJJJJ1"
  ],
  houseWall: [
    "LLLLLLLL",
    "HGHGHGHG",
    "GHGHGHGH",
    "HGHGHGHG",
    "GHGHGHGH",
    "HGHGHGHG",
    "LLLLLLLL",
    "KKKKKKKK"
  ],
  woodFloor: [
    "nnnnnnnn",
    "nLnLnLnL",
    "LnnnnnnL",
    "nnnnnnnn",
    "LnLnLnLn",
    "LnnnnnnL",
    "nnnnnnnn",
    "nLnLnLnL"
  ],
  swordIcon: [
    "000000vv",
    "00000v1v",
    "0000vv00",
    "000vv000",
    "00vv0000",
    "0Ev00000",
    "E0E00000",
    "0E000000"
  ],
  shieldIcon: [
    "ssssssss",
    "slhhlhhs",
    "slllllls",
    "slhhlhhs",
    "0shllhs0",
    "00shhs00",
    "000ss000",
    "00000000"
  ]
};

const COLORS: Record<string, string> = {
  '1': '#000000', // Black outline / crevice
  'b': '#3b82f6', // blue armor
  's': '#fcd34d', // skin
  'e': '#ffffff', // eye / glass
  'v': '#e2e8f0', // sword bright
  'h': '#64748b', // shield
  'm': '#a855f7', // mage purple
  'r': '#ef4444', // red brull
  'R': '#7f1d1d', // dark red brull
  'y': '#fef08a', // yellow eye brull
  'X': '#111827', // darker grey brullOscuro
  'B': '#374151', // lighter grey brullOscuro
  'p': '#10b981', // green spectre
  'g': '#4ade80', // potion green
  't': '#064e3b', // tree dark green
  'T': '#047857', // tree light green
  'c': '#d97706', // straw orange
  'W': '#334155', // stone brick
  'f': '#0f172a', // floor dark
  'F': '#1e293b', // floor light
  'w': '#3b82f6', // water wave
  'D': '#94a3b8', // Tombstone
  'k': '#4b5563', // rock
  'u': '#65a30d', // bush base
  'U': '#4d7c0f', // bush shade
  'L': '#78350f', // dark wood outline
  'Z': '#d97706', // roof for well
  'n': '#b45309', // wood inner
  'H': '#f8fafc', // House wall light
  'G': '#cbd5e1', // House wall shade
  'J': '#ea580c', // Roof tile
  'K': '#c2410c', // Roof shade
};

export const PixelSprite = ({ spriteKey, className = '' }: { spriteKey: keyof typeof SPRITES, className?: string }) => {
  const data = SPRITES[spriteKey];
  return (
    <svg 
      viewBox="-1 -1 10 10" 
      className={`w-full h-full ${className}`} 
      style={{ shapeRendering: 'crispEdges' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {data.map((row, y) => 
        row.split('').map((char, x) => 
          char !== '0' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={COLORS[char]} /> : null
        )
      )}
    </svg>
  );
};

export const getEntityIcon = (type: EntityType, isDead: boolean, name?: string, stepParity?: boolean) => {
  if (isDead) return <PixelSprite spriteKey="dead" className="opacity-70" />;
  const parityClass = stepParity ? 'scale-x-[-1] translate-y-[-2px]' : 'scale-x-100 translate-y-0';
  
  switch (type) {
    case 'player': return (
      <div className="animate-char-idle absolute inset-0 flex items-center justify-center z-10" style={{animationDelay: '0s'}}>
        <PixelSprite spriteKey="player" className={`drop-shadow-[0_0_2px_rgba(59,130,246,0.8)] scale-[1.1] relative transition-transform duration-150 ${parityClass}`} />
      </div>
    );
    case 'npc': 
      let npcKey = 'npc';
      if (name?.includes('Aldeano')) npcKey = 'villager';
      else if (name?.includes('Anciano')) npcKey = 'elder';
      return (
        <div className="animate-char-idle absolute inset-0 flex items-center justify-center z-10" style={{animationDelay: '0.2s'}}>
          <PixelSprite spriteKey={npcKey as any} className={`scale-[1.1] drop-shadow-[0_0_2px_rgba(168,85,247,0.5)] relative transition-transform duration-150 ${parityClass}`} />
        </div>
      );
    case 'enemy': 
      const sKey = name?.includes('Oscuro') ? 'brullOscuro' : (name?.includes('Espectro') ? 'spectre' : (name?.includes('Paja') ? 'dummy' : 'brull'));
      return (
        <div className="animate-enemy-float absolute inset-0 flex items-center justify-center z-10" style={{animationDelay: '0.5s'}}>
          <PixelSprite spriteKey={sKey as any} className={`drop-shadow-[0_0_4px_rgba(239,68,68,0.6)] relative transition-transform duration-150 ${parityClass}`} />
        </div>
      );
    case 'item': return <PixelSprite spriteKey="potion" className="drop-shadow-[0_0_4px_rgba(74,222,128,0.8)] animate-bounce z-10 relative" />;
    default: return null;
  }
};

export const getTileVisual = (type: string) => {
  switch (type) {
    case 'wall': return (
      <div className="w-full h-full bg-[#0f172a]">
        <PixelSprite spriteKey="wall" className="scale-[1.25]" />
      </div>
    );
    case 'floor': return (
      <div className="w-full h-full bg-[#020617]">
        <PixelSprite spriteKey="floor" className="scale-[1.25]" />
      </div>
    );
    case 'path': return (
      <div className="w-full h-full bg-[#27272a]">
        <PixelSprite spriteKey="floor" className="scale-[1.25] opacity-50 sepia mix-blend-screen" />
      </div>
    );
    case 'tree': return (
      <div className="w-full h-full bg-[#020617] relative">
        <PixelSprite spriteKey="floor" className="absolute inset-0 scale-[1.25]" />
        <PixelSprite spriteKey="tree" className="absolute inset-0 scale-[1.6] origin-bottom drop-shadow-[0_4px_2px_rgba(0,0,0,0.8)] z-20" />
      </div>
    );
    case 'water': return (
      <div className="w-full h-full bg-[#1e3a8a] relative">
        <PixelSprite spriteKey="water" className="absolute inset-0 scale-[1.25] opacity-60 animate-pulse" />
      </div>
    );
    case 'rock': return (
      <div className="w-full h-full bg-[#020617] relative">
        <PixelSprite spriteKey="floor" className="absolute inset-0 scale-[1.25]" />
        <PixelSprite spriteKey="rock" className="absolute inset-0 scale-[1.4] drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)] z-10" />
      </div>
    );
    case 'bush': return (
      <div className="w-full h-full bg-[#020617] relative">
        <PixelSprite spriteKey="floor" className="absolute inset-0 scale-[1.25]" />
        <PixelSprite spriteKey="bush" className="absolute inset-0 scale-[1.5] drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)] z-10" />
      </div>
    );
    case 'well': return (
      <div className="w-full h-full bg-[#020617] relative">
        <PixelSprite spriteKey="floor" className="absolute inset-0 scale-[1.25]" />
        <PixelSprite spriteKey="well" className="absolute inset-0 scale-[1.5] drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)] z-10" />
      </div>
    );
    case 'sign': return (
      <div className="w-full h-full bg-[#020617] relative">
        <PixelSprite spriteKey="floor" className="absolute inset-0 scale-[1.25]" />
        <PixelSprite spriteKey="sign" className="absolute inset-0 scale-[1.5] drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)] z-10" />
      </div>
    );
    case 'houseWall': return (
      <div className="w-full h-full bg-[#0f172a] relative">
        <PixelSprite spriteKey="houseWall" className="absolute inset-0 scale-[1.25]" />
      </div>
    );
    case 'houseRoof': return (
      <div className="w-full h-full bg-[#7f1d1d] relative z-20">
        <PixelSprite spriteKey="houseRoof" className="absolute inset-0 scale-[1.25]" />
      </div>
    );
    case 'woodFloor': return (
      <div className="w-full h-full bg-[#451a03] relative">
        <PixelSprite spriteKey="woodFloor" className="absolute inset-0 scale-[1.25]" />
      </div>
    );
    default: return <div className="w-full h-full bg-black" />;
  }
};
