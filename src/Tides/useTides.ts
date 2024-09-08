import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {ToolsNames} from '../constants.ts';
import HexGrid from './HexGrid/HexGrid.ts';
import TileFactory from './HexGrid/TileFactory';
import { handleMouseMove } from './mouseHandler';

const useTides = (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  selectedTool: string
) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const hoveredTileRef = useRef<THREE.Object3D | null>(null);

  // Обрабатываем движение мыши для подсветки тайла
  const onDocumentMouseMove = useCallback((event: MouseEvent) => {
    if (camera && scene) {
      handleMouseMove(event, camera, scene, raycaster, mouse, hoveredTileRef);
    }
  }, [camera, scene]);

  // Обрабатываем клик для добавления объекта на выбранный тайл
  const onDocumentClick = useCallback(async () => {
    if (camera && scene && selectedTool && hoveredTileRef.current) {
      const tile = hoveredTileRef.current; // Получаем выделенный тайл

      const worldPosition = new THREE.Vector3();
      tile.getWorldPosition(worldPosition);

      let object: THREE.Mesh | null = null;

      // Создаём объект в зависимости от выбранного инструмента
      switch (selectedTool) {
        case ToolsNames.STORE:
          object = await createHouse(); // Функция создания дома
          break;
        case ToolsNames.WALL:
          object = await createUnit(); // Функция создания юнита
          break;
        case ToolsNames.UNIT:
          object = await createToolObject(); // Функция создания объекта инструментов
          break;
        default:
          break;
      }

      if (object) {
        object.position.copy(worldPosition);
        scene.add(object);
      }
    }
  }, [camera, scene, selectedTool]);

  useEffect(() => {
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('click', onDocumentClick); // Добавляем слушатель для клика

    return () => {
      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('click', onDocumentClick); // Убираем слушатель
    };
  }, [onDocumentMouseMove, onDocumentClick]);

  useEffect(() => {
    if (scene) {
      const hexGrid = new HexGrid(10, 2, new TileFactory());
      hexGrid.addToScene(scene);
    }
  }, [scene]);

  return null;
};

export default useTides;

// Пример функций для создания объектов
const createHouse = async () => {
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  return new THREE.Mesh(geometry, material);
};

// Создание юнита вместо офиса
const createUnit = async () => {
  const geometry = new THREE.SphereGeometry(1, 32, 32); // Юнит в форме сферы
  const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  return new THREE.Mesh(geometry, material);
};

const createToolObject = async () => {
  const geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  return new THREE.Mesh(geometry, material);
};
