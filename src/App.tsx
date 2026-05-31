import React from 'react';
import { useGame } from './hooks/useGame';
import { GameGrid } from './components/GameGrid';
import { PixelSprite } from './components/Icons';

export default function App() {
  const {
    gameState,
    setGameState,
    currentLevel,
    mapLayout,
    player,
    enemies,
    items,
    npc,
    currentDialogueLine,
    messageLogs,
    startGame,
    restartFromCheckpoint,
    nextDialogue,
    selectDialogueOption,
    movePlayer,
    normalAttack,
    specialAttack
  } = useGame();

  const [crtEnabled, setCrtEnabled] = React.useState(true);
  const [musicVol, setMusicVol] = React.useState(100);
  const [sfxVol, setSfxVol] = React.useState(100);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center font-retro text-[8px] sm:text-xs pixel-art bg-[var(--color-game-bg)] select-none touch-none ${crtEnabled ? 'crt' : ''}`}>
      <div className="w-full max-w-2xl min-h-screen sm:min-h-0 sm:h-auto bg-neutral-900 sm:border-8 border-neutral-700 p-2 pt-6 sm:p-6 sm:rounded-xl flex flex-col items-center relative z-10 shadow-2xl overflow-y-auto overflow-x-hidden">
        
        {/* HEADER / HUD */}
        <div className="w-full flex flex-col mb-2 sm:mb-4 border-b-2 border-[var(--color-game-ui)] pb-2 text-[var(--color-game-ui)] uppercase tracking-wider px-1">
          <div className="flex justify-between items-end mb-1">
            <div className="text-[10px] sm:text-sm">HP: {player.hp}/{player.maxHp}</div>
            <div className="text-center font-bold text-xs sm:text-base">The Birth of a Knight</div>
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
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950 to-black flex flex-col items-center justify-center z-40 border-4 border-[var(--color-game-ui)] text-center p-2 sm:p-6 overflow-hidden">
              <div className="absolute top-4 left-4 w-10 h-10 sm:w-16 sm:h-16 opacity-20 sm:opacity-50 animate-char-idle">
                <PixelSprite spriteKey="swordIcon" className="w-full h-full" />
              </div>
              <div className="absolute bottom-4 right-4 w-10 h-10 sm:w-16 sm:h-16 opacity-20 sm:opacity-50 animate-enemy-float" style={{animationDelay: '1s'}}>
                <PixelSprite spriteKey="shieldIcon" className="w-full h-full" />
              </div>
              
              <div className="relative mb-4 sm:mb-12 mt-2">
                <h1 className="text-xl sm:text-4xl text-[var(--color-game-ui)] drop-shadow-[0_0_10px_rgba(250,204,21,1)] leading-tight relative z-10 font-bold">THE BIRTH<br/>OF A KNIGHT</h1>
                <div className="absolute inset-0 blur-md opacity-50 bg-[var(--color-game-ui)] z-0 rounded-full mix-blend-screen animate-pulse"></div>
              </div>
              
              <div className="flex flex-col gap-2 sm:gap-4 w-full max-w-[180px] sm:max-w-[240px] relative z-10">
                <button 
                  onClick={() => setGameState('INTRO_SCROLL')}
                  className="group relative px-4 py-2 sm:px-6 sm:py-3 border-2 border-[var(--color-game-ui)] text-[var(--color-game-ui)] text-[10px] sm:text-sm bg-black/50 hover:bg-[var(--color-game-ui)] hover:text-black transition-all uppercase flex justify-center items-center"
                >
                  <span className="absolute left-2 sm:left-4 opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                  Jugar
                  <span className="absolute right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">◀</span>
                </button>
                <button 
                  onClick={() => setGameState('CONFIG')}
                  className="group relative px-4 py-2 sm:px-6 sm:py-3 border-2 border-[var(--color-game-ui)] text-[var(--color-game-ui)] text-[10px] sm:text-sm bg-black/50 hover:bg-[var(--color-game-ui)] hover:text-black transition-all uppercase flex justify-center items-center"
                >
                  <span className="absolute left-2 sm:left-4 opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                  Configuración
                  <span className="absolute right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">◀</span>
                </button>
                <button 
                  onClick={() => setGameState('CREDITS')}
                  className="group relative px-4 py-2 sm:px-6 sm:py-3 border-2 border-[var(--color-game-ui)] text-[var(--color-game-ui)] text-[10px] sm:text-sm bg-black/50 hover:bg-[var(--color-game-ui)] hover:text-black transition-all uppercase flex justify-center items-center"
                >
                  <span className="absolute left-2 sm:left-4 opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                  Créditos
                  <span className="absolute right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">◀</span>
                </button>
              </div>
              
              <div className="absolute bottom-2 text-[var(--color-game-ui)] text-[6px] sm:text-[10px] opacity-70">
                © 2026 Cool Games Studio
              </div>
            </div>
          )}

          {gameState === 'CREDITS' && (
            <div className="absolute inset-0 bg-black/95 flex flex-col items-center py-6 px-4 z-40 border-4 border-gray-600 justify-between overflow-y-auto">
              <div className="text-center w-full my-auto">
                <h2 className="text-xl sm:text-2xl text-[var(--color-game-ui)] mb-4 mt-4">CRÉDITOS</h2>
                <div className="text-[8px] sm:text-[10px] text-gray-300 space-y-2 pb-4">
                  <p>Un juego de <span className="text-white">Cool Games Studio</span></p>
                  
                  <div className="mt-4">
                    <p className="text-[var(--color-game-ui)] mb-1">Música</p>
                    <p>Zinizter_Vinyl</p>
                  </div>

                  <div className="mt-2">
                    <p className="text-[var(--color-game-ui)] mb-1">Escritura</p>
                    <p>Perjota<br/>Nonono</p>
                  </div>

                  <div className="mt-2">
                    <p className="text-[var(--color-game-ui)] mb-1">Arte Pixel</p>
                    <p>Nando<br/>Elegardo/gabriel</p>
                  </div>

                  <div className="mt-2">
                    <p className="text-[var(--color-game-ui)] mb-1">Multi tarea</p>
                    <p>animekiller</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setGameState('MAIN_MENU')}
                className="px-4 py-2 border border-gray-400 text-gray-400 hover:text-white hover:border-white uppercase text-[8px] shrink-0 mb-4"
              >
                Volver
              </button>
            </div>
          )}

          {gameState === 'CONFIG' && (
            <div className="absolute inset-0 bg-black/95 flex flex-col items-center py-10 px-4 z-40 border-4 border-gray-600 justify-between">
              <div className="text-center w-full">
                <h2 className="text-xl sm:text-2xl text-[var(--color-game-ui)] mb-6">OPCIONES</h2>
                <div className="text-[8px] sm:text-[10px] text-gray-300 space-y-6">
                  <div 
                    className="flex justify-between items-center px-8 cursor-pointer active:text-white hover:text-white"
                    onClick={() => setMusicVol(v => v === 100 ? 50 : v === 50 ? 0 : 100)}
                  >
                     <span>Volumen Música</span>
                     <span>{musicVol}%</span>
                  </div>
                  <div 
                    className="flex justify-between items-center px-8 cursor-pointer active:text-white hover:text-white"
                    onClick={() => setSfxVol(v => v === 100 ? 50 : v === 50 ? 0 : 100)}
                  >
                     <span>Volumen SFX</span>
                     <span>{sfxVol}%</span>
                  </div>
                  <div 
                    className={`flex justify-between items-center px-8 cursor-pointer active:text-white hover:text-white ${crtEnabled ? 'text-yellow-500' : 'text-gray-500'}`}
                    onClick={() => setCrtEnabled(prev => !prev)}
                  >
                     <span>Filtro CRT</span>
                     <span>{crtEnabled ? 'ACTIVADO' : 'DESACTIVADO'}</span>
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
               onClick={() => startGame()}
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
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => restartFromCheckpoint()}
                  className="px-4 py-3 border border-red-400 text-red-400 active:bg-red-400 active:text-black sm:hover:bg-red-400 sm:hover:text-black transition-colors"
                >
                  Continuar desde Checkpoint
                </button>
                <button 
                  onClick={() => startGame()}
                  className="px-4 py-3 border border-red-900 text-red-700 active:bg-red-900 active:text-white sm:hover:bg-red-900 sm:hover:text-white transition-colors text-sm"
                >
                  Reiniciar todo el juego
                </button>
              </div>
            </div>
          )}

          {['DIALOGUE', 'PLAYING', 'VICTORY'].includes(gameState) && (currentLevel) && (
            <GameGrid level={currentLevel} mapLayout={mapLayout} player={player} npc={npc} enemies={enemies} items={items} gameState={gameState} />
          )}

          {(gameState === 'DIALOGUE' || gameState === 'VICTORY') && currentDialogueLine && (
            <div 
               className={`absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-blue-950/95 border-2 border-blue-400 p-2 sm:p-4 z-50 ${currentDialogueLine.options && currentDialogueLine.options.length > 0 ? '' : 'cursor-pointer active:bg-blue-900'}`}
               onClick={() => nextDialogue()}
            >
              <div className="text-blue-300 mb-1 sm:mb-2 uppercase text-[8px] sm:text-[10px]">{currentDialogueLine.speaker}</div>
              <div className="text-white leading-loose text-[9px] sm:text-sm">{currentDialogueLine.text}</div>
              {currentDialogueLine.options && currentDialogueLine.options.length > 0 ? (
                 <div className="mt-2 flex flex-col gap-1">
                   {currentDialogueLine.options.map((opt, idx) => (
                     <button
                       key={idx}
                       onClick={(e) => { e.stopPropagation(); selectDialogueOption(idx); }}
                       className="text-left bg-blue-900/50 hover:bg-blue-700 p-2 rounded text-blue-100 text-[9px] sm:text-[12px] border border-blue-600 transition-colors"
                     >
                       {idx + 1}. {opt.label}
                     </button>
                   ))}
                 </div>
              ) : (
                <div className="text-right mt-1 sm:mt-2 text-blue-500 animate-pulse text-[8px] sm:text-[10px]">[PULSA A O ESPACIO]</div>
              )}
            </div>
          )}
        </div>

        {/* LOGS PANEL */}
        <div className="w-full sm:h-32 bg-black border-2 border-neutral-700 mt-2 sm:mt-4 p-2 overflow-y-auto flex flex-col justify-end aspect-[4/1] sm:aspect-auto font-mono scrollbar-hide">
          {messageLogs.slice(-6).map((log, i) => {
            const isDialogue = log.includes(':"') || log.includes(': "');
            let speaker = "";
            let text = log;
            if (isDialogue) {
               const parts = log.split(/: "(.*)"/);
               if (parts.length > 1) {
                  speaker = parts[0];
                  text = `"${parts[1]}"`;
               }
            }
            return (
              <div key={i} className={`text-[10px] sm:text-[12px] leading-relaxed opacity-90 ${isDialogue ? 'text-yellow-400 font-semibold mb-1' : 'text-gray-400'}`}>
                {isDialogue ? (
                  <div className="flex gap-2 isolate">
                    <span className="text-yellow-500">{'>'}</span>
                    <span>
                      <span className="text-purple-400 font-bold">{speaker}: </span>
                      <span className="text-white italic">{text}</span>
                    </span>
                  </div>
                ) : (
                  <span>{'>'} {log}</span>
                )}
              </div>
            );
          })}
          {gameState === 'PLAYING' && messageLogs.length === 0 && (
            <div className="text-[10px] sm:text-[12px] text-gray-600">Mueve a Emeo hacia los Brull para atacar...</div>
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
                    restartFromCheckpoint();
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
