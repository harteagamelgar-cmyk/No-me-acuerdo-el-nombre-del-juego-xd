import { useState, useCallback, useEffect } from 'react';
import { GameState, Entity } from '../types';
import { LEVELS, getTile, isSolid, extractBasePlayer, MAP_WIDTH, MAP_HEIGHT } from '../data/levels';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>('STUDIO_LOGO');
  const [levelIndex, setLevelIndex] = useState(0);

  const [player, setPlayer] = useState<Entity>(extractBasePlayer(null));
  const [npc, setNpc] = useState<Entity>({ id: 'npc', type: 'npc', name: 'Dhalia', hp: 15, maxHp: 15, attack: 5, x: -1, y: -1, isDead: false });
  const [enemies, setEnemies] = useState<Entity[]>([]);
  const [items, setItems] = useState<Entity[]>([]);
  
  const [currentDialogue, setCurrentDialogue] = useState(LEVELS[0].introDialogue);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [messageLogs, setMessageLogs] = useState<string[]>([]);
  const currentLevel = LEVELS[levelIndex];

  const addLog = (msg: string) => {
    setMessageLogs(prev => {
      const newLogs = [...prev, msg];
      if (newLogs.length > 4) newLogs.shift();
      return newLogs;
    });
  };

  const loadLevel = (index: number, pBase: Entity) => {
    const level = LEVELS[index];
    if (!level) return;

    setPlayer({ ...pBase, x: level.playerStart.x, y: level.playerStart.y });
    if (level.npcStart) {
      setNpc(prev => ({ ...prev, x: level.npcStart!.x, y: level.npcStart!.y }));
    } else {
      setNpc(prev => ({ ...prev, x: -1, y: -1 }));
    }
    setEnemies(JSON.parse(JSON.stringify(level.enemies)));
    setItems(JSON.parse(JSON.stringify(level.items)));
    setCurrentDialogue(level.introDialogue);
    setDialogueIndex(0);
    setMessageLogs([`Entraste a ${level.name}.`]);
    setGameState('DIALOGUE');
  };

  const startGame = () => {
    setLevelIndex(0);
    loadLevel(0, extractBasePlayer(null));
  };

  const nextDialogue = () => {
    if (dialogueIndex < currentDialogue.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      if (gameState === 'VICTORY') {
        const nextIndex = levelIndex + 1;
        if (nextIndex < LEVELS.length) {
          setLevelIndex(nextIndex);
          loadLevel(nextIndex, player);
        } else {
          setGameState('MAIN_MENU');
        }
      } else {
        setGameState('PLAYING');
      }
    }
  };

  const enemyTurn = () => {
    if (player.isDead) return;

    setEnemies(currentEnemies => {
      let playerHit = false;
      let newPlayerHp = player.hp;

      const updated = currentEnemies.map(enemy => {
        if (enemy.isDead || enemy.attack === 0) return enemy; // dummy enemy doesn't attack

        const distToPlayer = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y);
        if (distToPlayer === 1) {
          const dmg = enemy.attack + Math.floor(Math.random() * 2);
          newPlayerHp -= dmg;
          addLog(`${enemy.name} golpea por ${dmg} dmg!`);
          playerHit = true;
          return enemy;
        } else if (distToPlayer < 4) {
          const dx = Math.sign(player.x - enemy.x);
          const dy = Math.sign(player.y - enemy.y);
          
          if (dx !== 0 && !isSolid(currentLevel.layout, enemy.x + dx, enemy.y) && !currentEnemies.some(e => e.id !== enemy.id && !e.isDead && e.x === enemy.x + dx && e.y === enemy.y)) {
            return { ...enemy, x: enemy.x + dx };
          } else if (dy !== 0 && !isSolid(currentLevel.layout, enemy.x, enemy.y + dy) && !currentEnemies.some(e => e.id !== enemy.id && !e.isDead && e.x === enemy.x && e.y === enemy.y + dy)) {
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
      setCurrentDialogue(currentLevel.winDialogue);
      setDialogueIndex(0);
    }
  };

  const [lastMoveTime, setLastMoveTime] = useState(0);

  const specialAttack = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    if (player.isDead) return;
    if ((player.mp ?? 0) < 5) {
      addLog("¡No tienes suficiente Maná (MP) para magia!");
      return;
    }

    const aliveEnemies = enemies.filter(e => !e.isDead);
    let target = null;
    let minD = 999;
    for (const e of aliveEnemies) {
      const d = Math.abs(e.x - player.x) + Math.abs(e.y - player.y);
      if (d <= 3 && d < minD) {
        minD = d;
        target = e;
      }
    }

    if (target) {
      setPlayer(prev => ({ ...prev, mp: Math.max(0, (prev.mp ?? 0) - 5) }));
      const damage = player.attack * 2;
      
      const newEnemies = enemies.map(e => {
        if (e.id === target?.id) {
          const newHp = Math.max(0, e.hp - damage);
          if (newHp === 0) {
             addLog(`¡Magia! Dhalia asiste: ${e.name} derrotado.`);
             return { ...e, hp: 0, isDead: true };
          } else {
             addLog(`¡Magia! Golpeas a ${e.name} por ${damage} dmg.`);
             return { ...e, hp: newHp };
          }
        }
        return e;
      });

      setEnemies(newEnemies);
      enemyTurn();
      checkVictory(newEnemies);
    } else {
      addLog("No hay enemigos cerca.");
    }
  }, [gameState, player, enemies]);

  const normalAttack = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    if (player.isDead) return;

    const enemyIndex = enemies.findIndex(e => !e.isDead && (Math.abs(e.x - player.x) + Math.abs(e.y - player.y)) === 1);
    
    if (enemyIndex !== -1) {
      const enemy = { ...enemies[enemyIndex] };
      const damage = player.attack + Math.floor(Math.random() * 2);
      enemy.hp -= damage;
      addLog(`Emeo ataca a ${enemy.name} por ${damage} dmg!`);

      if (enemy.hp <= 0) {
        enemy.hp = 0;
        enemy.isDead = true;
        addLog(`¡${enemy.name} ha sido derrotado!`);
        const gainedXp = enemy.xpReward || 10;
        setPlayer(prev => {
          let newXp = (prev.xp ?? 0) + gainedXp;
          let newLevel = prev.level ?? 1;
          let newMaxHp = prev.maxHp;
          let newMp = prev.maxMp ?? 10;
          let newAttack = prev.attack;
          if (newXp >= 50) {
            newXp -= 50;
            newLevel += 1;
            newMaxHp += 10;
            newMp += 5;
            newAttack += 2;
            addLog(`¡Emeo subió al nivel ${newLevel}!`);
          }
          return { ...prev, xp: newXp, level: newLevel, maxHp: newMaxHp, maxMp: newMp, attack: newAttack };
        });
      }

      const updatedEnemies = [...enemies];
      updatedEnemies[enemyIndex] = enemy;
      setEnemies(updatedEnemies);

      enemyTurn();
      checkVictory(updatedEnemies);
    } else {
      addLog("Lanzas un golpe al aire. (No hay objetivos cerca)");
    }
  }, [gameState, player, enemies, currentLevel]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'PLAYING') return;
    if (player.isDead) return;

    const now = Date.now();
    if (now - lastMoveTime < 150) return;
    setLastMoveTime(now);

    const newX = player.x + dx;
    const newY = player.y + dy;

    const enemyIndex = enemies.findIndex(e => e.x === newX && e.y === newY && !e.isDead);
    if (enemyIndex !== -1) {
      const enemy = enemies[enemyIndex];
      const damage = player.attack + Math.floor(Math.random() * 2);
      enemy.hp -= damage;
      addLog(`Emeo ataca a ${enemy.name} por ${damage} dmg!`);

      if (enemy.hp <= 0) {
        enemy.hp = 0;
        enemy.isDead = true;
        addLog(`¡${enemy.name} ha sido derrotado!`);
        const gainedXp = enemy.xpReward || 10;
        setPlayer(prev => {
          let newXp = (prev.xp ?? 0) + gainedXp;
          let newLevel = prev.level ?? 1;
          let newMaxHp = prev.maxHp;
          let newMp = prev.maxMp ?? 10;
          let newAttack = prev.attack;
          if (newXp >= 50) {
            newXp -= 50;
            newLevel += 1;
            newMaxHp += 10;
            newMp += 5;
            newAttack += 2;
            addLog(`¡Emeo subió al nivel ${newLevel}!`);
          }
          return { ...prev, xp: newXp, level: newLevel, maxHp: newMaxHp, maxMp: newMp, attack: newAttack };
        });
      }

      const updatedEnemies = [...enemies];
      updatedEnemies[enemyIndex] = { ...enemy };
      setEnemies(updatedEnemies);

      enemyTurn();
      checkVictory(updatedEnemies);
      return;
    }

    if (!isSolid(currentLevel.layout, newX, newY)) {
      setPlayer(prev => ({ ...prev, x: newX, y: newY }));
      setNpc(prev => ({ ...prev, x: player.x, y: player.y }));
      
      const itemIndex = items.findIndex(i => i.x === newX && i.y === newY && !i.isDead);
      if (itemIndex !== -1) {
        const item = items[itemIndex];
        if (item.itemType === 'potion') {
          addLog(`¡Recogiste ${item.name}!`);
          setPlayer(prev => ({ 
            ...prev, 
            hp: Math.min(prev.hp + 10, prev.maxHp),
            mp: Math.min((prev.mp ?? 0) + 10, prev.maxMp ?? 10)
          }));
        }
        setItems(prev => prev.map((itm, idx) => idx === itemIndex ? { ...itm, isDead: true } : itm));
      }

      enemyTurn();
    } else {
      addLog("El camino está bloqueado.");
    }
  }, [gameState, player, enemies, items, lastMoveTime, currentLevel]);

  useEffect(() => {
    if (gameState === 'STUDIO_LOGO') {
      const t = setTimeout(() => {
        setGameState('MAIN_MENU');
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'DIALOGUE' || gameState === 'VICTORY') {
        if (e.key === 'Enter' || e.key === ' ') nextDialogue();
        return;
      }
      if (gameState === 'PLAYING') {
        switch (e.key) {
          case 'ArrowUp': case 'w': movePlayer(0, -1); break;
          case 'ArrowDown': case 's': movePlayer(0, 1); break;
          case 'ArrowLeft': case 'a': movePlayer(-1, 0); break;
          case 'ArrowRight': case 'd': movePlayer(1, 0); break;
          case 'b': case 'B': specialAttack(); break;
          case ' ': case 'Enter': normalAttack(); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, movePlayer, nextDialogue, specialAttack, normalAttack]);

  return {
    gameState,
    setGameState,
    currentLevel,
    player,
    enemies,
    items,
    npc,
    currentDialogueLine: currentDialogue[dialogueIndex],
    messageLogs,
    startGame,
    nextDialogue,
    movePlayer,
    normalAttack,
    specialAttack
  };
}
