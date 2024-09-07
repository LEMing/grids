import React, { useEffect, useState } from 'react';
import {
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  FireIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

import './GameToolsMenu.css'; // Подключаем CSS

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
    <div className={`game-tools-menu ${isVisible ? 'show' : ''}`}> {/* Добавляем класс для анимации */}
      <div className="tool-section">
        <h4 className="menu-title">Build</h4>
        <div className="tool-icons">
          <HomeIcon
            className={`tool-icon ${selectedTool === 'house' ? 'selected' : ''}`}
            onClick={() => onSelectTool('house')}
          />
          <BuildingOfficeIcon
            className={`tool-icon ${selectedTool === 'office' ? 'selected' : ''}`}
            onClick={() => onSelectTool('office')}
          />
          <WrenchScrewdriverIcon
            className={`tool-icon ${selectedTool === 'tools' ? 'selected' : ''}`}
            onClick={() => onSelectTool('tools')}
          />
        </div>
      </div>

      {/* Вертикальная разделительная линия */}
      <div className="divider"></div>

      <div className="tool-section">
        <h4 className="menu-title">Manage Units</h4>
        <div className="tool-icons">
          <UsersIcon
            className={`tool-icon ${selectedTool === 'units' ? 'selected' : ''}`}
            onClick={() => onSelectTool('units')}
          />
          <FireIcon
            className={`tool-icon ${selectedTool === 'fire' ? 'selected' : ''}`}
            onClick={() => onSelectTool('fire')}
          />
          <ShieldCheckIcon
            className={`tool-icon ${selectedTool === 'shield' ? 'selected' : ''}`}
            onClick={() => onSelectTool('shield')}
          />
        </div>
      </div>
    </div>
  );
};

export default GameToolsMenu;
