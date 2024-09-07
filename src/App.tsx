import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import { SimpleViewer, type SimpleViewerOptions, defaultOptions } from 'threedviewer';
import useTides from './Tides/useTides';

import './App.css'

const App: React.FC = () => {

  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);

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
        directional: { position: [10, 10, 5] }
      },
      threeBaseRefs: {
        scene: sceneRef,
        camera: cameraRef,
        mountPoint: mountRef,
        controls: controlsRef,
        renderer: rendererRef,
      }
    }
  }, []);

  useTides(camera, scene);

  return (
    <div className="app-wrapper">
      <SimpleViewer object={null} options={options} />
    </div>
  );
};

export default App;
