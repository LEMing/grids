import {useCallback, useEffect, useMemo, useState} from 'react';
import * as THREE from 'three';
import { ToolsNames } from '../constants';
import HexGrid from './HexGrid/HexGrid.ts';
import Tile from './HexGrid/Tile';
import TileFactory from './HexGrid/TileFactory.ts';
import {objectFactory} from './ObjectFactory.ts';
import { UnitController } from './UnitController';
import { EventManager } from './EventManager';

const useGame = (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  selectedTool: ToolsNames
) => {
  const [selectedUnit, setSelectedUnit] = useState<THREE.Object3D | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [_, setAllTiles] = useState<Tile[]>([]);

  // Extracted logic to controllers
  const unitController = useMemo(() => {
    return new UnitController(setSelectedUnit, setMixer, mixer, selectedUnit);
  }, [mixer, selectedUnit]);

  const eventManager = useMemo(() => {
    if (!camera || !scene) return null;
    return new EventManager(camera, scene)
  }, [camera]);

  const onMove = useCallback((event: MouseEvent) => {
    if (!eventManager) return;
    eventManager.onMouseMove(event);
  }, [eventManager]);

  const onClick = useCallback(async (event: MouseEvent) => {
    if (!eventManager) return;
    await eventManager.onMouseClick(event, selectedTool, objectFactory);
  }, [eventManager]);

  useEffect(() => {
    if (scene) {
      const hexGrid = new HexGrid(10, 2, new TileFactory());
      hexGrid.addToScene(scene);
      setAllTiles(hexGrid.getAllTiles());
    }
  }, [scene]);

  // Centralized event listeners handling
  useEffect(() => {
    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick);
    };
  }, [onMove, onClick]);

  // Animation handling moved to UnitController
  useEffect(() => {
    unitController.animate();
  }, [mixer, unitController]);

  return null;
};

export default useGame;
