import React from 'react';
import * as THREE from 'three';
import Tile from './HexGrid/Tile.ts';

/**
 * Handles mouse move events and updates tile opacity based on intersections.
 * @param event - The MouseEvent
 * @param camera - The perspective camera
 * @param scene - The scene to cast rays onto
 * @param raycaster - Raycaster to calculate intersections
 * @param mouse - Vector2 for mouse coordinates
 * @param hoveredTileRef - Reference to the currently hovered tile
 */
export const handleMouseMove = (
  event: MouseEvent,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  raycaster: THREE.Raycaster,
  mouse: THREE.Vector2,
  hoveredTileRef: React.MutableRefObject<Tile | null>
) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  const intersectedTile: Tile | undefined = findTileInNodes(intersects);

  if (intersectedTile) {
    if (hoveredTileRef.current !== intersectedTile) {
      if (hoveredTileRef.current) {
        console.log('Fading out tile:', hoveredTileRef.current.hexCoordinates);
        hoveredTileRef.current.fadeOutTile();
      }

      hoveredTileRef.current = intersectedTile;
      const material = (intersectedTile.linkToObject3D as THREE.Object3D).material as THREE.MeshStandardMaterial;
      if (material) {
        material.opacity = 1.0;
      }
    }
  } else if (hoveredTileRef.current) {
    hoveredTileRef.current.fadeOutTile();
    hoveredTileRef.current = null;
  }
};

const findTileInNodes = (intersects: THREE.Intersection[]): Tile | undefined => {
  let tile: Tile | undefined;

  intersects.some(intersect => {
    if (intersect.object.userData.tile) {
      tile = intersect.object.userData.tile;
      return true;
    }

    intersect.object.traverseAncestors(parent => {
      if (parent.userData.tile) {
        tile = parent.userData.tile;
        return true;
      }
    });

    return !!tile;  // Прекратить цикл, если `tile` найден
  });

  return tile;
};
