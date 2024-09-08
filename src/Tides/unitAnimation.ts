import * as THREE from 'three';

export const createJumpingAnimation = () => {
  const times = [0, 0.5, 1];
  const values = [0, 1, 0];

  const track = new THREE.VectorKeyframeTrack('.position[y]', times, values);
  return new THREE.AnimationClip('Jump', -1, [track]);
};

export const animateUnit = (unit: THREE.Object3D, setMixer: (mixer: THREE.AnimationMixer | null) => void) => {
  const mixer = new THREE.AnimationMixer(unit);
  const action = mixer.clipAction(createJumpingAnimation());
  action.play();
  setMixer(mixer);
};

export const stopAnimation = (mixer: THREE.AnimationMixer | null, setMixer: (mixer: THREE.AnimationMixer | null) => void) => {
  if (mixer) {
    mixer.stopAllAction();
    setMixer(null);
  }
};
