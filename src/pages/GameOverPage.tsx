import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface GameOverPageProps {
  // 可选的props
}

const GameOverPage: React.FC<GameOverPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 从location.state获取游戏结果和分数
  const [gameResult, setGameResult] = useState<'win' | 'lose'>('lose');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    // 从本地存储获取最高分数
    const savedHighScore = localStorage.getItem('bombManHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }

    // 从location.state获取游戏结果和分数
    if (location.state) {
      const state = location.state as { result: 'win' | 'lose'; score: number };
      setGameResult(state.result);
      setScore(state.score);
      
      // 更新最高分数
      if (state.score > highScore) {
        setHighScore(state.score);
        localStorage.setItem('bombManHighScore', state.score.toString());
      }
    }
  }, [location.state, highScore]);

  const handleRestart = () => {
    navigate('/game');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
      gameResult === 'win' ? 'bg-gradient-to-br from-green-400 to-blue-400' : 'bg-gradient-to-br from-red-400 to-orange-400'
    }`}>
      <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">
        {gameResult === 'win' ? '游戏胜利！' : '游戏失败'}
      </h1>
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
        <div className="text-center mb-6">
          <p className="text-2xl font-bold text-gray-800">最终分数: {score}</p>
          <p className="text-gray-600 mt-2">最高分数: {highScore}</p>
        </div>
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleRestart}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            重新开始
          </button>
          <button 
            onClick={handleBackHome}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-all duration-300"
          >
            返回主页
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverPage;