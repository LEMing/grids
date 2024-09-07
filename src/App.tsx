import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { SimpleViewer, type SimpleViewerOptions, defaultOptions } from 'threedviewer';
import useTides from './Tides/useTides';
import GameToolsMenu from './GameToolsMenu'; // Подключаем меню инструментов

import './App.css'; // Можно добавить свой стиль для всей страницы

const App: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('house'); // Текущий инструмент

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
      helpers: {
        ...defaultOptions.helpers,
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

  // Логика для управления плитками (Tides)
  useTides(camera, scene);

  // Функция выбора инструмента
  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    console.log(`Selected tool: ${tool}`);
  };

  return (
    <div className="app-wrapper">
      <GameToolsMenu selectedTool={selectedTool} onSelectTool={handleToolSelect} /> {/* Меню инструментов */}
      <div className="viewer-container"> {/* Контейнер для SimpleViewer */}
        <SimpleViewer object={null} options={options} />
      </div>
    </div>
  );
};

export default App;
