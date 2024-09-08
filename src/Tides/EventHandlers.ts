// EventHandlers.ts
import * as THREE from 'three';
import {ToolsNames} from '../constants.ts';
import { handleMouseMove } from './mouseHandler';

// Функция для преобразования декартовых координат в шестиугольные
function cartesianToHex(x: number, z: number, size: number) {
  const q = (x * Math.sqrt(3) / 3 - z / 3) / size;
  const r = z * 2 / 3 / size;
  return { q, r };
}

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

      // После обработки движения мыши проверяем hoveredTileRef
      if (hoveredTileRef.current) {
        const tile = hoveredTileRef.current;

        // Получаем мировые координаты объекта
        const worldPosition = new THREE.Vector3();
        tile.getWorldPosition(worldPosition);  // Преобразуем локальные координаты в мировые

        const size = 2;  // Используй правильный размер тайла

        // Преобразуем мировые координаты в шестиугольные координаты
        const { q, r } = cartesianToHex(worldPosition.x, worldPosition.z, size);

        // Сохраняем координаты в userData
        tile.userData.q = q;
        tile.userData.r = r;

        // Логируем для проверки
        console.log('Hovered tile with hex coordinates:', { q, r });
      }
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
