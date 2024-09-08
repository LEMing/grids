import * as THREE from 'three';
import { fadeOutTile } from './tileUtils';

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
  hoveredTileRef: React.MutableRefObject<THREE.Object3D | null>
) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const intersectedTile = intersects[0].object;

    if (hoveredTileRef.current !== intersectedTile) {
      if (hoveredTileRef.current) {
        fadeOutTile(hoveredTileRef.current);
      }

      hoveredTileRef.current = intersectedTile;

      const material = (intersectedTile as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = 1.0;
    }
  } else if (hoveredTileRef.current) {
    fadeOutTile(hoveredTileRef.current);
    hoveredTileRef.current = null;
  }
};
