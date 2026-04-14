import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GameMap from '../components/GameMap';
import { audioManager } from '../utils/audioManager';

// 地图单元格类型
type CellType = 'empty' | 'wall' | 'block' | 'bomb' | 'player' | 'enemy' | 'item';

// 地图数据结构
type MapData = CellType[][];

const GamePage: React.FC = () => {
  const navigate = useNavigate();

  // 初始地图数据
  const [map, setMap] = useState<MapData>([
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'block', 'empty', 'block', 'empty', 'block', 'empty', 'empty', 'wall'],
    ['wall', 'block', 'wall', 'block', 'wall', 'block', 'wall', 'block', 'block', 'wall'],
    ['wall', 'empty', 'block', 'empty', 'block', 'empty', 'block', 'empty', 'empty', 'wall'],
    ['wall', 'block', 'wall', 'block', 'wall', 'block', 'wall', 'block', 'block', 'wall'],
    ['wall', 'empty', 'block', 'player', 'block', 'empty', 'block', 'enemy', 'empty', 'wall'],
    ['wall', 'block', 'wall', 'block', 'wall', 'block', 'wall', 'block', 'block', 'wall'],
    ['wall', 'empty', 'block', 'empty', 'block', 'empty', 'block', 'empty', 'empty', 'wall'],
    ['wall', 'block', 'wall', 'block', 'wall', 'block', 'wall', 'block', 'block', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ]);

  // 玩家位置
  const [playerPosition, setPlayerPosition] = useState({ x: 3, y: 5 });

  // 敌人位置
  const [enemies, setEnemies] = useState([
    { id: 1, x: 7, y: 5 },
    { id: 2, x: 2, y: 2 },
    { id: 3, x: 7, y: 7 }
  ]);

  // 玩家属性
  const [playerStats, setPlayerStats] = useState({
    bombs: 1,       // 最大炸弹数量
    flameLength: 2, // 火焰长度
    speed: 1        // 移动速度
  });

  // 移动方向
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);

  // 加载音频
  useEffect(() => {
    // 加载音效
    audioManager.loadSound('bomb', 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
    audioManager.loadSound('explosion', 'https://assets.mixkit.co/sfx/preview/mixkit-bomb-explosion-1804.mp3');
    audioManager.loadSound('collect', 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
    
    // 加载背景音乐
    audioManager.loadMusic('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-background-music-729.mp3');
    audioManager.playMusic();

    return () => {
      // 组件卸载时暂停音乐
      audioManager.pauseMusic();
    };
  }, []);

  // 检查移动是否有效
  const canMove = (x: number, y: number): boolean => {
    if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
      return false;
    }
    const cell = map[y][x];
    return cell === 'empty' || cell === 'item';
  };

  // 移动玩家
  const movePlayer = useCallback((newX: number, newY: number) => {
    if (!canMove(newX, newY)) return;

    // 创建新地图
    const newMap = map.map(row => [...row]);
    // 清除旧位置
    newMap[playerPosition.y][playerPosition.x] = 'empty';
    
    // 检查是否是道具
    const cell = map[newY][newX];
    if (cell === 'item') {
      // 播放收集道具音效
      audioManager.playSound('collect');
      
      // 随机道具效果
      const randomEffect = Math.random();
      if (randomEffect < 0.33) {
        // 增加炸弹数量
        setPlayerStats(prev => ({ ...prev, bombs: prev.bombs + 1 }));
      } else if (randomEffect < 0.66) {
        // 增加火焰长度
        setPlayerStats(prev => ({ ...prev, flameLength: prev.flameLength + 1 }));
      } else {
        // 增加速度
        setPlayerStats(prev => ({ ...prev, speed: prev.speed + 0.5 }));
      }
    }
    
    // 设置新位置
    newMap[newY][newX] = 'player';
    // 更新状态
    setMap(newMap);
    setPlayerPosition({ x: newX, y: newY });
  }, [map, playerPosition]);

  // 处理键盘输入
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          movePlayer(playerPosition.x, playerPosition.y - 1);
          break;
        case 'ArrowDown':
          movePlayer(playerPosition.x, playerPosition.y + 1);
          break;
        case 'ArrowLeft':
          movePlayer(playerPosition.x - 1, playerPosition.y);
          break;
        case 'ArrowRight':
          movePlayer(playerPosition.x + 1, playerPosition.y);
          break;
        case ' ': // 空格键放置炸弹
          placeBomb();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPosition, movePlayer]);

  // 敌人AI移动
  useEffect(() => {
    const moveEnemies = () => {
      setEnemies(prevEnemies => {
        const updatedEnemies = prevEnemies.map(enemy => {
          // 随机移动方向
          const directions = [
            { dx: 0, dy: -1 }, // 上
            { dx: 0, dy: 1 },  // 下
            { dx: -1, dy: 0 }, // 左
            { dx: 1, dy: 0 }   // 右
          ];
          
          // 随机选择一个方向
          const randomDirection = directions[Math.floor(Math.random() * directions.length)];
          const newX = enemy.x + randomDirection.dx;
          const newY = enemy.y + randomDirection.dy;
          
          // 检查移动是否有效
          if (newX >= 0 && newX < map[0].length && newY >= 0 && newY < map.length) {
            const cell = map[newY][newX];
            if (cell === 'empty') {
              // 更新地图
              const newMap = map.map(row => [...row]);
              newMap[enemy.y][enemy.x] = 'empty';
              newMap[newY][newX] = 'enemy';
              setMap(newMap);
              
              return { ...enemy, x: newX, y: newY };
            } else if (cell === 'player') {
              // 敌人碰到玩家，游戏失败
              navigate('/gameover', { state: { result: 'lose', score: 0 } });
              return enemy;
            }
          }
          
          return enemy;
        });
        
        // 检查是否所有敌人都被消灭
        if (updatedEnemies.length === 0) {
          navigate('/gameover', { state: { result: 'win', score: 1000 } });
        }
        
        return updatedEnemies;
      });
    };

    // 每1秒移动一次敌人
    const interval = setInterval(moveEnemies, 1000);
    return () => clearInterval(interval);
  }, [map, navigate]);

  // 放置炸弹
  const placeBomb = () => {
    const newMap = map.map(row => [...row]);
    newMap[playerPosition.y][playerPosition.x] = 'bomb';
    setMap(newMap);
    
    // 播放放置炸弹音效
    audioManager.playSound('bomb');

    // 3秒后爆炸
    setTimeout(() => {
      explodeBomb(playerPosition.x, playerPosition.y);
    }, 3000);
  };

  // 炸弹爆炸
  const explodeBomb = (x: number, y: number) => {
    const newMap = map.map(row => [...row]);
    // 清除炸弹
    newMap[y][x] = 'empty';
    
    // 播放爆炸音效
    audioManager.playSound('explosion');
    
    // 火焰传播范围（上下左右各2格）
    const directions = [
      { dx: 0, dy: -1 }, // 上
      { dx: 0, dy: 1 },  // 下
      { dx: -1, dy: 0 }, // 左
      { dx: 1, dy: 0 }   // 右
    ];
    
    // 火焰长度
    const flameLength = playerStats.flameLength;
    
    // 处理爆炸中心点
    // 处理火焰传播
    directions.forEach(({ dx, dy }) => {
      for (let i = 1; i <= flameLength; i++) {
        const nx = x + dx * i;
        const ny = y + dy * i;
        
        // 检查边界
        if (nx < 0 || nx >= map[0].length || ny < 0 || ny >= map.length) {
          break;
        }
        
        const cell = map[ny][nx];
        
        // 如果遇到墙壁，停止传播
        if (cell === 'wall') {
          break;
        }
        
        // 破坏砖块
        if (cell === 'block') {
          newMap[ny][nx] = 'empty';
          // 有一定概率生成道具
          if (Math.random() < 0.3) {
            newMap[ny][nx] = 'item';
          }
          break;
        }
        
        // 清除敌人
        if (cell === 'enemy') {
          newMap[ny][nx] = 'empty';
          // 从敌人数组中移除被消灭的敌人
          setEnemies(prevEnemies => prevEnemies.filter(enemy => !(enemy.x === nx && enemy.y === ny)));
        }
        
        // 清除其他炸弹
        if (cell === 'bomb') {
          newMap[ny][nx] = 'empty';
          // 递归触发其他炸弹爆炸
          setTimeout(() => {
            explodeBomb(nx, ny);
          }, 100);
        }
      }
    });
    
    setMap(newMap);
  };

  // 处理触摸控制
  const handleTouchMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    switch (direction) {
      case 'up':
        movePlayer(playerPosition.x, playerPosition.y - 1);
        break;
      case 'down':
        movePlayer(playerPosition.x, playerPosition.y + 1);
        break;
      case 'left':
        movePlayer(playerPosition.x - 1, playerPosition.y);
        break;
      case 'right':
        movePlayer(playerPosition.x + 1, playerPosition.y);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-white mb-4">游戏界面</h1>
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-4 flex flex-col items-center">
        <GameMap mapData={map} cellSize={32} />
        <div className="mt-4 flex justify-between w-full">
          <div className="text-white">分数: 0</div>
          <div className="text-white">生命: 3</div>
        </div>
        <div className="mt-2 flex justify-between w-full text-sm text-gray-300">
          <div>炸弹: {playerStats.bombs}</div>
          <div>火焰: {playerStats.flameLength}</div>
          <div>速度: {playerStats.speed}</div>
        </div>
      </div>
      
      {/* 虚拟方向键（移动端） */}
      <div className="mt-6 grid grid-cols-3 gap-2 w-48">
        <div className="col-start-2">
          <button 
            onClick={() => handleTouchMove('up')}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            ↑
          </button>
        </div>
        <div>
          <button 
            onClick={() => handleTouchMove('left')}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            ←
          </button>
        </div>
        <div>
          <button 
            onClick={() => handleTouchMove('down')}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            ↓
          </button>
        </div>
        <div>
          <button 
            onClick={() => handleTouchMove('right')}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            →
          </button>
        </div>
      </div>
      
      {/* 炸弹按钮 */}
      <button 
        onClick={placeBomb}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-8 rounded"
      >
        放置炸弹
      </button>
      
      <button 
        onClick={() => navigate('/gameover')}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        结束游戏
      </button>
    </div>
  );
};

export default GamePage;