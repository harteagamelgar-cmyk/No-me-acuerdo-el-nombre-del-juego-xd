import React from 'react';
import { useGame } from './hooks/useGame';
import { GameGrid } from './components/GameGrid';

export default function App() {
  const {
    gameState,
    player,
    enemies,
    npc,
    currentDialogueLine,
    messageLogs,
    startGame,
    nextDialogue,
    movePlayer
  } = useGame();

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-retro text-[8px] sm:text-xs crt pixel-art bg-[var(--color-game-bg)] select-none touch-none">
      <div className="w-full max-w-2xl min-h-screen sm:min-h-0 sm:h-auto bg-neutral-900 sm:border-8 border-neutral-700 p-2 pt-6 sm:p-6 sm:rounded-xl flex flex-col items-center relative z-10 shadow-2xl overflow-y-auto overflow-x-hidden">
        
        {/* HEADER / HUD */}
        <div className="w-full flex justify-between items-end mb-2 sm:mb-4 border-b-2 border-[var(--color-game-ui)] pb-2 text-[var(--color-game-ui)] uppercase tracking-wider text-[8px] sm:text-xs px-1">
          <div>HP: {player.hp}/{player.maxHp}</div>
          <div className="text-center font-bold">Resonancia Estelar</div>
          <div className="text-right">BRULL: {enemies.filter(e => !e.isDead).length}</div>
        </div>

        {/* MAIN GAME VIEW */}
        <div className="relative w-full aspect-[15/11]">
          {gameState === 'START_SCREEN' && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-blue-900 text-center p-4 sm:p-8">
              <h1 className="text-xl sm:text-3xl text-blue-500 mb-4 sm:mb-6 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] leading-relaxed">REBIRTH<br/>OF KNIGHT</h1>
              <p className="text-[8px] sm:text-[10px] text-gray-300 mb-6 sm:mb-8 max-w-[400px] leading-relaxed text-center">
                El bosque de Dumur guarda los secretos del pasado y la magia de los dragones. Los Brull han surgido...
              </p>
              <button 
                onClick={startGame}
                className="px-4 py-3 sm:px-6 sm:py-4 border-2 border-[var(--color-game-ui)] text-[var(--color-game-ui)] text-[10px] sm:text-xs active:bg-[var(--color-game-ui)] active:text-black sm:hover:bg-[var(--color-game-ui)] sm:hover:text-black transition-colors uppercase animate-pulse"
              >
                Comenzar Demo
              </button>
            </div>
          )}

          {gameState === 'GAME_OVER' && (
            <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20">
              <h2 className="text-2xl sm:text-3xl text-red-600 mb-6 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">HAS CAÍDO</h2>
              <button 
                onClick={startGame}
                className="px-4 py-3 border border-red-600 text-red-600 active:bg-red-600 active:text-black sm:hover:bg-red-600 sm:hover:text-black transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {gameState !== 'START_SCREEN' && (
            <GameGrid player={player} npc={npc} enemies={enemies} />
          )}

          {(gameState === 'DIALOGUE' || gameState === 'VICTORY') && currentDialogueLine && (
            <div 
               className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-blue-950/95 border-2 border-blue-400 p-2 sm:p-4 z-30 cursor-pointer active:bg-blue-900"
               onClick={nextDialogue}
            >
              <div className="text-blue-300 mb-1 sm:mb-2 uppercase text-[8px] sm:text-[10px]">{currentDialogueLine.speaker}</div>
              <div className="text-white leading-loose text-[9px] sm:text-sm">{currentDialogueLine.text}</div>
              <div className="text-right mt-1 sm:mt-2 text-blue-500 animate-pulse text-[8px] sm:text-[10px]">[PULSA PARA CONTINUAR]</div>
            </div>
          )}
        </div>

        {/* LOGS PANEL */}
        <div className="w-full sm:h-24 bg-black border-2 border-neutral-700 mt-2 sm:mt-4 p-2 overflow-hidden flex flex-col justify-end aspect-[5/1] sm:aspect-auto">
          {messageLogs.map((log, i) => (
            <div key={i} className="text-[7px] sm:text-[10px] text-gray-400 leading-relaxed opacity-80">
              {'>'} {log}
            </div>
          ))}
          {gameState === 'PLAYING' && messageLogs.length === 0 && (
            <div className="text-[7px] sm:text-[10px] text-gray-600">Mueve a Emeo hacia los Brull para atacar...</div>
          )}
        </div>

        {/* MOBILE CONTROLS */}
        <div className="w-full mt-auto mb-4 sm:mt-6 sm:mb-0 flex items-center justify-between gap-4 p-2 sm:px-8 select-none">
          {/* D-PAD */}
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-32 h-32 sm:w-40 sm:h-40">
            <div />
            <button 
              className="bg-neutral-800 border-2 border-neutral-600 active:bg-neutral-600 flex items-center justify-center rounded-t-lg active:scale-95 transition-transform"
              onPointerDown={(e) => { e.preventDefault(); movePlayer(0, -1); }}
            ><span className="text-xl">▲</span></button>
            <div />
            <button 
              className="bg-neutral-800 border-2 border-neutral-600 active:bg-neutral-600 flex items-center justify-center rounded-l-lg active:scale-95 transition-transform"
              onPointerDown={(e) => { e.preventDefault(); movePlayer(-1, 0); }}
            ><span className="text-xl">◄</span></button>
            <div className="bg-neutral-700 rounded-sm" />
            <button 
              className="bg-neutral-800 border-2 border-neutral-600 active:bg-neutral-600 flex items-center justify-center rounded-r-lg active:scale-95 transition-transform"
              onPointerDown={(e) => { e.preventDefault(); movePlayer(1, 0); }}
            ><span className="text-xl">►</span></button>
            <div />
            <button 
              className="bg-neutral-800 border-2 border-neutral-600 active:bg-neutral-600 flex items-center justify-center rounded-b-lg active:scale-95 transition-transform"
              onPointerDown={(e) => { e.preventDefault(); movePlayer(0, 1); }}
            ><span className="text-xl">▼</span></button>
            <div />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-900 border-4 border-blue-700 active:bg-blue-700 active:scale-95 transition-transform flex items-center justify-center text-blue-200"
              onPointerDown={(e) => { 
                 e.preventDefault(); 
                 if (gameState === 'DIALOGUE' || gameState === 'VICTORY' || gameState === 'START_SCREEN' || gameState === 'GAME_OVER') {
                   // if starting
                   if (gameState === 'START_SCREEN' || gameState === 'GAME_OVER') {
                     startGame();
                   } else {
                     nextDialogue(); 
                   }
                 }
              }}
            >
              A
            </button>
          </div>
        </div>

        {/* CONTROL HINTS */}
        <div className="text-[7px] sm:text-[9px] text-neutral-500 mt-4 uppercase hidden sm:block">
          [W,A,S,D] Mover • [ARROWS] Mover • [ENTER/ESPACIO] Continuar
        </div>

      </div>
    </div>
  );
}
