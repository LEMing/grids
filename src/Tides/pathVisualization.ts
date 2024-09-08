import * as THREE from 'three';
import Tile from './HexGrid/Tile.ts';

export const drawPath = (path: Tile[], scene: THREE.Scene) => {
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const points = path.map(tile => tile.position);

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);

  scene.add(line);

  return line;
};
