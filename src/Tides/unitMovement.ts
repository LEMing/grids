import * as THREE from 'three';

export const moveUnitToTile = async (unit: THREE.Object3D, targetTile: THREE.Object3D) => {
  const startPosition = unit.position.clone();
  const targetPosition = new THREE.Vector3();
  targetTile.getWorldPosition(targetPosition);

  const duration = 1.5;
  let elapsedTime = 0;

  const clock = new THREE.Clock();

  const animateMove = () => {
    const delta = clock.getDelta();
    elapsedTime += delta;

    const t = Math.min(elapsedTime / duration, 1);

    unit.position.lerpVectors(startPosition, targetPosition, t);

    if (t < 1) {
      requestAnimationFrame(animateMove);
    }
  };

  requestAnimationFrame(animateMove);
};
