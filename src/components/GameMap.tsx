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
    let className = 'border border-gray-700';
    
    switch (cell) {
      case 'wall':
        className += ' bg-gray-800';
        break;
      case 'block':
        className += ' bg-yellow-600';
        break;
      case 'bomb':
        className += ' bg-red-500 rounded-full';
        break;
      case 'player':
        className += ' bg-blue-500 rounded-full';
        break;
      case 'enemy':
        className += ' bg-green-500 rounded-full';
        break;
      case 'item':
        className += ' bg-purple-500 rounded-full';
        break;
      default:
        className += ' bg-gray-700';
    }
    
    return (
      <div
        key={`${row}-${col}`}
        className={className}
        style={{
          width: cellSize,
          height: cellSize,
          display: 'inline-block',
        }}
      />
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