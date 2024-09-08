// ObjectFactory.ts
import * as THREE from 'three';
import {ToolsNames} from '../constants.ts';

export const createObject = async (type: ToolsNames): Promise<THREE.Mesh | null> => {
  switch (type) {
    case ToolsNames.WALL:
      return createWall();
    case ToolsNames.UNIT:
      return createUnit();
    case ToolsNames.STORE:
      return createStore();
    default:
      return null;
  }
};

const createWall = async () => {
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  return new THREE.Mesh(geometry, material);
};

const createUnit = async () => {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const unit = new THREE.Mesh(geometry, material);

  // Назначаем тип юниту для идентификации
  unit.userData = { type: 'unit' };
  return unit;
};


const createStore = async () => {
  const geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  return new THREE.Mesh(geometry, material);
};
