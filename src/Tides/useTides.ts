import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import HexGrid from './HexGrid/HexGrid.ts';
import TileFactory from './HexGrid/TileFactory';
import { handleMouseMove } from './mouseHandler';

const useTides = (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null
) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const hoveredTileRef = useRef<THREE.Object3D | null>(null);

  const onDocumentMouseMove = useCallback((event: MouseEvent) => {
    if (camera && scene) {
      handleMouseMove(event, camera, scene, raycaster, mouse, hoveredTileRef);
    }
  }, [camera, scene]);

  useEffect(() => {
    document.addEventListener('mousemove', onDocumentMouseMove);
    return () => document.removeEventListener('mousemove', onDocumentMouseMove);
  }, [onDocumentMouseMove]);

  useEffect(() => {
    if (scene) {
      const hexGrid = new HexGrid(10, 2, new TileFactory());
      hexGrid.addToScene(scene);
    }
  }, [scene]);

  return null;
};

export default useTides;
