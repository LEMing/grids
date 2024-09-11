// EventHandlers.ts
import React from 'react';
import * as THREE from 'three';
import {ToolsNames} from '../constants.ts';
import Tile from './HexGrid/Tile.ts';
import { handleMouseMove } from './mouseHandler';

export const handleMouseEvents = (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  raycaster: THREE.Raycaster,
  mouse: THREE.Vector2,
  hoveredTileRef: React.MutableRefObject<Tile | null>
) => {
  const onMouseMove = (event: MouseEvent) => {
    if (camera && scene) {
      handleMouseMove(event, camera, scene, raycaster, mouse, hoveredTileRef);

      // После обработки движения мыши проверяем hoveredTileRef
      if (hoveredTileRef.current) {
        const tile = hoveredTileRef.current;

        // Получаем мировые координаты объекта
        const worldPosition = new THREE.Vector3();
        tile.linkToObject3D.getWorldPosition(worldPosition);  // Преобразуем локальные координаты в мировые
      }
    }
  };


  return { onMouseMove };
};

export const handleClickEvent = async (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  selectedTool: ToolsNames,
  hoveredTileRef: React.MutableRefObject<Tile | null>,
  createObjectFn: (type: ToolsNames) => Promise<THREE.Mesh | null>
) => {
  if (camera && scene && selectedTool && hoveredTileRef.current) {
    const tile = hoveredTileRef.current;
    const worldPosition = new THREE.Vector3();
    tile.linkToObject3D.getWorldPosition(worldPosition);

    const object = await createObjectFn(selectedTool);

    if (object) {
      object.position.copy(worldPosition);
      tile.room.add(object);
    }
  }
};
