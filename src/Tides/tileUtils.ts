import * as THREE from 'three';

/**
 * Gradually fades out the tile's opacity.
 * @param tile - The THREE.Object3D to fade out
 */
export const fadeOutTile = (tile: THREE.Object3D) => {
  const material = (tile as THREE.Mesh).material as THREE.MeshBasicMaterial;
  let currentOpacity = material.opacity;

  const fade = () => {
    currentOpacity -= 1;
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
