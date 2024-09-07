import React from 'react';
import './StatusPanel.css'; // Подключаем локальный CSS

interface StatusPanelProps {
  resources: number;
  money: number;
  sciencePoints: number;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ resources, money, sciencePoints }) => {
  return (
    <div className="status-panel menu-panel">
      <div className="status-item">
        <span className="status-label">Resources:</span>💎 {resources}
      </div>
      <div className="status-item">
        <span className="status-label">Money:</span>💰 {money}
      </div>
      <div className="status-item">
        <span className="status-label">Science Points:</span>📚  {sciencePoints}
      </div>
    </div>
  );
};

export default StatusPanel;
