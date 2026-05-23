import React from 'react';
import { Shield, Skull, Sword, Ghost, TreePine, Droplets, Zap } from 'lucide-react';
import { EntityType } from '../types';

export const getEntityIcon = (type: EntityType, isDead: boolean) => {
  if (isDead) return <Skull className="w-full h-full p-1 text-gray-500 opacity-50" />;
  switch (type) {
    case 'player': return <Shield className="w-full h-full p-1 text-blue-400" />;
    case 'npc': return <Zap className="w-full h-full p-1 text-purple-400" />;
    case 'enemy': return <Ghost className="w-full h-full p-1 text-red-500 drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]" />;
    default: return null;
  }
};

export const getTileVisual = (type: string) => {
  switch (type) {
    case 'wall': return <div className="w-full h-full bg-gray-800 border-[2px] border-gray-900 border-t-gray-700 border-l-gray-700" />;
    case 'floor': return <div className="w-full h-full bg-slate-900 border border-slate-800/30" />;
    case 'tree': return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
        <TreePine className="w-3/4 h-3/4 text-emerald-800 opacity-60 absolute" />
      </div>
    );
    case 'water': return (
      <div className="w-full h-full bg-blue-900/40 flex items-center justify-center">
        <Droplets className="w-1/2 h-1/2 text-blue-500 opacity-30" />
      </div>
    );
    default: return <div className="w-full h-full bg-black" />;
  }
};
