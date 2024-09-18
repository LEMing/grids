import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {defaultOptions, SimpleViewer, type SimpleViewerOptions} from 'threedviewer';
import {ToolsNames} from './constants.ts';
import GameToolsMenu from './GameToolsMenu'; // Подключаем меню инструментов
import StatusPanel from './StatusPanel/StatusPanel.tsx';
import useGame from './Tides/useGame.ts';
import './App.css'; // Можно добавить свой стиль для всей страницы

const App: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolsNames>(ToolsNames.SELECT); // Текущий инструмент

  const resources = 150;
  const money = 1000;
  const sciencePoints = 75;

  useEffect(() => {
    if (cameraRef.current) {
      setCamera(cameraRef.current);
    }

    if (sceneRef.current) {
      setScene(sceneRef.current);
    }
  }, [sceneRef, cameraRef]);

  const options: SimpleViewerOptions = useMemo(() => {
    return {
      ...defaultOptions,
      staticScene: false,
      backgroundColor: '#000000',
      camera: {
        ...defaultOptions.camera,
        cameraPosition: [12 * 6, 12 * 6, 12 * 6],
        cameraTarget: [0, 0, 0],
        fov: 60,
        autoFitToObject: false,
      },
      controls: {
        ...defaultOptions.controls,
        type: 'OrbitControls',
      },
      helpers: {
        ...defaultOptions.helpers,
        addGizmo: false,
        gridHelper: false,
        color: '#ff0000',
      },
      lights: {
        ambient: { intensity: 0.5 },
        directional: { position: [10, 10, 5] },
      },
      threeBaseRefs: {
        scene: sceneRef,
        camera: cameraRef,
        mountPoint: mountRef,
        controls: controlsRef,
        renderer: rendererRef,
      },
    };
  }, []);

  // Передаём selectedTool в useTides для управления объектами на сцене
  useGame(camera, scene, selectedTool);

  // Функция выбора инструмента
  const handleToolSelect = (tool: ToolsNames) => {
    setSelectedTool(tool);
  };

  return (
    <div className="app-wrapper">
      <GameToolsMenu selectedTool={selectedTool} onSelectTool={handleToolSelect} /> {/* Меню инструментов */}
      <StatusPanel resources={resources} money={money} sciencePoints={sciencePoints} /> {/* Панель статуса */}

      <div className="viewer-container"> {/* Контейнер для SimpleViewer */}
        <SimpleViewer object={null} options={options} />
      </div>
    </div>
  );
};

export default App;
