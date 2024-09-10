import * as THREE from 'three';
import Tile from './Tile';

class SolidHexTile extends Tile {
  private _position: THREE.Vector3;

  size: number;
  height: number;

  constructor(q: number, r: number, size: number, height: number) {
    super(q, r);  // Передаем q и r в родительский класс Tile
    this._position = this.hexToCartesian(q, r, size);
    this.size = size;
    this.height = height;
  }

  public get position(): THREE.Vector3 {
    return this._position;
  }
  public set position(value: THREE.Vector3) {
    this._position = value;
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
