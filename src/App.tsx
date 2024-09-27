import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {defaultOptions, SimpleViewer, type SimpleViewerOptions} from 'threedviewer';
import {ToolsNames} from './constants.ts';
import GameToolsMenu from './GameToolsMenu'; // Подключаем меню инструментов
import StatusPanel from './StatusPanel/StatusPanel.tsx';
import useGame from './Tides/useGame.ts';
import './App.css';

const App: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [renderer, setRenderer] = useState<THREE.Renderer | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolsNames>(ToolsNames.SELECT);

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

    if (rendererRef.current) {
      setRenderer(rendererRef.current);
    }
  }, []);

  const options: SimpleViewerOptions = useMemo(() => {
    return {
      ...defaultOptions,
      usePathTracing: true,
      maxSamplesPathTracing: 300,
      staticScene: true,
      envMapUrl: 'https://cdn.polyhaven.com/asset_img/primary/autumn_field.png?height=720', //
      backgroundColor: '#000000',
      camera: {
        ...defaultOptions.camera,
        cameraPosition: [12 * 6, 12 * 6, 12 * 6],
        cameraTarget: [0, 0, 0],
        cameraFov: 50, // From initializeCamera
        cameraNear: 0.1, // From initializeCamera
        cameraFar: 100000, // From initializeCamera
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
      lightning: {
        ambientLight: {
          color: '#404040',
          intensity: Math.PI,
        },
        hemisphereLight: {
          skyColor: '#ffffbb',
          groundColor: '#080820',
          intensity: 1,
        },
        directionalLight: {
          color: '#ffffff',
          intensity: Math.PI,
          position: new THREE.Vector3(6, 6, 6),
          castShadow: true,
          shadow: {
            mapSize: {
              width: 4096,
              height: 4096,
            },
            camera: {
              near: 0.5,
              far: 50,
              left: -10,
              right: 10,
              top: 10,
              bottom: -10,
            },
            bias: -0.0001,
            radius: 1,
          },
        },
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
  useGame(camera, scene, renderer, selectedTool);

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
