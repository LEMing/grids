import * as THREE from 'three';

interface Tile {
  createMesh(): THREE.Object3D;
}

export default Tile;
