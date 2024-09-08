import * as THREE from 'three';
import Tile from './HexGrid/Tile.ts';

/**
 * Gradually fades out the tile's opacity.
 * @param tile - The THREE.Object3D to fade out
 */
export const fadeOutTile = (tile: THREE.Object3D) => {
  const material = (tile as THREE.Mesh).material as THREE.MeshBasicMaterial;
  let currentOpacity = material.opacity;

  const fade = () => {
    currentOpacity -= 0.01;
    if (currentOpacity <= 0) {
      currentOpacity = 0;
    }
    material.opacity = currentOpacity;
    if (currentOpacity > 0) {
      requestAnimationFrame(fade);
    }
  };

  requestAnimationFrame(fade);
};

export const highlightTile = (tile: Tile, color: number) => {
  if (tile.linkToMesh) {
    const mesh = tile.linkToMesh.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh;

    // Проверяем, что материал — это MeshStandardMaterial
    const material = mesh.material as THREE.MeshStandardMaterial;

    material.color.set(color);
    material.transparent = true;  // Убедимся, что поддерживается прозрачность
    material.opacity = 1;  // Сделать тайл полностью видимым при подсветке
  }
};

export const resetTileHighlight = (tile: Tile, originalColor: number) => {
  if (tile.linkToMesh) {
    const mesh = tile.linkToMesh.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh;

    // Проверяем, что материал — это MeshStandardMaterial
    const material = mesh.material as THREE.MeshStandardMaterial;

    material.color.set(originalColor);
    material.opacity = 0.5;  // Сбросить прозрачность, если это нужно
  }
};
