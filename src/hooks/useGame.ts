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
  const [mapLayout, setMapLayout] = useState<number[][]>([]);
  
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

    setPlayer({ ...pBase, hp: pBase.maxHp, mp: pBase.maxMp ?? 10, isDead: false, x: level.playerStart.x, y: level.playerStart.y });
    if (level.npcStart) {
      setNpc(prev => ({ ...prev, x: level.npcStart!.x, y: level.npcStart!.y }));
    } else {
      setNpc(prev => ({ ...prev, x: -1, y: -1 }));
    }
    setEnemies(JSON.parse(JSON.stringify(level.enemies)));
    setItems(JSON.parse(JSON.stringify(level.items)));
    setMapLayout(JSON.parse(JSON.stringify(level.layout)));
    setCurrentDialogue(level.introDialogue);
    setDialogueIndex(0);
    setMessageLogs([`Entraste a ${level.name}.`]);
    setGameState('DIALOGUE');
  };

  const startGame = () => {
    setLevelIndex(0);
    loadLevel(0, extractBasePlayer(null));
  };

  const restartFromCheckpoint = () => {
    loadLevel(levelIndex, player);
  };

  const nextDialogue = () => {
    const currentLine = currentDialogue[dialogueIndex];
    if (currentLine?.options && currentLine.options.length > 0) {
      return; // Do not proceed. Must choose an option.
    }

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

  const selectDialogueOption = (optionIndex: number) => {
    const currentLine = currentDialogue[dialogueIndex];
    if (currentLine && currentLine.options) {
      const option = currentLine.options[optionIndex];
      if (option) {
         const newDialogue = [...currentDialogue.slice(0, dialogueIndex + 1), ...option.response];
         setCurrentDialogue(newDialogue);
         setDialogueIndex(prev => prev + 1);
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
          
          if (dx !== 0 && !isSolid(mapLayout, enemy.x + dx, enemy.y) && !currentEnemies.some(e => e.id !== enemy.id && !e.isDead && e.x === enemy.x + dx && e.y === enemy.y)) {
            return { ...enemy, x: enemy.x + dx };
          } else if (dy !== 0 && !isSolid(mapLayout, enemy.x, enemy.y + dy) && !currentEnemies.some(e => e.id !== enemy.id && !e.isDead && e.x === enemy.x && e.y === enemy.y + dy)) {
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
    if (currentEnemies.filter(e => e.type !== 'npc').every(e => e.isDead)) {
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

    const aliveEnemies = enemies.filter(e => !e.isDead && e.type !== 'npc');
    let targetEnemy = null;
    let minEnemyD = 999;
    for (const e of aliveEnemies) {
      const d = Math.abs(e.x - player.x) + Math.abs(e.y - player.y);
      if (d <= 3 && d < minEnemyD) {
        minEnemyD = d;
        targetEnemy = e;
      }
    }

    let treeTarget: {x: number, y: number} | null = null;
    let minTreeD = 999;
    for (let y = 0; y < mapLayout.length; y++) {
      for (let x = 0; x < mapLayout[y].length; x++) {
        if (mapLayout[y][x] === 2 || mapLayout[y][x] === 6) { // bushes too? user just said trees: "srboles"
          const d = Math.abs(x - player.x) + Math.abs(y - player.y);
          if (d <= 2 && d < minTreeD) {
            minTreeD = d;
            treeTarget = { x, y };
          }
        }
      }
    }

    if (!targetEnemy && !treeTarget) {
      addLog("No hay objetivos cerca.");
      return;
    }

    setPlayer(prev => ({ ...prev, mp: Math.max(0, (prev.mp ?? 0) - 5) }));

    if (treeTarget && minTreeD <= minEnemyD) {
      setMapLayout(prev => {
        const next = prev.map(row => [...row]);
        next[treeTarget!.y][treeTarget!.x] = 0;
        return next;
      });
      addLog("¡Magia! Dhalia quema un árbol y abre el paso.");
      enemyTurn();
    } else if (targetEnemy) {
      const damage = player.attack * 2;
      const newEnemies = enemies.map(e => {
        if (e.id === targetEnemy?.id) {
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
    }
  }, [gameState, player, enemies, mapLayout]);

  const normalAttack = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    if (player.isDead) return;

    const enemyIndex = enemies.findIndex(e => !e.isDead && e.type !== 'npc' && (Math.abs(e.x - player.x) + Math.abs(e.y - player.y)) === 1);
    
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
      let rockTarget: {x: number, y: number} | null = null;
      for (let y = 0; y < mapLayout.length; y++) {
        for (let x = 0; x < mapLayout[y].length; x++) {
          if (mapLayout[y][x] === 5) {
            const d = Math.abs(x - player.x) + Math.abs(y - player.y);
            if (d === 1) {
              rockTarget = { x, y };
              break;
            }
          }
        }
        if (rockTarget) break;
      }

      if (rockTarget) {
        setMapLayout(prev => {
          const next = prev.map(row => [...row]);
          next[rockTarget!.y][rockTarget!.x] = 0;
          return next;
        });
        
        let newHp = Math.max(0, player.hp - 2);
        setPlayer(prev => ({ ...prev, hp: newHp }));
        
        if (newHp === 0) {
          addLog("Emeo destruyó una roca, pero el golpe fue mortal...");
          setPlayer(prev => ({ ...prev, isDead: true }));
          setGameState('GAME_OVER');
          return;
        } else {
          addLog("¡Emeo destruyó una roca! Recibe 2 de daño por el impacto.");
        }
        enemyTurn();
      } else {
        addLog("Lanzas un golpe al aire. (No hay objetivos cerca)");
      }
    }
  }, [gameState, player, enemies, currentLevel, mapLayout]);

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
      
      if (enemy.type === 'npc') {
        let dialogueSequence: DialogueLine[] = [];
        if (enemy.name === 'Anciano Mayor') {
            dialogueSequence = [
              { speaker: enemy.name, text: '¡Emeo, muchacho! Qué bueno verte.' },
              { 
                speaker: enemy.name, 
                text: 'Cuidado con el bosque, se dice que puedes romper rocas si tienes la fuerza. ¿Entendido?',
                options: [
                  { label: 'Sí, lo entiendo.', response: [{ speaker: 'Emeo', text: 'Entendido. Lo tendré en cuenta, anciano.' }] },
                  { label: '¿Cómo romper rocas?', response: [{ speaker: enemy.name, text: 'Golpea las rocas con tu espada [Pulsa Espacio o A].' }] },
                  { label: 'No tengo tiempo.', response: [{ speaker: 'Emeo', text: 'Tengo prisa, debo irme ya.' }] }
                ]
              }
            ];
        } else if (enemy.name === 'Aldeano') {
            dialogueSequence = [
              { speaker: enemy.name, text: 'Ah, Emeo. La oscuridad de las cuevas es terrible...' },
              { 
                speaker: enemy.name, 
                text: 'Muchos monstruos acechan allí. ¿Crees que podrás con ellos?',
                options: [
                  { label: 'Claro, soy fuerte.', response: [{ speaker: 'Emeo', text: 'No te preocupes, yo me haré cargo de ellos.' }] },
                  { label: 'Tengo mis dudas.', response: [{ speaker: 'Emeo', text: 'La verdad es que estoy un poco asustado.' }, { speaker: enemy.name, text: 'Ten cuidado entonces...' }] },
                  { label: '...', response: [{ speaker: 'Emeo', text: '...' }] }
                ]
              }
            ];
        } else {
            dialogueSequence = [
              { speaker: enemy.name, text: '¡Hola, Emeo! Suerte en tu aventura.' }
            ];
        }
        setCurrentDialogue(dialogueSequence);
        setDialogueIndex(0);
        setGameState('DIALOGUE');
        return;
      }

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

    if (!isSolid(mapLayout, newX, newY)) {
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
    } else if (mapLayout[newY]?.[newX] === 5) {
      // Rock
      const nextX = newX + dx;
      const nextY = newY + dy;
      if (!isSolid(mapLayout, nextX, nextY)) {
        const enemyAt = enemies.find(e => e.x === nextX && e.y === nextY && !e.isDead);
        const npcAt = npc.x === nextX && npc.y === nextY;
        const itemAt = items.find(i => i.x === nextX && i.y === nextY && !i.isDead);
        
        if (!enemyAt && !npcAt && !itemAt) {
          addLog("¡Empujaste una roca!");
          setMapLayout(prev => {
            const next = prev.map(row => [...row]);
            next[newY][newX] = 0;
            next[nextY][nextX] = 5;
            return next;
          });
          setPlayer(prev => ({ ...prev, x: newX, y: newY }));
          setNpc(prev => ({ ...prev, x: player.x, y: player.y }));
          enemyTurn();
          return;
        } else {
          addLog("Algo bloquea la roca.");
        }
      } else if (mapLayout[nextY]?.[nextX] === 5) {
        const nextNextX = nextX + dx;
        const nextNextY = nextY + dy;
        if (!isSolid(mapLayout, nextNextX, nextNextY)) {
          const enemyAt = enemies.find(e => e.x === nextNextX && e.y === nextNextY && !e.isDead);
          const npcAt = npc.x === nextNextX && npc.y === nextNextY;
          const itemAt = items.find(i => i.x === nextNextX && i.y === nextNextY && !i.isDead);
          
          if (!enemyAt && !npcAt && !itemAt) {
            addLog("¡Empujaste dos rocas!");
            setMapLayout(prev => {
              const next = prev.map(row => [...row]);
              next[newY][newX] = 0;
              // next[nextY][nextX] = 5; // This is already 5
              next[nextNextY][nextNextX] = 5;
              return next;
            });
            setPlayer(prev => ({ ...prev, x: newX, y: newY }));
            setNpc(prev => ({ ...prev, x: player.x, y: player.y }));
            enemyTurn();
            return;
          } else {
            addLog("Algo bloquea las rocas.");
          }
        } else {
          addLog("Las rocas no se pueden mover más.");
        }
      } else {
        addLog("La roca no se puede mover más.");
      }
    } else {
      addLog("El camino está bloqueado.");
    }
  }, [gameState, player, enemies, items, lastMoveTime, mapLayout, npc]);

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
    mapLayout,
    player,
    enemies,
    items,
    npc,
    currentDialogueLine: currentDialogue[dialogueIndex],
    messageLogs,
    startGame,
    restartFromCheckpoint,
    nextDialogue,
    selectDialogueOption,
    movePlayer,
    normalAttack,
    specialAttack
  };
}
