import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { audioManager } from '../utils/audioManager';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());

  const handleStartGame = () => {
    navigate('/game');
  };

  const toggleMute = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-400 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 text-center drop-shadow-lg">
        泡泡堂
      </h1>
      <button 
        onClick={handleStartGame}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-110 shadow-lg"
      >
        开始游戏
      </button>
      <div className="mt-8">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          设置
        </button>
        
        {showSettings && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-800">音效</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={!isMuted}
                  onChange={toggleMute}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;