import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ToolsNames } from '../constants.ts';
import {createWall} from './createWall.ts';

export const objectFactory = async (type: ToolsNames): Promise<THREE.Object3D | null> => {
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

const createUnit = async () => {
  const geometry = new THREE.SphereGeometry(1.7, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xaaff00 });
  const unit = new THREE.Mesh(geometry, material);

  // Assign type to unit for identification
  unit.userData = { type: 'unit' };
  return unit;
};

const createStore = async () => {
  const loader = new GLTFLoader();

  try {
    const gltf = await new Promise<GLTF>((resolve, reject) => {
      loader.load(
        'generator.glb', // Replace with the correct path to your model
        (gltf: GLTF) => resolve(gltf),
        undefined,
        (error: Error) => reject(error)
      );
    });

    const model = gltf.scene.children[0];
    model.scale.setScalar(3);

    // Optional: adjust the scale, position, and rotation of the model
    console.log(model);

    // Add helper box around the model
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    model.position.y += size.y / 4;
    model.position.z -= 0.25;

    const wrapper = new THREE.Group();
    wrapper.add(model);
    wrapper.rotateX(-Math.PI / 2);

    // Assign type for identification
    wrapper.userData = { type: 'store' };

    return wrapper;
  } catch (error) {
    console.error('Error loading model:', error);
    return null;
  }
};
