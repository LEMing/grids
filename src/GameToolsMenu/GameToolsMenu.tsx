import React, { useEffect, useState } from 'react';
import {
  FireIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  CursorArrowRaysIcon,
  ArrowTrendingUpIcon,
  UserPlusIcon
} from '@heroicons/react/16/solid';

import './GameToolsMenu.css';
import {ToolsNames} from '../constants.ts'; // Подключаем CSS

interface GameToolsMenuProps {
  selectedTool: string;
  onSelectTool: (tool: string) => void;
}

const GameToolsMenu: React.FC<GameToolsMenuProps> = ({ selectedTool, onSelectTool }) => {
  const [isVisible, setIsVisible] = useState(false); // Управляем видимостью

  // После загрузки страницы запускаем анимацию
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Задержка для плавного выезда после загрузки

    return () => clearTimeout(timer); // Очищаем таймер, чтобы избежать утечек памяти
  }, []);

  return (
    <div className={`game-tools-menu menu-panel ${isVisible ? 'show' : ''}`}> {/* Добавляем класс для анимации */}
      <div className="tool-section">
        <h4 className="menu-title">Build</h4>
        <div className="tool-icons">
          <BuildingStorefrontIcon
            className={`tool-icon ${selectedTool === ToolsNames.STORE ? 'selected' : ''}`}
            onClick={() => onSelectTool(ToolsNames.STORE)}
          />
          <BuildingOfficeIcon
            className={`tool-icon ${selectedTool === ToolsNames.WALL ? 'selected' : ''}`}
            onClick={() => onSelectTool(ToolsNames.WALL)}
          />
          <UserPlusIcon
            className={`tool-icon ${selectedTool === ToolsNames.UNIT ? 'selected' : ''}`}
            onClick={() => onSelectTool(ToolsNames.UNIT)}
          />
        </div>
      </div>

      {/* Вертикальная разделительная линия */}
      <div className="divider"></div>

      <div className="tool-section">
        <h4 className="menu-title">Manage Units</h4>
        <div className="tool-icons">
          <CursorArrowRaysIcon
            className={`tool-icon ${selectedTool === ToolsNames.SELECT ? 'selected' : ''}`}
            onClick={() => onSelectTool(ToolsNames.SELECT)}
          />
          <ArrowTrendingUpIcon
            className={`tool-icon ${selectedTool === ToolsNames.MOVE ? 'selected' : ''}`}
            onClick={() => onSelectTool(ToolsNames.MOVE)}
          />
          <FireIcon
            className={`tool-icon ${selectedTool === ToolsNames.FIRE ? 'selected' : ''}`}
            onClick={() => onSelectTool(ToolsNames.FIRE)}
          />
        </div>
      </div>
    </div>
  );
};

export default GameToolsMenu;
