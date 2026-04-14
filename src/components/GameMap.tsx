import React from 'react';

// 地图单元格类型
type CellType = 'empty' | 'wall' | 'block' | 'bomb' | 'player' | 'enemy' | 'item';

// 地图数据结构
type MapData = CellType[][];

interface GameMapProps {
  mapData: MapData;
  cellSize?: number;
}

const GameMap: React.FC<GameMapProps> = ({ mapData, cellSize = 32 }) => {
  // 渲染单个单元格
  const renderCell = (cell: CellType, row: number, col: number) => {
    let className = 'border border-gray-700 relative';
    
    switch (cell) {
      case 'wall':
        className += ' bg-gray-800';
        break;
      case 'block':
        className += ' bg-yellow-600';
        break;
      case 'bomb':
        className += ' bg-gray-900 relative';
        break;
      case 'player':
        className += ' bg-transparent flex items-center justify-center';
        break;
      case 'enemy':
        className += ' bg-transparent flex items-center justify-center';
        break;
      case 'item':
        className += ' bg-transparent flex items-center justify-center';
        break;
      default:
        className += ' bg-gray-700';
    }
    
    const renderContent = () => {
      switch (cell) {
        case 'bomb':
          return (
            <div className="w-3/4 h-3/4 bg-red-500 rounded-full relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-yellow-300 rounded-full"></div>
            </div>
          );
        case 'player':
          return (
            <div className="w-3/4 h-3/4 flex flex-col items-center justify-center">
              <div className="w-3/4 h-3/4 bg-blue-500 rounded-full relative">
                <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white rounded-full"></div>
                <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-white rounded-full"></div>
                <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-1/2 h-1/4 bg-red-400 rounded-full"></div>
              </div>
            </div>
          );
        case 'enemy':
          return (
            <div className="w-3/4 h-3/4 flex flex-col items-center justify-center">
              <div className="w-3/4 h-3/4 bg-green-500 rounded-full relative">
                <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white rounded-full"></div>
                <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-white rounded-full"></div>
                <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-1/2 h-1/4 bg-red-400 rounded-full"></div>
                <div className="absolute -top-1/8 -right-1/8 w-1/4 h-1/4 bg-red-500 rounded-full"></div>
              </div>
            </div>
          );
        case 'item':
          return (
            <div className="w-3/4 h-3/4 flex items-center justify-center">
              <div className="w-2/3 h-2/3 bg-purple-500 rounded-lg transform rotate-45"></div>
            </div>
          );
        default:
          return null;
      }
    };
    
    return (
      <div
        key={`${row}-${col}`}
        className={className}
        style={{
          width: cellSize,
          height: cellSize,
          display: 'inline-block',
        }}
      >
        {renderContent()}
      </div>
    );
  };

  return (
    <div className="inline-block">
      {mapData.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
        </div>
      ))}
    </div>
  );
};

export default GameMap;