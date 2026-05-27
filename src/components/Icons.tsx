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
  brull: [
    "00000000",
    "01111110",
    "1rrrrrr1",
    "1r1rr1r1",
    "1rrrrrr1",
    "01rrrr10",
    "1r1001r1",
    "10000001"
  ],
  brullOscuro: [
    "00000000",
    "01111110",
    "1RRRRRR1",
    "1R1RR1R1",
    "1RRRRRR1",
    "01RRRR10",
    "1R1001R1",
    "10000001"
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
};

const PixelSprite = ({ spriteKey, className = '' }: { spriteKey: keyof typeof SPRITES, className?: string }) => {
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

export const getEntityIcon = (type: EntityType, isDead: boolean, name?: string) => {
  if (isDead) return <PixelSprite spriteKey="dead" className="opacity-70" />;
  switch (type) {
    case 'player': return <PixelSprite spriteKey="player" className="drop-shadow-[0_0_2px_rgba(59,130,246,0.8)] scale-[1.1] z-10 relative" />;
    case 'npc': return <PixelSprite spriteKey="npc" className="scale-[1.1] drop-shadow-[0_0_2px_rgba(168,85,247,0.5)] z-10 relative" />;
    case 'enemy': 
      const sKey = name?.includes('Oscuro') ? 'brullOscuro' : (name?.includes('Espectro') ? 'spectre' : (name?.includes('Paja') ? 'dummy' : 'brull'));
      return <PixelSprite spriteKey={sKey as any} className="drop-shadow-[0_0_4px_rgba(239,68,68,0.6)] z-10 relative" />;
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
    default: return <div className="w-full h-full bg-black" />;
  }
};
