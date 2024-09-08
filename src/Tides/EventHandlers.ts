// EventHandlers.ts
import * as THREE from 'three';
import {ToolsNames} from '../constants.ts';
import { handleMouseMove } from './mouseHandler';

export const handleMouseEvents = (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  raycaster: THREE.Raycaster,
  mouse: THREE.Vector2,
  hoveredTileRef: React.MutableRefObject<THREE.Object3D | null>
) => {
  const onMouseMove = (event: MouseEvent) => {
    if (camera && scene) {
      handleMouseMove(event, camera, scene, raycaster, mouse, hoveredTileRef);
    }
  };

  return { onMouseMove };
};

export const handleClickEvent = async (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  selectedTool: ToolsNames,
  hoveredTileRef: React.MutableRefObject<THREE.Object3D | null>,
  createObjectFn: (type: ToolsNames) => Promise<THREE.Mesh | null>
) => {
  if (camera && scene && selectedTool && hoveredTileRef.current) {
    const tile = hoveredTileRef.current;
    const worldPosition = new THREE.Vector3();
    tile.getWorldPosition(worldPosition);

    const object = await createObjectFn(selectedTool);

    if (object) {
      object.position.copy(worldPosition);
      scene.add(object);
    }
  }
};
