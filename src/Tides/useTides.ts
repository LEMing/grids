import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ToolsNames } from '../constants.ts';
import HexGrid from './HexGrid/HexGrid.ts';
import Tile from './HexGrid/Tile.ts';
import TileFactory from './HexGrid/TileFactory';
import { createObject } from './ObjectFactory';
import { handleMouseEvents, handleClickEvent } from './EventHandlers';
import { moveUnitToTile } from './unitMovement';
import { animateUnit, stopAnimation } from './unitAnimation';
import { findPath } from './pathFinding';
import { drawPath } from './pathVisualization';

const useTides = (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  selectedTool: ToolsNames
) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const hoveredTileRef = useRef<Tile | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<THREE.Object3D | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [pathLine, setPathLine] = useState<THREE.Line | null>(null);
  const [allTiles, setAllTiles] = useState<Tile[]>([]);

  const { onMouseMove } = handleMouseEvents(camera, scene, raycaster, mouse, hoveredTileRef);

  const onClick = useCallback(async () => {
    if (!allTiles.length) return;

    if (selectedTool === ToolsNames.MOVE && hoveredTileRef.current) {
      const tile = hoveredTileRef.current;

      if (selectedUnit) {
        if (tile) {
          console.log('Looking for startTile with selectedUnit userData:', selectedUnit?.userData);
          console.log('Looking for endTile with hoveredTile userData:', tile.linkToObject3D?.userData);

          const startTile = allTiles.find(t => {
            if (!t.linkToObject3D) return false;
            return t.hexCoordinates.q === selectedUnit.userData.q && t.hexCoordinates.r === selectedUnit.userData.r;
          });

          const endTile = allTiles.find(t => {
            if (!t.linkToObject3D) return false;
            return t.hexCoordinates.q === tile.hexCoordinates.q && t.hexCoordinates.r === tile.hexCoordinates.r;
          });

          console.log('Found startTile:', startTile);
          console.log('Found endTile:', endTile);

          if (!startTile || !endTile) {
            console.error('Start or end tile not found.');
            return;
          }

          // Подсвечиваем startTile и endTile
          startTile.highlightTile(0xff0000); // Красный для начала
          endTile.highlightTile(0x0000ff);   // Синий для конца

          // Поиск пути
          const path = findPath(startTile, endTile, allTiles);
          if (pathLine) scene?.remove(pathLine); // Удаляем предыдущую линию
          const newPathLine = drawPath(path, scene as THREE.Scene);
          setPathLine(newPathLine);

          // Анимация перемещения юнита по пути
          for (const pathTile of path) {
            await moveUnitToTile(selectedUnit, pathTile.linkToObject3D as THREE.Mesh);
          }

          // Возвращаем исходные цвета тайлов
          startTile.resetTileHighlight(0x00ff00); // Вернуть исходный цвет для startTile
          endTile.resetTileHighlight(0x00ff00);   // Вернуть исходный цвет для endTile

          stopAnimation(mixer, setMixer);
          setSelectedUnit(null);
        } else {
          stopAnimation(mixer, setMixer);
          setSelectedUnit(null);
        }
      } else {
        if (tile.room.children[0].userData && tile.room.children[0].userData.type === 'unit') {
          // Убедимся, что при выборе юнита передаются его координаты
          setSelectedUnit(tile.room.children[0]);

          animateUnit(tile.room.children[0], setMixer);
        }
      }
    } else {
      await handleClickEvent(camera, scene, selectedTool, hoveredTileRef, createObject);
    }
  }, [camera, scene, selectedTool, selectedUnit, hoveredTileRef, mixer, allTiles, pathLine]);

  useEffect(() => {
    if (scene) {
      const hexGrid = new HexGrid(10, 2, new TileFactory());
      hexGrid.addToScene(scene);
      const tiles = hexGrid.getAllTiles();
      setAllTiles(tiles);
    }
  }, [scene]);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick);
    };
  }, [onMouseMove, onClick]);

  useEffect(() => {
    const clock = new THREE.Clock();

    const animate = () => {
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [mixer]);

  return null;
};

export default useTides;
