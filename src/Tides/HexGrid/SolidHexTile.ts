import * as THREE from 'three';
import Tile from './Tile';

class SolidHexTile implements Tile {
  position: THREE.Vector3;
  size: number;
  height: number;

  constructor(position: THREE.Vector3, size: number, height: number) {
    this.position = position;
    this.size = size;
    this.height = height;
  }

  createMesh(): THREE.Mesh {
    const geometry = new THREE.CylinderGeometry(this.size, this.size, this.height, 6);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(this.position.x, this.position.y + this.height / 2, this.position.z);
    return mesh;
  }
}

export default SolidHexTile;
