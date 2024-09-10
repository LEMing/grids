import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ToolsNames } from '../constants.ts';
import HexGrid from './HexGrid/HexGrid.ts';
import Tile from './HexGrid/Tile.ts';
import TileFactory from './HexGrid/TileFactory';
import { createObject } from './ObjectFactory';
import { handleMouseEvents, handleClickEvent } from './EventHandlers';
import { highlightTile, resetTileHighlight } from './tileUtils.ts';
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
  const hoveredTileRef = useRef<THREE.Object3D | null>(null);
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
        if (tile.userData && tile.userData.type !== 'unit') {
          console.log('Looking for startTile with selectedUnit userData:', selectedUnit?.userData);
          console.log('Looking for endTile with hoveredTile userData:', tile?.userData);

          const startTile = allTiles.find(t => {
            if (!t.linkToMesh) return false;
            return t.hexCoordinates.q === selectedUnit.userData.q && t.hexCoordinates.r === selectedUnit.userData.r;
          });

          const endTile = allTiles.find(t => {
            if (!t.linkToMesh) return false;
            return t.hexCoordinates.q === tile.userData.q && t.hexCoordinates.r === tile.userData.r;
          });

          console.log('Found startTile:', startTile);
          console.log('Found endTile:', endTile);

          if (!startTile || !endTile) {
            console.error('Start or end tile not found.');
            return;
          }

          // Подсвечиваем startTile и endTile
          highlightTile(startTile, 0xff0000); // Красный для начала
          highlightTile(endTile, 0x0000ff);   // Синий для конца

          // Поиск пути
          const path = findPath(startTile, endTile, allTiles);
          if (pathLine) scene?.remove(pathLine); // Удаляем предыдущую линию
          const newPathLine = drawPath(path, scene as THREE.Scene);
          setPathLine(newPathLine);

          // Анимация перемещения юнита по пути
          for (const pathTile of path) {
            await moveUnitToTile(selectedUnit, pathTile.linkToMesh as THREE.Mesh);
          }

          // Возвращаем исходные цвета тайлов
          resetTileHighlight(startTile, 0x00ff00); // Вернуть исходный цвет для startTile
          resetTileHighlight(endTile, 0x00ff00);   // Вернуть исходный цвет для endTile

          stopAnimation(mixer, setMixer);
          setSelectedUnit(null);
        } else {
          stopAnimation(mixer, setMixer);
          setSelectedUnit(null);
        }
      } else {
        if (tile.userData && tile.userData.type === 'unit') {
          // Убедимся, что при выборе юнита передаются его координаты
          setSelectedUnit(tile);
          tile.userData.q = tile.position.x;  // Замените на реальные q, r
          tile.userData.r = tile.position.z;  // Замените на реальные q, r
          animateUnit(tile, setMixer);
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
