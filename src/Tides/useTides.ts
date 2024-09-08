import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ToolsNames } from '../constants.ts';
import HexGrid from './HexGrid/HexGrid.ts';
import TileFactory from './HexGrid/TileFactory';
import { createObject } from './ObjectFactory';
import { handleMouseEvents, handleClickEvent } from './EventHandlers';

const moveUnitToTile = (unit: THREE.Object3D, targetTile: THREE.Object3D) => {
  const startPosition = unit.position.clone();
  const targetPosition = new THREE.Vector3();
  targetTile.getWorldPosition(targetPosition);

  const duration = 1.5; // Время анимации перемещения в секундах
  let elapsedTime = 0; // Общее время анимации

  const clock = new THREE.Clock(); // Часы для отслеживания времени анимации

  const animateMove = () => {
    const delta = clock.getDelta(); // Разница времени между кадрами
    elapsedTime += delta; // Обновляем общее время

    const t = Math.min(elapsedTime / duration, 1); // Расчет параметра t (от 0 до 1)

    // Линейная интерполяция позиции юнита
    unit.position.lerpVectors(startPosition, targetPosition, t);

    // Если анимация еще не завершена, продолжаем
    if (t < 1) {
      requestAnimationFrame(animateMove);
    }
  };

  // Запуск анимации перемещения
  requestAnimationFrame(animateMove);
};

const createJumpingAnimation = () => {
  const times = [0, 0.5, 1]; // Ключевые моменты времени для анимации
  const values = [0, 1, 0]; // Задаем высоту прыжка

  const track = new THREE.VectorKeyframeTrack(
    '.position[y]', // Анимация по оси Y
    times,
    values
  );

  return new THREE.AnimationClip('Jump', -1, [track]); // -1 означает бесконечное повторение
};

const useTides = (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  selectedTool: ToolsNames
) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const hoveredTileRef = useRef<THREE.Object3D | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<THREE.Object3D | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null); // Для анимаций

  const { onMouseMove } = handleMouseEvents(camera, scene, raycaster, mouse, hoveredTileRef);

  const animateUnit = (unit: THREE.Object3D) => {
    const mixer = new THREE.AnimationMixer(unit);
    const action = mixer.clipAction(createJumpingAnimation()); // Создаем прыжковую анимацию
    action.play();
    setMixer(mixer); // Сохраняем анимационный миксер
  };

  const stopAnimation = () => {
    if (mixer) {
      mixer.stopAllAction();
      setMixer(null);
    }
  };

  const onClick = useCallback(async () => {
    if (selectedTool === ToolsNames.MOVE && hoveredTileRef.current) {
      const tile = hoveredTileRef.current;

      if (selectedUnit) {
        if (tile.userData && tile.userData.type !== 'unit') {
          // Анимация перемещения юнита
          moveUnitToTile(selectedUnit, tile);
          stopAnimation(); // Останавливаем анимацию прыжка после перемещения
          setSelectedUnit(null); // Сбрасываем выбор юнита
        } else {
          // Если кликнули снова на юнит — деактивируем его
          stopAnimation();
          setSelectedUnit(null);
        }
      } else {
        // Если клик по юниту — активируем его
        if (tile.userData && tile.userData.type === 'unit') {
          setSelectedUnit(tile);
          animateUnit(tile); // Запускаем анимацию прыжка
        }
      }
    } else {
      await handleClickEvent(camera, scene, selectedTool, hoveredTileRef, createObject);
    }
  }, [camera, scene, selectedTool, selectedUnit, hoveredTileRef]);
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

  useEffect(() => {
    const clock = new THREE.Clock();

    const animate = () => {
      if (mixer) {
        mixer.update(clock.getDelta()); // Обновляем анимационный миксер
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [mixer]);

  return null;
};

export default useTides;
