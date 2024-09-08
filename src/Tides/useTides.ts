// useTides.ts
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {ToolsNames} from '../constants.ts';
import HexGrid from './HexGrid/HexGrid.ts';
import TileFactory from './HexGrid/TileFactory';
import { createObject } from './ObjectFactory';
import { handleMouseEvents, handleClickEvent } from './EventHandlers';

const useTides = (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  selectedTool: ToolsNames
) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const hoveredTileRef = useRef<THREE.Object3D | null>(null);

  const { onMouseMove } = handleMouseEvents(camera, scene, raycaster, mouse, hoveredTileRef);

  const onClick = useCallback(async () => {
    await handleClickEvent(camera, scene, selectedTool, hoveredTileRef, createObject);
  }, [camera, scene, selectedTool]);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick);
    };
  }, [onMouseMove, onClick]);

  useEffect(() => {
    if (scene) {
      const hexGrid = new HexGrid(10, 2, new TileFactory());
      hexGrid.addToScene(scene);
    }
  }, [scene]);

  return null;
};

export default useTides;
