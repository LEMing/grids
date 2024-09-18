import React, { useEffect, useState } from 'react';
import './StatusPanel.css'; // Подключаем локальный CSS

interface StatusPanelProps {
  resources: number;
  money: number;
  sciencePoints: number;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ resources, money, sciencePoints }) => {
  const [isVisible, setIsVisible] = useState(false); // Управляем видимостью панели

  // После загрузки страницы запускаем анимацию
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Задержка для плавного выезда после загрузки

    return () => clearTimeout(timer); // Очищаем таймер
  }, []);

  return (
    <div className={`status-panel menu-panel ${isVisible ? 'show' : ''}`}>
      <div className="status-item">
        <span className="status-label">Resources:</span>💎 {resources}
      </div>
      <div className="status-item">
        <span className="status-label">Money:</span>💰 {money}
      </div>
      <div className="status-item">
        <span className="status-label">Science Points:</span>📚 {sciencePoints}
      </div>
    </div>
  );
};

export default StatusPanel;
