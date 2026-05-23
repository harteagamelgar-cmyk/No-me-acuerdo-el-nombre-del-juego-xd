import { useState, useCallback, useEffect } from 'react';
import { GameState, Position, Entity } from '../types';
import { isSolid, INITIAL_PLAYER, INITIAL_ENEMIES, INITIAL_NPC } from '../data/map';
import { INTRO_DIALOGUE, WIN_DIALOGUE, DialogueLine } from '../data/dialogue';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>('START_SCREEN');
  const [player, setPlayer] = useState<Entity>(INITIAL_PLAYER);
  const [enemies, setEnemies] = useState<Entity[]>(INITIAL_ENEMIES);
  const [npc, setNpc] = useState<Entity>(INITIAL_NPC);
  
  const [currentDialogue, setCurrentDialogue] = useState<DialogueLine[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [messageLogs, setMessageLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setMessageLogs(prev => {
      const newLogs = [...prev, msg];
      if (newLogs.length > 4) newLogs.shift();
      return newLogs;
    });
  };

  const startGame = () => {
    setGameState('DIALOGUE');
    setCurrentDialogue(INTRO_DIALOGUE);
    setDialogueIndex(0);
    setPlayer(INITIAL_PLAYER);
    setEnemies(INITIAL_ENEMIES);
    setNpc(INITIAL_NPC);
    setMessageLogs(["Entraste al Bosque de Dumur."]);
  };

  const nextDialogue = () => {
    if (dialogueIndex < currentDialogue.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      if (gameState === 'VICTORY') {
        setGameState('START_SCREEN');
      } else {
        setGameState('PLAYING');
      }
    }
  };

  const [lastMoveTime, setLastMoveTime] = useState(0);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'PLAYING') return;
    if (player.isDead) return;

    // Throttle movement slightly for game feel
    const now = Date.now();
    if (now - lastMoveTime < 150) return;
    setLastMoveTime(now);

    const newX = player.x + dx;
    const newY = player.y + dy;

    // Check collision with enemies (Attack)
    const enemyIndex = enemies.findIndex(e => e.x === newX && e.y === newY && !e.isDead);
    if (enemyIndex !== -1) {
      const enemy = enemies[enemyIndex];
      // Player attacks
      const damage = player.attack + Math.floor(Math.random() * 2);
      enemy.hp -= damage;
      addLog(`Emeo ataca a ${enemy.name} por ${damage} dmg!`);

      if (enemy.hp <= 0) {
        enemy.hp = 0;
        enemy.isDead = true;
        addLog(`¡${enemy.name} ha sido derrotado!`);
      }

      const updatedEnemies = [...enemies];
      updatedEnemies[enemyIndex] = { ...enemy };
      setEnemies(updatedEnemies);

      enemyTurn();
      checkVictory(updatedEnemies);
      return;
    }

    // Move player if no solid
    if (!isSolid(newX, newY)) {
      setPlayer(prev => ({ ...prev, x: newX, y: newY }));
      npcFollow(player.x, player.y);
      enemyTurn();
    } else {
      addLog("El camino está bloqueado.");
    }
  }, [gameState, player, enemies, lastMoveTime]);

  const npcFollow = (px: number, py: number) => {
    setNpc(prev => ({ ...prev, x: px, y: py }));
  };

  const enemyTurn = () => {
    if (player.isDead) return;

    setEnemies(currentEnemies => {
      let playerHit = false;
      let newPlayerHp = player.hp;

      const updated = currentEnemies.map(enemy => {
        if (enemy.isDead) return enemy;

        // Simple AI: Move towards player if adjacent or attack if very close
        const distToPlayer = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y);

        if (distToPlayer === 1) {
          // Attack
          const dmg = enemy.attack + Math.floor(Math.random() * 2);
          newPlayerHp -= dmg;
          addLog(`${enemy.name} golpea por ${dmg} dmg!`);
          playerHit = true;
          return enemy;
        } else if (distToPlayer < 4) {
          // Move towards player
          const dx = Math.sign(player.x - enemy.x);
          const dy = Math.sign(player.y - enemy.y);
          
          if (dx !== 0 && !isSolid(enemy.x + dx, enemy.y) && !currentEnemies.some(e => e.id !== enemy.id && !e.isDead && e.x === enemy.x + dx && e.y === enemy.y)) {
            return { ...enemy, x: enemy.x + dx };
          } else if (dy !== 0 && !isSolid(enemy.x, enemy.y + dy) && !currentEnemies.some(e => e.id !== enemy.id && !e.isDead && e.x === enemy.x && e.y === enemy.y + dy)) {
            return { ...enemy, y: enemy.y + dy };
          }
        }
        return enemy;
      });

      if (playerHit) {
        setPlayer(prev => {
          const updatedPlayer = { ...prev, hp: newPlayerHp };
          if (updatedPlayer.hp <= 0) {
            updatedPlayer.hp = 0;
            updatedPlayer.isDead = true;
            addLog("¡Emeo ha caído!");
            setGameState('GAME_OVER');
          }
          return updatedPlayer;
        });
      }

      return updated;
    });
  };

  const checkVictory = (currentEnemies: Entity[]) => {
    if (currentEnemies.every(e => e.isDead)) {
      setGameState('VICTORY');
      setCurrentDialogue(WIN_DIALOGUE);
      setDialogueIndex(0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'DIALOGUE' || gameState === 'VICTORY') {
        if (e.key === 'Enter' || e.key === ' ') {
          nextDialogue();
        }
        return;
      }

      if (gameState === 'PLAYING') {
        switch (e.key) {
          case 'ArrowUp': case 'w': movePlayer(0, -1); break;
          case 'ArrowDown': case 's': movePlayer(0, 1); break;
          case 'ArrowLeft': case 'a': movePlayer(-1, 0); break;
          case 'ArrowRight': case 'd': movePlayer(1, 0); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, movePlayer, nextDialogue]);

  return {
    gameState,
    player,
    enemies,
    npc,
    currentDialogueLine: currentDialogue[dialogueIndex],
    messageLogs,
    startGame,
    nextDialogue,
    movePlayer
  };
}
