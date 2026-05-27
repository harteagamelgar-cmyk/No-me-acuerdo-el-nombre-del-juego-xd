import React from 'react';
import { useGame } from './hooks/useGame';
import { GameGrid } from './components/GameGrid';

export default function App() {
  const {
    gameState,
    setGameState,
    currentLevel,
    player,
    enemies,
    items,
    npc,
    currentDialogueLine,
    messageLogs,
    startGame,
    nextDialogue,
    movePlayer,
    normalAttack,
    specialAttack
  } = useGame();

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-retro text-[8px] sm:text-xs crt pixel-art bg-[var(--color-game-bg)] select-none touch-none">
      <div className="w-full max-w-2xl min-h-screen sm:min-h-0 sm:h-auto bg-neutral-900 sm:border-8 border-neutral-700 p-2 pt-6 sm:p-6 sm:rounded-xl flex flex-col items-center relative z-10 shadow-2xl overflow-y-auto overflow-x-hidden">
        
        {/* HEADER / HUD */}
        <div className="w-full flex flex-col mb-2 sm:mb-4 border-b-2 border-[var(--color-game-ui)] pb-2 text-[var(--color-game-ui)] uppercase tracking-wider px-1">
          <div className="flex justify-between items-end mb-1">
            <div className="text-[10px] sm:text-sm">HP: {player.hp}/{player.maxHp}</div>
            <div className="text-center font-bold text-xs sm:text-base">Rebirth of Knight</div>
            <div className="text-right text-[10px] sm:text-sm">BRULL: {enemies.filter(e => !e.isDead).length}</div>
          </div>
          <div className="flex justify-between items-end text-[8px] sm:text-[10px] text-blue-400">
            <div>MP: {player.mp}/{player.maxMp}</div>
            <div>NIVEL {player.level} • XP: {player.xp}/50</div>
          </div>
        </div>

        {/* MAIN GAME VIEW */}
        <div className="relative w-full aspect-[15/11]">

          {gameState === 'STUDIO_LOGO' && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 text-center animate-fade-in-out">
               <h2 className="text-2xl sm:text-4xl text-white mb-2 tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Cool Games Studio</h2>
               <p className="text-gray-500 text-[10px] uppercase">Presents</p>
            </div>
          )}

          {gameState === 'MAIN_MENU' && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-40 border-4 border-[var(--color-game-ui)] text-center p-4 sm:p-8">
              <h1 className="text-xl sm:text-3xl text-[var(--color-game-ui)] mb-8 sm:mb-12 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] leading-relaxed">REBIRTH<br/>OF KNIGHT</h1>
              
              <div className="flex flex-col gap-4 w-full max-w-[200px]">
                <button 
                  onClick={() => setGameState('INTRO_SCROLL')}
                  className="px-4 py-3 border-2 border-[var(--color-game-ui)] text-[var(--color-game-ui)] text-[10px] sm:text-xs active:bg-[var(--color-game-ui)] active:text-black sm:hover:bg-[var(--color-game-ui)] sm:hover:text-black transition-colors uppercase"
                >
                  Jugar
                </button>
                <button 
                  onClick={() => setGameState('CONFIG')}
                  className="px-4 py-3 border-2 border-[var(--color-game-ui)] text-[var(--color-game-ui)] text-[10px] sm:text-xs active:bg-[var(--color-game-ui)] active:text-black sm:hover:bg-[var(--color-game-ui)] sm:hover:text-black transition-colors uppercase"
                >
                  Configuración
                </button>
                <button 
                  onClick={() => setGameState('CREDITS')}
                  className="px-4 py-3 border-2 border-[var(--color-game-ui)] text-[var(--color-game-ui)] text-[10px] sm:text-xs active:bg-[var(--color-game-ui)] active:text-black sm:hover:bg-[var(--color-game-ui)] sm:hover:text-black transition-colors uppercase"
                >
                  Créditos
                </button>
              </div>
            </div>
          )}

          {gameState === 'CREDITS' && (
            <div className="absolute inset-0 bg-black/95 flex flex-col items-center py-10 px-4 z-40 border-4 border-gray-600 justify-between">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl text-[var(--color-game-ui)] mb-6">CRÉDITOS</h2>
                <div className="text-[8px] sm:text-[10px] text-gray-300 space-y-4">
                  <p>Un juego de <span className="text-white">Cool Games Studio</span></p>
                  <p>Desarrollo y Diseño:<br/>Titan speakerwoman</p>
                  <p>Música e Historia:<br/>Mundo de Camoris</p>
                </div>
              </div>
              <button 
                onClick={() => setGameState('MAIN_MENU')}
                className="px-4 py-2 border border-gray-400 text-gray-400 hover:text-white hover:border-white uppercase text-[8px]"
              >
                Volver
              </button>
            </div>
          )}

          {gameState === 'CONFIG' && (
            <div className="absolute inset-0 bg-black/95 flex flex-col items-center py-10 px-4 z-40 border-4 border-gray-600 justify-between">
              <div className="text-center w-full">
                <h2 className="text-xl sm:text-2xl text-[var(--color-game-ui)] mb-6">OPCIONES</h2>
                <div className="text-[8px] sm:text-[10px] text-gray-300 space-y-4">
                  <div className="flex justify-between items-center opacity-50 px-8">
                     <span>Volumen Música</span>
                     <span>100%</span>
                  </div>
                  <div className="flex justify-between items-center opacity-50 px-8">
                     <span>Volumen SFX</span>
                     <span>100%</span>
                  </div>
                  <div className="flex justify-between items-center px-8 text-yellow-500">
                     <span>Filtro CRT</span>
                     <span>ACTIVADO</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setGameState('MAIN_MENU')}
                className="px-4 py-2 border border-gray-400 text-gray-400 hover:text-white hover:border-white uppercase text-[8px]"
              >
                Volver
              </button>
            </div>
          )}

          {gameState === 'INTRO_SCROLL' && (
             <div 
               className="absolute inset-0 bg-black flex flex-col items-center justify-center z-40 border-4 border-blue-900 p-4 sm:p-8 cursor-pointer overflow-hidden"
               onClick={startGame}
             >
                <div className="animate-intro-scroll text-justify w-[80%] space-y-4">
                   <p className="text-blue-400 text-xs sm:text-sm leading-relaxed mb-4 text-center">
                     Hace 200 años, Jirash el gran dragón eclipse atacó el reino.
                   </p>
                   <p className="text-gray-300 text-[8px] sm:text-[10px] leading-loose">
                     Hoy, la magia estelar se desvanece y la oscuridad de los Brull consume nuestra historia.
                   </p>
                   <p className="text-gray-300 text-[8px] sm:text-[10px] leading-loose">
                     Eres Emeo, caballero portador de la Resonancia, quien debe adentrarse en los viejos terrenos profanados,
                     comenzando desde el campo de entrenamiento de la Aldea.
                   </p>
                   <div className="text-center mt-8 text-blue-500 animate-pulse text-[8px] uppercase">
                     [ CLIC PARA COMENZAR ]
                   </div>
                </div>
             </div>
          )}


          {gameState === 'GAME_OVER' && (
            <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20">
              <h2 className="text-2xl sm:text-3xl text-red-600 mb-6 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">HAS CAÍDO</h2>
              <button 
                onClick={startGame}
                className="px-4 py-3 border border-red-600 text-red-600 active:bg-red-600 active:text-black sm:hover:bg-red-600 sm:hover:text-black transition-colors"
              >
                Intentar desde inicio
              </button>
            </div>
          )}

          {['DIALOGUE', 'PLAYING', 'VICTORY'].includes(gameState) && (currentLevel) && (
            <GameGrid level={currentLevel} player={player} npc={npc} enemies={enemies} items={items} />
          )}

          {(gameState === 'DIALOGUE' || gameState === 'VICTORY') && currentDialogueLine && (
            <div 
               className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-blue-950/95 border-2 border-blue-400 p-2 sm:p-4 z-30 cursor-pointer active:bg-blue-900"
               onClick={nextDialogue}
            >
              <div className="text-blue-300 mb-1 sm:mb-2 uppercase text-[8px] sm:text-[10px]">{currentDialogueLine.speaker}</div>
              <div className="text-white leading-loose text-[9px] sm:text-sm">{currentDialogueLine.text}</div>
              <div className="text-right mt-1 sm:mt-2 text-blue-500 animate-pulse text-[8px] sm:text-[10px]">[PULSA A O ESPACIO]</div>
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
          <div className="flex gap-2 sm:gap-4 items-end">
            <button 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-900 border-4 border-emerald-700 active:bg-emerald-700 active:scale-95 transition-transform flex items-center justify-center text-emerald-200 mb-4"
              onPointerDown={(e) => { 
                 e.preventDefault(); 
                 specialAttack();
              }}
            >
              B
            </button>
            <button 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-900 border-4 border-blue-700 active:bg-blue-700 active:scale-95 transition-transform flex items-center justify-center text-blue-200"
              onPointerDown={(e) => { 
                 e.preventDefault(); 
                 if (gameState === 'DIALOGUE' || gameState === 'VICTORY' || gameState === 'INTRO_SCROLL') {
                   if (gameState === 'INTRO_SCROLL') {
                     startGame();
                   } else {
                     nextDialogue(); 
                   }
                 } else if (gameState === 'GAME_OVER') {
                    startGame();
                 } else if (gameState === 'PLAYING') {
                    normalAttack();
                 }
              }}
            >
              A
            </button>
          </div>
        </div>

        {/* CONTROL HINTS */}
        <div className="text-[7px] sm:text-[9px] text-neutral-500 mt-4 uppercase hidden sm:block">
          [W,A,S,D] Mover • [ARROWS] Mover • [ENTER/A] Continuar • Magia [B]
        </div>

      </div>
    </div>
  );
}
